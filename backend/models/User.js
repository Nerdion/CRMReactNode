const mongo = require('../models/Model')
module.exports = class User {
    constructor() { }

    login = async () => {
        let email = bodyInfo.email;
        let password = bodyInfo.password;

        let checkUser = await mongo.appscountry.collection().find({ 'email': email }).toArray();
        if (checkUser.length == 1) {
            if (password == checkUser[0].password) return { 'Success': true, 'Message': "User is authenticated Successfully" };
        } else {
            return { 'Success': false, 'Message': "User is authenticated Un-successfully" };
        }
    }
    register = async () => {
        let email = bodyInfo.email;
        let password = bodyInfo.password;
        let userData = {
            email :email,
            password : password
        }
        await mongo.appscountry.collection().insertOne(userData);
        return { 'Success': true, 'Message': "User is registerd Successfully" };
    }
     encryptData = async(data, tokenkey) =>{
        try {
            var strenc = CryptoJS.AES.encrypt(JSON.stringify(data), tokenkey).toString();
            // return {"data": strenc};
            return strenc
    
        } catch (e) {
            console.log(e);
        }
    }
    
     decryptData=async(data, tokenkey) => {
        try {
            var bytes = CryptoJS.AES.decrypt(data, tokenkey)
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
    
            return JSON.parse(originalText);
        } catch (e) {
            console.log(e);
        }
    }
}
