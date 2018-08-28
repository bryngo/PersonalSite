// https://mongodb.github.io/node-mongodb-native/2.2/quick-start/
//
// required modules
//
// main function that handles the query part of input
// function queryServer(request, response, search)

/*
This file is used for run-onces. Eventually, it should be used to set up all necessary data to start the website off

 */

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
        callback(docs);
    });
};


/* --- Variable Filter --- */
var getVariable = function(variable, db, callback) {
  var collection = db.collection('variables');

  collection.find({}).toArray(function(err, vars) {
    assert.equal(err, null);
    callback(vars[0]);
  });

};

var insertVariable = function(info, db, callback) {
  var collection = db.collection('variables');

  collection.find({}).toArray(function(err, docs) {

    if(docs.length === 0) {
      collection.insertOne(info, function(err, results) {
        console.log("Fresh insert complete");
        callback(results);
      });
    } else {
      collection.updateOne(
        docs[0],
        {$set: info},
        function (err, result) {
          console.log("Updated variables");
          callback(result);
        });
    }
  });
};

// initial set up.`node setup.js` to run
MongoClient.connect(url, function(err, client) {

    var db = client.db('Lightning');

    var blogCategories = {
      "blogCategories":
        {'miscellaneous'  : 'Just some random stuff',
        'technology'      : 'how 2 code',
        'food'            : 'Is food porn nsfw?',
        'anime'           : 'Watch me become a weeb',
        'movies'          : 'Couple minutes of writing for hours of entertainment.',
        'tv-shows'        : 'Binge worthy, for sure.'}
    };

    insertVariable(blogCategories, db, function(){
      client.close();
    });
});
