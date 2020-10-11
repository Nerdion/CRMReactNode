const mongo = require('./Model')

const tokenKey = require('../config').key
const jwt = require('jsonwebtoken')
const { ObjectId, Db } = require('mongodb')

class Organization {

    constructor() {
        this.organization = 'Organizations'
    }

    async getMembers(userInformation) {
        try {
            let members = await mongo.usacrm.collection(this.organization).find({}, {}).toArray()
            return { success: true, message: 'Users inside organization', data: members }
        } catch (e) {
            return { sucess: false, error: e.toString() }
        }
    }

    async createOrganization(organizationName, userInformation) {
        try {
            if (!organizationName) return { success: false, message: 'Please enter organization name' }
            if (await this.ifOrgExists(organizationName)) return { sucess: false, message: 'Organization already exists' }

            await mongo.usacrm.collection(this.organization).insertOne({ orgName: organizationName, managerId: userInformation._id })

            let orgId = await mongo.usacrm.collection(this.organization).findOne({ orgName: organizationName })

            return { success: true, message: 'Organization created successfully', orgId: orgId._id }
        } catch (e) {
            return { sucess: false, error: e }
        }
    }

    async updateOrganizationName(userInformation, updatedName) {
        try {
            let userId = userInformation._id
            if (await this.ifUserHasOrganization(userId)) {
                await mongo.usacrm.collection(this.organization).findOneAndUpdate({ userId: userId }, { $set: { orgName: updatedName } })
            }
        } catch (err) {
            return { success: false, error: err }
        }
    }

    async ifOrgExists(organizationName) {
        if (await mongo.usacrm.collection(this.organization).findOne({ orgName: organizationName })) return true
        else return false
    }

    async getOrganizationNames(orgName) {
        try {
            let regexp = new RegExp(`^${orgName}`, 'gm')
            let data = await mongo.usacrm.collection(this.organization).find({ orgName: { $regex: regexp } }).toArray()
            return { sucess: true, orgName: data }
        } catch (e) {
            return { sucess: false, error: e.toString() }
        }
    }

    async getOrganizationDetails(orgId) {
        try {
            let orgDetails = await mongo.usacrm.collection(this.organization).findOne({ _id: new ObjectId(orgId) })
            return { success: true, message: 'Organization details', data: orgDetails }
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }
    async getOrganizationName(orgId) {
        try {
            let orgName = await mongo.usacrm.collection(this.organization).findOne({ orgID: workspaceData[i].orgID }, { orgName: 1, _id: 0, orgID: 0 });
            return orgName
        } catch (e) {
            return false
        }
    }
}

module.exports = Organization