var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost:27017/Lightning';



/* ---- Key insertion ---- */
// Inserts many keys
var insertKey = function(info, db, callback) {

    // // Get `keys` collection
    // var collection = db.collection('chest');
    // // Insert some documents
    // collection.insertMany([
    //     info
    // ], function(err, result) {
    //     assert.equal(err, null);
    //     assert.equal(1, result.result.n);
    //     assert.equal(1, result.ops.length);
    //     console.log("Inserted 1 keys into the chest");
    //     callback(result);
    // });
};

// Wrapper function to insert data externally
var insertKeyWrapper = function(info) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertKey(info, db, function() {
            db.close();
        });
    });
};


/* ---- Key Filter ---- */
// Select a key(s) with the given condition
var filterKeys = function(condition, db, callback) {

    // Get the `keys` collection
    var collection = db.collection('chest');

    // Find some documents
    collection.find(condition).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found specific event(s) with condition " + JSON.stringify(condition, null, 2));
        console.log(docs);
        callback(docs);
    });
};


// Wrapper function returns a single key
var filterKeyWrapper = function(condition, callback) {
    MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);
        filterKeys(condition, db, function(result) {
            db.close();
            if (callback){
                callback(result);
            }
        });
    });
};


var findAllKeys = function(db, callback) {

    var collection  = db.collection('chest');

    collection.find({}).toArray(function(err, docs) {
       assert.equal(err, null);
       console.log("All of the keys: \n");
       console.log(docs);
       callback(docs);
    });
};

var findAllKeysWrapper = function(callback) {
    MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);

        findAllKeys(db, function(results) {
            db.close();
            if(callback)
                callback(results);
        });
    });
};



// so we can externally call these function
exports.insertKey = insertKeyWrapper;
exports.filterKey = filterKeyWrapper;
exports.findAllKeys = findAllKeysWrapper;