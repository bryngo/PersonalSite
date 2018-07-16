var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';

/* ---- Anime insertion ---- */
// Inserts many anime
var insertAnime = function(info, db, callback) {

    var collection = db.collection('anime');

    // Insert some documents
    collection.insertMany([
        info
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        callback(result);
    });
};

// Wrapper function to insert data externally
var insertAnimeWrapper = function(info) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        insertAnime(info, db, function() {
            client.close();
        });
    });
};

/* ---- Anime Filter ---- */
// Select anime(s) with the given condition
var filterAnime = function(condition, db, callback) {

    var collection = db.collection('anime');

    // Find some documents
    collection.find(condition).toArray(function(err, docs) {
      assert.equal(err, null);

      if(callback)
        callback(docs);
    });
};


// Wrapper function returns a single key
var filterAnimeWrapper = function(condition, callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        filterAnime(condition, db, function(result) {
            client.close();
            if (callback){
                callback(result);
            }
        });
    });
};


var findAllAnime = function(db, callback) {

    var collection = db.collection('anime');

    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);


        callback(docs);
    });
};

var findAllAnimeWrapper = function(callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        findAllAnime(db, function(results) {

          client.close();
            if(callback)
                callback(results);
        });
    });
};

var updateOneAnime = function(condition, newField, db, callback) {

  var collection = db.collection('anime');

  collection.updateOne(
    condition,
    {$set : newField},
    function(err, result) {

      assert.equal(err, null);
      console.log("Entry successfully updated");

      callback(result);
    });

};

var updateOneAnimeWrapper = function(condition, newField) {
  MongoClient.connect(url, function(err, client) {

    var db = client.db('Lightning');

    assert.equal(null, err);

    updateOneAnime(condition, newField, db, function() {
      client.close();
    });

  });
};

var removeOneAnime = function(condition, db, callback) {

  var collection = db.collection('anime');

  collection.remove(condition, function(err, results) {
    assert.equal(err, null);

    if(callback)
      callback(results);
  })

};

var removeOneAnimeWrapper = function(condition) {
  MongoClient.connect(url, function(err, client) {

    var db = client.db('Lightning');

    assert.equal(null, err);

    removeOneAnime(condition, db, function() {
      client.close();
    });

  });
};

// so we can externally call these function
exports.insertAnime    = insertAnimeWrapper;
exports.filterAnime    = filterAnimeWrapper;
exports.findAllAnime   = findAllAnimeWrapper;
exports.updateOneAnime = updateOneAnimeWrapper;
exports.removeOneAnime = removeOneAnimeWrapper;