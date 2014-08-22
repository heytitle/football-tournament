// Example model
require('../../app/models/match');

var mongoose = require('mongoose');
var Match = mongoose.model('Match');
var Schema = mongoose.Schema;

var TeamSchema = new Schema(
    {
        name: String,
        win: Number,
        lose: Number,
        draw: Number,
        goal_for: Number,
        goal_against: Number,
    },
    { collection: 'team' }
);

//TeamSchema.methods.afterMatch = function( myGoal, opponentGoal, callback ) {
    //var matchStatus = { draw: 1 };

    //if( myGoal < opponentGoal ) {
        //matchStatus = { lose: 1 };
    //} else if ( myGoal > opponentGoal ) {
        //matchStatus = { win: 1 };
    //}

    //console.log('----------- After --- %s', this.name );

    //this.model('Team').findOneAndUpdate(
        //{ name: new RegExp( this.name, 'i') },
        //{
            //$inc: {
                //win: 1,
                //goal_for: myGoal,
                //goal_against: opponentGoal
            //}
            ////'$inc' : matchStatus,
            ////'$inc' : {  },
            ////'$inc' : {  }
        //},
        //function( err, team ) {
            //console.log('>>>>>>> '+team);
        //}
    //);
//}

//TeamSchema.statics.updateAfterMatch = function( name, myGoal, opponentGoal, callback ) {
    //this.findOne( { name: new RegExp(name, 'i') }, function( err, team ) {
        //team.afterMatch( myGoal, opponentGoal, callback );
    //});
//}
//
TeamSchema.statics.updateLeagueTable = function( name, callback ) {
    var overall = [];

    Match.findMatchFinish( { home: name }, function( err, matches ) {
        matches.forEach( function(m) {
            overall.push( m.teamResult( 0 ) );
        });

        Match.findMatchFinish( { away: name }, function( err, matches ) {
            matches.forEach( function(m) {
                overall.push( m.teamResult( 1 ) );
            });

            // Sum up
            var result = {
                win: 0,
                lose: 0,
                draw: 0,
                goal_for: 0,
                goal_against: 0
            };

            var keys = Object.keys(result);

            for( var i = 0; i < overall.length; i++ ) {
                var m = overall[i];
                for( var k = 0; k < keys.length; k++ ) {
                    var key_name = keys[k];
                    if( m[key_name] ) {
                        result[key_name] = result[key_name] + m[key_name];
                    }
                }
            }
            // End sum

            callback( result );
        });

    });
}

mongoose.model('Team', TeamSchema);
