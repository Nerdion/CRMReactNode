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

    async login(bodyInfo) {
        let authData = await this.decryptData(bodyInfo)
        let email = authData.useremail;
        let password = authData.password;

        let checkUser = await mongo.usacrm.collection(this.User).findOne({ 'email': email })
        if (checkUser.email) {
            if (checkUser.statusId == 1) {
                if (password == checkUser.password) {
                    let jwtData = await this.generatetoken(email, checkUser._id.toString());
                    let myOrganization = checkUser.orgId;
                    return { 'success': true, 'message': "User is authenticated Successfully", jwtData, orgID : myOrganization }
                };
            } else {
                return { 'success': false, 'message': "to login please verify your email first" };
            }

        } else {
            return { 'success': false, 'message': "User is authenticated Un-successfully" };
        }
    }

    async register (bodyInfo) {
        let registerData = await this.decryptData(bodyInfo)

        let userData = {
            name: registerData.username,
            email: registerData.useremail,
            password: registerData.password,
            orgId : null,
            statusId: 0,
            workspaces:[
                {
                    workspaceId : null,
                    rollId : 1,
                    lastModifiedDate : new Date()
                }
            ]
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
                ${siteName}/auth/login/${encData}`
        }
        let isSend = await mail.sendMail(mailOptions)
        if (isSend) {
            return { 'success': true, 'message': "Verificatio link sent successfully" };
        } else {
            return { 'success': false, 'message': "Verificatio link sent Un-successfully" };
        }
    }
    
    async getMyOrganization() {
        try {
            if(this.decodedInformation.orgId) {
                return { sucess: true, orgName: await this.decodedInformation.orgId }
            } else {
                return { sucess: false, message: "Not in any organization" }
            }
        } catch (err) {
            return { sucess: false, error: err }
        }
    }

    async encryptData (data) {
        try {
            var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
            return strenc
        } catch (e) {
            console.log(e);
        }
    }

    async decryptData (authData) {
        try {
            var bytes = CryptoJS.AES.decrypt(authData.data, tokenKey)
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(originalText);
        } catch (e) {
            console.log(e);
        }
    }

    async authorizeRegisteredUser() {
        try {
            await mongo.usacrm.collection(this.User).findOneAndUpdate({ _id: new ObjectId(this.decodedInformation._id) },{ $set:  {statusId : 1}} )
            let jwtData = await this.generatetoken(this.decodedInformation.email, this.decodedInformation._id.toString());
            return { success: true, message: 'User is authorized successfully', jwtData }
        } catch (e) {
            console.log(e);
            return { success : false, message: 'Expired', error : e.toString()}
        }
    }

    async generatetoken(email, userId) {
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
            this.decodedInformation = await mongo.usacrm.collection(this.User).findOne({ _id: new ObjectId(decoded.userid) }) //password : 0

            if (!this.decodedInformation) {
                return { success: false, message: 'Not authorised' }
            } else {
                return { success: true, message: this.decodedInformation }
            }
        } catch (e) {
            return { success: false, message: 'Not authorised, malformed key, no session', error: e }
        }
    }

    async inviteNewUser(newMailId) {
        try {
            let inviterId = this.decodedInformation
            if(inviterId.email == newMailId) return { sucess: false, message: "Cannot invite yourself !!"}
            
            let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': newMailId }).toArray();
            if (checkUser.length == 0) {
                let newUser = { email: newMailId, statusId: -1, orgId: inviterId.orgId }
                await mongo.usacrm.collection(this.User).insertOne(newUser)
            }
            let newUserData = await mongo.usacrm.collection(this.User).findOne({ email: newMailId })

            if(newUserData.orgId.toString() == inviterId.orgId.toString() && newUserData.statusId == 1) {
                return { success : false, message : " User already exists in your organization"}
            }

            if(newUserData.orgId != null && newUserData.statusId == 1) {
                return { success: false, message: "User already exists on smart note"}
            }

            let jwtData = await this.generatetoken(newMailId, newUserData._id.toString());
            let encData = await this.encryptData(jwtData)
            encData = encData.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');
            let mail = new Mail()

            const mailOptions = {
                toMail: newMailId,
                subject: `${inviterId.email} has invited you on smart note`,
                text: `${inviterId.email} has invited you on smart note,
                    go to this link to accept invitation - 
                    ${siteName}/auth/userinfo/${encData}`
            }
            let isSend = await mail.sendMail(mailOptions)
            if (isSend) return { 'success': true, 'message': "User is invited successfully via mail" };
            else return { 'success': false, 'message': "User is invited Un-successfully" };
        } catch (err) {
            return { success: false, message: '', error: err }
        }
    }

    async authorizeUser(bodyInfo) {
        try {
            let authData = await this.decryptData(bodyInfo)
            let password = authData.password;
            let name = authData.name
            await mongo.usacrm.collection(this.User).updateOne({ "email": this.decodedInformation.email },
                {
                    $set: { name: name, password: password, statusId: 1 }
                })
            
            let userData = this.decodedInformation
            let jwtData = await this.generatetoken(userData.email, userData._id.toString());

            return { success: true, message: 'User is authorized successfully', jwtData }
        } catch (err) {
            return { success: false, message: 'User is authorized Un-successfully' }
        }
    }

    async setOrgID(orgId) {
        console.log(orgId)
        console.log(typeof orgId)
        try {
            await mongo.usacrm.collection(this.User).findOneAndUpdate({_id: this.decodedInformation._id}, { $set: {orgId: orgId}})
        } catch(e) {
            return { success: false, message: '', error: e.toString() }
        }
    }

    async getMyOrganizationMembers() {
        try {
            let data = await mongo.usacrm.collection(this.User).find({orgId:this.decodedInformation.orgId}).project({orgId:0, password:0, statusId:0}).toArray()

            return { success: true, message: 'Users inside this organization', data: data}
        } catch(e) {
            return { success: false, message: '', error: e.toString() }
        }
        
    }

}
