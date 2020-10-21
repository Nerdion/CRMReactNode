
import React from "react";

// Editor
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromHTML, ContentState, } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

// reactstrap components
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Alert,
    Card,


} from "reactstrap";

import {
    FiberManualRecord,
    ExpandMore,
    PeopleAlt,
    Edit,
    Add,
    Clear,
    Public,
    Save,
    ArrowBackIos,
} from '@material-ui/icons';

import {
    Tooltip,
    Button,
    FormControl,
    Avatar,
    FormLabel,
    Input as Input1
} from '@material-ui/core';

//Api

import { taskAction, organizationAPI } from '../views/CRM_Apis';

// core components

import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';
import UserTaskCard from '../components/Cards/UserTaskCard';

let linkTaskId = null;
class EditTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            openMenu: null,
            options: [
                { "option": "Draft", "icon": FiberManualRecord, "color": "#bac7d4", "statusid": 0 },
                { "option": "Pending", "icon": FiberManualRecord, "color": "#e8cd82", "statusid": 1 },
                { "option": "Finished", "icon": FiberManualRecord, "color": "#83e67e", "statusid": 2 },
            ],
            statusName: "Draft",
            statusColor: "#bac7d4",
            users: [],
            enableEditor: false,
            setAddUsersBol: false,
            userSearch: '',
            userObj: [],
            addedUserIds: [],
            deletedUserIds: [],
            userBackup: [],
            topicName: '',
            stepTitle: '',
            taskEditBol: false,
            taskIdToEdit: null,
            taskEditable: false,
            reload: true,
            title: '',
            message: '',
            Alert_open_close: false,
            statusId: null,
            alertColorSuccess: false
        };
    }

    componentDidMount() {
        linkTaskId = this.props.match.params.tasks;
        console.log("linkTaskId---->", linkTaskId)
        if (linkTaskId) {
            this.setState({ taskEditBol: true, taskIdToEdit: linkTaskId, taskEditable: true })
            this.getTaskData();
            this.getTaskUsers();
        }
        //this.getUserProfile();

    }

    handleopen = () => {
        this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
    }

    changeStatus = (color, status, id) => {
        this.setState({ statusName: status, statusColor: color, statusId: id });
    }

    onChangeTextData = (state, text) => {
        this.setState({ [`${state}`]: text })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onClickEditTask = () => {
        this.setState((prevState) => ({ taskEditable: !prevState.taskEditable }));
    }

    onClickOpenAddUsers = () => {

        let NewData = [...this.orgUsersData];

        for (var i = NewData.length - 1; i >= 0; i--) {
            for (var j = 0; j < this.state.userObj.length; j++) {
                if (NewData[i] && (NewData[i].id === this.state.userObj[j].id)) {
                    NewData.splice(i, 1);
                }
            }
        }

        this.setState({
            setAddUsersBol: true,
            userBackup: this.orgUsersData,
            users: NewData
        });
    }

    onClickCloseAddUsers = () => {
        this.setState({ setAddUsersBol: false });
    };

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    handleInputChange = event => {
        const query = event.target.value;

        this.setState(prevState => {
            const filteredData = prevState.data.filter(element => {
                return element.name.toLowerCase().includes(query.toLowerCase());
            });

            return {
                query,
                filteredData
            };
        });
    };

    selectUsers = (UserName, UserImage, userId) => {
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
            let array1 = [...this.state.deletedUserIds];
            let filteredArray1 = array1.filter(item => item !== userId)
            this.setState({
                userObj: [...this.state.userObj,
                { userName: UserName, imageUrl: UserImage, id: userId }],
                users: filteredArray,
                deletedUserIds: filteredArray1
            });
        }
        console.log("userObj==>", this.state.userObj);


    }

    deleteSelectedUsers = (userName, userId) => {
        let array = [...this.state.userObj]
        let filteredArray = array.filter(item => item.userName !== userName);
        let filteredArray1 = array.filter(item => item.userName === userName);
        let returnFlag = 0;
        if (this.state.deletedUserIds.length === 0) {
            returnFlag = 0;
        } else {
            for (let i = 0; i < this.state.userBackup.length; i++) {
                for (let j = 0; j < this.state.deletedUserIds.length; j++) {
                    if (this.state.userBackup[i].id === this.state.deletedUserIds[j]) {
                        returnFlag = 1;
                        break;
                    } else {
                        returnFlag = 0;
                    }
                }
            }
            for (let i = 0; i < this.state.userObj.length; i++) {
                for (let j = 0; j < this.state.deletedUserIds.length; j++) {
                    if (this.state.userObj[i].id === this.state.deletedUserIds[j]) {
                        returnFlag = 1;
                        break;
                    } else {
                        returnFlag = 0;
                    }
                }
            }
        }
        if (returnFlag === 0) {
            this.setState((prevState) => ({ deletedUserIds: [...prevState.deletedUserIds, userId], users: [...prevState.users, filteredArray1[0]], userObj: filteredArray }))
        }
    }


    getTaskUsers = async () => {
        let title = "Error";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        const {
            workspaceId
        } = this.props.location.state;
        try {
            const getAllMembers = await fetch(organizationAPI, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                body: JSON.stringify({
                    method: "workspaceMembers",
                    workspaceId: workspaceId
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
            this.setState({ userBackup: this.orgUsersData })
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true, alertColorSuccess: false });
        }
    }

    customContentStateConverter = (contentState) => {
        // changes block type of images to 'atomic'
        const newBlockMap = contentState.getBlockMap().map((block) => {
            const entityKey = block.getEntityAt(0);
            if (entityKey !== null) {
                const entityBlock = contentState.getEntity(entityKey);
                const entityType = entityBlock.getType();
                switch (entityType) {
                    case 'IMAGE': {
                        const newBlock = block.merge({
                            type: 'atomic',
                            text: 'img',
                        });
                        return newBlock;
                    }
                    default:
                        return block;
                }
            }
            return block;
        });
        const newContentState = contentState.set('blockMap', newBlockMap);
        return newContentState;
    }


    getTaskData = async () => {
        let title = "Error";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        try {
            const getWorkSpaceTaskData = await fetch(taskAction, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                body: JSON.stringify({
                    taskId: linkTaskId,
                    action: 5
                })
            });
            const responseData = await getWorkSpaceTaskData.json();
            console.log('getWorkSpaceTaskData--->', JSON.stringify(responseData, null, 2))
            console.log(getWorkSpaceTaskData, 'getWorkSpaceTaskData');
            let editorRawData = convertFromHTML(responseData.taskData.taskDetails);
            const editorStateData = this.customContentStateConverter(ContentState.createFromBlockArray(
                editorRawData.contentBlocks,
                editorRawData.entityMap,
            ));
            console.log("html Data--->", responseData.taskData.taskDetails);
            console.log("Raw Data--->", editorRawData);
            let setStatusColor = null;
            if (responseData.taskData.status === "Pending") {
                setStatusColor = "#e8cd82"
            }
            else if (responseData.taskData.status === "Finished") {
                setStatusColor = "#83e67e"
            }
            else if (responseData.taskData.status === "Draft") {
                setStatusColor = "#bac7d4"
            }

            let TaskMembers = responseData.taskData.users.map((data) => {
                let image = data.userProfileImage ? data.userProfileImage : ''
                return {
                    userName: data.name,
                    imageUrl: image,
                    id: data._id
                }
            });



            this.setState({
                topicName: responseData.taskData.taskName,
                stepTitle: responseData.taskData.taskDescription,
                userObj: TaskMembers,
                statusId: responseData.taskData.statusId,
                statusName: responseData.taskData.status,
                statusColor: setStatusColor,
                editorState: EditorState.createWithContent(editorStateData)
            })

        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true, alertColorSuccess: false });
        }
    }


    onClickSaveEditWorkSpaceTask = async () => {
        const { topicName, stepTitle, userObj, editorState, taskIdToEdit, addedUserIds, statusId, deletedUserIds } = this.state;
        let crm_token = localStorage.getItem('CRM_Token_Value');
        let taskId = this.props.match.params.tasks;
        let title = "Error";
        const {
            workSpaceName,
            workspaceId
        } = this.props.location.state;
        let message = '';
        let editorRawData = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        //  console.log("data---->", { topicName, stepTitle, userObj });
        // console.log("Editor Data--->", editorRawData);
        let userIds = userObj.map((val) => val.id)
        try {
            if (topicName === "" && stepTitle === "") {
                message = "Please Enter Topic Name and Step Title";
                this.setState({ title, message, Alert_open_close: true, alertColorSuccess: false });
            }
            else if (topicName !== "" && stepTitle === "") {
                message = "Please Enter Step Title";
                this.setState({ title, message, Alert_open_close: true, alertColorSuccess: false });
            }
            else if (topicName === "" && stepTitle !== "") {
                message = "Please Enter Topic Name";
                this.setState({ title, message, Alert_open_close: true, alertColorSuccess: false });
            }
            else if (topicName !== "" && stepTitle !== "") {

                const UserRegisterApiCall = await fetch(taskAction, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${crm_token}`
                    },
                    body: JSON.stringify({
                        action: 2,
                        updatedTaskData: {
                            taskId: taskId,
                            workspaceId: workspaceId,
                            taskName: topicName,
                            taskDescription: stepTitle,
                            deletedUserIds: deletedUserIds,
                            addedUserIds: userIds,
                            taskDetails: editorRawData,
                            statusId: statusId
                        }
                    })
                });
                const responseData = await UserRegisterApiCall.json();
                console.log(responseData, 'UserRegisterApiCallData')
                console.log(UserRegisterApiCall, 'UserRegisterApiCall');

                if (responseData.success === true) {
                    console.log("Task Added!");
                    const title = "Success"
                    message = "Task Created!";
                    this.setState({
                        title,
                        message,
                        Alert_open_close: true,
                        alertColorSuccess: true,
                        userObj: [],
                    });
                    this.props.history.push("/admin/tasks", { WorkSpaceName: workSpaceName, workspaceId: workspaceId });
                }
                else {
                    message = "Invalid data";
                    this.setState({ title, message, Alert_open_close: true, alertColorSuccess: false });
                }
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true, alertColorSuccess: false });
        }
    }


    render() {
        let { editorState,
            options,
            openMenu,
            statusName,
            statusColor,
            users,
            userObj,
            userSearch,
            enableEditor,
            setAddUsersBol,
            topicName,
            stepTitle,
            taskEditable,
            Alert_open_close,
            title,
            statusId,
            message,
            alertColorSuccess
        } = this.state;
        const {
            workSpaceName,
            workspaceId
        } = this.props.location.state;

        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={alertColorSuccess === true ? "success" : "danger"} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );


        let filtereContacts = users !== null ? users.filter(
            (item) => {
                return item.userName.toLowerCase().indexOf(userSearch.toLowerCase()) !== -1;
            }
        ) : '';
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {AlertError}
                    <Row className="mb-3 align-items-center">
                        <Col className="justify-content-center" xl="12">
                            <Card className="shadow pt-2 pb-2 pr-4 pl-4">
                                <Row className="d-flex align-items-center justify-content-between">
                                    <Col sm="12" md="6" lg="6" className="p-1 txt-left-to-center">
                                        <h5 className="text-muted">WorkSpace Name:</h5>
                                        <h3 className="text-default">{workSpaceName}</h3>
                                    </Col>
                                    <Col className="txt-right-to-center p-1 mt-1 p-1" xs="12" sm="12" md="6" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            color={taskEditable ? "primary" : "secondary"}
                                            size="medium"
                                            className="wd-150"
                                            startIcon={<Edit />}
                                            onClick={this.onClickEditTask}
                                        >
                                            Edit
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col className="" xs="6" sm="6" md="6" lg="10" xl="10">
                            <Form>
                                <FormGroup>
                                    <Label for="taskName">Task Name</Label>
                                    <Input
                                        type="text"
                                        className="txt-lt-dark"
                                        name="taskName"
                                        disabled={taskEditable}
                                        id="taskName"
                                        value={topicName}
                                        onChange={(event) => { this.onChangeTextData("topicName", event.target.value, event) }}
                                        placeholder="Enter Task Name" />
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col className="text-center mb-4" xs="6" sm="6" md="3" lg="2" xl="2">
                            <Tooltip title="Status" arrow>
                                <ButtonDropdown disabled={taskEditable} className="" direction="left" isOpen={openMenu} toggle={() => this.handleopen()}>
                                    <Col className="mb-1">
                                        <span className="text-left txt-lt-dark mr-5">
                                            Status
                                        </span>
                                    </Col>
                                    <DropdownToggle size="md" className="br-sm outline-border">
                                        <FiberManualRecord style={{ color: statusColor }} />
                                        <ExpandMore style={{ color: "#d0d4d9" }} />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {
                                            options.map((options, index) => (
                                                <DropdownItem key={index} onClick={() => this.changeStatus(options.color, options.option, options.statusid)} key={index}>< options.icon style={{ color: options.color }} />{options.option}</DropdownItem>
                                            ))
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row >
                        <Col xs="12" sm="12" md="12" lg="3" xl="3">
                            <Col className=" br-sm  bg-white card-shadow-lt-white p-2">
                                <div className="pt-2 pr-2 pl-2 pb-1 text-center ">
                                    <PeopleAlt style={{ fontSize: 60 }} />
                                </div>
                                <div className="text-center">
                                    <span className="txt-lt-dark font-weight-400">
                                        Team Members
                                    </span>
                                </div>
                                <Col className="mb-2 min-dn-ht hide-scroll-ind">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        disabled={taskEditable}
                                        className="wd-100p mt-2"
                                        startIcon={<Add />}
                                        onClick={this.onClickOpenAddUsers}
                                    >
                                        Add Users
                                        </Button>
                                    {
                                        userObj.map((item, index) => (
                                            <UserTaskCard
                                                userName={item.userName}
                                                imageUrl={item.imageUrl}
                                            />
                                        ))
                                    }
                                </Col>
                            </Col>
                        </Col>
                        <Col className="mb-5 mb-xl-0" xs="12" sm="12" lg="9" xl="9">
                            <Col>
                                <Form>
                                    <FormGroup>
                                        <Label for="taskDescription">Task Description</Label>
                                        <Input
                                            type="text"
                                            className="txt-lt-dark"
                                            name="taskDescription"
                                            disabled={taskEditable}
                                            id="taskDescription"
                                            value={stepTitle}
                                            onChange={(event) => { this.onChangeTextData("stepTitle", event.target.value, event) }}
                                            placeholder="Enter Task Description"
                                        />
                                    </FormGroup>
                                </Form>
                            </Col>
                            <div>
                                <div className="br-xs bg-white mb-4 align-items-center card-shadow-lt-white">
                                    <Editor
                                        readOnly={taskEditable}
                                        editorState={editorState}
                                        wrapperClassName="br-sm text-dark"
                                        editorClassName="p-3 ht-l"
                                        onEditorStateChange={this.onEditorStateChange}
                                        spellCheck={true}

                                    />
                                </div>
                                {/* <div className="bg-white align-items-centeer">
                                    <textarea
                                        disabled
                                        className="col-md-12 ht-m"
                                        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                    />
                                </div> */}
                            </div>
                            <Col className="mb-5 mb-xl-0" xl="12">
                                <Row className="d-flex align-items-center justify-content-center">
                                    <Col className="text-center p-1" xs="12" sm="12" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            color={"primary"}
                                            size="medium"
                                            className="wd-150"
                                            startIcon={<ArrowBackIos />}
                                            onClick={() => { this.props.history.push("/admin/tasks", { WorkSpaceName: workSpaceName, workspaceId: workspaceId }); }}
                                        >
                                            Go Back
                                        </Button>
                                    </Col>
                                    <Col className="text-center  p-1" xs="12" sm="12" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            disabled={taskEditable}
                                            color="primary"
                                            className="wd-200"
                                            size="medium"
                                            startIcon={<Save />}
                                            onClick={() => { this.onClickSaveEditWorkSpaceTask() }}
                                        >
                                            Save Task
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                </Container>
                <DialogBox
                    disableBackdropClick={true}
                    maxWidth={"sm"}
                    fullWidth={true}
                    DialogHeader={"Manage Users and Roals"}
                    DialogContentTextData={"Configure Users assignments, Roals, Completions and Content Access for this Subjects"}
                    DialogButtonText2={"Ok"}
                    Variant={"outlined"}
                    onClose={this.onClickCloseAddUsers}
                    onOpen={setAddUsersBol}
                    OnClick_Bt2={this.onClickCloseAddUsers}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >

                    <Col className="shadow br-sm p-4" lg="12">
                        <FormControl className="col-md-12 col-lg-12 mt-4 mb-2 wd-100p">
                            <FormLabel className="m-0">
                                <span for="UserName" className="text-default">  Add Users  </span>
                            </FormLabel>
                            <Input1
                                type="text"
                                className="txt-lt-dark "
                                name="UserName"
                                id="UserName"
                                value={userSearch}
                                onChange={(event) => { this.setState({ userSearch: event.target.value }) }}
                                placeholder="Search for Users"

                            />
                        </FormControl>
                        <Col className="p-1 max-dn-ht-250  hide-scroll-ind" lg="12">
                            {
                                filtereContacts.map((users, index) => (
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
                            userObj.length != 0 ?
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
                </DialogBox>
            </>
        );
    }
}

export default EditTask;
