const mongo = require('./Model')
const CryptoJS = require("crypto-js");
const tokenKey = require('../config').key
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Mail = require('./Mail');
const { verifyMail, inviteMail, inviteToJoin } = require('./MailTemplates');
const siteName = require('../config').siteName
const Organization = require('./Organization');
const { response, request } = require('express');
const e = require('express');

module.exports = class User {
    constructor() {
        this.User = 'User',
            this.workspace = 'Workspaces',
            this.task = 'Task'
    }

    // Login Authentication function
    async login(bodyInfo) {
        try {
            let authData = await this.decryptData(bodyInfo)
            let email = authData.useremail;
            let password = authData.password;

            let checkUser = await mongo.usacrm.collection(this.User).findOne({ 'email': email })
            if (checkUser.email) {
                if (checkUser.statusId == 1) {
                    if (password == checkUser.password) {
                        let jwtData = await this.generatetoken(email, checkUser._id.toString());
                        let myOrganization = checkUser.orgId;
                        return { 'success': true, 'message': "User is authenticated Successfully", jwtData, orgID: myOrganization }
                    } else {
                        return { 'success': false, 'message': "User is authenticated Un-successfully" }
                    }
                } else {
                    return { 'success': false, 'message': "To login please verify your email first" };
                }
            }
        } catch (e) {
            return { 'success': false, 'message': "User doesn't exists please register" };
        }

    }

    // Registeration of the new user
    async register(bodyInfo) {
        let registerData = await this.decryptData(bodyInfo)

        let userData = {
            name: registerData.username,
            email: registerData.useremail,
            password: registerData.password,
            orgId: null,
            statusId: 0,
            orgRoleId: 0
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

    // send the mail for newly registered user
    async emailVerification(email) {
        let newUserData = await mongo.usacrm.collection(this.User).findOne({ email: email })
        let jwtData = await this.generatetoken(email, newUserData._id.toString());
        let encData = await this.encryptData(jwtData)
        encData = encData.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');
        let mail = new Mail()
        let html = await verifyMail(`${siteName}/auth/login/${encData}`)
        const mailOptions = {
            toMail: email,
            subject: `Verify Email Address`,
            html: html
        }
        let isSend = await mail.sendMail(mailOptions)
        if (isSend) {
            return { 'success': true, 'message': "Verification link sent successfully" };
        } else {
            return { 'success': false, 'message': "Verification link sent Un-successfully" };
        }
    }

    // returns the orgId of the user
    async getMyOrganization() {
        try {
            if (this.decodedInformation.orgId) {
                //also return the role of me
                return { sucess: true, orgName: await this.decodedInformation.orgId }
            } else {
                return { sucess: false, message: "Not in any organization" }
            }
        } catch (e) {
            return { sucess: false, error: e.toString() }
        }
    }

    // function for encryption
    async encryptData(data) {
        try {
            var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenKey).toString();
            return strenc
        } catch (e) {
            console.log(e.toString());
        }
    }

    // function for decryption
    async decryptData(authData) {
        try {
            var bytes = CryptoJS.AES.decrypt(authData.data, tokenKey)
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(originalText);
        } catch (e) {
            console.log(e.toString());
        }
    }

    // Verifies normally registered user
    async authorizeRegisteredUser() {
        try {
            await mongo.usacrm.collection(this.User).findOneAndUpdate({ _id: new ObjectId(this.decodedInformation._id) }, { $set: { statusId: 1 } })
            let jwtData = await this.generatetoken(this.decodedInformation.email, this.decodedInformation._id.toString());
            return { success: true, message: 'User is authorized successfully', jwtData }
        } catch (e) {
            console.log(e);
            return { success: false, message: 'Expired', error: e.toString() }
        }
    }

    // Generates a new JWT Token called by Login function
    async generatetoken(email, userId) {
        var token_string = {
            userid: userId.toString(),
            email: email
        }
        let token = jwt.sign(token_string, tokenKey, {
            expiresIn: '7d'
        });
        return { "Token": token }
    }

    // verifies the credentials of the JWT Token & returns complete information of the user
    async verifyUser(token) {
        try {
            let decoded = await jwt.verify(token, tokenKey)
            this.decodedInformation = await mongo.usacrm.collection(this.User).findOne({ _id: new ObjectId(decoded.userid) }, {
                projection: {
                    password: 0,
                    workspaces: 0
                }
            })
            if (!this.decodedInformation) {
                return { success: false, message: 'Not authorised' }
            } else {
                return { success: true, message: this.decodedInformation }
            }
        } catch (e) {
            return { success: false, message: 'Not authorised, malformed key, no session', error: e }
        }
    }

    // invites new user takes in new mail id which registered user has invited
    async inviteNewUser(newMailId) {
        try {
            let inviterId = this.decodedInformation
            if (inviterId.email == newMailId) return { sucess: false, message: "Cannot invite yourself !!" }

            let checkUser = await mongo.usacrm.collection(this.User).find({ 'email': newMailId }).toArray();
            if (checkUser.length == 0) {
                let newUser = { email: newMailId, statusId: -1, orgId: inviterId.orgId }
                await mongo.usacrm.collection(this.User).insertOne(newUser)
            }
            let newUserData = await mongo.usacrm.collection(this.User).findOne({ email: newMailId })

            if (newUserData.orgId.toString() == inviterId.orgId.toString() && newUserData.statusId == 1) {
                return { success: false, message: " User already exists in your organization" }
            }

            if (newUserData.orgId != null && newUserData.statusId == 1) {
                return { success: false, message: "User already exists on smart note" }
            }

            let jwtData = await this.generatetoken(newMailId, newUserData._id.toString());
            let encData = await this.encryptData(jwtData)
            encData = encData.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l');
            let mail = new Mail()
            let orgName = await new Organization().getOrganizationName(this.decodedInformation.orgId)
            let html = await inviteMail(this.decodedInformation.name, this.decodedInformation.email, `${siteName}/auth/userinfo/${encData}`, orgName)
            const mailOptions = {
                toMail: newMailId,
                subject: `${this.decodedInformation.email} has invited you on smart note`,
                html: html
            }
            let isSend = await mail.sendMail(mailOptions)
            if (isSend) return { 'success': true, 'message': "User is invited successfully via mail" };
            else return { 'success': false, 'message': "User is invited Un-successfully" };
        } catch (err) {
            return { success: false, message: '', error: err }
        }
    }

    //Authorize newly invited user
    async authorizeUser(bodyInfo) {
        try {
            let authData = await this.decryptData(bodyInfo)
            let password = authData.password;
            let name = authData.name
            await mongo.usacrm.collection(this.User).updateOne({ "email": this.decodedInformation.email },
                {
                    $set: { name: name, password: password, statusId: 1, orgRoleId: 0 }
                })

            let userData = this.decodedInformation
            let jwtData = await this.generatetoken(userData.email, userData._id.toString());

            return { success: true, message: 'User is authorized successfully', jwtData }
        } catch (err) {
            return { success: false, message: 'User is authorized Un-successfully', error:err.toString() }
        }
    }

    //setting the OrgID of a user
    async setOrgID(orgId) {
        try {
            await mongo.usacrm.collection(this.User).findOneAndUpdate({ _id: this.decodedInformation._id }, { $set: { orgId: orgId } })
        } catch (e) {
            return { success: false, message: '', error: e.toString() }
        }
    }

    async makeMeOrgAdmin() {
        try {
            await mongo.usacrm.collection(this.User).findOneAndUpdate({ _id: this.decodedInformation._id }, { $set: { orgRoleId: 1 } })
        } catch (e) {
            return { success: false, message: '', error: e.toString() }
        }
    }

    // returns all the members in the organization
    async getMyOrganizationMembers() {
        try {
            let data = await mongo.usacrm.collection(this.User).find({ orgId: this.decodedInformation.orgId }).project({ orgId: 0, password: 0, statusId: 0, workspaces: 0 }).toArray()
            //console.log(data)
            for (let i = 0; i < data.length; i++) {
                if (data[i].orgRoleId == 1) {
                    data[i]['isAdmin'] = 'Admin'
                } else {
                    let checkUser = await mongo.usacrm.collection(this.User).findOne({ _id: data[i]._id, 'workspaces.roleId': 1 })
                    if (checkUser) {
                        data[i]['isAdmin'] = 'Manager'
                    } else {
                        data[i]['isAdmin'] = 'Member'
                    }
                }
            }
            return { success: true, message: 'Users inside this organization', data: data }
        } catch (e) {
            return { success: false, message: '', error: e.toString() }
        }
    }

    async getMyTaskMembers(taskId) {
        try {
            let data = []
            let taskUserIds = await mongo.usacrm.collection(this.task).findOne({ _id: taskId }, {
                projection: {
                    _id: 0,
                    userIds: 1
                }
            })
            taskUserIds = taskUserIds.userIds

            for (let i = 0; i < taskUserIds.length; i++) {
                let userData = await mongo.usacrm.collection(this.User).findOne({ _id: taskUserIds[i] }, {
                    projection: {
                        orgId: 0,
                        password: 0,
                        statusId: 0,
                        workspaces: 0
                    }
                })
                data.push(userData)
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].orgRoleId == 1) {
                    data[i]['isAdmin'] = 'Admin'
                } else {
                    let checkUser = await mongo.usacrm.collection(this.User).findOne({ _id: data[i]._id, 'workspaces.roleId': 1 })
                    if (checkUser) {
                        data[i]['isAdmin'] = 'Manager'
                    } else {
                        data[i]['isAdmin'] = 'Member'
                    }
                }
            }
            return data
        } catch (e) {
            return false
        }

    }
    async getMyWorkSpaceMembers(workspaceId) {
        try {
            let data = []
            workspaceId = new ObjectId(workspaceId)
            let workspaceUserIds = await mongo.usacrm.collection(this.workspace).findOne({ _id: workspaceId }, {
                projection: {
                    _id: 0,
                    userIds: 1
                }
            })
            workspaceUserIds = workspaceUserIds.userIds
            for (let i = 0; i < workspaceUserIds.length; i++) {
                let userData = await mongo.usacrm.collection(this.User).findOne({ _id: workspaceUserIds[i] }, {
                    projection: {
                        orgId: 0,
                        password: 0,
                        statusId: 0,
                        workspaces: 0
                    }
                })
                data.push(userData)
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].orgRoleId == 1) {
                    data[i]['isAdmin'] = 'Admin'
                } else {
                    let checkUser = await mongo.usacrm.collection(this.User).findOne({ _id: data[i]._id, 'workspaces.roleId': 1 })
                    if (checkUser) {
                        data[i]['isAdmin'] = 'Manager'
                    } else {
                        data[i]['isAdmin'] = 'Member'
                    }
                }
            }
            return { success: true, message: 'Users inside this workspace', data: data }
        } catch (e) {
            return { success: false, message: '', error: e.toString() }
        }

    }

    // gets the manager information of a particular organization
    async getManagerName(managerID) {
        try {
            let managerName = await mongo.usacrm.collection(this.User).findOne({ _id: managerID }, {
                projection: {
                    name: 1,
                    _id: 0,
                }
            })
            return managerName.name;
        } catch (e) {
            return { success: false, message: '', error: e.toString() }
        }
    }

    //returns names & images of the users
    async getUserNameAndImage(userIds) {
        try {
            let users = []
            for (let i = 0; i < userIds.length; i++) {
                let userData = await mongo.usacrm.collection(this.User).findOne({ _id: userIds[i] }, {
                    projection: {
                        password: 0,
                    }
                })
                if (userData.orgRoleId == 1) {
                    userData['isAdmin'] = 'Admin'
                } else {
                    userData.workspaces.roleId ? userData['isAdmin'] = 'Manager' : userData['isAdmin'] = 'Member'
                }

                users.push({
                    userId: userData._id,
                    userProfileImage: userData.userProfileImage,
                    userName: userData.name,
                    mail: userData.email,
                    Role: userData.isAdmin
                })
            }
            return users
        } catch (e) {
            return { success: false, message: '', error: e.toString() }
        }
    }

    async getMyUserNameAndImage() {

        let profileAndImage = {
            userProfile: this.decodedInformation.userProfileImage ? this.decodedInformation.userProfileImage : '',
            name: this.decodedInformation.name
        }
        return { success: true, data: profileAndImage }
    }

    // this will send organization manager a mail
    async inviteToJoin(managerId) {
        try {
            let loggedInUser = this.decodedInformation

            let managerInfo = await mongo.usacrm.collection(this.User).findOne({ _id: managerId }, { projection: { email: 1, _id: 0 } })

            let inviteToken = await this.generatetoken(loggedInUser.email, loggedInUser._id)
            let link = `${siteName}/auth/joinUser/${inviteToken.Token}`
            let html = await inviteToJoin(loggedInUser.name, loggedInUser.email, link)

            const mailOptions = {
                toMail: managerInfo.email,
                subject: `${this.decodedInformation.name} has asked to join on yours SmartNote`,
                html: html
            }

            await new Mail().sendMail(mailOptions)

            return { success: true, message: 'Invite sent successfully.' }

        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }

    async approveInvited(newUserToken) {
        try {
            let managerId = await new Organization().getMyManager(this.decodedInformation.orgId)

            if (managerId.message.toString() == this.decodedInformation._id.toString()) {
                let orgId = this.decodedInformation.orgId
                let newUserData = await this.verifyUser(newUserToken)
                await this.setOrgID(orgId)
                return { success: true, message: 'User added sucessfully!' }
            } else {
                return { success: false, message: 'User is not admin' }
            }

        } catch (e) {
            return { sucess: false, error: e.toString() }
        }
    }
    async searchToJoinUser(name) {
        try {
            let regexp = new RegExp(`^${name}`, 'gm')
            let data = await mongo.usacrm.collection(this.User).find({ orgName: { $regex: regexp } }).limit(5).toArray()
            return { success: true, userNameData: data }
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }

    async getUserProfileInformation() {
        try {
            let userInfo = this.decodedInformation;
            let data = {}
            userInfo.name ? data.userName = userInfo.name : ''
            userInfo.email ? data.userEmail = userInfo.email : ''
            userInfo.firstName ? data.firstName = userInfo.firstName : ''
            userInfo.lastName ? data.lastName = userInfo.lastName : ''
            userInfo.address ? data.address = userInfo.address : ''
            userInfo.city ? data.city = userInfo.city : ''
            userInfo.country ? data.country = userInfo.city : ''
            userInfo.postCode ? data.postCode = userInfo.postCode : ''
            userInfo.userProfileImage ? data.userProfileImage = userInfo.userProfileImage : ''

            return { success: true, data: data }
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }

    async setUserProfileInformation(requestData) {
        try {
            let changedData = requestData.data
            changedData.name = changedData.userName
            await mongo.usacrm.collection(this.User).findOneAndUpdate({ _id: this.decodedInformation._id }, { $set: changedData })
            return { success: true, message: 'Profile Updated Sucessfully' }
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }
}
