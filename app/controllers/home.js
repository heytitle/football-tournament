var express = require('express');
var  router = express.Router();
var  mongoose = require('mongoose');
var  Team = mongoose.model('Team');
var  Match = mongoose.model('Match');
var  Article = mongoose.model('Article');
var  League = mongoose.model('League');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    League.leagueTable( function( table ) {
        res.render('index',{
            teams: table
        });
    });
});

router.get('/fixture', function (req, res, next) {
    Match.fixture( function( err, matches ) {
        res.render('admin/matches',{
            matches: matches
        });
    });
});

router.get( '/admin', function( req, res, next ) {
    Match.fixture( function( err, matches ) {
        if (err) return next(err);

        res.render('admin/matches', {
            matches: matches,
            isEditable: true
        });
    });
});

router.get('/admin/edit/:id', function( req, res, next ) {
    var matchID = req.param('id');

    Match.findById( matchID, function( err, match ) {
        if (err) return next(err);

        res.render('admin/matches-edit', {
            match: match,
            isSave: req.param('saved')
        });
    });

});

router.post('/admin/match/save', function( req, res, next ) {
    var matchID = req.param('matchID');
    var home_team = req.param('home_team');
    var away_team = req.param('away_team');

    var home_score = parseInt(req.param('home_score'));
    var away_score = parseInt(req.param('away_score'));

    var updated = {
        home_score: new Array(home_score),
        away_score: new Array(away_score),
        finished: true
    };


    Match.findByIdAndUpdate( matchID, updated, function( err, match ) {
        // TODO: update league table
        League.matchFinish( match, function(){
            res.redirect( '/admin/edit/' + match.id + '?saved=1' );
        });

    });

});

