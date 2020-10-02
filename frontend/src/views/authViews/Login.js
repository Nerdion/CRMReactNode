
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
  CardFooter,
  Alert
} from "reactstrap";

//API's
import { VerifyUserLogin } from '../CRM_Apis';

class Login extends React.Component {

  state = {
    UserEmail: '',
    Password: '',
    Alert_open_close: false,
    title: '',
    message: ''
  }

  onChange = (state, text) => {
    this.setState({ [`${state}`]: text })
    // console.log("UserEmailChange:-", [this.state.UserEmail])
    // console.log("UserPasswordChange:-", [this.state.Password])
  }

  onDismissAlert = () => {
    this.setState({ Alert_open_close: false });
  }

  submitLoginHandler = async (event) => {
    event.preventDefault();
    const title = "Error";
    console.log("Signed in:-", this.state.UserEmail, this.state.Password);
    try {
      if (this.state.UserEmail === "") {
        const message = "Please Enter Your Email Address";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (this.state.Password === "") {
        const message = "Please Enter Your Password";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (this.state.UserEmail !== "" && this.state.Password !== "") {
        const UserLoginApiCall = await fetch(VerifyUserLogin, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            useremail: this.state.UserEmail,
            password: this.state.Password,
          })
        });
        const responseData = await UserLoginApiCall.json();
        console.log(responseData, 'UserLoginApiCallData')
        console.log(UserLoginApiCall, 'UserLoginApiCall');

        if (responseData.status === "200") {
          console.log("User Loggedin");
          localStorage.setItem('CRM_Token_Value', responseData.token);
          this.props.history.push("/admin/index");
        }
        else {
          const message = "Invalid Email & Password";
          this.setState({ title, message, Alert_open_close: true });
        }
      } else {
        const message = "Please Enter Email & Password";
        this.setState({ title, message, Alert_open_close: true });
      }
    }
    catch (err) {
      console.log("Error fetching data-----------", err);
      this.setState({ title, message: err, Alert_open_close: true });
    }
  }
  encryptData = async (data) => {
    try {
      let tokenKey='crmfrontendbackend'
      var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
      // return {"data": strenc};
      return strenc

    } catch (e) {
      console.log(e);
    }
  }

  decryptData = async (data) => {
    try {
      let tokenKey='crmfrontendbackend'
      var bytes = CryptoJS.AES.decrypt(data, tokenKey)
      var originalText = bytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(originalText);
    } catch (e) {
      console.log(e);
    }
  }


  render() {
    const { title, message, Alert_open_close } = this.state;
    const AlertError =
      (
        <div>
          <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color="danger" >
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
                      value={this.state.Password}
                      className="txt-dark"
                      onChange={(event) => { this.onChange("Password", event.target.value) }}
                      autoComplete="new-password"
                    />
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button
                    className="my-4 pl-6 pr-6 br-lg"
                    color="primary"
                    type="button"
                    onClick={(event) => this.submitLoginHandler(event)}
                  >
                    Sign in
                  </Button>
                </div>
                <div className="text-center">
                  <a
                    className="txt-lt-dark"
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                  >
                    <small>Forgot password?</small>
                  </a>
                </div>
              </Form>
            </CardBody>
            <CardFooter className="bg-transparent pb-5">
              <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon mt-2 mb-2"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../../assets/img/icons/common/facebook.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Facebook</span>
                </Button>

                <Button
                  className="btn-neutral btn-icon  mt-2 mb-2"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("../../assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </>
    );
  }
}

export default Login;
