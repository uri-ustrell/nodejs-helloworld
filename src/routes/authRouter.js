const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
	authRouter.route('/signUp')
		.post((req, res) => {
			const { username, password } = req.body;
			const url = 'mongodb://127.0.0.1:27017';
			const dbName = 'LibraryApp';

			(async function addUser() {
				let client;

				try {
					client = await MongoClient.connect(url);
					debug('connected correctly to db');

					const db = client.db(dbName);
					const col = db.collection('users');
					const user = { username, password };
					const response = await col.insertOne(user);
					debug(response.ops[0]);

					req.login(response.ops[0], () => {
						res.redirect('/auth/profile');
					});
				} catch (error) {
					debug(error);
				}

				client.close();
			}());
		});

	authRouter.route('/signin')
		.get((req, res) => {
			res.render('signin',
				{
					nav,
					title: 'Sign In',
				});
		})
		.post(passport.authenticate('local',
			{
				successRedirect: '/books',
				failureRedirect: '/',
			}));
	authRouter.route('/profile')
		.all((req, res, next) => {
			if (req.user) {
				next();
			} else {
				res.redirect('/');
			}
		})
		.get((req, res) => {
			res.json(req.user);
		});
	authRouter.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});
	return authRouter;
}

module.exports = router;
