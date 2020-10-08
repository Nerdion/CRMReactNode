import React from "react";

//Material UI
import {
    Button,
    TextField
} from '@material-ui/core/';

// reactstrap components
import {
    Container,
    Alert
} from "reactstrap";

// core components

import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';
import UsersTable from "../components/Tables/UsersTable.js";


//API's
import { VerifyUserInvite, GetUserAvail } from './CRM_Apis';

//Temp Data

const UserData = [
    {
        "UserName": "Nishad Patil",
        "Permissions": "Admin",
        "Team": "Meta",
        "Role": "Designer",
        "Completion_Text": "60%",
        "Completion": 60,
        "last_active": "2 minute ago"
    },
    {
        "UserName": "Neel Khalade",
        "Permissions": "Organizer",
        "Team": "Meta",
        "Role": "Backend Manager",
        "Completion_Text": "30%",
        "Completion": 30,
        "last_active": "5 minute ago"
    },

]

const HeaderData = [
    { "Header": "User Name" },
    { "Header": "Permissions" },
    { "Header": "Team" },
    { "Header": "Role" },
    { "Header": "Completion" },
    { "Header": "last active" },
];

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
            this.SendInviteHandle()
            this.handleClose();
        }
    }

    GetUserData = async () => {
        const CRM_Token = await localStorage.getItem('CRM_Token_Value');
        try {
            const GetAvailUser = await fetch(GetUserAvail, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${CRM_Token}`
                },
            });
            const responseData = await GetAvailUser.json();
            console.log(responseData, 'GetAvailUser')
            console.log(GetAvailUser, 'GetAvailUserHeader');
            this.setState({
                TotalCount: responseData.count,
                UserData: responseData.results.userData,
            })
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }

    SendInviteHandle = async () => {
        let title = "Error";
        let message = '';
        let CRM_Token = await localStorage.getItem('CRM_Token_Value');
        try {
            const UserInviteFetch = await fetch(VerifyUserInvite, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${CRM_Token}`
                },
                body: JSON.stringify({
                    method: 'invite',
                    useremail: this.state.UserEmail
                })
            });
            let responseData = await UserInviteFetch.json();
            console.log(responseData, 'UserInviteFetchData')
            console.log(UserInviteFetch, 'UserInviteFetch');

            if (responseData.success) {
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
                        <UsersTable
                            Header={'Users'}
                            onClickHeaderButton={() => this.handleClickOpen()}
                            HeaderButtonName={'Invite User'}
                            userData={UserData}
                            tHeader={HeaderData}
                        />
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
                    Variant={"text"}
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
                        autoComplete="section-blue shipping address-level2"
                        onChange={(e) => this.onChangeText(e.target.value)}
                        fullWidth
                    />
                </DialogBox>
            </>
        );
    }
}

export default Users;
