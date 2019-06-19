const express = require('express');
const bookController = require('../controllers/bookController');
const goodreadsService = require('../services/goodreadsService');

const bookRouter = express.Router();

function router(nav) {
	const { getIndex, getById, middleware } = bookController(goodreadsService, nav);
	bookRouter.use(middleware);
	bookRouter.route('/')
		.get(getIndex);

	bookRouter.route('/:isbn')
		.get(getById);

	return bookRouter;
}

module.exports = router;
