import React, { Component } from 'react';

//Material UI
import {
    Button,
    Avatar,
} from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import {
    Delete,
    Edit,
    Add
} from '@material-ui/icons';
// reactstrap components
import {
    Row,
    Col,
    Card,
    CardHeader,
    Table,
    Progress,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledTooltip
} from "reactstrap";

export class WorkSpaceTable extends Component {
    render() {
        const {
            Header,
            onClickHeaderButton,
            HeaderButtonName,
            tHeader,
            userData,
            onRowPress,
            onClickAvatar,
            editWorkSpace,
            deleteWorkSpace
        } = this.props;
        return (
            <div>
                <Col className="mb-12 mb-xl-0" md='12' xl="12">
                    <Card className="shadow max-dn-ht-500 hide-scroll-ind">
                        <CardHeader className="border-0">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h3 className="mb-0">{Header}</h3>
                                </div>
                                <div className="col text-right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={onClickHeaderButton}
                                    >
                                        {HeaderButtonName}
                                    </Button>
                                </div>
                            </Row>
                        </CardHeader>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    {tHeader.map((hdata, index) => (
                                        <th key={index} scope="col">{hdata.Header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((Tdata, index) => (
                                    <tr className="card-hover-view" key={index}>
                                        <th className="cursor-point txt-decoration-hov" onClick={() => onRowPress(Tdata)} scope="row">{Tdata.workspaceName}</th>
                                        <td>{Tdata.organizationName}</td>
                                        <td>{Tdata.managerName}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">{Tdata.completionText}</span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value={Tdata.completion}
                                                        barClassName={
                                                            Tdata.completion <= 30 ? "bg-gradient-danger" :
                                                                Tdata.completion > 30 && Tdata.completion <= 60 ? "bg-gradient-warning"
                                                                    : "bg-gradient-success"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div onClick={() => onClickAvatar(Tdata)}>
                                                {Tdata.users.length === 0 || Tdata.users === undefined ?
                                                    <span className=" text-default">No User Assigned</span> :
                                                    <AvatarGroup max={3}>
                                                        {Tdata.users.map((item, index) => (
                                                            <>
                                                                < Avatar alt={item.userName} src={item.userProfileImage} id={`tooltip${item.userId}`} />
                                                                <UncontrolledTooltip
                                                                    delay={0}
                                                                    target={`tooltip${item.userId}`}
                                                                >
                                                                    {item.userName}
                                                                </UncontrolledTooltip>
                                                            </>
                                                        ))}
                                                    </AvatarGroup>
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            {Tdata.createdAt}
                                        </td>
                                        <td className="text-right">
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    className="btn-icon-only text-light"

                                                    role="button"
                                                    size="sm"
                                                    color=""
                                                    onClick={e => e.preventDefault()}
                                                >
                                                    <i className="fas fa-ellipsis-v" />
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-arrow" right>
                                                    <DropdownItem
                                                        onClick={() => editWorkSpace(Tdata)}
                                                    >
                                                        <Edit color="primary" />
                                                            Edit
                                                        </DropdownItem>
                                                    <DropdownItem

                                                        onClick={() => deleteWorkSpace(Tdata)}
                                                    >
                                                        <Delete color="error" />
                                                            Delete
                                                        </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </div >
        )
    }
}

export default WorkSpaceTable;
