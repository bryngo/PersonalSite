var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var mime = require('mime');
var ObjectID = require('mongodb').ObjectID;
var dateFormat = require('dateformat');

// HTML to md or md to HTML
var showdown = require('showdown');
var converter = new showdown.Converter({strikethrough: true});

var html2jade = require('html2jade');

const passport = require('passport');
const Account = require('../models/account');

// import query file(s)
var keyqueries = require('./keyqueries');
var wallpostqueries = require('./wallpostqueries');
var animequeries = require('./animeQueries');
var animeEpQueries = require('./animeEpQueries');
var variableQueries = require('./variablesQueries');

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
          user: req.user,
        });
      });
    });
});

/**
 *  @route: /blog
 */
router.get('/blog', function(req, res, next) {

  variableQueries.getVariable('blogCategories', function(result) {

    console.log(Object.keys(result));

    res.render('blogPosts/blog', {
      title: 'Blog',

      // for some reason, Object.keys doesn't really work in the jade file :(
      blogCategories: Object.keys(result),
      blogDescriptions: result
    });
  });
});

router.get('/anime', function(req, res, next) {

  animequeries.findAllAnime(function (animes) {
    variableQueries.getVariable('blogCategories', function (blogCategories) {

      // this can be optimized later. Instead of formatting the input here, maybe
      // store the formatted description in the collection

      animes.forEach(function(anime) {

        anime.review = converter.makeHtml(anime.review.substr(0, 250) + '...');

      });

      res.render('blogPosts/animeLanding', {
        title             : 'Anime Reviews',
        animeKey          : 'anime',
        blogCategories    : Object.keys(blogCategories),
        blogDescriptions  : blogCategories,
        animes            : animes
      });
    });
  });
});

/**
 * @route: /coursehero
 */
