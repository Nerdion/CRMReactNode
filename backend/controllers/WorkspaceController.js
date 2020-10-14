const workspace = require('../models/Workspace')
const User = require('../models/User')
module.exports.workspaceAction = async function (req, res) {
    try {
        let bodyInfo = req.body
        let legitUser = await new User().verifyUser(req.headers.authorization)
        if (bodyInfo.action == 1) {
            bodyInfo.workspaceData['orgId'] = legitUser.message.orgId;
            bodyInfo.workspaceData['managerId'] = legitUser.message._id;
            bodyInfo.workspaceData['lastModifiedUser'] = legitUser.message._id;
        }
        if (bodyInfo.action == 2) {
            bodyInfo.updatedWorkSpaceData['lastModifiedUser'] = legitUser.message._id;
        }
        if (legitUser.success) {
            var response = await new workspace().workspaceAction(bodyInfo);
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error.toString(), "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};