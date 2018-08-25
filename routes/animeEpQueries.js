var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';

/* ---- Anime Episode insertion ---- */
// Inserts many anime episodes
var insertAnimeEpisode = function(info, db, callback) {

    var collection = db.collection('anime_ep');

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
var insertAnimeEpisodeWrapper = function(info) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        insertAnimeEpisode(info, db, function() {
            client.close();
        });
    });
};

/* ---- Anime Episode Filter ---- */
// Select anime episode(s) with the given condition
var filterAnimeEpisode = function(condition, db, callback) {

    var collection = db.collection('anime_ep');

    // Find some documents
    collection.find(condition).sort({ epNumber: 1}).toArray(function(err, docs) {
      assert.equal(err, null);

      if(callback)
        callback(docs);
    });
};


// Wrapper function returns a single key
var filterAnimeEpisodeWrapper = function(condition, callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        filterAnimeEpisode(condition, db, function(result) {
            client.close();
            if (callback){
                callback(result);
            }
        });
    });
};


var findAllAnimeEpisode = function(db, callback) {

    var collection = db.collection('anime_ep');

    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);


        callback(docs);
    });
};

var findAllAnimeEpisodeWrapper = function(callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        findAllAnimeEpisode(db, function(results) {

          client.close();
            if(callback)
                callback(results);
        });
    });
};

var updateOneAnimeEpisode = function(condition, newField, db, callback) {

  var collection = db.collection('anime_ep');

  // only overwrites the passed in fields
  collection.updateOne(
    condition,
    {$set : newField},
    function(err, result) {

      assert.equal(err, null);
      console.log("Entry successfully updated");

      callback(result);
    });

};

var updateOneAnimeEpisodeWrapper = function(condition, newField) {
  MongoClient.connect(url, function(err, client) {

    var db = client.db('Lightning');

    assert.equal(null, err);

    updateOneAnimeEpisode(condition, newField, db, function() {
      client.close();
    });

  });
};

var removeAnimeEpisode = function(condition, db, callback) {

  var collection = db.collection('anime_ep');

  collection.remove(condition, function(err, results) {
    assert.equal(err, null);

    if(callback)
      callback(results);
  })

};

var removeAnimeEpisodeWrapper = function(condition) {
  MongoClient.connect(url, function(err, client) {

    var db = client.db('Lightning');

    assert.equal(null, err);

    removeAnimeEpisode(condition, db, function() {
      client.close();
    });

  });
};

// so we can externally call these function
exports.insertAnimeEpisode    = insertAnimeEpisodeWrapper;
exports.filterAnimeEpisode    = filterAnimeEpisodeWrapper;
exports.findAllAnimeEpisode   = findAllAnimeEpisodeWrapper;
exports.updateOneAnimeEpisode = updateOneAnimeEpisodeWrapper;
exports.removeAnimeEpisode    = removeAnimeEpisodeWrapper;