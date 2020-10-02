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