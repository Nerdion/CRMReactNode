
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

//API's
import { VerifyUserLogin, VerifyEmailUser } from '../CRM_Apis';

//redux
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions';

let token = null;
const emailExpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
class Login extends React.Component {

  state = {
    UserEmail: '',
    Password: '',
    Alert_open_close: false,
    title: '',
    message: '',
    setRedirect: '',
    isSignned: false
  }

  async componentDidMount() {
    token = this.props.match.params.token;
    console.log(token)
    if (token) {
      // this.props.onLogin(localStorage.removeItem('CRM_Token_Value'));
      let originalToken = token.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=');
      console.log(token);
      let crmToken = await this.decryptData(originalToken);
      this.jwtToken = Object.values(crmToken)[0]
      await this.getLoggedIn(VerifyEmailUser)
    }
  }

  onChange = (state, text) => {
    this.setState({ [`${state}`]: text })
    // console.log("UserEmailChange:-", [this.state.UserEmail])
    // console.log("UserPasswordChange:-", [this.state.Password])
  }

  onDismissAlert = () => {
    this.setState({ Alert_open_close: false });
  }

  emailValidation = (email) => {
    return emailExpression.test(String(email).toLowerCase());
  }

  submitLoginHandler = async (event) => {
    //event.preventDefault();
    let title = "Error";
    let token = this.props.match.params.token;
    this.setState({ isSignned: true });
    // console.log("Signed in:-", this.state.UserEmail, this.state.Password);
    try {
      if (this.state.UserEmail === "") {
        const message = "Please Enter Your Email Address";
        this.setState({ title, message, Alert_open_close: true, isSignned: false });
      }
      else if (this.state.Password === "") {
        const message = "Please Enter Your Password";
        this.setState({ title, message, Alert_open_close: true, isSignned: false });
      }
      else if (this.state.UserEmail !== "" && this.state.Password !== "") {
        if (this.emailValidation(this.state.UserEmail)) {
          let authData = {
            useremail: this.state.UserEmail,
            password: this.state.Password,
          }
          let encAuthData = await this.encryptData(authData);

          await this.getLoggedIn(VerifyUserLogin, encAuthData);
        }
        else {
          const message = "Invalid Email";
          this.setState({ title, message, Alert_open_close: true, isSignned: false });
        }
      } else {
        const message = "Please Enter Email & Password";
        this.setState({ title, message, Alert_open_close: true, isSignned: false });
      }
    }
    catch (err) {
      console.log("Error fetching data-----------", err);
      this.setState({ title, message: "Email or Password is Incorrect", Alert_open_close: true, isSignned: false });
    }
  }

  encryptData = async (data) => {
    try {
      let tokenKey = 'crmfrontendbackend'
      var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
      // return {"data": strenc};
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

  getLoggedIn = async (whichAPI, encAuthData) => {
    let Root = '';
    const UserLoginApiCall = await fetch(whichAPI, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${this.jwtToken}`
      },
      body: JSON.stringify(encAuthData)
    });
    const responseData = await UserLoginApiCall.json();
    console.log(responseData, 'UserLoginApiCallData')
    console.log(UserLoginApiCall, 'UserLoginApiCall');
    if (responseData.success === true) {
      console.log("User Loggedin");
      localStorage.setItem('CRM_Token_Value', responseData.jwtData.Token)
      console.log("this is orgId---->", responseData.orgID);
      if (responseData.orgID) {
        await this.props.onLogin(localStorage.getItem('CRM_Token_Value'));
        await this.props.history.push("/admin/workSpace");
      } else {
        await this.props.onLogin(localStorage.getItem('CRM_Token_Value'));
        await this.props.history.push("/auth/joininviteorg");
      }
    }
    else {
      this.setState({ title: "Error", message: responseData.message, Alert_open_close: true, isSignned: false });
    }
  }


  render() {
    const { title, message, Alert_open_close, setRedirect, isSignned } = this.state;
    const AlertError =
      (
        <div>
          <Alert isOpen={Alert_open_close} toggle={this.onDismissAlert} color="danger" >
            <h4 className="alert-heading">
              {title}
            </h4>
            {message}
          </Alert>
        </div>
      );

    return (
      <>
        <Col lg="5" md="7">
          {AlertError}
          {isSignned ?
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
                  <h2 className="txt-dark disable-hover"> Sign in </h2>
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
                  <div className="text-center">
                    <Button
                      className="my-4 pl-6 pr-6 br-lg"
                      color="primary"
                      type="button"
                      onClick={(event) => { this.submitLoginHandler(event) }}
                    >
                      Sign in
                  </Button>
                  </div>
                  <div className="text-center">
                    <a
                      className="txt-lt-dark cursor-point"

                      onClick={() => { this.props.history.push("/auth/forgotpass") }}
                    >
                      <small>Forgot password?</small>
                    </a>
                  </div>
                  <div className="text-center mt-2">
                    <a
                      className="txt-lt-dark cursor-point"

                      onClick={() => { this.props.history.push("/auth/register") }}
                    >
                      <h5>Sign up</h5>
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

export default connect(mapStateToProps, mapDispatcToProps)(Login);
