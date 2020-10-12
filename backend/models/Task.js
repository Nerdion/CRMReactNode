const { ObjectId } = require('mongodb')
const mongo = require('./Model')
class Task {

    constructor() {
        this.task = 'task'
    }

    taskAction = async (bodyInfo) => {
        if (bodyInfo.action == 1) {  // create task
            try {
                let taskData = bodyInfo.taskData;
                let task = {
                    title: taskData.title,
                    blob: taskData.JSONObject,
                    deadline: taskData.deadline,
                    status: taskData.status,
                    createdDate: new Date(),
                    lastModified: new Date(),
                    lastModifiedUser: taskData.lastModifiedUser,
                    creationUserID: bodyInfo.creationUserID,
                    userIDs: bodyInfo.userIDs
                }
                let insert = await mongo.usacrm.collection(this.task).insertOne(task)
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
                let taskData = await mongo.usacrm.collection(this.task).findOne({ _id: new ObjectId(taskId) }).toArray();
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
            let deleteFilter = [
                {
                    "$match":
                    {
                        "_id": ObjectId(taskId)
                    }
                },
                {
                    "$project":
                    {
                        "title": 1,
                        "taskId": '$_id',
                        "_id": 0
                    }
                }
            ]
            //deletedUser id
            let deletedTaskData = await mongo.usacrm.collection(this.task).aggregate(deleteFilter).toArray()
            let deleteResult = deletedTaskData[0]
            deleteResult['status'] = 4
            let updateResult = await mongo.usacrm.collection(this.task).replaceOne({ _id: new ObjectId(taskId) }, deleteResult)
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
}

module.exports = Task