require('../../app/models/team');
require('../../app/models/match');
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Schema = mongoose.Schema;

var LeagueSchema = new Schema(
    {
        name: String,
        date: String,
        teams: Schema.Types.Mixed,
    },
    { collection: 'league' }
);


LeagueSchema.statics.matchFinish = function ( match, callback ) {
    var league = this;

    updateTeam( league, match.home, function( ) {
        updateTeam( league, match.away, callback);
    });
}

LeagueSchema.statics.leagueTable = function( callback ) {
    this.findOne( { }, function( err, league ) {
        var teams = league.teams
        var keys = Object.keys(teams);
        var teamsArray =[];
        for( var i = 0; i < keys.length; i++ ) {
            var name = keys[i];
            var team = league.teams[name];
            team.name = name;

            team.score = 0;
            if( team.win ) {
                team.score = team.score + team.win*3;
            }

            if( team.draw ) {
                team.score = team.score + team.draw;
            }

            team.total_goal = team.goal_for - team.goal_against || 0;

            teamsArray.push(team);
        }
        teamsArray.sort(sortLeague).reverse();
        league.teams = teamsArray;
        callback(league);
    });
}

mongoose.model('League', LeagueSchema);

function updateTeam( league, team_name, callback ) {
    // Home update
    Team.updateLeagueTable( team_name, function( res ){
        var key = 'teams.'+team_name;
        var updated = {};
        updated[key] = res;
        league.model('League').findOneAndUpdate(
            { name: new RegExp( this.name, 'i') },
            updated,
            callback
        );
    });
}

function sortLeague(a, b) {
    if( a.score > b.score )
        return -1
    if( a.score < b.score )
        return 1
    if( a.total_goal > b.total_goal )
        return -1
    if( a.total_goal < b.total_goal )
        return 1
    return 0;
}

