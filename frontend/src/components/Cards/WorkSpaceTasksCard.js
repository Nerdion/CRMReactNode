import React, { Component } from 'react';

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Progress,
    Row,
    Col,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
    CardFooter
} from "reactstrap";

import {
    MoreVert,
    Edit,
    FileCopy,
    Archive,
    Delete
} from '@material-ui/icons';

import { Tooltip } from '@material-ui/core';

const ITEM_HEIGHT = 48;
export class WorkSpaceTasksCard extends Component {
    state = {
        openMenu: null,
        options: [
            { "option": "Edit", "icon": Edit, "color": "#2b5578" },
            { "option": "Duplicate", "icon": FileCopy, "color": "#2b7872" },
            { "option": "Archive", "icon": Archive, "color": "#523e9c" },
            { "option": "Delete", "icon": Delete, "color": "#c4416a" },
        ]
    }
    handleopen = () => {
        this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
    }
    render() {
        const { openMenu, options } = this.state;
        const { TaskCardData } = this.props;
        return (
            <Col className="mar-b-2 mb-xl-0" xs="12" md="12" lg="6" xl="6">
                <Card className="bg-gradient-white card-shadow-white">
                    <CardHeader className="bg-transparent">
                        <Row className="align-items-center">
                            <div className="col">
                                <h3 className="text-uppercase txt-dark disable-hover ls-1 mb-1">
                                    {TaskCardData.header}
                                </h3>
                            </div>
                            <Tooltip title="More Options" arrow>
                                <div className="text-right">
                                    <ButtonDropdown className="" direction="left" isOpen={openMenu} toggle={() => this.handleopen()}>
                                        <DropdownToggle size="sm" className="br-lg outline-border">
                                            <MoreVert />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {
                                                options.map((options, index) => (
                                                    <DropdownItem key={index}>< options.icon style={{ color: options.color }} />{options.option}</DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                            </Tooltip>
                        </Row>
                    </CardHeader>
                    <div className="card-hover-view cursor-point" onClick={TaskCardData.onClick}>
                        <CardBody>
                            {/* Chart */}
                            <div className="col">
                                <p className="text-body font-weight-400">{TaskCardData.desc}</p>
                            </div>
                            <div className="col text-right">
                                <Badge color={TaskCardData.activityStatus === "published" ? "success" : "warning"} className="p-2" pill>{TaskCardData.activityStatus}</Badge>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Row className="align-items-center">
                                <div className="col">
                                    <Row>
                                        <div className=" col text-left">
                                            <span className="">Avg Completion</span>
                                        </div>
                                        <div className=" col text-right">
                                            <span className="">{TaskCardData.Completion_Text}</span>
                                        </div>
                                    </Row>
                                    <div>
                                        <Progress
                                            max="100"
                                            value={TaskCardData.Completion}
                                            barClassName={
                                                TaskCardData.Completion <= 30 ? "bg-gradient-danger" :
                                                    TaskCardData.Completion > 30 && TaskCardData.Completion <= 60 ? "bg-gradient-warning"
                                                        : "bg-gradient-success"
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 mt-1 text-right">
                                    <h4 className="text-muted">Assign User</h4>
                                </div>
                            </Row>
                        </CardFooter>
                    </div>
                </Card>
            </Col>
        )
    }
}

export default WorkSpaceTasksCard
