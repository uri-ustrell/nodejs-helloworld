const debug = require('debug')('app:bookController');
const { MongoClient, ObjectID } = require('mongodb');

function bookController(goodreadsService, nav) {
	function middleware(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect('/');
		}
	}

	function getIndex(req, res) {
		const url = 'mongodb://127.0.0.1:27017';
		const dbName = 'LibraryApp';
		(async function mongo() {
			let client;
			try {
				client = await MongoClient.connect(url);
				debug('Connected correctly to server');

				const db = client.db(dbName);
				const collection = await db.collection('books');
				const books = await collection.find().toArray();
				debug(books);
				res.render(
					'books',
					{
						nav,
						title: 'Book Shelf',
						books,
					},
				);
			} catch (err) {
				debug(err.stack);
			}

			client.close();
		}());
	}
	function getById(req, res) {
		const isbn = parseInt(req.params.isbn, 10);
		const url = 'mongodb://127.0.0.1:27017';
		const dbName = 'LibraryApp';

		(async function mongo() {
			let client;
			try {
				client = await MongoClient.connect(url);
				debug('Connected correctly to server');

				const db = client.db(dbName);
				const col = await db.collection('books');
				const book = await col.findOne({ isbn });
				debug(book);

				book.details = await goodreadsService.getBookById(book.isbn);
				res.render(
					'book',
					{
						nav,
						title: 'Book Shelf',
						book,
					},
				);
			} catch (err) {
				debug(err.stack);
			}

			client.close();
		}());
	}

	return {
		getIndex,
		getById,
		middleware,
	};
}

module.exports = bookController;
