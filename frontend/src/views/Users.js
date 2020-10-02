
import React from "react";

//Material UI
import {
    Button,
    TextField
} from '@material-ui/core/';

// reactstrap components
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Table,
    Progress,
    Alert
} from "reactstrap";

// core components

import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';

//API's
import { VerifyUserInvite } from './CRM_Apis';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Dialog_open_close: false,
            Alert_open_close: false,
            title: '',
            message: '',
            AlertColor: '',
            UserEmail: '',
            invalidEmail: false
        };
    }

    handleClickOpen = () => {
        this.setState({ Dialog_open_close: true });
    };

    handleClose = () => {
        this.setState({ Dialog_open_close: false });
    };

    onChangeText = (text) => {
        const Regex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
        const result = Regex.test(text);
        this.setState({ UserEmail: text });
        if (text.length > 0) {
            if (result) {
                this.setState({ invalidEmail: false })
            } else {
                console.log("Error invalid data");
                this.setState({ invalidEmail: true })
            }
        }

    }

    onInviteSend = (type) => {
        const title = type === "success" ? "Success" : "Error"
        const message = type === "success" ? "Invitition has been sent to the user" : "User's Email is invalid";
        this.setState({ title, message, Alert_open_close: true, AlertColor: type });
        if (this.state.invalidEmail === false && type === "success") {
            this.handleClose();
        }
    }

    SendInviteHandle = async () => {
        const title = "Error";
        const message = '';
        //var CRM_Token = await localStorage.getItem('CRM_Token_Value');
        try {
            const UserInviteFetch = await fetch(VerifyUserInvite, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    //'Authorization': `JWT ${CRM_Token}`
                },
                body: JSON.stringify({
                    useremail: this.state.UserEmail
                })
            });
            const responseData = await UserInviteFetch.json();
            console.log(responseData, 'UserInviteFetchData')
            console.log(UserInviteFetch, 'UserInviteFetch');

            if (responseData.status === "200") {
                console.log("User Invited");
            }
            else {
                message = "User's Email is invalid";
                this.setState({ title, message, Alert_open_close: true });
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err);
            this.setState({ title, message: err, Alert_open_close: true });
        }
    }

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }


    render() {
        const { Dialog_open_close, title, message, Alert_open_close, AlertColor, UserEmail, invalidEmail } = this.state;
        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={AlertColor} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <div className="col-md-12 justify-content-center">
                        {AlertError}
                        <Col className="mb-12 mb-xl-0" md='12' xl="12">
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <div className="col">
                                            <h3 className="mb-0">Users</h3>
                                        </div>
                                        <div className="col text-right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={this.handleClickOpen}
                                            >
                                                Invite User
                                                </Button>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Permissions</th>
                                            <th scope="col">Team</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">completion</th>
                                            <th scope="col">last active</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Nishad Patil</th>
                                            <td>Admin</td>
                                            <td>Meta</td>
                                            <td>Designer</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-2">60%</span>
                                                    <div>
                                                        <Progress
                                                            max="100"
                                                            value="60"
                                                            barClassName="bg-gradient-success"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                2 minute ago
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Neel Khalade</th>
                                            <td>Organizer</td>
                                            <td>Meta</td>
                                            <td>Backend Manager</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span className="mr-2">30%</span>
                                                    <div>
                                                        <Progress
                                                            max="100"
                                                            value="30"
                                                            barClassName="bg-gradient-danger"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                5 minute ago
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card>
                        </Col>
                    </div>
                </Container>
                <DialogBox
                    disableBackdropClick={true}
                    DialogHeader={"Invite User"}
                    DialogContentTextData={" To Add Users to this Organization, please enter users email address here. We will send updates occasionally."}
                    DialogButtonText1={"Cancel"}
                    DialogButtonText2={"Invite"}
                    onClose={this.handleClose}
                    onOpen={Dialog_open_close}
                    OnClick_Bt1={this.handleClose}
                    OnClick_Bt2={UserEmail.length < 1 ? () => this.onInviteSend("danger") : () => this.onInviteSend("success", "close")}
                >
                    <TextField
                        error={invalidEmail ? true : false}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        required={true}
                        helperText={invalidEmail ? "Incorrect entry." : null}
                        value={UserEmail}
                        autocomplete="section-blue shipping address-level2"
                        onChange={(e) => this.onChangeText(e.target.value)}
                        fullWidth
                    />
                </DialogBox>
            </>
        );
    }
}

export default Users;
