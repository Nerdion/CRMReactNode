
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
  Row,
  Col,
  Alert,
  Spinner
} from "reactstrap";

//API's
import { VerifyUserRegister } from '../CRM_Apis';

//redux
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';

const emailExpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
class Register extends React.Component {
  state = {
    UserName: '',
    UserEmail: '',
    Password: '',
    PolicyCheckbox: false,
    Alert_open_close: false,
    title: '',
    message: '',
    alertColor: null,
    isRegistered: false

  }

  onChange = (state, text) => {
    this.setState({ [`${state}`]: text })
    // console.log("UserEmailChange:-", [this.state.UserEmail])
    // console.log("UserPasswordChange:-", [this.state.Password])

  }

  onClickPolicy = (event) => {
    this.setState({ PolicyCheckbox: event });
    console.log("PrivatePolicy:-", event);
  }

  onDismissAlert = () => {
    this.setState({ Alert_open_close: false });
  }

  setLogout = () => {
    this.props.onLogin(localStorage.removeItem('CRM_Token_Value'));
  }

  emailValidation = (email) => {
    return emailExpression.test(String(email).toLowerCase());
  }

  submitRegisterHandler = async (event) => {
    const { UserName, UserEmail, Password, PolicyCheckbox, Alert_open_close } = this.state;
    event.preventDefault();
    const title = "Error";
    let message = "";
    let registerData = {
      username: UserName,
      useremail: UserEmail,
      password: Password,
    }
    let encregisterData = await this.encryptData(registerData)
    console.log("Signed in:-", UserEmail, Password);
    try {
      if (UserName === "" && Password !== "" && UserEmail !== "") {
        message = "Please Enter Your Name";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (UserName !== "" && Password === "" && UserEmail !== "") {
        message = "Please Enter Password";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (UserName !== "" && Password !== "" && UserEmail === "") {
        message = "Please Enter Email";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (UserName === "" && Password === "" && UserEmail !== "") {
        message = "Please Enter Name & Password";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (UserName !== "" && Password === "" && UserEmail === "") {
        message = "Please Enter Email & Password";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (UserName === "" && Password !== "" && UserEmail === "") {
        message = "Please Enter Name & Email";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (UserEmail !== "" && Password !== "" && UserName !== "") {
        if (PolicyCheckbox === false) {
          message = "Please Accept the Private Policy";
          this.setState({ title, message, Alert_open_close: true });
        }
        else {
          if (this.emailValidation(UserEmail)) {
            // const title = "Success"
            // message = "Account Created!";
            this.setState({ isRegistered: true });
            const UserRegisterApiCall = await fetch(VerifyUserRegister, {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(encregisterData)
            });
            const responseData = await UserRegisterApiCall.json();
            console.log(responseData, 'UserRegisterApiCallData')
            console.log(UserRegisterApiCall, 'UserRegisterApiCall');

            if (responseData.success === true) {
              console.log("User Loggedin");
              this.setState({ title: "Success", message: responseData.message, Alert_open_close: true, alertColor: "success" });
              this.props.history.push("/auth/Login");
            }
            else {
              this.setState({ title, message: responseData.message, Alert_open_close: true, isRegistered: false });
            }
          } else {
            message = "Invalid Email";
            this.setState({ title, message, Alert_open_close: true });
          }
        }
      } else {
        message = "All Fields Are Empty";
        this.setState({ title, message, Alert_open_close: true, isRegistered: false });
      }
    }
    catch (err) {
      console.log("Error fetching data-----------", err.toString());
      this.setState({ title, message: err.toString(), Alert_open_close: true, isRegistered: false });
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

  render() {
    const { title, message, Alert_open_close, alertColor, isRegistered } = this.state;
    let { setLogin } = this.props;
    const AlertError =
      (
        <div>
          <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={alertColor ? alertColor : "danger"} >
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
          {setLogin ?
            <Card className="bg-secondary shadow border-0">
              <CardBody className="px-lg-5 py-lg-5 wd-100p ht-300 d-flex justify-content-center align-items-center">
                <Col lg="12" className="">
                  <Col className="ht-160 ">
                    <div className="text-center mb-4">
                      <h2 className="txt-dark disable-hover">You are already logged in!</h2>
                    </div>
                    <div className="text-center text-muted mb-4">
                      <small>Please Logout to Register new user</small>
                    </div>
                  </Col>
                  <Col className=" d-flex justify-content-center align-items-center">
                    <Button
                      onClick={(event) => { this.setLogout(event) }}
                      className="mt-4"
                      color="primary"
                      type="button">
                      Logout
                  </Button>
                  </Col>
                </Col>
              </CardBody>
            </Card>
            :
            isRegistered ?
              <Card className="bg-secondary shadow border-0">
                < CardBody className="px-lg-5 py-lg-5 wd-100p ht-500 d-flex justify-content-center align-items-center">
                  <Col lg="12" className="d-flex justify-content-center align-items-center">
                    <Spinner style={{ width: '3rem', height: '3rem' }} className="align-self-center" color="primary" />
                  </Col>
                </CardBody>
              </Card> :
              <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="txt-dark disable-hover"> Register Account </h2>
                  </div>
                  <div className="text-center text-muted mb-4">
                    <small>Or sign up with credentials</small>
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
                          name="name"
                          className="txt-dark"
                          value={this.state.UserName}
                          onChange={(event) => { this.onChange("UserName", event.target.value, event) }}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          className="txt-dark"
                          value={this.state.UserEmail}
                          onChange={(event) => { this.onChange("UserEmail", event.target.value, event) }}
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
                          value={this.state.Password}
                          onChange={(event) => { this.onChange("Password", event.target.value, event) }}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-muted font-italic">
                      <small>
                        {this.state.Password.length <= 0 ?
                          null :
                          this.state.Password.length < 8 ?
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
                    <Row className="my-4">
                      <Col xs="12">
                        <div className="custom-control custom-control-alternative custom-checkbox">
                          <input
                            className="custom-control-input"
                            id="customCheckRegister"
                            type="checkbox"
                            value={this.state.PolicyCheckbox}
                            onChange={(event) => { this.onClickPolicy(event.target.checked) }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheckRegister"
                          >
                            <span className="text-muted">
                              I agree with the{" "}
                              <a className="txt-dark cursor-point" onClick={e => e.preventDefault()}>
                                Privacy Policy
                          </a>
                            </span>
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <Button onClick={(event) => { this.submitRegisterHandler(event) }} className="mt-4" color="primary" type="button">
                        Create account
                  </Button>
                    </div>
                    <div className="text-center mt-2 mb-0">
                      <a
                        className="txt-lt-dark cursor-point"

                        onClick={() => this.props.history.push("/auth/login")}
                      >
                        <h5>Sign in</h5>
                      </a>
                    </div>
                  </Form>
                </CardBody>
              </Card>
          }
        </Col >
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    setLogin: state.setLoginValue
  };
}

const mapDispatcToProps = dispatch => {
  return {
    onLogin: (setLoginData) => dispatch({ type: actionTypes.SET_LOGIN, setLoginValue: setLoginData })
  }
}


export default connect(mapStateToProps, mapDispatcToProps)(Register);
