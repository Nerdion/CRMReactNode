const task = require('../models/Task')
const User = require('../models/User')
module.exports.taskAction = async function (req, res) {
    try {
        let bodyInfo = req.body
        let legitUser = await new User().verifyUser(req.headers.authorization)
        if (bodyInfo.action == 1) {
            bodyInfo.taskData['managerId'] = legitUser.message._id;
            bodyInfo.taskData['lastModifiedUser'] = legitUser.message._id;
        }
        if (legitUser.success) {
            var response = await new task().taskAction(bodyInfo);
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};