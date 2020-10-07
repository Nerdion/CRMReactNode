const Organization = require('../models/Organization')
const User = require('../models/User');


module.exports.manage = async (req, res) => {
    try {
        const oragnization = new Organization()

        let legitUser = await new User().verifyUser(req.headers.authorization)
        if (legitUser.success) {
            if (req.body.method == 0) res.json(await oragnization.getMyOrganization(legitUser.message._id))
            if (req.body.method == 1) res.json(await oragnization.createOrganization(req.body.orgName, legitUser.message))
            if (req.body.method == 2) res.json(await oragnization.updateOrganizationName(legitUser.message, req.body.updatedName))
        } else res.json(legitUser)
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};