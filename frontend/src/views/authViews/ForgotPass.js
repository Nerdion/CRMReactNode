import React from "react";
// reactstrap components
import CryptoJS from 'crypto-js';
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col,
    Alert,
    Spinner
} from "reactstrap";
import { Switch, Redirect } from "react-router-dom";

//API's
import { sendRecoveryEmail, changePasswordApi } from '../CRM_Apis';

let token = null;

class ForgotPass extends React.Component {

    state = {
        UserEmail: '',
        Password: '',
        confirmPassword: '',
        Alert_open_close: false,
        title: '',
        message: '',
        setRedirect: '',
        sendEmail: false,
        emailSent: false,
        color: ''
    }

    async componentDidMount() {
        token = this.props.match.params.token;
        console.log("Token---->", token)
        if (token) {
            this.setState({ sendEmail: true });
            let originalToken = token.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
            console.log(token);
            let crmToken = await this.decryptData(originalToken);
            this.jwtToken = Object.values(crmToken)[0]
        } else {
            this.setState({ sendEmail: false });
        }
    }

    onChange = (state, text) => {
        this.setState({ [`${state}`]: text })
    }

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    submitEmail = async () => {
        let title = "Error";
        try {
            if (this.state.UserEmail === "") {
                const message = "Please Enter Email Address";
                this.setState({ title, message, Alert_open_close: true });
            }
            else if (this.state.UserEmail !== "") {
                this.setState({ emailSent: true });
                let authData = {
                    email: this.state.UserEmail,
                }
                let encAuthData = await this.encryptData(authData);

                const sendChangePassword = await fetch(sendRecoveryEmail, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(encAuthData)
                });
                const responseData = await sendChangePassword.json();
                console.log(responseData, 'sendChangePasswordData')
                console.log(sendChangePassword, 'sendChangePassword');
                if (responseData.success === true) {
                    const message = "Email has been sent!";
                    this.setState({ title: "Success", message, Alert_open_close: true, emailSent: false, color: "success" });
                }
                else {
                    this.setState({ title: "Error", message: responseData.error, Alert_open_close: true, emailSent: false });
                }
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true });
        }
    }

    submitForgotPassHandler = async (event) => {
        let title = "Error";
        try {
            if (this.state.confirmPassword === "" && this.state.Password !== "") {
                const message = "Please Enter confirm password";
                this.setState({ title, message, Alert_open_close: true });
            }
            else if (this.state.confirmPassword !== "" && this.state.Password === "") {
                const message = "Please Enter Your Password";
                this.setState({ title, message, Alert_open_close: true });
            }
            else if (this.state.confirmPassword !== "" && this.state.Password !== "") {

                let authData = {
                    password: this.state.Password,
                    confirmPassword: this.state.confirmPassword
                }
                let encAuthData = await this.encryptData(authData);

                const confirmUserPassword = await fetch(changePasswordApi, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${this.jwtToken}`
                    },
                    body: JSON.stringify(encAuthData)
                });
                const responseData = await confirmUserPassword.json();
                console.log(responseData, 'confirmUserPasswordData')
                console.log(confirmUserPassword, 'confirmUserPassword');
                if (responseData.success === true) {
                    console.log("Password Changed!");
                    localStorage.setItem('CRM_Token_Value', responseData.jwtData.Token);
                    //this.props.history.push("/admin/workSpace");
                    this.setState({ setRedirect: 'workSpace' })
                }
                else {
                    this.setState({ title: "Error", message: "Link Expired", Alert_open_close: true });
                }
            } else {
                const message = "Fields are Empty!";
                this.setState({ title, message, Alert_open_close: true });
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true });
        }
    }
    encryptData = async (data) => {
        try {
            let tokenKey = 'crmfrontendbackend'
            var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
            // return {"data": strenc};
            return { data: strenc }

        } catch (e) {
            console.log(e);
        }
    }

    decryptData = async (data) => {
        try {
            let tokenKey = 'crmfrontendbackend'
            var bytes = CryptoJS.AES.decrypt(data, tokenKey)
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return JSON.parse(originalText);
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const { title, message, Alert_open_close, setRedirect, sendEmail, emailSent, color } = this.state;
        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={color ? color : "danger"} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );

        return (
            <>
                {setRedirect === "workSpace" ?
                    <Switch>
                        <Redirect from="/" to="/admin/workSpace" />
                    </Switch> :
                    null
                }
                <Col lg="5" md="7">
                    {AlertError}
                    {sendEmail === false ?
                        emailSent ?
                            <Card className="bg-secondary shadow border-0">
                                <CardBody className="px-lg-5 py-lg-5 wd-200 ht-200">
                                    <Col lg="12" className="d-flex justify-content-center align-items-center">
                                        <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" />
                                    </Col>
                                </CardBody>
                            </Card>
                            : <Card className="bg-secondary shadow border-0">
                                <CardBody className="px-lg-5 py-lg-5">
                                    <div className="text-center mb-4">
                                        <h2 className="txt-dark disable-hover"> Send Email </h2>
                                    </div>
                                    <Form role="form">
                                        <FormGroup className="mb-3">
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-email-83" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    placeholder="Email"
                                                    type="email"
                                                    name="email"
                                                    className="txt-dark"
                                                    value={this.state.UserEmail}
                                                    onChange={(event) => { this.onChange("UserEmail", event.target.value, event) }}
                                                />
                                            </InputGroup>
                                        </FormGroup>
                                        <div className="text-center">
                                            <Button
                                                className="my-4 pl-6 pr-6 br-lg"
                                                color="primary"
                                                type="button"
                                                onClick={(event) => this.submitEmail(event)}
                                            >
                                                Send
                                    </Button>
                                        </div>
                                        <div className="text-center mt-2">
                                            <a
                                                className="txt-lt-dark cursor-point"

                                                onClick={() => this.props.history.push("/auth/login")}
                                            >
                                                <h5>Sign in</h5>
                                            </a>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card> :
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="px-lg-5 py-lg-5">
                                <div className="text-center mb-4">
                                    <h2 className="txt-dark disable-hover"> Change Password </h2>
                                </div>
                                <Form role="form">
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-lock-circle-open" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                                value={this.state.Password}
                                                className="txt-dark"
                                                onChange={(event) => { this.onChange("Password", event.target.value) }}
                                                autoComplete="new-password"
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-key-25" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Confirm Password"
                                                type="password"
                                                name="confirmPassword"
                                                className="txt-dark"
                                                value={this.state.confirmPassword}
                                                onChange={(event) => { this.onChange("confirmPassword", event.target.value, event) }}
                                            />
                                        </InputGroup>
                                        <div className="text-muted font-italic">
                                            <small>
                                                {this.state.confirmPassword.length <= 0 ?
                                                    null :
                                                    this.state.confirmPassword !== this.state.Password ?
                                                        <>
                                                            password Match:{" "}
                                                            <span className="text-danger font-weight-700">Password doesn't match</span>
                                                        </> :
                                                        <>
                                                            password Match:{" "}
                                                            <span className="text-success font-weight-700">Password Match</span>
                                                        </>
                                                }
                                            </small>
                                        </div>
                                    </FormGroup>
                                    <div className="text-center">
                                        <Button
                                            className="my-4 br-lg"
                                            color="primary"
                                            type="button"
                                            onClick={(event) => this.submitForgotPassHandler(event)}
                                        >
                                            Change Password
                                    </Button>
                                    </div>
                                    <div className="text-center mt-2">
                                        <a
                                            className="txt-lt-dark cursor-point"

                                            onClick={() => this.props.history.push("/auth/login")}
                                        >
                                            <h5>Sign in</h5>
                                        </a>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>}
                </Col>
            </>
        );
    }
}

export default ForgotPass;
