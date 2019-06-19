
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;
const config = {
	user: 'uriustrell-root',
	password: 'myDv7hDoch8LilVfwrIq',
	server: 'uriustrell-server.database.windows.net',
	database: 'PSLibrary',
	options: { encrypt: true },
};
const NAV = [
	{ uri: '/books', title: 'Books' },
	{ uri: '/authors', title: 'Authors' },
];
const bookRouter = require('./src/routes/bookRouter')(NAV);

sql.connect(config).catch(err => debug(err));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.set('views', path.join('./src/views'));
app.set('view engine', 'ejs');

app.use('/books', bookRouter);

app.get('/', (req, res) => {
	res.render(
		'index',
		{
			nav: NAV,
			title: 'My Library',
		},
	);
});

app.listen(port, () => {
	debug(`listening on port ${chalk.green(port)}`);
});
