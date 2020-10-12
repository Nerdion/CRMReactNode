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
                //check managerId 
                //let orgId = new user().getOrganizationName()
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
                return { 'success': true, 'message': "Workspace is created successfully" }
            } catch (error) {
                return { 'success': false, 'error': error.toString(), 'message': "workspace is created Un-successfully" };
            }
        } else if (bodyInfo.action == 2) { //update a workspace
            try {
                let workspaceId = bodyInfo.workspaceId;
                //lastmodified
                let updatedWorkSpaceData = bodyInfo.updatedWorkSpaceData;
                let updatedWorkSpaceDataKeys = Object.keys(updatedWorkSpaceData);
                let workspaceData = await mongo.usacrm.collection(this.workspace).findOne({ _id: new ObjectId(taskId) }).toArray();
                for (let i = 0; i < updatedWorkSpaceDataKeys.length; i++) {
                    workspaceData[updatedWorkSpaceDataKeys[i]] = updatedWorkSpaceData[i];
                }
                workspaceData['lastModified'] = new Date()
                //lastmodifieduser jwt
                let updateResult = await mongo.usacrm.collection(this.workspace).replaceOne({ _id: new ObjectId(workspaceId) }, workspaceData)
                return { 'success': true, 'message': "Workspace is updated successfully" }

            } catch (error) {
                return { 'success': false, 'error': error.toString(), 'message': "workspace is updated Un-successfully" };
            }
        } else if (bodyInfo.action == 3) { //delete a workspace
            try {
                let workspaceId = bodyInfo.workspaceId;
                let workspaceData = await mongo.usacrm.collection(this.workspace).findOne({ workspaceId: new ObjectId(workspaceId) }).toArray();
                workspaceData = workspaceData[0];
                let tasksIDs = workspaceData.tasksIDs;
                let taskBody;
                let deletedTasks = []
                let failedDeleteTask = []
                for (let i = 0; i < tasksIDs.length; i++) {
                    taskBody = {
                        action: 3,
                        taskId: tasksIDs[i]
                    }
                    let deleteTaskResult = await new task().taskAction(taskBody);
                    if (deleteTaskResult.success == true) {
                        deletedTasks.push(tasksIDs[i])
                    } else {
                        failedDeleteTask.push(tasksIDs[i])
                    }
                }

                let deleteFilter = [
                    {
                        "$match":
                        {
                            "_id": ObjectId(workspaceId)
                        }
                    },
                    {
                        "$project":
                        {
                            "title": 1,
                            "workspaceId": '$_id',
                            "_id": 0
                        }
                    }
                ]
                //deleted user
                let deletedWorkspaceData = await mongo.usacrm.collection(this.workspace).aggregate(deleteFilter).toArray()
                let deleteResult = deletedWorkspaceData[0]
                deleteResult['status'] = 4
                if (failedDeleteTask.length == 0) {
                    let updateResult = await mongo.usacrm.collection(this.workspace).replaceOne({ _id: new ObjectId(taskId) }, deleteResult)
                    return { 'success': true, 'message': "Workspace is deleted successfully" }
                } else {
                    return { 'success': false, 'error': error.toString(), 'message': "workspace is deleted Un-successfully" };
                }
            } catch (error) {
                return { 'success': false, 'error': error.toString(), 'message': "workspace is deleted Un-successfully" };
            }
        } else if (bodyInfo.action == 4) { //grid data workspace
            try {
                let fData = {
                    "workspaceName": "New Location",
                    "organizationName": "DevLinkLab",
                    "managerName": "Neel-121434",
                    "completionText": "30%",
                    "completion": 30,
                    "users": [
                        {
                            "userName": "Nishad Patil",
                            "imageUrl": "data:image/jpeg;base64,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"
                        },
                        {
                            "userName": "Neel Khalade",
                            "imageUrl": "https://storage.pixteller.com/designs/designs-images/2016-11-19/02/thumbs/img_page_1_58305b35ebf5e.png"
                        },
                    ],
                    "createdAt": "5 minute ago"
                };
                let workspaceGrid = []
                let workspaceData = await mongo.usacrm.collection(this.workspace).find({}).toArray();
                for (let i = 0; i < workspaceData.length; i++) {
                    fData.workspaceName = workspaceData[i].workspaceName
                    fData.organizationName = await new org().getOrganizationName(workspaceData[i].orgID)
                    fData.managerName = await new user().getManagerName(workspaceData[i].managerId)
                    fData.completion = await new task().getCompletionPercentage(workspaceData[i].tasksIds)
                    fData.completionText = fData.completion + '%'
                    fData.users = await new user().getUserNameAndImage(workspaceData[i].userIds)
                    fData.createdAt = await this.timeDifference(Date.now(), workspaceData[i].createdDate.getTime())
                    workspaceGrid.push(fData)
                }
                return { success: true, workspaceGrid: workspaceGrid }
            } catch (e) {
                return { success: false, workspaceGrid: [] }
            }


        }

    }

    async timeDifference(current, previous) {

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
            return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        }

        else {
            return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
    }
    async returnObjectId(ids) {
        let idArray = [];
        if (ids.length == 1) {
            return new ObjectId(ids)
        } else {
            for (let i = 0; i < ids.length; i++) {
                idArray.push(new ObjectId(ids[i]))
            }
            return idArray
        }

    }

}



module.exports = Workspace