var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';

/* ---- Wall Post insertion ---- */
// Inserts many wall posts
var insertWallPost = function(info, db, callback) {

    // Get `wallposts` collection
    var collection = db.collection('wallposts');
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
var insertWallPostWrapper = function(info) {

    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        insertWallPost(info, db, function() {
            client.close();
        });
    });
};

/* ---- Wall Post Filter ---- */
// Select wall post(s) with the given condition
var filterWallPosts = function(condition, db, callback) {

    // Get the `wallposts` collection
    var collection = db.collection('wallposts');

    // Find some documents
    collection.find(condition).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

// Wrapper function returns a single wall post
var filterWallPostWrapper = function(condition, callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        filterWallPosts(condition, db, function(result) {
            client.close();
            if (callback){
                callback(result);
            }
        });
    });
};

/* --- Find All Wall Posts --- */
// Select all wall posts, no condition(s)
var findAllWallPosts = function(db, callback) {

    var collection  = db.collection('wallposts');

    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

// Wrapper function to return all wall posts
var findAllWallPostsWrapper = function(callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);

        findAllWallPosts(db, function(results) {
            client.close();
            if(callback)
                callback(results);
        });
    });
};



// so we can externally call these function
exports.insertWallPost = insertWallPostWrapper;
exports.filterWallPost = filterWallPostWrapper;
exports.findAllWallPosts = findAllWallPostsWrapper;