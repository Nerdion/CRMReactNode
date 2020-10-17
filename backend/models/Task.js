const { ObjectId } = require('mongodb')
const mongo = require('./Model')
const workspace = require('./Workspace')
const user = require('./User')
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
                let workspaceId = await this.returnObjectId(bodyInfo.taskData.workspaceId)
                let userIds = await this.returnObjectId(bodyInfo.taskData.addedUserIds)
                let task = {
                    taskName: taskData.taskName,
                    taskDescription: taskData.taskDescription,
                    taskDetails: taskData.taskDetails,
                    workspaceId: workspaceId,
                    managerId: taskData.managerId,
                    userIds: userIds,
                    //deadline: new Date(taskData.deadline),
                    statusId: taskData.statusId,
                    createdDate: new Date(),
                    lastModified: new Date(),
                    lastModifiedUser: taskData.lastModifiedUser
                }
                let insert = await mongo.usacrm.collection(this.task).insertOne(task)
                task['taskId'] = insert.insertedId
                await mongo.usacrm.collection(this.workspace).updateOne(
                    {_id:workspaceId},
                    { '$push': { "taskIds": insert.insertedId } })
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
            await mongo.usacrm.collection(this.workspace).updateOne(
                {_id:workspaceId},
                {'$pull':{taskIds:taskId}}
            )
            let userIds = taskData.userIds;
            let deletedTaskData = await mongo.usacrm.collection(this.task).deleteOne({ "_id": taskId });
            if(!bodyInfo.from){
                await this.deleteUserIds(userIds)
            }
            return { success: true, message: "task deleted successfully" }
        } else if (bodyInfo.action == 4) { //all task card 
            let taskCardData = []
            let workspaceId = await this.returnObjectId(bodyInfo.workspaceId)
            let taskData = await mongo.usacrm.collection(this.task).find({ workspaceId: workspaceId }).toArray();
            for (let i = 0; i < taskData.length; i++) {
                let tData = {};
                tData['taskName'] = taskData[i].taskName
                tData['taskId'] = taskData[i]._id;
                tData['taskDescription'] = taskData[i].taskDescription
                if (taskData[i].statusId == 0) {
                    tData['status'] = 'Draft'
                    tData['activityStatus'] = 'unpublished'
                } else if (taskData[i].statusId == 1) {
                    tData['status'] = 'Pending'
                    tData['activityStatus'] = 'published'
                } else if (taskData[i].statusId == 2) {
                    tData['status'] = 'Finished'
                    tData['activityStatus'] = 'published'
                }
                tData['users'] = await new user().getUserNameAndImage(taskData[i].userIds)
                taskCardData.push(tData)
            }
            return { success: true, taskCardData: taskCardData }

        } else if (bodyInfo.action == 5) { //single task data
            try {
                let taskId = await this.returnObjectId(bodyInfo.taskId)
                let taskData = await mongo.usacrm.collection(this.task).findOne({ _id: taskId }, {
                    projection: {
                        _id: 0,
                        taskName: 1,
                        taskDescription: 1,
                        taskDetails: 1,
                        statusId: 1
                    }
                })
                if (taskData.statusId == 0) {
                    taskData['status'] = 'Draft'
                } else if (taskData.statusId == 1) {
                    taskData['status'] = 'Pending'
                } else if (taskData.statusId == 2) {
                    taskData['status'] = 'Finished'
                }
                return { success: true, taskData: taskData }
            } catch (err) {
                return { success: false, error: err.toString() }
            }

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
    async insertIntoUser(task, workspaceId) {
        try {
            let userIds = task.userIds
            let managerId = task.managerId

            for (let i = 0; i < userIds.length; i++) {
                let taskObj = {
                    taskId: task.taskId,
                    roleId: 0,
                    lastModifiedDate: null
                }
                if (!(userIds[i] == managerId)) {
                    await mongo.usacrm.collection(this.user).updateOne(
                        { _id: userIds[i], "workspaces.workspaceId": workspaceId },
                        { '$push': { "workspaces.$.tasks": taskObj } }
                    )
                }
            }
            let taskObj = {
                taskId: task.taskId,
                roleId: 1,
                lastModifiedDate: null
            }
            await mongo.usacrm.collection(this.user).updateOne(
                { _id: managerId, "workspaces.workspaceId": workspaceId },
                { '$push': { "workspaces.$.tasks": taskObj } }
            )
            return true
        } catch (err) {
            return false
        }
    }
    async deleteUserIds(deletedIds, workspaceId, taskId) {
        try {
            for (let i = 0; i < deletedIds.length; i++) {
                let updated = await mongo.usacrm.collection(this.user).update({
                    '_id': deletedIds[i],
                    workspaces: {
                        "$elemMatch": {
                            workspaceId: workspaceId
                        }
                    }
                },
                    {
                        "$pull": {
                            "workspaces.$.tasks": { "taskId": taskId }
                        }
                    }
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
                let taskObj = {
                    taskId: taskId,
                    roleId: 0,
                    lastModifiedDate: null
                }
                await mongo.usacrm.collection(this.user).updateOne(
                    { _id: addedUserIds[i], "workspaces.workspaceId": workspaceId },
                    { '$push': { "workspaces.$.tasks": taskObj } }
                )
                return true
            }
        } catch (err) {
            return false
        }

    }
}

module.exports = Task