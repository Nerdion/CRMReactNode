const { ObjectId } = require('mongodb')
const mongo = require('./Model')
const workspace = require('./Workspace')
class Task {

    constructor() {
        this.task = 'Task'
        this.workspace = 'Workspaces',
            this.organization = 'Organizations',
            this.user = 'User'
    }

    taskAction = async (bodyInfo) => {
        if (bodyInfo.action == 1) {  // create task
            try {
                let taskData = bodyInfo.taskData;
                let workspaceId = await this.returnObjectId(bodyInfo.workspaceId)
                let userIds = await this.returnObjectId(bodyInfo.taskData.userIds)
                let task = {
                    taskName: taskData.taskName,
                    blob: taskData.JSONObject,
                    deadline: new Date(taskData.deadline),
                    statusId: taskData.statusId,
                    createdDate: new Date(),
                    lastModified: new Date(),
                    lastModifiedUser: taskData.lastModifiedUser,
                    userIds: userIds
                }
                let insert = await mongo.usacrm.collection(this.task).insertOne(task)
                task['taskId'] = insert.insertedId
                let userInsert = await this.insertIntoUser(task, workspaceId)
                return { 'success': true, 'message': "Task is created successfully" }

            } catch (error) {
                return { 'success': false, 'message': "Task is created Un-successfully" };
            }
        } else if (bodyInfo.action == 2) { // update task
            try {
                //single update
                let taskId = await this.returnObjectId(bodyInfo.updatedTaskData.taskId);
                let workspaceId = await this.returnObjectId(bodyInfo.updatedTaskData.workspaceId)
                let updatedTaskData = bodyInfo.updatedTaskData;
                let updatedTaskDataKeys = Object.keys(updatedTaskData);
                let nKeysArray = ['taskId', 'deletedUserIds', 'addedUserIds', 'workspaceId']
                let taskData = await mongo.usacrm.collection(this.task).findOne({ _id: new ObjectId(taskId) })
                for (let i = 0; i < updatedTaskDataKeys.length; i++) {
                    taskData[updatedTaskDataKeys[i]] = updatedTaskData[i];
                    if (!nKeysArray.includes(updatedTaskDataKeys[i])) {
                        taskData[updatedTaskDataKeys[i]] = updatedTaskData[updatedTaskDataKeys[i]];
                    } else if (updatedTaskDataKeys[i] == 'deletedUserIds') {
                        let deletedIds = await this.returnObjectId(updatedTaskData[updatedTaskDataKeys[i]])
                        for (let i = 0; i < deletedIds.length; i++) {
                            let userIds = taskData['userIds'].splice(taskData['userIds'].indexOf(deletedIds[i], 1))
                        }
                        await this.deleteUserIds(deletedIds, workspaceId, taskId)
                    } else if (updatedTaskDataKeys[i] == 'addedUserIds') {
                        let addedIds = await this.returnObjectId(updatedTaskData[updatedTaskDataKeys[i]])
                        for (let i = 0; i < addedIds.length; i++) {
                            taskData['userIds'].push(addedIds[i])
                        }
                        await this.addUserIds(addedIds, workspaceId, taskId)
                    }
                }
                taskData['lastModified'] = new Date()
                let updateResult = await mongo.usacrm.collection(this.task).replaceOne({ _id: new ObjectId(taskId) }, taskData)
                return { 'success': true, 'message': "Task is updated successfully" }
            } catch (error) {
                return { 'success': false, 'message': "Task is updated Un-successfully" };

            }
        } else if (bodyInfo.action == 3) {  //delete task
            let taskId = bodyInfo.taskId;
            let taskData = await mongo.usacrm.collection(this.task).findOne({ _id: taskId })
            let userIds = taskData.userIds;
            let deletedTaskData = await mongo.usacrm.collection(this.task).deleteOne({ "_id": taskId });
            let deleteResult = deletedTaskData[0]
            deleteResult['status'] = 4
        }
    }
    async getCompletionPercentage(taskIds) {
        try {
            if (!taskIds) {
                return 0
            } else {
                for (let i = 0; i < taskIds.length; i++) {
                    let statusIdCount = 0;
                    totalCount = taskIds.length;
                    let statusId = await mongo.usacrm.collection(this.task).findOne({ _id: taskIds[i] }, {
                        projection: {
                            _id: 0,
                            status: 1

                        }
                    })
                    if (statusId == 3) {
                        statusIdCount++;
                    }

                }
                let percentage = (statusIdCount / totalCount) * 100
                return percentage;
            }

        } catch (e) {
            return false;
        }

    }
    async returnObjectId(ids) {
        let idArray = [];
        if (typeof (ids) == 'string') {
            return new ObjectId(ids)
        } else {
            for (let i = 0; i < ids.length; i++) {
                idArray.push(new ObjectId(ids[i]))
            }
            return idArray
        }

    }
    async insertIntoUser(task, workspace) {
        try {
            let userIds = task.userIds
            let managerId = task.managerId

            for (let i = 0; i < userIds.length; i++) {
                let taskObj = {
                    taskId: task.taskId,
                    rollId: 0,
                    lastModifiedDate: null
                }
                if (!(userIds[i] == managerId)) {
                    await mongo.usacrm.collection(this.user).updateOne(
                        { _id: userIds[i], "workspaces.workspaceId": workspaceId },
                        { '$push': { "workspaces.tasks": taskObj } }
                    )
                }
            }
            let taskObj = {
                taskId: task.taskId,
                rollId: 1,
                lastModifiedDate: null
            }
            await mongo.usacrm.collection(this.user).updateOne(
                { _id: managerId, "workspaces.workspaceId": workspaceId, "workspaces.tasks.taskId": taskId },
                { '$push': { "workspaces.tasks": taskObj } }
            )
        } catch (err) {
            return false
        }
    }
    async deleteUserIds(deletedIds, workspaceId, taskId) {
        try {
            for (let i = 0; i < deletedIds.length; i++) {
                let updated = await mongo.usacrm.collection(this.user).updateOne(
                    { '_id': deletedIds[i], "workspaces.tasks.taskId": taskId },
                    { '$pull': { "workspaces.tasks": taskId } }
                )
            }
            return true
        } catch (err) {
            return false
        }
    }

    async addUserIds(addedUserIds, workspaceId, taskId) {
        try {
            for (let i = 0; i < addedUserIds.length; i++) {
                let workspacesObj = {
                    workspaceId: workspaceId,
                    rollId: 0,
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

module.exports = Task