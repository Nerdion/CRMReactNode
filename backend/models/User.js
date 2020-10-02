const mongo = require('../models/Model')
const CryptoJS = require("crypto-js");
const tokenKey = require('../config').key
const nJwt = require('njwt')
module.exports = class User {
    constructor() { 
        this.User = 'User'
    }

    login = async (bodyInfo) => {
        let authData = await this.decryptData(bodyInfo)
        let email = authData.email;
        let password = authData.password;

        let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': email }).toArray();
        if (checkUser.length == 1) {
            if (password == checkUser[0].password) {
                let jwtData = await this.generatetoken(email, checkUser[0].userId);
                console.log(jwtData)
                return { 'success': true, 'status':200, 'message': "User is authenticated Successfully", jwtToken: jwtData }
            };
        } else {
            return { 'success': false, 'status':400, 'message': "User is authenticated Un-successfully" };
        }
    }
    register = async () => {
        let email = bodyInfo.email;
        let password = bodyInfo.password;
        let userData = {
            email: email,
            password: password
        }
        await mongo.appscountry.collection().insertOne(userData);
        return { 'Success': true, 'Message': "User is registerd Successfully" };
    }

    encryptData = async (data) => {
        try {
            var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
            // return {"data": strenc};
            return strenc

        } catch (e) {
            console.log(e);
        }
    }

    decryptData = async (authData) => {
        try {
            var bytes = CryptoJS.AES.decrypt(authData.data, tokenKey)
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return JSON.parse(originalText);
        } catch (e) {
            console.log(e);
        }
    }
    generatetoken = async (email, userId) => {
        var token_string = {
            userid: userId.toString(),
            email: email
        }
        var jwt = nJwt.create(token_string, tokenKey);
        jwt.setExpiration(new Date().getTime() + (28800000))
        var token = jwt.compact();
        //refrestokenu
        var res_token = {
            userid: userId.toString(),
            email: email
        }
        var refreshToken = nJwt.create(res_token, tokenKey);
        var rToken = refreshToken.compact();


        return { "Token": token, "RefreshToken": rToken }
    }
}
