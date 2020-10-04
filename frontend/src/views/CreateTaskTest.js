
import React from "react";

// Editor
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// reactstrap components
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

import {
    FiberManualRecord,
    ExpandMore,
    Telegram,
    PeopleAlt
} from '@material-ui/icons';

import {
    Tooltip,
    Button,
} from '@material-ui/core';

// core components

import Header from "../components/Headers/Header.js";

class CreateTaskTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            openMenu: null,
            options: [
                { "option": "Draft", "icon": FiberManualRecord, "color": "#bac7d4" },
                { "option": "Pending", "icon": FiberManualRecord, "color": "#e8cd82" },
                { "option": "Finished", "icon": FiberManualRecord, "color": "#83e67e" },
            ],
            statusName: "None",
            statusColor: "#bac7d4"
        };
    }

    handleopen = () => {
        this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
    }

    changeStatus = (color, status) => {
        this.setState({ statusName: status, statusColor: color });
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };


    render() {
        const { editorState, options, openMenu, statusName, statusColor } = this.state;
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col className="" xs="12" md="6" lg="8" xl="8">
                            <Form>
                                <FormGroup>
                                    <Label className="text-white" for="Topic">Topic Name</Label>
                                    <Input type="text" name="TopicName" id="Topic" placeholder="with a placeholder" />
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col className="text-center mb-4" xs="6" md="3" lg="2" xl="2">
                            <Tooltip title="Status" arrow>
                                <ButtonDropdown className="" direction="left" isOpen={openMenu} toggle={() => this.handleopen()}>
                                    <Col className="mb-1">
                                        <span className="text-left text-defalut text-white-to-default mr-5">
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
                                                <DropdownItem onClick={() => this.changeStatus(options.color, options.option)} key={index}>< options.icon style={{ color: options.color }} />{options.option}</DropdownItem>
                                            ))
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Tooltip>
                        </Col>
                        <Col className="text-center mt-1" xs="6" md="3" lg="2" xl="2">
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                startIcon={<Telegram />}
                                onClick={this.onClickOpenAddWorkSpace}
                            >
                                Notify Team
                                     </Button>
                        </Col>
                    </Row>
                    <Row >
                        <Col xs="12" md="3" xl="3">
                            <Col className=" br-sm col-md-12 bg-white card-shadow-lt-white">
                                <div className="p-4 text-center col-md-12">
                                    <PeopleAlt style={{ fontSize: 60 }} />
                                </div>
                                <div className="text-center">
                                    <span className="txt-lt-dark font-weight-400 ">
                                        Team Members
                                    </span>
                                </div>
                            </Col>
                            <Col>

                            </Col>
                        </Col>
                        <Col className="mb-5 mb-xl-0" xl="9">
                            <Col>
                                <Form>
                                    <FormGroup>
                                        <Label for="StepTitle">Step Title</Label>
                                        <Input type="text" name="StepTitle" id="StepTitle" placeholder="Step Title" />
                                    </FormGroup>
                                </Form>
                            </Col>
                            <div>
                                <div className="br-xs bg-white mb-4 align-items-center card-shadow-lt-white">
                                    <Editor
                                        editorState={editorState}
                                        wrapperClassName="br-sm"
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
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default CreateTaskTest;
