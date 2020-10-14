const { ObjectId } = require('mongodb')
const mongo = require('./Model')
const workspace = require('./Workspace')
class Task {

    constructor() {
        this.task = 'Task'
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
                let userInsert = await this.insertIntoUser(task,workspaceId)
                return { 'success': true, 'message': "Task is created successfully" }

            } catch (error) {
                return { 'success': false, 'message': "Task is created Un-successfully" };
            }
        } else if (bodyInfo.action == 2) { // update task
            try {
                //single update
                let taskId = bodyInfo.taskId;
                let updatedTaskData = bodyInfo.updatedTaskData;
                let updatedTaskDataKeys = Object.keys(updatedTaskData);
                let taskData = await mongo.usacrm.collection(this.task).findOne({ _id: new ObjectId(taskId) })
                for (let i = 0; i < updatedTaskDataKeys.length; i++) {
                    taskData[updatedTaskDataKeys[i]] = updatedTaskData[i];
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
            let deletedTaskData = await mongo.usacrm.collection(this.task).deleteOne( { "_id" : taskId } );
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
        if (ids.length == 1) {
            return new ObjectId(ids)
        } else {
            for (let i = 0; i < ids.length; i++) {
                idArray.push(new ObjectId(ids[i]))
            }
            return idArray
        }

    }
    async insertIntoUser(task,workspaceId) {
        try {
            let userIds = task.userIds
            let managerId = task.managerId

            for (let i = 0; i < userIds.length; i++) {
                let workspacesObj = {
                    taskId: task.taskId,
                    rollId: 0,
                    lastModifiedDate: null
                }
                if (!(userIds[i] == managerId)) {
                    await mongo.usacrm.collection(this.user).updateOne({ _id: userIds[i] }, { $push: { "workspaces": workspacesObj } })
                }
            }
            let workspacesObj = {
                workspaceId: workspace.workspaceId,
                rollId: 1,
                lastModifiedDate: null
            }
            await mongo.usacrm.collection(this.user).updateOne({ _id: managerId }, { $push: { "workspaces": workspacesObj } })
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