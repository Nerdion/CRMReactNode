const User = require('../models/User');
module.exports.login = async function (req, res) {
    try {
        let bodyInfo = req.body
        if (1) {
            var response = await new User().login(bodyInfo);
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};

module.exports.register = async function (req, res) {
    try {
        let bodyInfo = req.body
        if (1) {
            var response = await new User().register(bodyInfo);
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};

module.exports.manageUser = async function (req, res) {
    try {
        let user = new User()
        let bodyInfo = req.body
        let legitUser = await user.verifyUser(req.headers.authorization)

        if (legitUser.success) {
            if (bodyInfo.method == 'invite') {
                res.send(await user.inviteNewUser(bodyInfo.useremail))
            }
        } else {
            res.send(legitUser)
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
}

module.exports.authorizeUser = async function (req, res) {
    try {
        let user = new User()
        let bodyInfo = req.body
        let legitUser = await user.verifyUser(req.headers.authorization)
        if (legitUser.success) {
            var response = await user.authorizeUser(bodyInfo);
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};