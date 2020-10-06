const mongo = require('./Model')
const CryptoJS = require("crypto-js");
const tokenKey = require('../config').key
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Mail = require('./Mail')
const siteName = require('../config').siteName

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

        let userData = {
            name: registerData.username,
            email:  registerData.useremail,
            password: registerData.password,
        }

        let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': userData.email }).toArray();
        try {
            if (checkUser.length == 0) {
                await mongo.usacrm.collection(this.User).insertOne(userData);
                return { 'success': true, 'message': "User is registerd Successfully" };
            } else {
                return { 'success': false, 'message': "User is already exits" };
            }
        } catch (e) {
            return { 'success': false, 'message': e.toString() };
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
        let token = jwt.sign(token_string, tokenKey, {
                expiresIn:'1h'
        });
        return { "Token": token }
    }

    
    async verifyUser(token) {
        try {
            let decoded = await jwt.verify(token, tokenKey)

            let decodedInformation = await mongo.usacrm.collection(this.User).findOne({_id:new ObjectId(decoded.userid)})

            if(!decodedInformation) {
                return {success:false, message:'Not authorised'}
            } else {
                return {success:true, message:decodedInformation}
            }
        } catch(e) {
            return {success:false, message:'Not authorised, malformed key, no session', error:e}
        }
    }

    async inviteNewUser(newMailID, inviterID) {
        try {
            console.log(await inviterID)
            await mongo.usacrm.collection(this.User).insertOne({email: newMailID, status: -1})

            let mail = new Mail()

            const mailOptions = {
                toMail : newMailID,
                subject: `${inviterID.email} has invited you on MYTASK`,
                text: `${inviterID.email} has invited you on MYTASK,
                    go to this link to accept invitation - 
                    ${siteName}?mail=${newMailID}`
            }

            await mail.sendMail(mailOptions)
        } catch(err) {
            return {success:false, message:'', error:err}
        }
    }
}
