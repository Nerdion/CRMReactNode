const Mail = require('../models/Mail')
module.exports.sendMail = async function (req, res) {
    try {
        var bodyInfo = req.body
        if (req.body.toMail) {

            const options = {
                toMail: req.body.toMail,
                subject: req.body.subject,
                text: req.body.text
            }

            new Mail().sendMail(options, res);
        } else {
            res.send({ "success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "success": false, "Error": e.toString(), "Payload": [] });
    }
};