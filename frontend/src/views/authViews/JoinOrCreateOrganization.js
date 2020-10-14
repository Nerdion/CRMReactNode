
import React, { Component } from "react";
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
    Label,
    Row
} from "reactstrap";

import {
    Clear
} from '@material-ui/icons';

//API's
import { organizationAPI } from '../CRM_Apis';

let organization = [
];

class JoinOrCreateOrganization extends Component {
    state = {
        ifJoinOrg: null,
        orgName: '',
        orgSearch: '',
        orgNameObj: null,
        title: '',
        message: '',
        Alert_open_close: false
    }

   
    async componentDidMount() {
        this.jwtToken = await localStorage.getItem('CRM_Token_Value');
    }

    onPressJoinOrg = async (event) => {
        event.preventDefault();
        console.log("Organization in:-", this.state.orgNameObj[0].id);

        const inviteToJoin = await fetch(organizationAPI, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${this.jwtToken}`
            },
            body: JSON.stringify({
                method: 'inviteToJoin',
                orgId: this.state.orgNameObj[0].id
            })
        });

        try {
            let response = await inviteToJoin.json()
            console.log(response)
        } catch(e) {
            console.log(e.toString())
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

    selectOrganization = (orgName, orgID, event) => {
        //   event.preventDefault();
        this.setState({ orgNameObj: [{ orgName: orgName, id: orgID }] })
    }

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    createNewOrganization = async (event) => {
        console.log('Org created with name-', this.state.orgName)

        const createNewOrganizationCall = await fetch(organizationAPI, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              'Authorization': `${this.jwtToken}`
            },
            body: JSON.stringify({
                method: 'createOrg',
                orgName: this.state.orgName
            })
        });

        const responseData = await createNewOrganizationCall.json();

        if(responseData.success) {
            console.log('Created successfully')
            this.props.history.push("/admin/index");
        } else {
            this.setState({ title: "Error", message:  responseData.message, Alert_open_close: true });
        }
    }

    searchForOrganization = async (event) => {
        
        this.setState({ orgSearch: event.target.value })
        const searchedOrganizations = await fetch(organizationAPI, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `${this.jwtToken}`
            },
            body: JSON.stringify({ orgName: this.state.orgSearch, method: 'search'})
          });
          const responseData = await searchedOrganizations.json();
          organization = await responseData.orgNameData
    }

    render() {
        let { ifJoinOrg, orgName, orgSearch, orgNameObj, title, message, Alert_open_close } = this.state;
        let filtereContacts = organization !== null ? organization.filter(
            (item) => {
                return item.orgName.toLowerCase().indexOf(orgSearch.toLowerCase()) !== -1;
            }
        ) : '';

        let AlertError =
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
            <Col lg="8" md="9">
                {AlertError}
                <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center mb-4">
                            <h2 className="txt-primeblue"> {ifJoinOrg === null ? "Create or Join Organization" : ifJoinOrg ? "Create Organization" : "Join Organization"} </h2>
                        </div>
                        {ifJoinOrg === null ?
                            <Col lg="12">
                                <Row>
                                    <Col lg="12" className="text-center disable-hover">
                                        <Row className="text-center">
                                            <Col lg="5" sm="12" className="shadow br-sm border-div-1 p-3 d-flex align-items-center justify-content-between d-fc-direction">
                                                <div className="text-center p-4">
                                                    <span className="text-center">
                                                        <img
                                                            className="wd-190 ht-160"
                                                            alt="..."
                                                            src={require("../../assets/img/theme/createOrg.svg")}
                                                        />
                                                    </span>
                                                </div>
                                                <h4 className="txt-darker">
                                                    Create your own organization to manage your work with other members
                                                </h4>
                                                <div className="text-center">
                                                    <Button
                                                        className="my-4 pl-3 pr-3 br-lg"
                                                        color="primary"
                                                        type="button"
                                                        onClick={(event) => { this.setState({ ifJoinOrg: true }) }}
                                                    >
                                                        Create Organization
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col lg="2" sm="12" className="p-3 d-flex align-items-center justify-content-center">
                                                <h3 className="txt-lt-dark disable-hover ">Or</h3>
                                            </Col>
                                            <Col lg="5" sm="12" className=" shadow br-sm border-div-1 p-3 d-flex align-items-center justify-content-between d-fc-direction">
                                                <div className="text-center p-4">
                                                    <span className="text-center">
                                                        <img
                                                            className="wd-150 ht-160"
                                                            alt="..."
                                                            src={require("../../assets/img/theme/joinOrg.png")}
                                                        />
                                                    </span>
                                                </div>
                                                <h4 className="txt-darker">
                                                    Join organization to experience and to continue work bla bla
                                            </h4>
                                                <div className="text-center">
                                                    <Button
                                                        className="my-4 pl-3 pr-3 br-lg"
                                                        color="primary"
                                                        type="button"
                                                        onClick={() => { this.setState({ ifJoinOrg: false }) }}
                                                    >
                                                        Join Organization
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            : null
                        }

                        {ifJoinOrg === true ?
                            <Col className="shadow br-sm p-4" lg="12">
                                <Form role="form">
                                    <h3 className="txt-lt-dark"> What you would like to call your organization? </h3>
                                    <FormGroup className="mb-3">
                                        <InputGroup className="input-group-alternative mt-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-world-2" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Create your Organization"
                                                type="text"
                                                autoComplete="text"
                                                className="txt-dark"
                                                value={orgName}
                                                onChange={(event) => { this.setState({ orgName: event.target.value }); }}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <div className="text-center">
                                        <Button
                                            className="my-4 pl-6 pr-6 br-lg"
                                            color="primary"
                                            type="button"
                                            onClick={(event) => { this.createNewOrganization(event)}}
                                        >
                                            Create
                                        </Button>
                                    </div>

                                    <div className="text-center mt-2">
                                        <a
                                            className="txt-lt-dark cursor-point"

                                            onClick={() => { this.setState({ ifJoinOrg: null }) }}
                                        >
                                            <small>Go back</small>
                                        </a>
                                    </div>
                                </Form>
                            </Col> : null
                        }

                        {ifJoinOrg === false ?
                            <Col className="shadow br-sm p-4" lg="12">
                                <Col>
                                    <Form>
                                        <FormGroup>
                                            <Label for="organizationTitle">Search Organization</Label>
                                            <Input
                                                type="text"
                                                className="txt-lt-dark"
                                                name="organizationTitle"
                                                id="organizationTitle"
                                                value={orgSearch}
                                                onChange={(event) => { this.searchForOrganization(event) }}
                                                placeholder="Search for Organization" />
                                        </FormGroup>
                                    </Form>
                                </Col>
                                <Col className="p-1 max-dn-ht-250  hide-scroll-ind" lg="12">
                                    {
                                        filtereContacts.map((users, index) => (
                                            <Card onClick={(event) => { this.selectOrganization(users.orgName, users._id, event) }} key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                    <Col lg="9" className="d-flex align-items-center justify-content-center">
                                                        <span className="text-clamp">{users.orgName}</span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                </Col>
                                {
                                    orgNameObj != null ?
                                        <Col className="p-1 ht-120 hide-scroll-ind" lg="12">
                                            <h3 className="txt-lt-dark"> Selected Organization </h3>
                                            {
                                                orgNameObj.map((users, index) => (
                                                    <Card key={index} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                                                        <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                                                            <Col lg="8" className="d-flex align-items-center justify-content-center">
                                                                <span className="text-clamp">{users.orgName}</span>
                                                            </Col>
                                                            <Col lg="1" className="d-flex align-items-center justify-content-center">
                                                                <span
                                                                    className="txt-lt-dark cursor-point p-2"
                                                                    onClick={() => { this.setState({ orgNameObj: null }) }}
                                                                >
                                                                    <Clear className="text-red" />
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                ))
                                            }
                                        </Col> : null
                                }
                                <div className="text-center mt-4">
                                    <Button
                                        className="my-4 pl-6 pr-6 br-lg"
                                        color="primary"
                                        type="button"
                                        onClick={(event) => { this.onPressJoinOrg(event) }}
                                    >
                                        Join
                                        </Button>
                                </div>
                                <div className="text-center mt-2">
                                    <a
                                        className="txt-lt-dark cursor-point"
                                        onClick={() => { this.setState({ ifJoinOrg: null }) }}
                                    >
                                        <small>Go back</small>
                                    </a>
                                </div>
                            </Col>
                            : null}

                    </CardBody>
                </Card>
            </Col>
        )
    }
}

export default JoinOrCreateOrganization;

