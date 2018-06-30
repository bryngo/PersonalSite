var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';


/* ---- Admin insertion ---- */
// Inserts many admins
var insertAdmin = function(info, db, callback) {

    var collection = db.collection('admins');

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
var insertAdminWrapper = function(info) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        insertAdmin(info, db, function() {
            client.close();
        });
    });
};


/* ---- Admin Filter ---- */
// Select admin(s) with the given condition
var filterAdmins = function(condition, db, callback) {

    var collection = db.collection('admins');

    // Find some documents
    collection.find(condition).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};


// Wrapper function returns a single key
var filterAdminWrapper = function(condition, callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        filterAdmins(condition, db, function(result) {
            client.close();
            if (callback){
                callback(result);
            }
        });
    });
};


var findAllAdmins = function(db, callback) {

    var collection = db.collection('admins');

    collection.find({}).toArray(function(err, docs) {
       assert.equal(err, null);
       callback(docs);
    });
};

var findAllAdminsWrapper = function(callback) {
    MongoClient.connect(url, function(err, client) {

        var db = client.db('Lightning');

        assert.equal(null, err);
        findAllAdmins(db, function(results) {
            client.close();
            if(callback)
                callback(results);
        });
    });
};



// so we can externally call these function
exports.insertAdmin = insertAdminWrapper;
exports.filterAdmin = filterAdminWrapper;
exports.findAllAdmins = findAllAdminsWrapper;