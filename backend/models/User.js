const mongo = require('./Model')
const CryptoJS = require("crypto-js");
const tokenKey = require('../config').key
const nJwt = require('njwt')
module.exports = class User {
    constructor() {
        this.User = 'User'
    }

    login = async (bodyInfo) => {
        let authData = await this.decryptData(bodyInfo)
        let email = authData.useremail;
        let password = authData.password;

        let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': email }).toArray();
        if (checkUser.length == 1) {
            if (password == checkUser[0].password) {
                let jwtData = await this.generatetoken(email, checkUser[0]._id.toString());
                return { 'success': true, 'status': 200, 'message': "User is authenticated Successfully", jwtToken: jwtData }
            };
        } else {
            return { 'success': false, 'status': 400, 'message': "User is authenticated Un-successfully" };
        }
    }
    register = async (bodyInfo) => {
        let registerData = await this.decryptData(bodyInfo)
        let email = registerData.useremail;
        let password = registerData.password;
        let name = registerData.username
        let userData = {
            name: name,
            email: email,
            password: password,
        }

        let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': email }).toArray();
        try {
            if (checkUser.length == 0) {
                await mongo.usacrm.collection(this.User).insertOne(userData);
                return { 'success': true, status: 200, 'message': "User is registerd Successfully" };
            } else {
                return { 'success': false, status: 400, 'message': "User is already exits" };
            }

        } catch (e) {
            return { 'success': false, status: 400, 'message': e.toString() };
        }

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

    
    async verifyUser(token, res) {
        try {
            let decoded = nJwt.verify(token, process.env.SECRET_KEY)

            let reAuth = await mongo.usacrm.collection(this.User).findOne({_id:decoded._id}).toArray()

            if(!reAuth) {
                res.json({success:false, message:'Not authorised'})
                return false
            }
            return decoded._id
        } catch(e) {
            res.json({success:false, message:'Not authorised, malformed key, no session'})
            return false
        }
    }
}
