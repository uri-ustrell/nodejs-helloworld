const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

function localStrategy() {
	passport.use(new Strategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		(username, password, done) => {
			const url = 'mongodb://127.0.0.1:27017';
			const dbName = 'LibraryApp';

			(async function mongo() {
				let client;

				try {
					client = await MongoClient.connect(url);
					debug('connected correctly to db');

					const db = client.db(dbName);
					const col = db.collection('users');
					const user = await col.findOne({ username });

					if (user.password === password) {
						done(null, user);
					} else {
						done(null, false);
					}
				} catch (error) {
					debug(error.stack);
				}

				client.close();
			}());
		},
	));
}

module.exports = localStrategy;
