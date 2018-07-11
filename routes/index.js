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
var animequeries = require('./anime_queries');

/**
 * @route: /
 */
router.get('/', function(req, res, next) {

    var condition = {key_type: "IG_access_token"};

    keyqueries.filterKey(condition, function(result) {
        wallpostqueries.findAllWallPosts(function(wallresult) {
            res.render('index', {
                title: 'Home',
                keys: result,
                wallposts: wallresult,
                user: req.user
            });
        });
    });
});

/**
 *  @route: /blog
 */
router.get('/blog', function(req, res, next) {

    res.render('blog', {
        title: 'Blog'});
});

/**
 * @route: /coursehero
 */
router.get('/coursehero', function(req, res, next) {

   res.render('blogposts/coursehero', {
       title: 'Course Hero'});

});

/**
 *  @route: /register
 */
router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username, permission : 0, email: req.body.email}), req.body.password, (err, account) => {
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

/**
 * @route: /login
 */
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

/**
 * @route: /logout
 */
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

/**
 * @route: /anime_edit
 * @requires: permissions: 1
 */
router.get('/anime_edit', (req, res, next) => {

    // user isn't logged in or the user is not an admin
    if(!req.user || req.user.permission !== 1) {
        res.render('error', {
            title: "uh oh.",
            reason: "You don't have permission to view this page!"
        });
    } else {

        console.log("Finding all anime!");
        animequeries.findAllAnime(function(animes) {
            res.render('admin/anime_edit', {
                title: 'Anime Edit',
                animes: animes,
                user: req.user
            });
        });
    }
});

router.post('/animesubmit', function(req, res) {

    var info = {
        'title': req.body.title,
        'rating': req.body.rating,
        'fav_char': req.body.fav_char,
        'review': req.body.review
    };

    animequeries.insertAnime(info);


    res.end("Anime successfully posted into database.");
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


    res.end("Wall post successfully submitted into database.");

}); /// TODO: email myself wall posts for review

/* catches all error pages */
router.get('*', (req, res, next) => {
    res.render('error', {
        title: "uh oh.",
        reason: "Something went wrong, and I don't know why!"
    });
});

// Export to make this externally visible
module.exports = router;
