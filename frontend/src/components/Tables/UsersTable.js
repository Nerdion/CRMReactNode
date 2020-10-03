import React, { Component } from 'react';

//Material UI
import {
    Button,
} from '@material-ui/core/';

// reactstrap components
import {
    Row,
    Col,
    Card,
    CardHeader,
    Table,
    Progress,
} from "reactstrap";

export class UsersTable extends Component {
    render() {
        const { Header, onClickHeaderButton, HeaderButtonName, tHeader, userData } = this.props;
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
                                    <tr key={index}>
                                        <th scope="row">{Tdata.UserName}</th>
                                        <td>{Tdata.Permissions}</td>
                                        <td>{Tdata.Team}</td>
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

export default UsersTable;
