/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Alert
} from "reactstrap";

import ImageUploader from 'react-images-upload';

// core components
import UserHeader from "../../components/Headers/UserHeader.js";
import DialogBox from '../../components/DialogBox/DialogBox';

//redux
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

//Api
import { editUserProfileApi, getUserProfileApi } from '../CRM_Apis';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userEmail: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: '',
      postCode: '',
      title: '',
      message: '',
      Alert_open_close: false,
      pictures: null,
      setShowUsers: false,
      Alert_open_close1: false,
      editUserProfile: false,
      alertColor: null
    };
    this.onDrop = this.onDrop.bind(this);
  }


  componentDidMount() {
    this.getUserProfile()
  }

  onDrop(picture) {
    this.setState({
      pictures: picture,
    });
  }

  setImageTobase = () => {
    let { pictures } = this.state;
    let title = "Error";
    let message = '';

    console.log("base64 type---->", pictures[0])
    var reader = new FileReader();
    if (pictures != null) {
      reader.readAsDataURL(pictures[0]);
      reader.onload = async () => {
        var Base64 = await reader.result;
        title = "Note"
        message = "Please Click Save to upload the selected Image";
        this.setState({ title, message, Alert_open_close: true, base64Image: Base64, userProfileImage: Base64 });
        console.log("Base64 Image------>", Base64);
        this.handleCloseDialog();
      };
      reader.onerror = (error) => {
        message = "Please Enter Username And Email, Required Fields";
        this.setState({ title, message, Alert_open_close1: true });
      }
    }
  }

  onTextValueChanged = (state, text) => {
    this.setState({ [`${state}`]: text })
    console.log("Edited UserName---->", text);
  }

  getUserProfile = async () => {
    let title = "Error";
    let crmToken = localStorage.getItem('CRM_Token_Value');
    try {
      const getUserProfileData = await fetch(getUserProfileApi, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${crmToken}`
        },
        body: JSON.stringify({
          method: 'getUserProfile'
        })
      });
      let response = await getUserProfileData.json()
      let responseData = response.data

      console.log("set workspace:---", responseData);
      this.setState({
        userName: responseData.userName,
        userEmail: responseData.userEmail,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        address: responseData.address,
        city: responseData.city,
        country: responseData.country,
        postCode: responseData.postCode,
        userProfileImage: responseData.userProfileImage
      })

      this.props.onSetUserProfile(responseData.userProfileImage, responseData.userName);

    }
    catch (err) {
      console.log("Error fetching data-----------", err.toString());
      this.setState({ title, message: err.toString(), Alert_open_close: true });
    }
  }

  editUserProfile = async (event) => {
    let { userName, userEmail, firstName, lastName, address, city, country, postCode, base64Image } = this.state;
    //event.preventDefault();
    let title = "Error";
    let message = "";
    let crmToken = localStorage.getItem('CRM_Token_Value');
    try {
      if (userName === "" && userEmail === "") {
        message = "Please Enter Username And Email, Required Fields";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (userName === "" && userEmail !== "") {
        message = "Please Enter Username";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (userName !== "" && userEmail === "") {
        message = "Please Enter userEmail";
        this.setState({ title, message, Alert_open_close: true });
      }
      else if (userName !== "" && userEmail !== "") {
        console.log("UserName----->", userName);
        let data = {
          userName,
          userEmail,
          firstName,
          lastName,
          address,
          city,
          country,
          postCode,
          userProfileImage: base64Image
        }
        let editUserProfileData = await fetch(getUserProfileApi, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${crmToken}`
          },
          body: JSON.stringify({
            data: data,
            method: 'setUserProfile'
          })
        });
        let responseData = await editUserProfileData.json();
        if (responseData.success === true) {
          console.log('Updated successfully')
          setTimeout(() => {
            this.componentDidMount();
          }, 400);
          title = "Changed successfully"
          this.setState({ title: title, message: responseData.message, Alert_open_close: true, editUserProfile: false, alertColor: "success" });
        } else {
          message = "Error Updating User Data"
          this.setState({ title, message, Alert_open_close: true });
        }
      }
    }
    catch (err) {
      console.log("Error fetching data-----------", err.toString());
      this.setState({ title, message: err.toString(), Alert_open_close: true });
    }
  }


  onDismissAlert = () => {
    this.setState({ Alert_open_close: false });
  }

  onDismissAlert1 = () => {
    this.setState({ Alert_open_close1: false });
  }


  OpenUsersDialog = () => {
    this.setState({ setShowUsers: true })
  }

  handleCloseDialog = () => {
    this.setState({ setShowUsers: false })
  }

  editUserProfileEnable = () => {
    this.setState((prevState) => ({ editUserProfile: !prevState.editUserProfile }));
  }

  render() {
    let {
      userName,
      userEmail,
      firstName,
      lastName,
      address,
      city,
      country,
      postCode,
      title,
      message,
      Alert_open_close,
      setShowUsers,
      pictures,
      Alert_open_close1,
      userProfileImage,
      editUserProfile,
      alertColor
    } = this.state;
    const AlertError =
      (
        <div className="mb-2">
          <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={alertColor ? alertColor : "danger"} >
            <h4 className="alert-heading">
              {title}
            </h4>
            {message}
          </Alert>
        </div>
      );
    const AlertError1 =
      (
        <div className="mb-2">
          <Alert isOpen={Alert_open_close1} toggle={() => this.onDismissAlert1()} color="danger" >
            <h4 className="alert-heading">
              {title}
            </h4>
            {message}
          </Alert>
        </div>
      );

    console.log("Picture Data------", pictures);
    return (
      <>
        <UserHeader userName={userName} />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              {AlertError}
            </Col>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3" sm="6" xs="6" md="6">
                    <div className="card-profile-image ">
                      <a onClick={(e) => { editUserProfile ? this.OpenUsersDialog() : e.preventDefault() }}>
                        <img
                          alt="..."
                          className="rounded-circle obj-cover"
                          width="190"
                          height="175"
                          src={(userProfileImage) ? userProfileImage : require("../../assets/img/theme/team-4-800x800.jpg")}
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="bg-white border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color={editUserProfile ? "warning" : "primary"}
                        onClick={() => this.editUserProfileEnable()}
                        size="sm"
                        className="pr-4 pl-4"
                      >
                        Edit
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              required={true}
                              disabled={editUserProfile ? false : true}
                              value={userName}
                              name="userName"
                              onChange={(event) => this.onTextValueChanged("userName", event.target.value)}
                              id="input-username"
                              placeholder="User Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              id="input-email"
                              value={userEmail}
                              disabled={editUserProfile ? false : true}
                              name="email"
                              required={true}
                              onChange={(event) => this.onTextValueChanged("userEmail", event.target.value)}
                              placeholder="jesse@example.com"
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First name
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              value={firstName}
                              name="firstName"
                              disabled={editUserProfile ? false : true}
                              onChange={(event) => this.onTextValueChanged("firstName", event.target.value)}
                              id="input-first-name"
                              placeholder="First name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              value={lastName}
                              name="lastName"
                              disabled={editUserProfile ? false : true}
                              onChange={(event) => this.onTextValueChanged("lastName", event.target.value)}
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Contact information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              value={address}
                              name="address"
                              disabled={editUserProfile ? false : true}
                              onChange={(event) => this.onTextValueChanged("address", event.target.value)}
                              id="input-address"
                              placeholder="Home Address"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              City
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              value={city}
                              name="city"
                              disabled={editUserProfile ? false : true}
                              onChange={(event) => this.onTextValueChanged("city", event.target.value)}
                              id="input-city"
                              placeholder="City"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Country
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              value={country}
                              name="country"
                              disabled={editUserProfile ? false : true}
                              onChange={(event) => this.onTextValueChanged("country", event.target.value)}
                              id="input-country"
                              placeholder="Country"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Postal code
                            </label>
                            <Input
                              className="form-control-alternative txt-lt-dark disable-hover"
                              id="input-postal-code"
                              value={postCode}
                              disabled={editUserProfile ? false : true}
                              name="postCode"
                              onChange={(event) => this.onTextValueChanged("postCode", event.target.value)}
                              placeholder="Postal code"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    {
                      editUserProfile ?
                        <>
                          <hr className="my-4" />
                          <div className="text-center">
                            <FormGroup>
                              <Button
                                color="primary"
                                onClick={(e) => this.editUserProfile(e.preventDefault())}
                                size="md"
                                className="pr-4 pl-4"
                              >
                                Save
                              </Button>
                            </FormGroup>
                          </div>
                        </> :
                        null
                    }
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <DialogBox
          disableBackdropClick={true}
          maxWidth={"sm"}
          fullWidth={true}
          DialogHeader={"Edit User Image"}
          DialogContentTextData={""}
          DialogButtonText1={"Cancel"}
          DialogButtonText2={"Save"}
          Variant={"outlined"}
          onClose={this.handleCloseDialog}
          onOpen={setShowUsers}
          OnClick_Bt1={this.handleCloseDialog}
          OnClick_Bt2={this.setImageTobase}
          B2backgroundColor={"#3773b0"}
          B2color={"#ffffff"}
        >
          {AlertError1}
          <ImageUploader
            withIcon={true}
            buttonText='Choose images'
            onChange={this.onDrop}
            singleImage={true}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
          />
        </DialogBox>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    userImage: state.userImage,
    userName: state.userName
  };
}

const mapDispatcToProps = dispatch => {
  return {
    onSetUserProfile: (userImage, userName) => dispatch({ type: actionTypes.ADD_PROFILE, userImage: userImage, userName: userName })
  }
}

export default connect(mapStateToProps, mapDispatcToProps)(Profile);
