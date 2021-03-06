
import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    Spinner,
    CardBody
} from "reactstrap";

// Material UI
import {
    FormControl,
    TextField,
    Input,
    FormGroup,
    FormLabel,
    Avatar,
} from '@material-ui/core';

import {
    Clear
} from '@material-ui/icons';

// core components
import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';
import WorkSpaceTable from "../components/Tables/WorkSpaceTable.js";
import UsersTable from '../components/Tables/UsersTable';

//Api
import { workspaceAction, organizationAPI } from './CRM_Apis';


const UserHeaderData = [
    { "Header": "Profile" },
    { "Header": "User Name" },
    { "Header": "Email" },
    { "Header": "Role" },
];


const HeaderData = [
    { "Header": "WorkSpace Name" },
    { "Header": "Organization Name" },
    { "Header": "Manager Name" },
    { "Header": "Completion" },
    { "Header": "Users" },
    { "Header": "Created At" },
    { "Header": "Menu" },
];

class WorkSpace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectWorkSpace: '',
            setAddWorkspaceOpenClose: false,
            WorkSpaceName: '',
            userSearch: '',
            setShowUsers: false,
            userObj: [],
            workSpaceData: null,
            Alert_open_close: false,
            Alert_open_close1: false,
            title: '',
            message: '',
            users: [],
            setEditWorkspaceOpenClose: false,
            editUserObj: [],
            editUserDeleteIds: [],
            editAddedUserIds: [],
            workSpaceId: null,
            isCreatedWorkspace: false,
            isEditWorkSpace: false,
            Alert_open_close2: false,
            alertColor2: null,
            userBackup: []
        };
    }


    componentDidMount() {
        this.jwtToken = localStorage.getItem('CRM_Token_Value');
        this.getWorkSpace();
        this.getOrgUsers();
    }


    onSingleWorkSpaceClicked = (TableData) => {
        this.props.history.push("/admin/tasks", { WorkSpaceName: TableData.workspaceName, workspaceId: TableData.workspaceId });
    }

    onWorkSpaceChanged = (event) => {
        this.setState({ SelectWorkSpace: event });
    }

    onClickOpenAddWorkSpace = () => {
        this.setState({ setAddWorkspaceOpenClose: true, users: this.orgUsersData, userBackup: this.orgUsersData, WorkSpaceName: '', userObj: [] });
    }

    handleEditWorkSpaceClose = () => {
        this.setState({ setEditWorkspaceOpenClose: false });
    }

    onClickOpenUpdateWorkSpace = (data) => {
        let workspaceMembers = data.users.map((data) => {
            let image = data.userProfileImage ? data.userProfileImage : ''
            return {
                userName: data.userName,
                imageUrl: image,
                id: data.userId
            }
        });

        let NewData = [...this.orgUsersData];

        for (var i = NewData.length - 1; i >= 0; i--) {
            for (var j = 0; j < workspaceMembers.length; j++) {
                if (NewData[i] && (NewData[i].id === workspaceMembers[j].id)) {
                    NewData.splice(i, 1);
                }
            }
        }

        this.setState({
            setEditWorkspaceOpenClose: true,
            users: NewData,
            userBackup: this.orgUsersData,
            editUserObj: workspaceMembers,
            WorkSpaceName: data.workspaceName,
            workSpaceId: data.workspaceId
        });
    }

    handleClose = () => {
        this.setState({ setAddWorkspaceOpenClose: false });
    };

    onChangeText = (Name, value) => {
        this.setState({ [`${Name}`]: value })
    }

    editSelectUsers = (UserName, UserImage, userId) => {
        let returnFlag = 0

        for (let i = 0; i < this.state.editUserObj.length; i++) {
            if (this.state.editUserObj[i].userName == UserName) {
                returnFlag = 1
                break;
            }
        }

        if (!returnFlag) {
            let array = [...this.state.users];
            let filteredArray = array.filter(item => item.userName !== UserName)
            let array1 = [...this.state.editUserDeleteIds];
            let filteredArray1 = array1.filter(item => item !== userId)
            this.setState({
                editUserObj: [...this.state.editUserObj,
                { userName: UserName, imageUrl: UserImage, id: userId }],
                users: filteredArray,
                editUserDeleteIds: filteredArray1
            });
        }
    }

    editDeleteSelectedUsers = (userName, userId) => {
        let array = [...this.state.editUserObj]
        let filteredArray = array.filter(item => item.userName !== userName);
        let filteredArray1 = array.filter(item => item.userName === userName);
        let returnFlag = 0;
        if (this.state.editUserDeleteIds.length === 0) {
            returnFlag = 0;
        } else {
            for (let i = 0; i < this.state.userBackup.length; i++) {
                for (let j = 0; j < this.state.editUserDeleteIds.length; j++) {
                    if (this.state.userBackup[i].id === this.state.editUserDeleteIds[j]) {
                        returnFlag = 1;
                        break;
                    } else {
                        returnFlag = 0;
                    }
                }
            }
            for (let i = 0; i < this.state.editUserObj.length; i++) {
                for (let j = 0; j < this.state.editUserDeleteIds.length; j++) {
                    if (this.state.editUserObj[i].id === this.state.editUserDeleteIds[j]) {
                        returnFlag = 1;
                        break;
                    } else {
                        returnFlag = 0;
                    }
                }
            }
        }
        if (returnFlag === 0) {
            this.setState((prevState) => ({ editUserDeleteIds: [...prevState.editUserDeleteIds, userId], users: [...prevState.users, filteredArray1[0]], editUserObj: filteredArray }))
        }
    }

    selectUsers = (UserName, UserImage, UserId) => {
        //   event.preventDefault();
        let returnFlag = 0

        for (let i = 0; i < this.state.userObj.length; i++) {
            if (this.state.userObj[i].userName == UserName) {
                returnFlag = 1
                break;
            }
        }

        if (!returnFlag) {
            let array = [...this.state.users];
            let filteredArray = array.filter(item => item.userName !== UserName)
            this.setState({
                userObj: [...this.state.userObj, { userName: UserName, imageUrl: UserImage, id: UserId }],
                users: filteredArray
            });
        }
    }

    deleteSelectedUsers = (userName, userId) => {
        let array = [...this.state.userObj]
        let filteredArray = array.filter(item => item.userName !== userName)
        let array1 = [...this.state.userBackup]
        let filteredArray1 = array1.filter(item => item.id === userId)
        this.setState((prevState) => ({ userObj: filteredArray, users: [...prevState.users, filteredArray1[0]] }));
    }


    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    onDismissAlert1 = () => {
        this.setState({ Alert_open_close1: false });
    }

    onDismissAlert2 = () => {
        this.setState({ Alert_open_close2: false });
    }

    OpenUsersDialog = (data) => {
        this.setState({ setShowUsers: true, UserData: data })
    }

    handleCloseDialog = () => {
        this.setState({ setShowUsers: false })
    }

    getWorkSpace = async () => {
        let title = "Error";
        this.setState({ users: [], userBackup: [], deletedUserIds: [] });
        try {
            const getWorkSpaceData = await fetch(workspaceAction, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${this.jwtToken}`
                },
                body: JSON.stringify({
                    action: 4
                })
            });
            const responseData = await getWorkSpaceData.json();
            this.setState({
                workSpaceData: responseData.workspaceGrid
            })

        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true });
        }
    }

    editWorkSpace = async (data) => {
        const { WorkSpaceName, editUserObj, editUserDeleteIds, workSpaceId } = this.state;
        const title = "Error";
        let message = "";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        this.setState({ isEditWorkSpace: true })
        try {
            if (WorkSpaceName === "" && editUserObj.length === 0) {
                message = "Please Enter WorkSpace Name And Add Users";
                this.setState({ title, message, Alert_open_close1: true, isEditWorkSpace: false });
            }
            else if (WorkSpaceName === "" && editUserObj.length !== 0) {
                message = "Please Enter WorkSpace Name";
                this.setState({ title, message, Alert_open_close1: true, isEditWorkSpace: false });
            }
            else if (WorkSpaceName !== "" && editUserObj.length === 0) {
                message = "Please Add Users";
                this.setState({ title, message, Alert_open_close1: true, isEditWorkSpace: false });
            }
            else if (WorkSpaceName !== "" && editUserObj.length !== 0) {
                let userIds = editUserObj.map((val) => {
                    if (val.id) {
                        return val.id
                    } else {

                        return val.userId
                    }
                });
                let workspaceData = {
                    workspaceName: WorkSpaceName,
                    addedUserIds: userIds,
                    deletedUserIds: editUserDeleteIds,
                    workspaceId: workSpaceId
                }
                let setWorkSpaceResponse = await fetch(workspaceAction, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${crmToken}`
                    },
                    body: JSON.stringify({
                        updatedWorkSpaceData: workspaceData,
                        action: 2,
                    })
                });
                let responseData = await setWorkSpaceResponse.json();

                if (responseData.success === true) {
                    const title = "Success"
                    message = "WorkSpace Added!";
                    this.setState({ title, message, Alert_open_close2: true, alertColor2: "success", isEditWorkSpace: false, setEditWorkspaceOpenClose: false });
                    this.handleClose();
                    this.getWorkSpace();
                }
                else {
                    message = responseData.error;
                    this.setState({ title, message, Alert_open_close1: true, isEditWorkSpace: false });
                }
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close1: true, isEditWorkSpace: false });
        }

    }

    getOrgUsers = async () => {
        const getAllMembers = await fetch(organizationAPI, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${this.jwtToken}`
            },
            body: JSON.stringify({
                method: 'members'
            })
        });
        const response = await getAllMembers.json();
        let responseData = await response.data

        this.orgUsersData = responseData.map((data) => {
            let image = data.userProfileImage ? data.userProfileImage : ''
            return {
                userName: data.name,
                imageUrl: image,
                id: data._id
            }
        })
    }

    setWorkSpaceApi = async (event) => {
        const { WorkSpaceName, userObj } = this.state;
        event.preventDefault();
        const title = "Error";
        let message = "";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        this.setState({ isCreatedWorkspace: true });
        try {
            if (WorkSpaceName === "" && userObj.length === 0) {
                message = "Please Enter WorkSpace Name And Add Users";
                this.setState({ title, message, Alert_open_close: true, isCreatedWorkspace: false });
            }
            else if (WorkSpaceName === "" && userObj.length !== 0) {
                message = "Please Enter WorkSpace Name";
                this.setState({ title, message, Alert_open_close: true, isCreatedWorkspace: false });
            }
            else if (WorkSpaceName !== "" && userObj.length === 0) {
                message = "Please Add Users";
                this.setState({ title, message, Alert_open_close: true, isCreatedWorkspace: false });
            }
            else if (WorkSpaceName !== "" && userObj.length !== 0) {
                let userIds = userObj.map((val) => val.id)
                let workspaceData = {
                    workspaceName: WorkSpaceName,
                    userIds: userIds,
                }
                let setWorkSpaceResponse = await fetch(workspaceAction, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${crmToken}`
                    },
                    body: JSON.stringify({
                        workspaceData: workspaceData,
                        action: 1,
                    })
                });
                let responseData = await setWorkSpaceResponse.json();

                if (responseData.success === true) {
                    const title = "Success"
                    message = "WorkSpace Added!";
                    this.setState({ title, message, Alert_open_close2: true, alertColor2: "success", isCreatedWorkspace: false, setAddWorkspaceOpenClose: false });
                    this.handleClose();
                    this.getWorkSpace();
                }
                else {
                    message = responseData.message;
                    this.setState({ title, message, Alert_open_close: true, isCreatedWorkspace: false });
                }
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true, isCreatedWorkspace: false });
        }
    }


    deleteWorkSpace = async (data) => {
        let title = "Error";
        let message = "";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        try {
            let deleteWorkspaceResponse = await fetch(workspaceAction, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                body: JSON.stringify({
                    workspaceId: data.workspaceId,
                    action: 3,
                })
            });
            let responseData = await deleteWorkspaceResponse.json();

            if (responseData.success === true) {
                title = "Success"
                message = "WorkSpace Deleted!";
                this.setState({ title, message, Alert_open_close2: true, alertColor2: "success" });
                this.getWorkSpace();
            }
            else {
                message = responseData.error;
                this.setState({ title, message, Alert_open_close2: true , alertColor2: "danger"});
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close2: true , alertColor2: "danger"});
        }

    }


    render() {
        let {
            Alert_open_close,
            setAddWorkspaceOpenClose,
            WorkSpaceName,
            title,
            message,
            workSpaceData,
            users,
            userObj,
            userSearch,
            setShowUsers,
            UserData,
            setEditWorkspaceOpenClose,
            Alert_open_close1,
            editUserObj,
            isCreatedWorkspace,
            isEditWorkSpace,
            alertColor2,
            Alert_open_close2
        } = this.state;

        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color="danger" >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );

        const AlertError1 =
            (
                <div>
                    <Alert isOpen={Alert_open_close1} toggle={() => this.onDismissAlert1()} color="danger" >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );
        const AlertError2 =
            (
                <div>
                    <Alert isOpen={Alert_open_close2} toggle={() => this.onDismissAlert2()} color={alertColor2 ? alertColor2 : "danger"} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );
        let filterContacts = users !== null ? users.filter(
            (item) => {
                return item.userName.toLowerCase().indexOf(userSearch.toLowerCase()) !== -1;
            }
        ) : '';
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {AlertError2}
                    {workSpaceData === null ?
                        <Card className="bg-transparent shadow border-0">
                            < CardBody className="px-lg-5 py-lg-5 wd-100p ht-500 d-flex justify-content-center align-items-center">
                                <Col lg="12" className="d-flex justify-content-center align-items-center">
                                    <Spinner style={{ width: '3rem', height: '3rem' }} className="align-self-center" color="primary" />
                                </Col>
                            </CardBody>
                        </Card>
                        :
                        <Row className="mb-3 align-items-center">
                            <Col className="justify-content-center" xl="12">
                                <WorkSpaceTable
                                    Header={'WorkSpace'}
                                    onClickHeaderButton={() => this.onClickOpenAddWorkSpace()}
                                    HeaderButtonName={'Add WorkSpace'}
                                    userData={workSpaceData}
                                    tHeader={HeaderData}
                                    onRowPress={(Tdata) => this.onSingleWorkSpaceClicked(Tdata)}
                                    onClickAvatar={(Tdata) => this.OpenUsersDialog(Tdata.users)}
                                    editWorkSpace={(Tdata) => this.onClickOpenUpdateWorkSpace(Tdata)}
                                    deleteWorkSpace={(Tdata) => this.deleteWorkSpace(Tdata)}
                                />
                            </Col>
                        </Row>}
                </Container>

                {/* create WorkSpace */}
                <DialogBox
                    disableBackdropClick={true}
                    maxWidth={"sm"}
                    fullWidth={true}
                    DialogHeader={"Create New WorkSpace"}
                    DialogContentTextData={""}
                    DialogButtonText1={"Cancel"}
                    DialogButtonText2={"Save"}
                    Variant={"outlined"}
                    onClose={this.handleClose}
                    onOpen={setAddWorkspaceOpenClose}
                    OnClick_Bt1={this.handleClose}
                    OnClick_Bt2={this.setWorkSpaceApi}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >
                    {AlertError}
                    {isCreatedWorkspace ?
                        <Card className="bg-secondary shadow border-0">
                            < CardBody className="px-lg-5 py-lg-5 wd-100p ht-500 d-flex justify-content-center align-items-center">
                                <Col lg="12" className="d-flex justify-content-center align-items-center">
                                    <Spinner style={{ width: '3rem', height: '3rem' }} className="align-self-center" color="primary" />
                                </Col>
                            </CardBody>
                        </Card> :
                        <>
                            <FormGroup className="mt-4">
                                <FormControl>
                                    <FormLabel className="m-0">
                                        <span className="text-default">  What would you like to call the WorkSpace? </span>
                                    </FormLabel>
                                    <TextField
                                        autoFocus
                                        margin="none"
                                        id="name"
                                        label="WorkSpace Name"
                                        type="text"
                                        required={false}
                                        value={WorkSpaceName}
                                        autoComplete="section-blue shipping"
                                        onChange={(e) => this.onChangeText("WorkSpaceName", e.target.value)}
                                        fullWidth
                                    />
                                </FormControl>
                                <FormControl className="mt-4">
                                    <FormLabel className="m-0">
                                        <span for="UserName" className="text-default">  Add Users </span>
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        className="txt-lt-dark"
                                        name="UserName"
                                        id="UserName"
                                        value={userSearch}
                                        onChange={(e) => this.onChangeText("userSearch", e.target.value)}
                                        placeholder="Search for Users" />
                                </FormControl>
                            </FormGroup>
                            <Col className="shadow br-sm p-4" lg="12">
                                <Col className="p-1 max-dn-ht-250  hide-scroll-ind" lg="12">
                                    {
                                        filterContacts.map((users, index) => (
                                            <Card onClick={() => { this.selectUsers(users.userName, users.imageUrl, users.id) }} key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                    <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                        <Avatar alt={users.userName} src={users.imageUrl} />
                                                    </Col>
                                                    <Col lg="9" className="d-flex align-items-center justify-content-center">
                                                        <span className="text-clamp">{users.userName}</span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                </Col>
                                {
                                    userObj != null && userObj.length != 0 ?
                                        <Col className="p-1 max-dn-ht-250 hide-scroll-ind" lg="12">
                                            <h3 className="txt-lt-dark"> Selected Users </h3>
                                            {
                                                userObj.map((users, index) => (
                                                    <Card key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                        <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                            <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                                <Avatar alt={users.userName} src={users.imageUrl} />
                                                            </Col>
                                                            <Col lg="8" className="d-flex align-items-center justify-content-center">
                                                                <span className="text-clamp">{users.userName}</span>
                                                            </Col>
                                                            <Col lg="1" className="d-flex align-items-center justify-content-center">
                                                                <span
                                                                    className="txt-lt-dark cursor-point p-2"
                                                                    onClick={() => { this.deleteSelectedUsers(users.userName, users.id) }}
                                                                >
                                                                    <Clear className="text-red" />
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                ))
                                            }
                                        </Col> : null
                                }
                            </Col>
                        </>}
                </DialogBox>


                {/* Edit User Work Space */}

                <DialogBox
                    disableBackdropClick={true}
                    maxWidth={"sm"}
                    fullWidth={true}
                    DialogHeader={"Edit WorkSpace"}
                    DialogContentTextData={""}
                    DialogButtonText1={"Cancel"}
                    DialogButtonText2={"Save"}
                    Variant={"outlined"}
                    onClose={this.handleEditWorkSpaceClose}
                    onOpen={setEditWorkspaceOpenClose}
                    OnClick_Bt1={this.handleEditWorkSpaceClose}
                    OnClick_Bt2={() => this.editWorkSpace()}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >
                    {AlertError1}
                    {isEditWorkSpace ?
                        <Card className="bg-secondary shadow border-0">
                            < CardBody className="px-lg-5 py-lg-5 wd-100p ht-500 d-flex justify-content-center align-items-center">
                                <Col lg="12" className="d-flex justify-content-center align-items-center">
                                    <Spinner style={{ width: '3rem', height: '3rem' }} className="align-self-center" color="primary" />
                                </Col>
                            </CardBody>
                        </Card> :
                        <>
                            <FormGroup className="mt-4">
                                <FormControl>
                                    <FormLabel className="m-0">
                                        <span className="text-default"> WorkSpace Name </span>
                                    </FormLabel>
                                    <TextField
                                        autoFocus
                                        margin="none"
                                        id="name"
                                        label="Enter WorkSpace Name"
                                        type="text"
                                        required={false}
                                        value={WorkSpaceName}
                                        autoComplete="section-blue shipping"
                                        onChange={(e) => this.onChangeText("WorkSpaceName", e.target.value)}
                                        fullWidth
                                    />
                                </FormControl>
                                <FormControl className="mt-4">
                                    <FormLabel className="m-0">
                                        <span for="UserName" className="text-default">  Add Users </span>
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        className="txt-lt-dark"
                                        name="UserName"
                                        id="UserName"
                                        value={userSearch}
                                        onChange={(e) => this.onChangeText("userSearch", e.target.value)}
                                        placeholder="Search for Users" />
                                </FormControl>
                            </FormGroup>
                            <Col className="shadow br-sm p-4" lg="12">
                                <Col className="p-1 max-dn-ht-250  hide-scroll-ind" lg="12">
                                    {
                                        filterContacts.map((users, index) => (
                                            <Card onClick={() => { this.editSelectUsers(users.userName, users.imageUrl, users.id) }} key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                    <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                        <Avatar alt={users.userName} src={users.imageUrl} />
                                                    </Col>
                                                    <Col lg="9" className="d-flex align-items-center justify-content-center">
                                                        <span className="text-clamp">{users.userName}</span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                </Col>
                                {
                                    editUserObj != null && editUserObj.length != 0 ?
                                        <Col className="p-1 max-dn-ht-250 hide-scroll-ind" lg="12">
                                            <h3 className="txt-lt-dark"> Selected Users </h3>
                                            {
                                                editUserObj.map((users, index) => (
                                                    <Card key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                        <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                            <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                                <Avatar alt={users.userName} src={users.imageUrl} />
                                                            </Col>
                                                            <Col lg="8" className="d-flex align-items-center justify-content-center">
                                                                <span className="text-clamp">{users.userName}</span>
                                                            </Col>
                                                            <Col lg="1" className="d-flex align-items-center justify-content-center">
                                                                <span
                                                                    className="txt-lt-dark cursor-point p-2"
                                                                    onClick={() => { this.editDeleteSelectedUsers(users.userName, users.id) }}
                                                                >
                                                                    <Clear className="text-red" />
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                ))
                                            }
                                        </Col> : null
                                }
                            </Col>
                        </>}
                </DialogBox>
                <DialogBox
                    disableBackdropClick={true}
                    maxWidth={"md"}
                    fullWidth={true}
                    DialogHeader={"Users"}
                    DialogContentTextData={"Users Which are Availabel in WorkSpace"}
                    DialogButtonText2={"Ok"}
                    Variant={"outlined"}
                    onClose={this.handleCloseDialog}
                    onOpen={setShowUsers}
                    OnClick_Bt2={this.handleCloseDialog}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >
                    <UsersTable
                        Header={'Users'}
                        userData={UserData}
                        tHeader={UserHeaderData}
                    />
                </DialogBox>
            </>
        );
    }
}

export default WorkSpace;
