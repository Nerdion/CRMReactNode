import React from "react";
//API's
import { organizationAPI } from './CRM_Apis';

//redux
import { connect } from 'react-redux';

import * as actionTypes from '../store/actions';

import {
    Card,
    CardBody,
    Col,
    Alert,
    Spinner
} from "reactstrap";

class JoinUser extends React.Component {
    state = {
        Alert_open_close: false,
        title: '',
        message: '',
        color: ''
    }

    componentDidMount = async () => {
        await this.addTheUser()
    }

    async addTheUser() {
        let message = '';
        let title = "Error";
        let joinLink = this.props.match.params.joinLink;
        this.jwtToken = this.props.setLogin;
        try {
            const UserRegisterApiCall = await fetch(organizationAPI, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `${this.jwtToken}`
                },
                body: JSON.stringify({
                    method: 'allowJoin',
                    userData: joinLink
                })
            });
            const responseData = await UserRegisterApiCall.json();
            if (responseData.success === true) {
                message = "User is Authorized!";
                title = "Success"
                this.setState({ title, message, Alert_open_close: true, color: "success" });
                this.props.history.push("/admin/workspace");
            }
            else {
                message = "User already added.";
                this.setState({ title, message, Alert_open_close: true });
            }
        } catch (err) {
            this.setState({ title, message: JSON.stringify(err), Alert_open_close: true });
        }
    }


    render() {
        const { title, message, Alert_open_close, color } = this.state;
        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={color ? color : "danger"}  >
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
                        <CardBody className="px-lg-5 py-lg-5 ht-400 d-flex justify-content-center align-items-center">
                            <Col lg="12" className="d-flex justify-content-center align-items-center d-fc-direction">
                                <h3 className="txt-lt-dark ">Authorizing User...</h3>
                                <Spinner style={{ width: '3rem', height: '3rem', alignSelf: "center", justifySelf: "center" }} color="primary" />
                            </Col>
                        </CardBody>
                    </Card>
                </Col>
            </>
        )
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

export default connect(mapStateToProps, mapDispatcToProps)(JoinUser);