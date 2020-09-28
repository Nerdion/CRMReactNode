const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
var ObjectID = require('mongodb').ObjectID;
var objectId = new ObjectID();
async function test(){
console.log(uuidv4())
console.log(objectId)
var userData = {email:'shriyashshingare@gmail.com',
password:'shriyash'};
var data = await new User().encryptData(userData)
console.log(data)
var decData = await new User().decryptData(data)
console.log(decData);
}
test()