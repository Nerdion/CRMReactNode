module.exports.getAllUsersData = async function (req, res) {
    try {
        //let bodyInfo = req.body
        let legitUser = await new User().verifyUser(req.headers.authorization)
        if (legitUser) {
            var response = await new workspace().getAllUsersData();
            res.send(response)
        } else {
            res.send({ "Success": true, "Error": error, "Payload": [] })
        }
    } catch (e) {
        res.send({ "Success": false, "Error": e.toString(), "Payload": [] });
    }
};