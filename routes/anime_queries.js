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

          console.log("Found " + JSON.stringify(results, null, 1));

          client.close();
            if(callback)
                callback(results);
        });
    });
};


// so we can externally call these function
exports.insertAnime = insertAnimeWrapper;
exports.filterAnime = filterAnimeWrapper;
exports.findAllAnime = findAllAnimeWrapper;