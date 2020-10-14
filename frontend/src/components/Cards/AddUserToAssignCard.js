import React, { Component } from 'react';

//Material UI
import {
    Avatar,

} from '@material-ui/core';

import {
    Card,
    CardBody,
    Row,
    CardHeader,
    Col,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import {
    ExpandMore,
} from '@material-ui/icons';

export class AddUserToAssignCard extends Component {
    render() {
        const { userName, imageUrl, SearchData, openSearchMenu, onClick, onAddUser } = this.props;
        return (
            <div>
                <Card className="mt-1">
                    <CardHeader>
                        <ButtonDropdown className="" direction="left" isOpen={openSearchMenu} toggle={onclick}>
                            <Col className="mb-1">
                                <span className="text-left text-defalut text-white-to-default mr-5">
                                    Status
                                </span>
                            </Col>
                            <DropdownToggle size="md" className="br-sm outline-border">
                                <ExpandMore style={{ color: "#d0d4d9" }} />
                            </DropdownToggle>
                            <DropdownMenu>
                                {
                                    SearchData.map((users, index) => (
                                        <DropdownItem key={index} onClick={onAddUser} key={index}>
                                            <Card className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                    <Col lg="3" className="d-flex align-items-center justify-content-center">
                                                        <Avatar alt={users.userName} src={users.imageUrl} />
                                                    </Col>
                                                    <Col lg="9" className="d-flex align-items-center justify-content-center">
                                                        <span className="text-clamp">{users.userName}</span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </DropdownItem>
                                    ))
                                }
                            </DropdownMenu>
                        </ButtonDropdown>
                    </CardHeader>
                    <CardBody>
                        <Card className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                            <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                <Col lg="3" className="d-flex align-items-center justify-content-center">
                                    <Avatar alt={userName} src={imageUrl} />
                                </Col>
                                <Col lg="9" className="d-flex align-items-center justify-content-center">
                                    <span className="text-clamp">{userName}</span>
                                </Col>
                            </Row>
                        </Card>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default AddUserToAssignCard;
