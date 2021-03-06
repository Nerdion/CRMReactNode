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
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";
import Sidebar from "../components/Sidebar/Sidebar";

//redux
import { connect } from 'react-redux';

import * as actionTypes from '../store/actions';

import routes from "../routes.js";

class Admin extends React.Component {
  state = {
    logoutBol: false
  }
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  logout = (e) => {
    this.props.onLogin(localStorage.removeItem('CRM_Token_Value'))
    this.setState({ logoutBol: true })
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
      else if (this.props.location.pathname.indexOf(
        routes[i].layout + routes[i].letsPath
      ) !== -1) {
        return routes[i].name;
      }
    }
    return "WorkSpace";
  };

  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/workSpace",
            imgSrc: require("../assets/img/brand/smartnote2.png"),
            imgAlt: "..."
          }}
        //userImage = {}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            //userName={"Nishad Patil"}
            //userImage
            logout={() => this.logout()}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          {this.state.logoutBol ?
            <Switch>
              <Redirect from="*" to="/auth/login" />
            </Switch> : null
          }
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/admin/workSpace" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
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

export default connect(mapStateToProps, mapDispatcToProps)(Admin);
