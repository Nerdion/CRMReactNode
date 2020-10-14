import React from "react";
//API's
import { organizationAPI } from './CRM_Apis';

class JoinUser extends React.Component {

    componentDidMount = async () => {
        await this.addTheUser()
    }

    async addTheUser() {
        let joinLink = this.props.match.params.joinLink;
        this.jwtToken = await localStorage.getItem('CRM_Token_Value');

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
    }


    render() {
        return (
            <>
                <p>loading...</p>
            </>
        )
    }

}



export default JoinUser;