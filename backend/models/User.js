const mongo = require('../models/Model')
module.exports = class User {
    constructor() { }

    async login(bodyInfo) {
        let email = bodyInfo.email;
        let password = bodyInfo.password;

        let checkUser = await mongo.appscountry.collection().find({ 'email': email }).toArray();
        if (checkUser.length == 1) {
            if (password == checkUser[0].password) return { 'Success': true, 'Message': "User is authenticated Successfully" };
        } else {
            return { 'Success': false, 'Message': "User is authenticated Un-successfully" };
        }
    }
    async register(bodyInfo) {
        let email = bodyInfo.email;
        let password = bodyInfo.password;
        let userData = {
            email :email,
            password : password
        }
        await mongo.appscountry.collection().insertOne(userData)
    }
}
