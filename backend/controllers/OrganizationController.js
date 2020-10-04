const Organization = require('../models/Organization')
const User = require('../models/User');


module.exports.manage = async (req, res) => {
    try {
        const oragnization = new Organization()

        let legitUser = await new User().verifyUser(req.body.token, res)
        let updatedName = req.body.updatedName
        if(legitUser) {
            if(req.body.method == 0) res.json(await oragnization.getMyOrganization(legitUser._id))
            if(req.body.method == 1) res.json(await oragnization.createOrganization(req.body.orgName, legitUser))
            if(req.body.method == 2) res.json(await oragnization.updateOrganizationName(legitUser, updatedName))

        } else res.json({success:false, message:''})
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};