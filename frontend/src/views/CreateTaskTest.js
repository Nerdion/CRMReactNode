
import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";

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
    Col
} from "reactstrap";

// core components

import Header from "../components/Headers/Header.js";

class CreateTaskTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        };
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };


    render() {
        const { editorState } = this.state;
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Col className="mb-5 mb-xl-0" xl="8">
                        <div>
                            <div className="bg-white mb-4 align-items-centeer">
                                <Editor
                                    editorState={editorState}
                                    wrapperClassName=""
                                    editorClassName="p-3 ht-l"
                                    onEditorStateChange={this.onEditorStateChange}
                                />
                            </div>
                            <div className="bg-white align-items-centeer">
                                <textarea
                                    disabled
                                    className="col-md-12 ht-m"
                                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                                />
                            </div>
                        </div>
                    </Col>
                </Container>
            </>
        );
    }
}

export default CreateTaskTest;
