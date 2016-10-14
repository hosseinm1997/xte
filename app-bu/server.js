
// Variables
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// ----------------------------------------------------------

// Confings
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// ----------------------------------------------------------

// Requires
app.use('/api', require('./route/api'));
// ----------------------------------------------------------

// Routes
app.get('/', function (request, response) {
	response.render('index');
});
// ----------------------------------------------------------

// Start point
app.listen(80, function () {
	console.log('Xte is running on 127.0.0.1');
});
// ----------------------------------------------------------