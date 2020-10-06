const { ObjectId } = require('mongodb')
const mongo = require('./Model')
const task = require('./Task')
class Workspace {

    constructor() {
        this.task = 'task',
        this.workspace = 'workspace'
    }
    workspaceAction = async () => {
        if (bodyInfo.action == 1) { //create a workspace
            try {
                //check managerId 
                let workspaceData = bodyInfo.workspaceData;
                let workspace = {
                    title: workspaceData.title,
                    orgID: workspaceData.orgID,//{backend} jwt
                    managerID: workspaceData.managerID,
                    createdDate: new Date(),
                    lastModified: new Date(),
                    lastModifiedUser: workspaceData.lastModifiedUser,
                    userIDs: workspaceData.userIDs,
                    tasksIDs: workspaceData.tasksIDs
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
        }

    }
}

module.exports = Workspace