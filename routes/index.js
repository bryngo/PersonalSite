var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var mime = require('mime');

// import query file(s)
var keyqueries = require('./keyqueries');

/* GET home page. */
router.get('/', function(req, res, next) {

    var condition = {key_type: "IG_access_token"};

    keyqueries.filterKey(condition, function(result) {

       res.render('index', {
           title: 'Home',
           keys: result
       });
    });
});

// Export to make this externally visible
module.exports = router;
