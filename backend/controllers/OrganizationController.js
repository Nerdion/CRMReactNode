const { response } = require('express');
const Organization = require('../models/Organization')
const User = require('../models/User');


module.exports.manage = async (req, res) => {
    try {
        const organization = new Organization()
        const user = new User()
        let legitUser = await user.verifyUser(req.headers.authorization)
        if (legitUser.success) {
            if (req.body.method == 'search') res.json(await organization.searchToJoin(req.body.orgName))
            if (req.body.method == 'members') res.json(await user.getMyOrganizationMembers())
            if (req.body.method == 'inviteToJoin') {
                let managerIdData = await organization.getMyManager(req.body.orgId)
                let reponse = await user.inviteToJoin(managerIdData.message)
                res.json(reponse)
            }
            //method to get organization details
            if (req.body.method == 0) {
                const orgID = await user.getMyOrganization()
                res.json(await organization.getOrganizationDetails(await orgID.orgName))
            }
            if (req.body.method == 'createOrg') {
                if(legitUser.message.orgId) {
                    res.send({ sucess: false, message: 'Already part of an organization' })
                }
                else {
                    let response = await organization.createOrganization(req.body.orgName, legitUser.message)
                    await user.setOrgID(response.orgId)
                    await user.makeMeOrgAdmin()
                    res.json(response)
                }
            }
            if (req.body.method == 2) res.json(await organization.updateOrganizationName(legitUser.message, req.body.updatedName))

            if(req.body.method == 'allowJoin') {
                
            }

        } else res.json(legitUser)
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};