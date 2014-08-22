// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MatchSchema = new Schema(
    {
        stadium: String,
        time: String,
        home: String,
        away: String,
        referee: String,
        home_score: Array,
        away_score: Array,
        finished: Boolean
    },
    { collection: 'match' }
);

MatchSchema.statics.fixture = function ( callback ) {
    return this.model('Match').find( function( err, matches ) {
        matches.sort(sortByTimeAndStadium);
        callback( err, matches );
    });
};

MatchSchema.methods.teamResult = function( side ) {
    var res = {
        goal_for: 0,
        goal_against: 0
    };
    var teams = ['home','away'];
    var myTeam = teams[side];

    res.goal_for = this[myTeam+'_score'].length;

    var opponentTeam = teams[ Math.abs( side - 1 ) ];
    res.goal_against = this[opponentTeam+'_score'].length;

    if( res.goal_for < res.goal_against ) {
        res.lose = 1;
    }else if( res.goal_for > res.goal_against ) {
        res.win = 1;
    }else {
        res.draw = 1;
    }

    return res;
}

MatchSchema.statics.findMatchFinish = function ( query, callback ) {
    query['finished'] = true;

    return this.model('Match').find( query, function( err, matches ) {
        callback( err, matches );
    });
};

mongoose.model('Match', MatchSchema);

function sortByTimeAndStadium(a, b) {
    var timeA = parseFloat(a.time.replace(/:/,'.'));
    var timeB = parseFloat(b.time.replace(/:/,'.'));

    if ( timeA < timeB )
        return -1;
    if ( timeA > timeB )
        return 1;

    if( a.stadium < b.stadium )
        return -1;
    if( a.stadium > b.stadium )
        return 1;
    return 0;
}

