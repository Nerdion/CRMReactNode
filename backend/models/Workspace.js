const { ObjectId } = require('mongodb')
const mongo = require('./Model')
const task = require('./Task')
const org = require('./Organization')
const user = require('./User')
const { get } = require('request-promise-native')
class Workspace {

    constructor() {
        this.task = 'Tasks',
        this.workspace = 'Workspaces',
        this.organization = 'Organizations',
        this.user = 'User'
    }
    workspaceAction = async (bodyInfo) => {
        if (bodyInfo.action == 1) { //create a workspace
            try {
                let workspaceData = bodyInfo.workspaceData;
                let userIds = await this.returnObjectId(workspaceData.userIds)
                let workspace = {
                    workspaceName: workspaceData.workspaceName,
                    orgID: workspaceData.orgId,//{backend} jwt
                    managerId: workspaceData.managerId,
                    createdDate: new Date(),
                    lastModified: new Date(),
                    lastModifiedUser: workspaceData.lastModifiedUser,
                    userIds: userIds,
                    tasksIds: workspaceData.tasksIds
                }
                let insert = await mongo.usacrm.collection(this.workspace).insertOne(workspace);
                workspace['workspaceId'] = insert.insertedId
                let userInsert = await this.insertIntoUser(workspace)
                return { 'success': true, 'message': "Workspace is created successfully" }
            } catch (error) {
                return { 'success': false, 'error': error.toString(), 'message': "workspace is created Un-successfully" };
            }
        } else if (bodyInfo.action == 2) { //update a workspace
            try {
                let workspaceId = await this.returnObjectId(bodyInfo.updatedWorkSpaceData.workspaceId)
                let updatedWorkSpaceData = bodyInfo.updatedWorkSpaceData;
                updatedWorkSpaceData['lastModified'] = new Date()
                let updatedWorkSpaceDataKeys = Object.keys(updatedWorkSpaceData);
                let nKeysArray = ['workspaceId', 'deletedUserIds', 'addedUserIds']
                let workspaceData = await mongo.usacrm.collection(this.workspace).findOne({ _id: workspaceId })
                for (let i = 0; i < updatedWorkSpaceDataKeys.length; i++) {
                    if (!nKeysArray.includes(updatedWorkSpaceDataKeys[i])) {
                        workspaceData[updatedWorkSpaceDataKeys[i]] = updatedWorkSpaceData[updatedWorkSpaceDataKeys[i]];
                    } else if (updatedWorkSpaceDataKeys[i] == 'deletedUserIds') {
                        let deletedIds = await this.returnObjectId(updatedWorkSpaceData[updatedWorkSpaceDataKeys[i]])
                        for (let i = 0; i < deletedIds.length; i++) {
                            let userIds = workspaceData['userIds'].splice(workspaceData['userIds'].indexOf(deletedIds[i], 1))
                        }
                        await this.deleteUserIds(deletedIds, workspaceId)
                    } else if (updatedWorkSpaceDataKeys[i] == 'addedUserIds') {
                        let addedIds = await this.returnObjectId(updatedWorkSpaceData[updatedWorkSpaceDataKeys[i]])
                        for (let i = 0; i < addedIds.length; i++) {
                            if(!workspaceData['userIds'].includes(addedIds[i])){
                                workspaceData['userIds'].push(addedIds[i])
                            }else{
                                addedIds.splice(i,1)
                                i--;
                            }
                        }
                        await this.addUserIds(addedIds, workspaceId)
                    }

                }
                let updateResult = await mongo.usacrm.collection(this.workspace).replaceOne({ _id: workspaceId }, workspaceData)
                return { 'success': true, 'message': "Workspace is updated successfully" }

            } catch (error) {
                return { 'success': false, 'error': error.toString(), 'message': "workspace is updated Un-successfully" };
            }
        } else if (bodyInfo.action == 3) { //delete a workspace
            try {
                let workspaceId = await this.returnObjectId(bodyInfo.workspaceId);
                let workspaceData = await mongo.usacrm.collection(this.workspace).findOne({ _id: workspaceId })
                let tasksIds = workspaceData.tasksIds;
                let deletedTasks = []
                let failedDeleteTask = []
                if(!tasksIds == null){
                    for (let i = 0; i < tasksIds.length; i++) {
                        let taskBody = {
                            action: 3,
                            from:1,
                            taskId: tasksIds[i]
                        }
                        let deleteTaskResult = await new task().taskAction(taskBody);
                        if (deleteTaskResult.success == true) {
                            deletedTasks.push(tasksIDs[i])
                        } else {
                            failedDeleteTask.push(tasksIDs[i])
                        }
                    }
                }
                
                if (failedDeleteTask.length == 0) {
                    let updateResult = await mongo.usacrm.collection(this.workspace).deleteOne({ "_id": workspaceId });
                    let userUpdatedResult = await mongo.usacrm.collection(this.user).updateMany(
                        {},
                        { '$pull': { workspaces: { workspaceId: workspaceId } } },
                        { multi: true }
                    )
                    return { 'success': true, 'message': "Workspace is deleted successfully" }
                } else {
                    return { 'success': false, 'error': error.toString(), 'message': "workspace is deleted Un-successfully" };
                }
            } catch (error) {
                return { 'success': false, 'error': error.toString(), 'message': "workspace is deleted Un-successfully" };
            }
        } else if (bodyInfo.action == 4) { //grid data workspace
            try {
                let workspaceGrid = []
                let workspaceData;
                if(bodyInfo.isAdmin){
                    workspaceData = await mongo.usacrm.collection(this.workspace).find({}).toArray();
                }else {
                    let workspaceIds = await mongo.usacrm.collection(this.user).aggregate([
                        { "$match": { "_id": bodyInfo.userId } },
                        { "$project": { "workspaceIds": "$workspaces.workspaceId", "_id": 0 } }
                    ]).toArray()

                    workspaceData = await mongo.usacrm.collection(this.workspace).find({_id:{$in:workspaceIds[0]['workspaceIds']}}).toArray()
                }
                for (let i = 0; i < workspaceData.length; i++) {
                    let fData = {};
                    fData['workspaceName'] = workspaceData[i].workspaceName
                    fData['workspaceId'] = workspaceData[i]._id;
                    fData['organizationName'] = await new org().getOrganizationName(workspaceData[i].orgID)
                    fData['managerName'] = await new user().getManagerName(workspaceData[i].managerId)
                    fData['completion'] = await new task().getCompletionPercentage(workspaceData[i].tasksIds)
                    fData['completionText'] = fData.completion + '%'
                    fData['users'] = await new user().getUserNameAndImage(workspaceData[i].userIds)
                    fData['createdAt'] = await this.timeDifference(Date.now(), workspaceData[i].createdDate.getTime())
                    workspaceGrid.push(fData)
                }
                return { success: true, workspaceGrid: workspaceGrid }
            } catch (e) {
                return { success: false, workspaceGrid: [] }
            }


        }

    }

