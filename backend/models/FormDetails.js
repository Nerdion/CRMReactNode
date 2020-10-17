const { ObjectId } = require('mongodb')
const mongo = require('./Model')
const task = require('./Task')
class FormDetails {

    constructor() {
        this.user = 'user'
    }
    userSearch = async (bodyInfo) => {
        let searchText = bodyInfo.searchText.toString();

        let conmatch = { "email": { "$regex": searchText, "$options": 'i' } }
        let grp = { "_id": { "email": "$email" } }
        let pro = { "_id": 1, "email": "$_id.email", "userName": "$_id.firstName" + "$_id.lastName" }

        let searchFilter = [
            { "$match": conmatch },
            { "$group": grp },
            { "$project": pro }
        ];
        var res = await mongo.appscountry.collection(this.user).aggregate(searchFilter).toArray();
        return res
    }


}

module.exports = FormDetails