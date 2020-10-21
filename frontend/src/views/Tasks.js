
import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col
} from "reactstrap";

// Material UI
import {
    Card,
    Button
} from '@material-ui/core';
import {
    Add,

} from '@material-ui/icons';



// core components
import Header from "../components/Headers/Header.js";
import WorkSpaceTasksCard from '../components/Cards/WorkSpaceTasksCard';

// Api
import { taskAction } from './CRM_Apis';

const WorkspaceData = [
    {
        "WorkspaceName": "DevLab Setup",
        "Permissions": "Admin",
        "Role": "Designer",
        "Completion_Text": "60%",
        "Completion": 60,
        "last_active": "2 minute ago"
    },
    {
        "WorkspaceName": "New Location",
        "Permissions": "Organizer",
        "Role": "Backend Manager",
        "Completion_Text": "30%",
        "Completion": 30,
        "last_active": "5 minute ago"
    },

]

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
            workSpaces: []
        };
    }

    componentDidMount() {
        this.getWorkSpaceTasksCall();
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
    getWorkSpaceTasksCall = async () => {
        let title = "Error";
        let crmToken = localStorage.getItem('CRM_Token_Value');
        const {
            workspaceId
        } = this.props.location.state;
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
            this.setState({
                taskCardData: responseData.taskCardData
            })

        }
        catch (err) {
            console.log("Error fetching data-----------", JSON.stringify(err));
            this.setState({ title, message: JSON.stringify(err), Alert_open_close: true });
        }
    }

    render() {
        const {
            SelectWorkSpace,
            taskCardData,
            setAddWorkspaceOpenClose,
            WorkSpaceDesc,
            workSpaces
        } = this.state;
        const {
            WorkSpaceName,
            workspaceId
        } = this.props.location.state;
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row className="mb-3 align-items-center">
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
                                            onClick={() => { this.props.history.push(`/admin/CreateTaskTest/${workspaceId}`, { workSpaceName: WorkSpaceName }) }}
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
                                onClickTask={() => { this.props.history.push(`/admin/editTask/${workspaceId}/${data.taskId}`, { workSpaceName: WorkSpaceName }) }}
                            />
                        ))}
                    </Row>
                </Container>
            </>
        );
    }
}

export default WorkSpace;
