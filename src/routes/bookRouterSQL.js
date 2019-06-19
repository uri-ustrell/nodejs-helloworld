const express = require('express');
const debug = require('debug')('app:bookRouter');
const sql = require('mssql');

const bookRouter = express.Router();

function router(nav) {
	bookRouter.route('/')
		.get((req, res) => {
			(async function query() {
				const request = new sql.Request();
				const { recordset } = await request.query('SELECT * FROM books;');
				debug(recordset);
				res.render(
					'books',
					{
						nav,
						title: 'Book Shelf',
						books: recordset,
					},
				);
			}());
		});

	bookRouter.route('/:isbn')
		.all((req, res, next) => {
			(async function query() {
				const { isbn } = req.params;
				const request = new sql.Request();
				const { recordset } = await request
					.input('isbn', sql.Int, isbn)
					.query('SELECT * FROM books WHERE isbn=@isbn');
				debug(recordset);
				[req.book] = recordset;
				next();
			}());
		})
		.get((req, res) => {
			res.render(
				'book',
				{
					nav,
					title: 'Book Shelf',
					book: req.book,
				},
			);
		});

	return bookRouter;
}

module.exports = router;
