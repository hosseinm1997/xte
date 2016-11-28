
// Requires
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
require('./library/prototype')
require('./plugin/telegram_bot/index')
// ----------------------------------------------------------

// Confings
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.png'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', require('./route/api'));
// ----------------------------------------------------------

// Routes
app.get('/', function (request, response) {
	response.render('index');
});
// ----------------------------------------------------------

// Start point
app.listen(80, function () {
	console.log('xte is running on',process.env.NODE_ENV || 'development',
		'enviroment', `@ 127.0.0.1`);
});
// ----------------------------------------------------------
