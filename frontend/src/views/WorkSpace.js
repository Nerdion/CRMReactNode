
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
    Button
} from '@material-ui/core/';

// core components
import Header from "../components/Headers/Header.js";
import W_Tasks from '../components/Cards/W_Tasks';

class WorkSpace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectWorkSpace: ''
        };
    }

    onWorkSpaceChanged = (event) => {
        this.setState({ SelectWorkSpace: event });
    }

    render() {
        const { SelectWorkSpace } = this.state;
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row className="mb-3 align-items-center">
                        <Col xs="12" md="6" lg="6" xl="6">
                            <FormControl className="min-wd-200 width-f">
                                <InputLabel className="text-white" id="demo-simple-select-helper-label">WorkSpace</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={SelectWorkSpace}
                                    className="text-default font-weight-bold"
                                    onChange={(event) => this.onWorkSpaceChanged(event.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"Main Project"}>Main Project</MenuItem>
                                    <MenuItem value={"Main Project 1"}>Main Project 1</MenuItem>
                                    <MenuItem value={"Main Project 2"}>Main Project 2</MenuItem>
                                </Select>
                                <FormHelperText className="text-dark">Select your workspace here</FormHelperText>
                            </FormControl>
                        </Col>
                        <Col  xs="12" md="6" lg="6" xl="6">
                            <Row className="d-flex justify-content-around align-items-center">
                                <Col className="d-flex justify-content-around align-items-center" xs="12" md="6" lg="6" xl="6">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={this.onClickOpenAddWorkSpace}
                                    >
                                        Add WorkSpace
                                     </Button>
                                </Col>
                                {/* <Col className="d-flex justify-content-around align-items-center" xs="12" md="6" lg="6" xl="6">
                                    <FormControl className="min-wd-120 width-f ">
                                        <InputLabel style={{zIndex:1}} className="text-white" id="demo-simple-select-helper-label">WorkSpace</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            value={SelectWorkSpace}
                                            className="text-default font-weight-bold br-sm "
                                            onChange={(event) => this.onWorkSpaceChanged(event.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={"Main Project"}>Main Project</MenuItem>
                                            <MenuItem value={"Main Project 1"}>Main Project 1</MenuItem>
                                            <MenuItem value={"Main Project 2"}>Main Project 2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>
                    <Row className=" mt-2 justify-content-around">
                        <W_Tasks />
                        <W_Tasks />
                        <W_Tasks />
                        <W_Tasks />
                    </Row>
                </Container>
            </>
        );
    }
}

export default WorkSpace;
