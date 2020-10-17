import React, { Component } from 'react';

//Material UI
import {
    Avatar,

} from '@material-ui/core';

import {
    Card,
    Row,
    Col,
} from 'reactstrap';

export class UserTaskCard extends Component {
    render() {
        const { onClick, userName, imageUrl, } = this.props;
        return (
            <div>
                <Card onClick={onClick} className="p-2 pl-3 pr-3 mt-1 cursor-point card-hover-view">
                    <Row className="d-flex align-items-center justify-content-around d-fr-direction">
                        <Col lg="3" className="d-flex align-items-center justify-content-center">
                            <Avatar alt={userName} src={imageUrl} />
                        </Col>
                        <Col lg="9" className="d-flex align-items-center justify-content-center">
                            <span className="text-clamp">{userName}</span>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default UserTaskCard
