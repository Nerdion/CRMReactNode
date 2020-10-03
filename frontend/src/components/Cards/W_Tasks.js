import React, { Component } from 'react';

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Progress,
    Container,
    Row,
    Col,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

import MoreVertIcon from '@material-ui/icons/MoreVert';

const options = [
    'None',
    'Atria',
    'Callisto',
];
const ITEM_HEIGHT = 48;
export class W_Tasks extends Component {
    state = {
        openMenu: null
    }
    handleMenuClick = (event) => {
        this.setState({ openMenu: event })
    };

    handleMenuClose = () => {
        this.setState({ openMenu: null })
    };

    handleopen = () => {
        this.setState((prevState) => ({ openMenu: !prevState.openMenu }))
    }
    render() {
        const { openMenu } = this.state;
        return (
            <Col className="mar-b-2 mb-xl-0" xs="12" md="12" lg="6" xl="6">
                <Card className="bg-gradient-default shadow">
                    <CardHeader className="bg-transparent">
                        <Row className="align-items-center">
                            <div className="col">
                                <h3 className="text-uppercase text-light ls-1 mb-1">
                                    Overview
                                </h3>
                            </div>
                            <div className="col text-right">
                                <ButtonDropdown direction="left" isOpen={openMenu} toggle={() => this.handleopen()}>
                                    <DropdownToggle size="sm" className="br-lg outline-border">
                                    <MoreVertIcon />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Another Action</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        {/* Chart */}
                        <div className="">
                            <p>hello this is desc</p>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}

export default W_Tasks
