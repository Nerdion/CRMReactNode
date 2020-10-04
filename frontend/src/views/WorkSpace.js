
import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";

// reactstrap components
import {
    Container,
    Row,
    Col
} from "reactstrap";

// Material UI
import {
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Button,
    TextField,
    Input,
    FormControlLabel,
    FormGroup,
    FormLabel,
    TextareaAutosize
} from '@material-ui/core';

import {
    Add
} from '@material-ui/icons';

// core components
import Header from "../components/Headers/Header.js";
import W_Tasks from '../components/Cards/W_Tasks';
import DialogBox from '../components/DialogBox/DialogBox';

class WorkSpace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectWorkSpace: '',
            setAddWorkspaceOpenClose: false,
            WorkSpaceName: '',
            WorkSpaceDesc: '',
            TaskCardData: [
                {
                    "header": "Overall Method of Sets",
                    "desc": "you have to create a data related to a perticular matrix",
                    "activityStatus": "published",
                    "Completion": 10,
                    "Completion_Text": "10%",
                    "onClick": () => { this.props.history.push("/admin/index") }
                },
                {
                    "header": "Dev Link new Set",
                    "desc": "you have to create a data related to a perticular matrix",
                    "activityStatus": "unpublished",
                    "Completion": 60,
                    "Completion_Text": "60%",
                    "onClick": () => { this.props.history.push("/admin/index") }
                },
                {
                    "header": "Best Project",
                    "desc": "you have to create a data related to a perticular matrix",
                    "activityStatus": "published",
                    "Completion": 50,
                    "Completion_Text": "50%",
                    "onClick": () => { this.props.history.push("/admin/index") }
                },
                {
                    "header": "Good Project",
                    "desc": "Make it new",
                    "activityStatus": "unpublished",
                    "Completion": 30,
                    "Completion_Text": "30%",
                    "onClick": () => { this.props.history.push("/admin/index") }
                }
            ],
            workSpaces: [
                "OVERALL METHOD OF SETS",
                "DEV LINK NEW SET",
                "Best project",
                "Good Project"
            ]
        };
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

    render() {
        const {
            SelectWorkSpace,
            TaskCardData,
            setAddWorkspaceOpenClose,
            WorkSpaceName,
            WorkSpaceDesc,
            workSpaces
        } = this.state;
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row className="mb-3 align-items-center">
                        <Col xs="12" md="6" lg="6" xl="6">
                            <FormControl className="min-wd-200 width-f bg-info p-2 br-sm">
                                <InputLabel className="text-white mar-1" id="demo-simple-select-helper-label">WorkSpace</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={SelectWorkSpace}
                                    className="txt-darker font-weight-normal"
                                    onChange={(event) => this.onWorkSpaceChanged(event.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        workSpaces.map((workspaces, index) => (
                                            <MenuItem key={index} value={workspaces}>{workspaces}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText className="text-lt-dark">Select your workspace here</FormHelperText>
                            </FormControl>
                        </Col>
                        <Col xs="12" md="6" lg="6" xl="6">
                            <Row className="d-flex justify-content-around align-items-center mt-1">
                                <Col className="d-flex justify-content-around align-items-center" xs="12" md="6" lg="6" xl="6">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        startIcon={<Add />}
                                        onClick={this.onClickOpenAddWorkSpace}
                                    >
                                        Add WorkSpace
                                     </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className=" mt-2 justify-content-around">
                        {TaskCardData.map((data, index) => (
                            <W_Tasks key={index} TaskCardData={data} />
                        ))}
                    </Row>
                </Container>
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
                    OnClick_Bt2={this.handleClose}
                    B2backgroundColor={"#3773b0"}
                    B2color={"#ffffff"}
                >
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
                                autocomplete="section-blue shipping"
                                onChange={(e) => this.onChangeText("WorkSpaceName", e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                        <FormControl className="mt-5">
                            <FormLabel className="m-0">
                                <span className="text-default">  Description(Optional) </span>
                            </FormLabel>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Description"
                                type="text"
                                rows={6}
                                rowsMax={6}
                                multiline={true}
                                required={false}
                                value={WorkSpaceDesc}
                                autocomplete="section-blue shipping"
                                onChange={(e) => this.onChangeText("WorkSpaceDesc", e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                    </FormGroup>
                </DialogBox>
            </>
        );
    }
}

export default WorkSpace;
