import React, { Component } from 'react';

//Material UI
import {
    Button,
} from '@material-ui/core';

import {
    Delete,
    Edit,
    Telegram,
    PeopleAlt,
    SaveAlt,
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
} from "reactstrap";

export class WorkSpaceTable extends Component {
    render() {
        const { Header, onClickHeaderButton, HeaderButtonName, tHeader, userData, IconName, onRowPress } = this.props;
        return (
            <div>
                <Col className="mb-12 mb-xl-0" md='12' xl="12">
                    <Card className="shadow">
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
                                    <tr className="cursor-point" onClick={onRowPress} key={index}>
                                        <th scope="row">{Tdata.WorkspaceName}</th>
                                        <td>{Tdata.Permissions}</td>
                                        <td>{Tdata.Role}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="mr-2">{Tdata.Completion_Text}</span>
                                                <div>
                                                    <Progress
                                                        max="100"
                                                        value={Tdata.Completion}
                                                        barClassName={
                                                            Tdata.Completion <= 30 ? "bg-gradient-danger" :
                                                                Tdata.Completion > 30 && Tdata.Completion <= 60 ? "bg-gradient-warning"
                                                                    : "bg-gradient-success"
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {Tdata.last_active}
                                        </td>
                                        <tb>
                                            <td className="text-right">
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                        className="btn-icon-only text-light"
                                                        href="#pablo"
                                                        role="button"
                                                        size="sm"
                                                        color=""
                                                        onClick={e => e.preventDefault()}
                                                    >
                                                        <i className="fas fa-ellipsis-v" />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" right>
                                                        <DropdownItem
                                                            href="#pablo"
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            <Edit color="primary" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            href="#pablo"
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            <Delete color="error" />
                                                            Delete
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            href="#pablo"
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            Something else here
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tb>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </div>
        )
    }
}

export default WorkSpaceTable;
