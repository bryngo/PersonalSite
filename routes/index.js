var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var mime = require('mime');

// import query file(s)
var keyqueries = require('./keyqueries');
var wallpostqueries = require('./wallpostqueries');

/* GET home page. */
router.get('/', function(req, res, next) {

    var condition = {key_type: "IG_access_token"};

    keyqueries.filterKey(condition, function(result) {
        wallpostqueries.findAllWallPosts(function(wallresult) {
            res.render('index', {
                title: 'Home',
                keys: result,
                wallposts: wallresult
            });
        });
    });
});

/* For submitting a message from the home page */
router.post('/wallsubmit', function(req, res) {

    var info = {
        'name': req.body.msg_name,
        'email': req.body.msg_email,
        'message': req.body.msg_messsage
    };

    wallpostqueries.insertWallPost(info);
    wallpostqueries.findAllWallPosts();


    res.end("Wall post successfully submitted into database")
});


// Export to make this externally visible
module.exports = router;
