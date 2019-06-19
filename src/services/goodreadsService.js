const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({ explicitArray: false });

function goodreadsService() {
	function getBookById(isbn) {
		return new Promise((resolve, reject) => {
			debug(`I'm goodreadsService -> about o axios.get() ${isbn}`);
			axios.get(`https://www.goodreads.com/book/isbn/${isbn}?key=28CuE2rQb9pcoIIhhxh6hw`)
				.then((response) => {
					parser.parseString(response.data, (error, result) => {
						if (error) {
							debug(error);
						} else {
							debug(result);
							resolve(result.GoodreadsResponse.book);
						}
					});
				})
				.catch((error) => {
					reject(error);
					debug(error);
				});
		});
	}

	return { getBookById };
}

module.exports = goodreadsService();
