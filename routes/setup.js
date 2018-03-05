// https://mongodb.github.io/node-mongodb-native/2.2/quick-start/
//
// required modules
//
// main function that handles the query part of input
// function queryServer(request, response, search)

//Make queryServer function visible outside this module
//exports.queryServer = queryServer;

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';


// Set up documents
var insertKey = function(db, callback) {
    // Get `chest` collection
    var collection = db.collection('chest');

    // Insert a key
    collection.insertMany([
            { key_type: "IG_access_token", key: "API_KEY_VALUE" }
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 key into collection chest");
        callback(result);
    });
};


var clearChest = function(db, callback) {
    // get the officers collection
    var collection = db.collection('chest');

    // delete the officers
    collection.remove({}, function(err, result) {
        assert.equal(err, null);
        callback(result)
    });
}; // clear the `chest` collection of all entries

var findAllKeys = function(db, callback) {

    var collection  = db.collection('chest');

    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("All of the keys: \n");
        console.log(docs);
        callback(docs);
    });
};


// initial set up.`node setup.js` to run
MongoClient.connect(url, function(err, client) {

    var db = client.db('Lightning');

    clearChest(db, function() {
        insertKey(db, function() {
            findAllKeys(db, function() {
                client.close();
            });
        });
    });
});
