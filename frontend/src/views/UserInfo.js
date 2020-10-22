
import React from "react";
import CryptoJS from 'crypto-js';
// reactstrap components
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
    Alert, Spinner
} from "reactstrap";

//API's
import { AuthUser, AuthUserResponse } from './CRM_Apis';

class UserInfo extends React.Component {
    state = {
        name: '',
        password: '',
        PolicyCheckbox: false,
        Alert_open_close: false,
        title: '',
        message: '',
        setActivityIndicator: false
    }

    onChange = (state, text) => {
        this.setState({ [`${state}`]: text })
    }

    onClickPolicy = (event) => {
        this.setState({ PolicyCheckbox: event });
        console.log("PrivatePolicy:-", event);
    }

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    submitAuthHandler = async (event) => {
        event.preventDefault();

        let { name, password, Alert_open_close } = this.state;
        let token = this.props.match.params.token;
        let originalToken = token.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
        console.log(token);
        let crmToken = await this.decryptData(originalToken);
        var jwtToken = Object.values(crmToken)[0]
        let title = "Error";
        let message = "";
        let registerData = {
            name: name,
            password: password
        }
        let encregisterData = await this.encryptData(registerData)
        try {
            if (name === "" && password === "") {
                message = "Please Enter Your Name & Password";
                this.setState({ title, message, Alert_open_close: true, setActivityIndicator: false });
            }
            else if (name !== "" && password === "") {
                message = "Please Enter Password";
                this.setState({ title, message, Alert_open_close: true, setActivityIndicator: false });
            }
            else if (name === "" && password !== "") {
                message = "Please Enter Your Name";
                this.setState({ title, message, Alert_open_close: true, setActivityIndicator: false });
            }
            else {
                const UserRegisterApiCall = await fetch(AuthUser, {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `${jwtToken}`

                    },
                    body: JSON.stringify(encregisterData)
                });
                const responseData = await UserRegisterApiCall.json();

                if (responseData.success) {
                    localStorage.setItem('CRM_Token_Value', responseData.jwtData.Token);                    
                    this.setState({ setActivityIndicator: true })
                    this.props.history.push("/admin/index");
                }
                else {
                    message = "Invalid Email & Password";
                    this.setState({ title, message, Alert_open_close: true, setActivityIndicator: false });
                }
            }
        }
        catch (err) {
            console.log("Error fetching data-----------", err.toString());
            this.setState({ title, message: err.toString(), Alert_open_close: true, setActivityIndicator: false });
        }
    }


    encryptData = async (data) => {
        try {
            let tokenKey = 'crmfrontendbackend'
            var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
            return { data: strenc }

        } catch (e) {
            console.log(e.toString());
        }
    }

    decryptData = async (data) => {
        try {
            let tokenKey = 'crmfrontendbackend'
            var bytes = CryptoJS.AES.decrypt(data, tokenKey)
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return JSON.parse(originalText);
        } catch (e) {
            console.log(e.toString());
        }
    }


    render() {
        const { title, message, Alert_open_close, setActivityIndicator } = this.state;
        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={title === "Success" ? "success" : "danger"} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );
        return (
            <>
                <Col lg="6" md="8">
                    {AlertError}
                    <Card className="bg-secondary shadow border-0">
                        {setActivityIndicator === false ?
                            <CardBody className="px-lg-5 py-lg-5">
                                <div className="text-center mb-4">
                                    <h2 className="txt-dark disable-hover"> Authorize User </h2>
                                </div>
                                <div className="text-center text-muted mb-4">
                                    <small>Authorize user to continue using CRM</small>
                                </div>
                                <Form role="form">
                                    <FormGroup>
                                        <InputGroup className="input-group-alternative mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-hat-3" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Name"
                                                type="text"
                                                className="txt-dark"
                                                value={this.state.name}
                                                onChange={(event) => { this.onChange("name", event.target.value, event) }}
                                            />
                                        </InputGroup>
                                    </FormGroup>
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
                                                autoComplete="new-password"
                                                className="txt-dark"
                                                value={this.state.password}
                                                onChange={(event) => { this.onChange("password", event.target.value, event) }}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <div className="text-muted font-italic">
                                        <small>
                                            {this.state.password.length <= 0 ?
                                                null :
                                                this.state.password.length < 8 ?
                                                    <>
                                                        password strength:{" "}
                                                        <span className="text-danger font-weight-700">Weak</span>
                                                    </> :
                                                    <>
                                                        password strength:{" "}
                                                        <span className="text-success font-weight-700">strong</span>
                                                    </>
                                            }
                                        </small>
                                    </div>
                                    <div className="text-center">
                                        <Button onClick={(event) => { this.submitAuthHandler(event) }} className="mt-4" color="primary" type="button">
                                            Enter
                                    </Button>
                                    </div>
                                </Form>
                            </CardBody> :
                            <CardBody className="px-lg-5 py-lg-5">
                                <Col className="d-flex justify-content-center align-items-center ht-300" lg="12">
                                    <Spinner className="wd-100 ht-100" type="grow" color="info" />
                                </Col>
                            </CardBody>
                        }
                    </Card>
                </Col>
            </>
        );
    }
}

export default UserInfo;
