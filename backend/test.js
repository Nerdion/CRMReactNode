// const { v4: uuidv4 } = require('uuid');
// const User = require('./models/User');
// var ObjectID = require('mongodb').ObjectID;
// var objectId = new ObjectID();
// async function test(){
// //console.log(uuidv4())
// //console.log(objectId)
// var userData = {email:'shriyashshingare@gmail.com',
// password:'shriyash'};
// var data1 = await new User().encryptData(userData)
// console.log(data1)
// let authdata = {data:data1}
// var decData = await new User().decryptData(authdata)
// console.log(decData);
// }
// test()
// let body ={"action":4,
// "workspaceData" : {
//    "workspaceName": "sample workspace 2",
//    "userIds": [
//        "5f816afd7b3de903e5201488",
//        "5f775cfb468ce741b33babdb",
//        "5f7ead1a00f666150ee1b3d4"
//    ]
// }
// }

const { ObjectId } = require('mongodb');


// task = {
//     "action":1,
//     "taskData":{
//         "taskName": 'sample task 1',
//         "userIds":[
//             "5f816afd7b3de903e5201488",
//             "5f775cfb468ce741b33babdb",
//         ],
//         "JSONObject":null,
//         "statusId":0,
//     }

task = {
    "action": 2,
    "updatedTaskData": {
        "taskId": "5f86d1d102d98a2752a69ec3",
        "workspaceId": "5f8582bc2ee99672bac77ae4",
        "taskName": 'mail generator',
        "deletedUserIds": [
            "5f7ead1a00f666150ee1b3d4",
        ],
        "addedUserIds": [
            "5f7ead1a00f666150ee1b3d4"
        ],
        "JSONObject": `<p>fadfasdfadsfasdfasdfadfafasf</p>
        <img src="https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="undefined" style="height: auto;width: auto"/>
        <p></p>`,
        "statusId": 1,
    }
}
task = {
    "action": 1,
    "taskData": {
        "workspaceId": "5f8582bc2ee99672bac77ae4",
        "taskName": 'mail generator',
        "taskDescription": "xyz",
        "addedUserIds": [
            "5f7ead1a00f666150ee1b3d4"
        ],
        "taskDetails": "sdjfh",
        "statusId": 1,
    }
}
task = {
    "action": 1,
    "taskData":
    {
        "workspaceId": "5f840bc3ca75743262e373ab",
        "taskName": "sample task",
        "taskDescription": "sample des",
        "taskDetails": "<p>hsakdfhkajshfl</p>\n<p>asjdfhajkshdfljsahdflashljfsadfsadf</p>\n<p>asfkhksjhdfkjshfkjhskjfhsaf</p>\n<p>sfslkadhfkjsahdfkjhsadkfjhasdf</p>\n",
        "statusId": 1,
        "addedUserIds": []
    }
}


// task = {
//     'action':1,
//     'taskData':{
//         'taskName': 'sample task 1',
//         'userIds':[
//             "5f816afd7b3de903e5201488",
//             "5f775cfb468ce741b33babdb",
//         ],
//         'JSONObject':null,
//         'statusId':0,

//     }
// }


async function main() {
    const Org = require('./models/Organization');
    const org = await new Org()
    let orgName = await org.getOrganizationName(new ObjectId('5f8580cb9f423623786d34ca'))
    console.log(orgName)
}

main()