import React, { Component } from 'react';

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
    CardFooter,
} from "reactstrap";

import {
    MoreVert,
    Edit,
    FileCopy,
    Delete
} from '@material-ui/icons';

import { Tooltip } from '@material-ui/core';

const ITEM_HEIGHT = 48;
export class WorkSpaceTasksCard extends Component {
    state = {
        openMenu: null,
        options: [
            { "option": "Edit", "icon": Edit, "color": "#2b5578" },
            { "option": "Delete", "icon": Delete, "color": "#c4416a" },
        ]
    }
    handleopen = () => {
        this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
    }
    render() {
        const { openMenu, options } = this.state;
        const { TaskCardData, onClickAvatar, onClickTask, onClickDelete } = this.props;
        let createdAt = TaskCardData.createdAt;
        return (
            <Col className="mar-b-2 mb-xl-0" xs="12" md="12" lg="6" xl="6">
                <Card className="bg-gradient-white card-shadow-white">
                    <CardHeader className="bg-transparent">
                        <Row className="align-items-center">
                            <div className="col">
                                <h3 className="text-uppercase txt-dark disable-hover ls-1 mb-1">
                                    {TaskCardData.taskName}
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
                                                    <DropdownItem onClick={options.option === "Edit" ? onClickTask : onClickDelete } key={index}>< options.icon style={{ color: options.color }} />{options.option}</DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                            </Tooltip>
                        </Row>
                    </CardHeader>
                    <div className="card-hover-view cursor-point" onClick={onClickTask}>
                        <CardBody>
                            {/* Chart */}
                            <div className="col">
                                <p className="text-body font-weight-400">{TaskCardData.taskDescription}</p>
                            </div>
                            <div className="col text-right">
                                <Badge color={TaskCardData.activityStatus === "published" ? "success" : "warning"} className="p-2" pill>{TaskCardData.activityStatus}</Badge>
                            </div>
                        </CardBody>

                        <CardFooter>
                            <Row className="align-items-center">
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className="text-left">
                                        {TaskCardData.status === "Pending" ?
                                            <span className="txt-bold txt-pending">Status: {TaskCardData.status}</span> :
                                            TaskCardData.status === "Draft" ?
                                                <span className="txt-bold txt-draft">Status: {TaskCardData.status}</span> :
                                                <span className="txt-bold txt-finished">Status: {TaskCardData.status}</span>
                                        }
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-1 text-right">
                                    <span className="text-muted">Created at : </span>
                                    <div onClick={onClickAvatar} className="avatar-group">
                                        {createdAt === null || createdAt === undefined ?
                                            <span className=" text-default">No User Assigned</span> :
                                            <span className=" text-default">{TaskCardData.createdAt}</span>
                                        }
                                    </div>

                                </div>
                            </Row>
                        </CardFooter>
                    </div>
                </Card>
            </Col >
        )
    }
}

export default WorkSpaceTasksCard
