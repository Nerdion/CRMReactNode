const mongo = require('./Model')
class Task {

    constructor() {
        this.task = 'task'
    }

    createTask = async (bodyInfo) => {
        try {
            let task = {
                title: bodyInfo.title,
                blob: bodyInfo.JSONObject,
                deadline: bodyInfo.deadline,
                status: bodyInfo.status,
                creationUserID: bodyInfo.creationUserID,
                status: bodyInfo.status,
                userIDs: bodyInfo.userIDs
            }
            let insert = await mongo.usacrm.collection(this.task).insertOne(task)
            return { 'success': true, 'status': 200, 'message': "Task is created successfully" }

        } catch (error) {
            return { 'success': false, 'status': 400, 'message': "Task is created Un-successfully" };
        }


    }
}

module.exports = Task