
export DB_NAME="xit";

mongo $DB_NAME --eval "db.dropDatabase()"

mongoimport --db $DB_NAME --collection league --type json --file data/leagues.json --jsonArray
mongoimport --db $DB_NAME --collection team --type csv --file data/teams.csv --headerline
mongoimport --db $DB_NAME --collection match --type csv --file data/matches.csv --headerline
