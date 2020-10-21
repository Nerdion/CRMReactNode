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
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
  Col
} from "reactstrap";

//redux
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

import { getUserProfileApi } from '../../views/CRM_Apis';

class AdminNavbar extends React.Component {

  state = { userName: '', userImage: '' }

  getMyProfile = async () => {

    this.jwtToken = await localStorage.getItem('CRM_Token_Value');
    const getMyProfileCall = await fetch(getUserProfileApi, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${this.jwtToken}`

      },
      body: JSON.stringify({
        method: 'userNameAndImage'
      })
    });
    const responseData = await getMyProfileCall.json();
    if (responseData.success) {
      await this.setState({ userImage: responseData.data.userProfile, userName: responseData.data.name });
      this.props.onSetUserProfile(responseData.data.userProfile, responseData.data.name);
    }
  }

  componentDidMount() {
    this.getMyProfile();
  }


  render() {
    let { logout, userName, userImage } = this.props;
    return (
      <>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {this.props.brandText}
            </Link>
            <Col className="text-center">
              <span className="text-white mb-0 h4 text-uppercase">This is my Org</span>
            </Col>
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle obj-cover">
                      <img
                        alt="..."
                        className="navbar-brand-img ht-100p obj-cover"
                        src={userImage ? userImage : require("../../assets/img/theme/defaultUser.png")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {userName}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={logout}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
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

export default connect(mapStateToProps, mapDispatcToProps)(AdminNavbar);
