
import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Alert,
    Spinner,
    CardBody
} from "reactstrap";

// Material UI
import {
    Card,
    Button,
} from '@material-ui/core';
import {
    Add,

} from '@material-ui/icons';



// core components
import Header from "../components/Headers/Header.js";
import WorkSpaceTasksCard from '../components/Cards/WorkSpaceTasksCard';

// Api
import { taskAction } from './CRM_Apis';

const HeaderData = [
    { "Header": "WorkSpace Name" },
    { "Header": "Permissions" },
    { "Header": "Role" },
    { "Header": "Completion" },
    { "Header": "last active" },
    { "Header": "Menu" },
];

class WorkSpace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectWorkSpace: '',
            setAddWorkspaceOpenClose: false,
            WorkSpaceDesc: '',
            taskCardData: [],
            workSpaces: [],
            Alert_open_close: false,
            title: '',
            message: '',
            altSuccessColor: false,
            isSpinning: false
        };
    }

    componentDidMount() {
        this.getWorkSpaceTasksCall();
    }

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }


    onWorkSpaceChanged = (event) => {
        this.setState({ SelectWorkSpace: event });
    }

    onClickOpenAddWorkSpace = () => {
        this.setState({ setAddWorkspaceOpenClose: true });
    }

    handleClose = () => {
        this.setState({ setAddWorkspaceOpenClose: false });
    };

    onChangeText = (Name, value) => {
        this.setState({ [`${Name}`]: value })
    }

    deleteTasks = async (id) => {
        const {
            workspaceId
        } = this.props.location.state;
        let title = "Error";
        let message = "";
        this.setState({ isSpinning: true });
        let crmToken = localStorage.getItem('CRM_Token_Value');
        try {
            let deleteTaskData = await fetch(taskAction, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                body: JSON.stringify({
                    taskId: id,
                    action: 3,
                })
            });
            let responseData = await deleteTaskData.json();

            if (responseData.success === true) {
                title = "Success"
                message = "WorkSpace Deleted!";
                this.setState({ title, message, Alert_open_close: true, altSuccessColor: true, isSpinning: false });
                this.getWorkSpaceTasksCall();
            }
            else {
                message = responseData.Error;
                this.setState({ title, message, Alert_open_close: true, altSuccessColor: false, isSpinning: false });
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true, altSuccessColor: false, isSpinning: false });
        }
    }
    getWorkSpaceTasksCall = async () => {
        let title = "Error";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        const {
            workspaceId
        } = this.props.location.state;
        this.setState({ isSpinning: true });
        try {
            const getWorkSpaceTasks = await fetch(taskAction, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${crmToken}`
                },
                body: JSON.stringify({
                    workspaceId: workspaceId,
                    action: 4
                })
            });

            const responseData = await getWorkSpaceTasks.json();
            console.log('getWorkSpaceData--->', JSON.stringify(responseData, null, 2))
            console.log(getWorkSpaceTasks, 'getWorkSpaceData');

            console.log("set workspace:---", responseData.taskCardData);
            if (responseData.success === true) {
                this.setState({
                    taskCardData: responseData.taskCardData,
                    isSpinning: false
                })
            }

        }
        catch (err) {
            console.log("Error fetching data-----------", JSON.stringify(err));
            this.setState({ title, message: JSON.stringify(err), Alert_open_close: true, isSpinning: false });
        }
    }

    render() {
        const {
            taskCardData,
            Alert_open_close,
            title,
            message,
            altSuccessColor,
            isSpinning
        } = this.state;
        const {
            WorkSpaceName,
            workspaceId
        } = this.props.location.state;

        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={altSuccessColor === true ? "success" : "danger"} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    {isSpinning ? <Card className="bg-secondary shadow border-0">
                        < CardBody className="px-lg-5 py-lg-5 wd-100p ht-500 d-flex justify-content-center align-items-center">
                            <Col lg="12" className="d-flex justify-content-center align-items-center">
                                <Spinner style={{ width: '3rem', height: '3rem' }} className="align-self-center" color="primary" />
                            </Col>
                        </CardBody>
                    </Card> :
                        <>
                            {AlertError}
                            < Row className="mb-3 align-items-center">
                                <Col className="justify-content-center" xl="12">
                                    <Card className="shadow pt-2 pb-2 pr-4 pl-4">
                                        <Row className="d-flex align-items-center justify-content-between">
                                            <Col sm="12" md="6" lg="6" className="p-1 txt-left-to-center">
                                                <h5 className="text-muted">WorkSpace Name:</h5>
                                                <h3 className="text-default">{WorkSpaceName}</h3>
                                            </Col>
                                            <Col className="txt-right-to-center p-1 mt-1 p-1" xs="12" sm="12" md="6" lg="6" xl="6">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className="wd-150"
                                                    size="medium"
                                                    startIcon={<Add />}
                                                    onClick={() => { this.props.history.push(`/admin/CreateTaskTest/${workspaceId}`, { workSpaceName: WorkSpaceName, workspaceId: workspaceId }) }}
                                                >
                                                    Add Task
                                        </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className=" mt-2 justify-content-around">
                                {taskCardData.map((data, index) => (
                                    <WorkSpaceTasksCard
                                        key={index}
                                        TaskCardData={data}
                                        onClickTask={() => { this.props.history.push(`/admin/editTask/${workspaceId}/${data.taskId}`, { workSpaceName: WorkSpaceName, workspaceId: workspaceId }) }}
                                        onClickDelete={() => { this.deleteTasks(data.taskId) }}
                                    />
                                ))}
                            </Row>
                        </>}
                </Container>
            </>
        );
    }
}

export default WorkSpace;
