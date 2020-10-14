const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
var ObjectID = require('mongodb').ObjectID;
var objectId = new ObjectID();
async function test(){
//console.log(uuidv4())
//console.log(objectId)
var userData = {email:'shriyashshingare@gmail.com',
password:'shriyash'};
var data1 = await new User().encryptData(userData)
console.log(data1)
let authdata = {data:data1}
var decData = await new User().decryptData(authdata)
console.log(decData);
}
test()
let body ={"action":4,
"workspaceData" : {
   "workspaceName": "sample workspace 2",
   "userIds": [
       "5f816afd7b3de903e5201488",
       "5f775cfb468ce741b33babdb",
       "5f7ead1a00f666150ee1b3d4"
   ]
}
}

task = {
    "action":1,
    "taskData":{
        "taskName": 'sample task 1',
        "userIds":[
            "5f816afd7b3de903e5201488",
            "5f775cfb468ce741b33babdb",
        ],
        "JSONObject":null,
        "statusId":0,
        
    }
}