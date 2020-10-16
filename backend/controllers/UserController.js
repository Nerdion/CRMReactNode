const User = require('../models/User');
module.exports.login = async function (req, res) {
    try {
        let bodyInfo = req.body
        if (1) {
            var response = await new User().login(bodyInfo);
            res.send(response)
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
};

module.exports.register = async function (req, res) {
    try {
        let bodyInfo = req.body
        if (1) {
            var response = await new User().register(bodyInfo);
            res.send(response)
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
};

module.exports.manageUser = async function (req, res) {
    try {
        let user = new User()
        let bodyInfo = req.body
        let legitUser = await user.verifyUser(req.headers.authorization)

        if (legitUser.success) {
            // method to invite a new user
            if (bodyInfo.method == 'invite') {
                res.send(await user.inviteNewUser(bodyInfo.useremail))
            }
        } else {
            res.send(legitUser)
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
}

//Authorize newly invited user
module.exports.authorizeUser = async function (req, res) {
    try {
        let user = new User()
        let bodyInfo = req.body
        let legitUser = await user.verifyUser(req.headers.authorization)
        if (legitUser.success) {
            let response = await user.authorizeUser(bodyInfo);
            res.send(response)
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
};

module.exports.authorizeRegisteredUser = async function (req,res) {
    try {
        let user = new User()
        let bodyInfo = req.body
        let legitUser = await user.verifyUser(req.headers.authorization)
        if (legitUser.success) {
            let response = await user.authorizeRegisteredUser(bodyInfo);
            res.send(response)
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
}
module.exports.getMyOrganizationMembers = async function (req,res) {
    try {
        let user = new User()
        let bodyInfo = req.body
        let legitUser = await user.verifyUser(req.headers.authorization)
        if (legitUser.success) {
            let response = await user.getMyOrganizationMembers(bodyInfo);
            res.send(response)
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
}

module.exports.userProfile = async function (req,res) {
    try {
        const user = new User()
        
        await user.verifyUser(req.headers.authorization)
        let bodyInfo = req.body
        if (1) {
            if(bodyInfo.method == 'getUserProfile') {
                var response = await user.getUserProfileInformation(bodyInfo);
                res.send(response)
            }

            if(bodyInfo.method == 'setUserProfile') {
                let response = await user.setUserProfileInformation(bodyInfo)
                res.send(response)
            }

            if(bodyInfo.method == 'userNameAndImage') {
                let response = await user.getMyUserNameAndImage(bodyInfo)
                res.send(response)
            }
        } else {
            res.send({ success: true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ success: false, "Error": e.toString(), "Payload": [] });
    }
}