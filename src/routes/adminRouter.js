const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');

const adminRouter = express.Router();
const books = [
	{
		title: 'Guerra i Pau',
		genre: 'Historical Fiction',
		author: 'Lev Nikolayevich Tolstoy',
		isbn: 9780192833983,
		read: false,
	},
	{
		title: 'Els misarables',
		genre: 'Musical',
		author: 'Victor Hugo',
		isbn: 9780375403170,
		read: false,
	},
	{
		title: 'The Time Machine',
		genre: 'Science Fiction',
		author: 'H. G. Wells',
		isbn: 9780451528551,
		read: false,
	},
];

function router(nav) {
	adminRouter.route('/')
		.get((req, res) => {
			const url = 'mongodb://127.0.0.1:27017';
			const dbName = 'LibraryApp';
			(async function mongo() {
				let client;
				try {
					client = await MongoClient.connect(url);
					debug('Connected correctly to server');

					const db = client.db(dbName);
					const response = await db.collection('books').insertMany(books);
					res.json(response);
				} catch (err) {
					debug(err.stack);
				}

				client.close();
			}());
		});
	return adminRouter;
}

module.exports = router;
