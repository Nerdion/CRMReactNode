var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var gridfs = require('mongodb').GridFSBucket;

var Credetials = require('../config')
var fs = require('fs');

db_ac = Credetials.DB_UCRM
url = Credetials.URL

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
  if (err) throw err;
  console.log("DB")
  module.exports.usacrm = db.db(Credetials.DB_UCRM);
});