router.get('/coursehero', function(req, res, next) {

   res.render('blogPosts/coursehero', {
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

router.get('/photos', function(req, res, next) {

  variableQueries.getVariable('blogCategories', function(result) {

    res.render('photography', {
      title: 'Photography'
    });
  });
});

/**
 * @route: /animeEdit
 * @requires: permissions: 1
 */
router.get('/animeEdit', (req, res, next) => {

  if(!isAdmin(req)) {
    res.render('error', {
      title: "uh oh.",
      reason: "You don't have permission to view this page!"
    });
  }

  var displayedAnimeID = req.query.animeID;

  var condition = '';
  if(displayedAnimeID) {
    condition = {
      '_id': ObjectID(displayedAnimeID)
    };
  } else {

    // because we don't want to grab existing data if we didn't request it
    condition = {
      '_id': ObjectID(0)
    };
  }

  animequeries.filterAnime(condition, function(displayedAnime){
    animequeries.findAllAnime(function(animes) {
      res.render('admin/animeEdit', {
        title           : 'Anime Edit',
        animes          : animes,
        user            : req.user,
        displayedAnime  : displayedAnime[0] || []
      });
    });
  });
});

router.post('/animesubmit', function(req, res) {

  var today = getTodayDate();
  var dateUTC = dateFormat(new Date(), 'isoUtcDateTime');

  // TODO: Implement the number of likes per blog post
  var info = {
    'title'             : decodeURIComponent(req.body.title),
    'rating'            : decodeURIComponent(req.body.rating),
    'fav_char'          : decodeURIComponent(req.body.fav_char),
    'review'            : decodeURIComponent(req.body.review),
    'last_modified'     : today,
    'last_modified_UTC' : dateUTC,
    'wallpaper'         : decodeURIComponent(req.body.wallpaper),
    'blog_tags'         : ['anime'],
  };

  // if we're updating an existing entry
  if(decodeURIComponent(req.body.animeID)) {

    let condition = {
      '_id': ObjectID(decodeURIComponent(req.body.animeID))
    };

    animequeries.updateOneAnime(condition, info);

  } else {

    animequeries.insertAnime(info);

  }

  res.end("Anime successfully posted into database.");
});

router.post('/animedelete', function(req, res) {

  if(!req.body.animeID) {
    res.render('error', {
      title: "uh oh.",
      reason: "Something went wrong, and I don't know why!"
    });
  }

  let condition = {
    '_id': ObjectID(req.body.animeID)
  };

  let parentCondition = {
    'parentId' : req.body.animeID
  };

  animequeries.removeOneAnime(condition);
  animeEpQueries.removeAnimeEpisode(parentCondition);


  res.end("Anime successfully removed from the database");
});

router.post('/animemodify', function(req, res) {

  // no anime ID passed in for some reason
  if(!req.body.animeID) {
    res.render('error', {
      title: "uh oh.",
      reason: "Something went wrong, and I don't know why!"
    });
  }

  let condition = ObjectID(req.body.animeID);

  animequeries.filterAnime(condition, function(anime) {
      res.end(JSON.stringify(anime));
    });
});

/**
 * @route: /animeEpEdit
 * @requires: permission: 1
 */
router.get('/animeEpEdit', function(req, res) {

  if(!isAdmin(req)) {
    res.render('error', {
      title: "uh oh.",
      reason: "You don't have permission to view this page!"
    });
  }

  let condition = ObjectID(req.query.parentID);
  let parentAnime = {
    'parentId' : req.query.parentID
  };

  var displayedAnimeEpID = req.query.episodeID;
  var displayedAnimeCond = '';
  if(displayedAnimeEpID) {
    displayedAnimeCond = {
      '_id': ObjectID(displayedAnimeEpID)
    };
  } else {
    // because we don't want to grab existing data if we didn't request it
    displayedAnimeCond = {
      '_id': ObjectID(0)
    };
  }

  animeEpQueries.filterAnimeEpisode(displayedAnimeCond, function (displayedAnimeEp) {
    animequeries.filterAnime(condition, function(anime) {
      animeEpQueries.filterAnimeEpisode(parentAnime, function(episodes) {
          res.render('admin/animeEpEdit', {
          title             : 'Anime Episode Edit',
          animeParent       : anime[0],
          parentId          : req.query.parentID,
          episodes          : episodes,
          displayedAnimeEp  : displayedAnimeEp[0] || []
        });
      });
    });
  });

  // }

});

router.post('/animeEpSubmit', function(req, res) {

  var today = getTodayDate();

  var info = {
    'epNumber'      : parseInt(decodeURIComponent(req.body.epNumber)),
    'epRating'      : decodeURIComponent(req.body.epRating),
    'epReview'      : decodeURIComponent(req.body.epReview),
    'parentId'      : decodeURIComponent(req.body.parentID),
    'last_modified' : today
  };

  // if we're updating an existing entry
  if(decodeURIComponent(req.body.episodeID)) {

    let condition = {
      '_id': ObjectID(decodeURIComponent(req.body.episodeID))
    };

    animeEpQueries.updateOneAnimeEpisode(condition, info);

  } else {
    animeEpQueries.insertAnimeEpisode(info);

  }
  res.end('Anime Episode Successfully uploaded to db');
});

router.post('/animeEpDelete', function(req, res) {

  if(!req.body.episodeID) {
    res.render('error', {
      title: "uh oh.",
      reason: "Something went wrong, and I don't know why!"
    });
  }

  let condition = {
    '_id': ObjectID(req.body.episodeID)
  };


  animeEpQueries.removeAnimeEpisode(condition);

  res.end("Anime episode successfully removed from the database");

});

router.post('/animeEpModify', function(req, res) {

  // no _id passed in for some reason
  if(!req.body.episodeID || !isAdmin(req)) {
    res.render('error', {
      title: "uh oh.",
      reason: "Something went wrong, and I don't know why!"
    });
  }

  let condition = ObjectID(req.body.episodeID);

  animeEpQueries.filterAnimeEpisode(condition, function(animeEp) {
    res.end(JSON.stringify(animeEp));
  });
});

router.get('/single-anime', function(req, res) {

  var parentID = req.query.parentID;

  // if there's no parent id to grab all the anime
  if(!parentID) {
    res.render('error', {
      title: "uh oh.",
      reason: "Something went wrong, and I don't know why!"
    });
  }

  var condition  = ObjectID(req.query.parentID);
  var parentAnime = {
    'parentId' : req.query.parentID
  };

  variableQueries.getVariable('blogCategories', function(blogCategories) {
    animequeries.filterAnime(condition, function(anime) {
      animeEpQueries.filterAnimeEpisode(parentAnime, function(episodes) {


        anime[0].review = converter.makeHtml(anime[0].review);

        episodes.forEach(function(ep) {
          ep.epReview = converter.makeHtml(ep.epReview);
        });

        res.render('blogPosts/single', {
          title           : anime[0]['title'] + " Review",
          episodes        : episodes,
          anime           : anime[0],
          blogCategories  : Object.keys(blogCategories),
          blogDescriptions: blogCategories
        });
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


    res.end("Wall post successfully submitted into database.");

}); /// TODO: email myself wall posts for review


/* catches all error pages */
router.get('*', (req, res, next) => {
    res.render('error', {
        title: "uh oh.",
        reason: "Something went wrong, and I don't know why!"
    });
});

function getTodayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd = '0'+dd
  }

  if(mm<10) {
    mm = '0'+mm
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

/**
 * Returns true if a user is an admin
 * @param req
 * @returns {boolean}
 */
function isAdmin(req) {

  return !(!req.user || req.user.permission !== 1);

}


// Export to make this externally visible
module.exports = router;
