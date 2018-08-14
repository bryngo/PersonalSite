var fs = require('fs');
var util = require('util');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
assert = require('assert');

// Connection url
var url = 'mongodb://localhost';


/* --- Variable Filter --- */
var getVariable = function(variable, db, callback) {
  var collection = db.collection('variables');

  collection.find({}).toArray(function(err, vars) {
    assert.equal(err, null);
    callback(vars[0]);
  });

};

/**
 * Variable here is used to indicate which variable to grab from the db
 *
 * @param variable
 * @param callback
 */
var getVariableWrapper = function(variable, callback) {
  MongoClient.connect(url, function(err, client) {
    var db = client.db('Lightning');

    assert.equal(null, err);
    getVariable(variable, db, function(result) {
      client.close();
      if(callback) {
        callback(result[variable]);
      }
    });
  });
};


// so we can externally call these function
exports.getVariable     = getVariableWrapper;
