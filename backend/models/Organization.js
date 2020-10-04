const mongo = require('./Model')

const tokenKey = require('../config').key
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

class Organization {

    constructor() {
        this.organization = 'organizations'
    }

    async getMyOrganization(userID) {
        try {
            if(await this.ifUserHasOrganization(userID)) {
                let result = await mongo.usacrm.collection(this.organization).findOne({userID:userID})
                return  {sucess:true, orgName:await result.orgName}
            }
        } catch(err) {
            return {sucess:false, error:err}
        }
    }

    async createOrganization(organizationName, userInformation) {       
        try {
            if(await this.ifOrgExists(organizationName)) return {sucess:false, message: 'Organization already exists'}
            if(await this.ifUserHasOrganization(userInformation._id)) return {sucess:false, message: 'Already part of an organization'}
        
            await mongo.usacrm.collection(this.organization).insertOne({orgName:organizationName, userID:userInformation._id})
            return await {success:true, message:'Organization created successfully'}
        } catch(e) {
            return {sucess:false, error:e}
        }
    }

    async updateOrganizationName(userInformation, updatedName) {
        try {
            let userID = userInformation._id
            if(await this.ifUserHasOrganization(userID)) {
                await mongo.usacrm.collection(this.organization).findOneAndUpdate({userID: userID}, {$set: {orgName: updatedName}})
            }
        } catch(err) {
            return {success:false, error:err}
        }
    }

    async ifOrgExists(organizationName) {
        if(await mongo.usacrm.collection(this.organization).findOne({orgName:organizationName})) return true
        else return false
    }

    async ifUserHasOrganization(userid) {
        if(await mongo.usacrm.collection(this.organization).findOne({userID: userid})) return true
        else return false
    }

}

module.exports = Organization