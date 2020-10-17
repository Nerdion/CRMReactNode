import React, { Component } from 'react';
import { Route, Switch, Redirect,withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth";



class App extends Component {
    state = {
        isAuth: false
    }
    componentDidMount() {
        if (localStorage.getItem("CRM_Token_Value")) {
            this.setState({ isAuth: true });
        }
    }
    render() {
        let routes = (
            <Switch>
                <Route path="/auth" render={props => <AuthLayout {...props} />} />
                <Redirect from="/" to="/auth/login" />
            </Switch>
        );

        if (this.props.setLogin) {
            routes = (
                <Switch>
                    <Route path="/admin" render={props => <AdminLayout {...props} />} />
                    <Route path="/auth" render={props => <AuthLayout {...props} />} />
                    <Redirect from="/" to="/admin/workSpace" />
                </Switch>
            );
        }
        return (
            <>
                {routes}
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        setLogin: state.setLoginValue
    };
}

export default withRouter(connect(mapStateToProps)(App));
