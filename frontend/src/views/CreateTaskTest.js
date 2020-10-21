
import React from "react";

// Editor
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
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
    Card,
    Alert

} from "reactstrap";

import {
    FiberManualRecord,
    Public,
    PeopleAlt,
    SaveAlt,
    Add,
    Clear,
    ArrowBackIos
} from '@material-ui/icons';

import {
    Button,
    FormControl,
    Avatar,
    FormLabel,
    Input as Input1
} from '@material-ui/core';

// core components

import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';
import UserTaskCard from '../components/Cards/UserTaskCard';
import { taskAction, organizationAPI } from "../views/CRM_Apis";


let linkTaskId = null;
class CreateTaskTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            openMenu: null,
            options: [
                // { "option": "Draft", "icon": FiberManualRecord, "color": "#bac7d4", "statusId":  },
                { "option": "Pending", "icon": FiberManualRecord, "color": "#e8cd82", "statusId": 1 },
                { "option": "Finished", "icon": FiberManualRecord, "color": "#83e67e", "statusId": 2 },
            ],
            statusName: "Pending",
            statusColor: "#e8cd82",
            statusData: null,
            users: [],
            userBackup: [],
            enableEditor: false,
            setAddUsersBol: false,
            userSearch: '',
            userObj: [],
            addedUserIds: [],
            editUserDeleteIds: [],
            topicName: '',
            stepTitle: '',
            title: '',
            message: '',
            Alert_open_close: false,
            alertColorSuccess: false
        };
    }

    componentDidMount = () => {
        this.getOrgUsers();
        console.log("check status--->", this.state.statusName, this.state.statusColor);
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
        this.setState({ setAddUsersBol: true, users: this.orgUsersData, userBackup: this.orgUsersData, userObj: [] });
    }

    onClickCloseAddUsers = () => {
        this.setState({ setAddUsersBol: false });
    };

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    onClickSaveWorkSpaceTask = async (statusId) => {
        const { topicName, stepTitle, userObj, statusData, editorState } = this.state;
        let crm_token = localStorage.getItem('CRM_Token_Value');
        let title = "Error";
        let message = '';
        const {
            workSpaceName,
            workspaceId
        } = this.props.location.state;
        let editorRawData = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        console.log("data---->", { topicName, stepTitle, userObj, statusData });
        console.log("Editor Data--->", editorState);

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
                let userIds = userObj.map((val) => val.id)
                const UserRegisterApiCall = await fetch(taskAction, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${crm_token}`
                    },
                    body: JSON.stringify({
                        action: 1,
                        taskData: {
                            workspaceId: workspaceId,
                            taskName: topicName,
                            taskDescription: stepTitle,
                            taskDetails: editorRawData,
                            statusId: statusId,
                            addedUserIds: userIds,
                            //addedUserIds :addedUserIds
                        }
                    }
                    )
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
                        topicName: '',
                        stepTitle: '',
                        userObj: [],
                        editorState: EditorState.createEmpty(),
                        alertColorSuccess: true
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

    getOrgUsers = async () => {
        const {
            workSpaceName,
            workspaceId
        } = this.props.location.state;

        let crmToken = localStorage.getItem('CRM_Token_Value');
        const getAllMembers = await fetch(organizationAPI, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${crmToken}`
            },
            body: JSON.stringify({
                method: 'workspaceMembers',
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
    }

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
            this.setState({
                userObj: [...this.state.userObj, { userName: UserName, imageUrl: UserImage, id: userId }],
                users: filteredArray
            });
        }

        console.log("userObj==>", this.state.userObj);

    }

    deleteSelectedUsers = (userName, userId) => {
        let array = [...this.state.userObj]
        let filteredArray = array.filter(item => item.userName !== userName)
        let array1 = [...this.state.userBackup]
        let filteredArray1 = array1.filter(item => item.id === userId)
        this.setState((prevState) => ({ userObj: filteredArray, users: [...prevState.users, filteredArray1[0]] }));
        console.log("UsersAfterDelete---->", filteredArray1);
        // console.log("DeletedId====>", this.state.editUserDeleteIds);
    }


    render() {
        let { editorState,
            users,
            userObj,
            userSearch,
            setAddUsersBol,
            topicName,
            stepTitle,
            taskEditable,
            Alert_open_close,
            title,
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
                                            color={"primary"}
                                            size="medium"
                                            className="wd-150"
                                            startIcon={<ArrowBackIos />}
                                            onClick={() => { this.props.history.push("/admin/tasks", { WorkSpaceName: workSpaceName, workspaceId: workspaceId }); }}
                                        >
                                            Go Back
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col className="" xs="12" md="12" lg="12" xl="12">
                            <Form>
                                <FormGroup>
                                    <Label for="TaskName">Task Name</Label>
                                    <Input
                                        type="text"
                                        className="txt-lt-dark"
                                        name="TaskName"
                                        id="TaskName"
                                        value={topicName}
                                        onChange={(event) => { this.onChangeTextData("topicName", event.target.value, event) }}
                                        placeholder="Task Name" />
                                </FormGroup>
                            </Form>
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

                                        className="wd-100p mt-2"
                                        startIcon={<Add />}
                                        onClick={this.onClickOpenAddUsers}
                                    >
                                        Add Members
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
                                        <Label for="TaskDescription">Task Description</Label>
                                        <Input
                                            type="text"
                                            className="txt-lt-dark"
                                            name="TaskDescription"

                                            id="TaskDescription"
                                            value={stepTitle}
                                            onChange={(event) => { this.onChangeTextData("stepTitle", event.target.value, event) }}
                                            placeholder="Task Description"
                                        />
                                    </FormGroup>
                                </Form>
                            </Col>
                            <div>
                                <div className="br-xs bg-white mb-4 align-items-center card-shadow-lt-white">
                                    <Editor
                                        editorState={editorState}
                                        wrapperClassName="br-sm text-dark"
                                        editorClassName="p-3 ht-l"
                                        onEditorStateChange={this.onEditorStateChange}

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
                                    <Col className="text-center  p-1" xs="12" sm="12" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            disabled={taskEditable}
                                            color="primary"
                                            className="wd-150"
                                            size="medium"
                                            startIcon={<SaveAlt />}
                                            onClick={() => { this.onClickSaveWorkSpaceTask(0) }}
                                        >
                                            Save Draft
                                        </Button>
                                    </Col>
                                    <Col className="text-center  p-1" xs="12" sm="12" lg="6" xl="6">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="wd-150"
                                            size="medium"
                                            startIcon={<Public />}
                                            onClick={() => { this.onClickSaveWorkSpaceTask(1) }}
                                        >
                                            publish
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

export default CreateTaskTest;
