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
        if(bodyInfo.action == 4){
            bodyInfo['userId'] = legitUser.message._id
            bodyInfo['isAdmin'] = legitUser.message.orgRoleId
        }
        if (legitUser.success) {
            var response = await new workspace().workspaceAction(bodyInfo);
            res.send(response)
        } else {
            res.send({ "success": true, "error": error.toString(), "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "error": e.toString(), "Payload": [] });
    }
};