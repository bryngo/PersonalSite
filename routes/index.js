var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var mime = require('mime');

const passport = require('passport');
const Account = require('../models/account');

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

/* GET blog page. */
router.get('/blog', function(req, res, next) {

    res.render('blog', {title: 'Blog'});
});

/* GET blog/coursehero */
router.get('/blog/coursehero', function(req, res, next) {

   res.render('blog', {title: 'Blog'});

});

/* GET registration page */
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
            return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

/* GET login page */
router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

/* GET logout page */
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
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

}); /// TODO: email myself wall posts for review


// Export to make this externally visible
module.exports = router;
