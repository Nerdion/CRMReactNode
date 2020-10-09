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

        let checkUser = await mongo.usacrm.collection(this.User).findOne({ 'email': email })
        if (checkUser.email) {
            if (checkUser.statusId == 1) {
                if (password == checkUser.password) {
                    let jwtData = await this.generatetoken(email, checkUser._id.toString());
                    return { 'success': true, 'message': "User is authenticated Successfully", jwtData }
                };
            } else {
                return { 'success': false, 'message': "to login please verify your email first" };
            }

        } else {
            return { 'success': false, 'message': "User is authenticated Un-successfully" };
        }
    }

    register = async (bodyInfo) => {
        let registerData = await this.decryptData(bodyInfo)

        let userData = {
            name: registerData.username,
            email: registerData.useremail,
            password: registerData.password,
            statusId: 0
        }

        let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': userData.email }).toArray();
        try {
            if (checkUser.length == 0) {
                await mongo.usacrm.collection(this.User).insertOne(userData);
                await this.emailVerification(userData.email)
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
            expiresIn: '1h'
        });
        return { "Token": token }
    }


    async verifyUser(token) {
        try {
            let decoded = await jwt.verify(token, tokenKey)
            let decodedInformation = await mongo.usacrm.collection(this.User).findOne({ _id: new ObjectId(decoded.userid) }) //password : 0

            if (!decodedInformation) {
                return { success: false, message: 'Not authorised' }
            } else {
                return { success: true, message: decodedInformation }
            }
        } catch (e) {
            return { success: false, message: 'Not authorised, malformed key, no session', error: e }
        }
    }

    async inviteNewUser(newMailID, inviterID) {
        try {
            console.log(await inviterID)
            let inviterData = await mongo.usacrm.collection(this.User).findOne({ _id: new ObjectId(inviterID._id) })
            let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': newMailID }).toArray();
            if (checkUser.length == 0) {
                let newUser = { email: newMailID, statusId: -1, orgId: inviterData.orgId }
                await mongo.usacrm.collection(this.User).insertOne(newUser)
            }
            let newUserData = await mongo.usacrm.collection(this.User).findOne({ email: newMailID })
            let jwtData = await this.generatetoken(newMailID, newUserData._id.toString());
            let encData = await this.encryptData(jwtData)
            encData = encData.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');
            let mail = new Mail()

            const mailOptions = {
                toMail: newMailID,
                subject: `${inviterID.email} has invited you on smart note`,
                text: `${inviterID.email} has invited you on smart note,
                    go to this link to accept invitation - 
                    ${siteName}/auth/userinfo/${encData}`
            }
            let isSend = await mail.sendMail(mailOptions)
            if (isSend) {
                return { 'success': true, 'message': "User is invited successfully via mail" };
            } else {
                return { 'success': false, 'message': "User is invited Un-successfully" };
            }
        } catch (err) {
            return { success: false, message: '', error: err }
        }
    }
    async authorizeUser(bodyInfo, userData) {
        try {
            let authData = await this.decryptData(bodyInfo)
            let password = authData.password;
            let name = authData.name
            let updateResult = await mongo.usacrm.collection(this.User).updateOne({ "email": userData.email },
                {
                    $set: { name: name, password: password, statusId: 1 }
                })

            return { success: true, message: 'User is authorized successfully' }
        } catch (err) {
            return { success: false, message: 'User is authorized Un-successfully' }
        }


    }

    async emailVerification(email) {
        let newUserData = await mongo.usacrm.collection(this.User).findOne({ email: email })
        let jwtData = await this.generatetoken(email, newUserData._id.toString());
        let encData = await this.encryptData(jwtData)
        encData = encData.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');
        let mail = new Mail()
        const mailOptions = {
            toMail: email,
            subject: `Verify Email Address`,
            text: `Please click the given link below to verify your email
                ${siteName}/auth/emailVerification/${encData}`
        }
        let isSend = await mail.sendMail(mailOptions)
        if (isSend) {
            return { 'success': true, 'message': "Verificatio link sent successfully" };
        } else {
            return { 'success': false, 'message': "Verificatio link sent Un-successfully" };
        }

    }
}