    async timeDifference(current, previous) {
        try {
            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;

            var elapsed = current - previous;

            if (elapsed < msPerMinute) {
                return Math.round(elapsed / 1000) + ' seconds ago';
            }

            else if (elapsed < msPerHour) {
                return Math.round(elapsed / msPerMinute) + ' minutes ago';
            }

            else if (elapsed < msPerDay) {
                return Math.round(elapsed / msPerHour) + ' hours ago';
            }

            else if (elapsed < msPerMonth) {
                return Math.round(elapsed / msPerDay) + ' days ago';
            }

            else if (elapsed < msPerYear) {
                return Math.round(elapsed / msPerMonth) + ' months ago';
            }

            else {
                return Math.round(elapsed / msPerYear) + ' years ago';
            }

        } catch (err) {
            return false
        }


    }

    async returnObjectId(ids) {
        try {
            let idArray = [];
            if (typeof (ids) == 'string') {
                return new ObjectId(ids)
            } else {
                for (let i = 0; i < ids.length; i++) {
                    idArray.push(new ObjectId(ids[i]))
                }
                return idArray
            }

        } catch (err) {
            return false
        }
    }
    async insertIntoUser(workspace) {
        try {
            let userIds = workspace.userIds
            let managerId = workspace.managerId

            for (let i = 0; i < userIds.length; i++) {
                let workspacesObj = {
                    workspaceId: workspace.workspaceId,
                    roleId: 0,
                    lastModifiedDate: null
                }
                if (!(userIds[i] == managerId)) {
                    let data = await mongo.usacrm.collection(this.user).findOne({_id:userIds[i],'workspaces.workspaceId':workspace.workspaceId})
                    if(!data){
                        await mongo.usacrm.collection(this.user).updateOne({ _id: userIds[i] }, { $push: { "workspaces": workspacesObj } })
                    }

                }
            }
            let workspacesObj = {
                workspaceId: workspace.workspaceId,
                roleId: 1,
                lastModifiedDate: null
            }
            let data = await mongo.usacrm.collection(this.user).findOne({_id:managerId,'workspaces.workspaceId':workspace.workspaceId})
                    if(!data){
                        await mongo.usacrm.collection(this.user).updateOne({ _id: managerId }, { $push: { "workspaces": workspacesObj } })
                    }
        } catch (err) {
            return false
        }
    }
    async deleteUserIds(deletedIds, workspaceId) {
        try {
            for (let i = 0; i < deletedIds.length; i++) {
                let updated = await mongo.usacrm.collection(this.user).updateOne(
                    { '_id': deletedIds[i] },
                    { '$pull': { workspaces: { workspaceId: workspaceId } } }
                )
            }
            return true
        } catch (err) {
            return false
        }


    }

    async addUserIds(addedUserIds, workspaceId) {
        try {
            for (let i = 0; i < addedUserIds.length; i++) {
                let workspacesObj = {
                    workspaceId: workspaceId,
                    roleId: 0,
                    lastModifiedDate: null
                }
                await mongo.usacrm.collection(this.user).updateOne({ _id: addedUserIds[i] }, { $push: { "workspaces": workspacesObj } })
                return true
            }
        } catch (err) {
            return false
        }
    }
}




module.exports = Workspace