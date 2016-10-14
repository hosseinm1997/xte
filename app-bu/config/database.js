
// Requires
var mysql = require('mysql');
// ----------------------------------------------------------

// Connection info
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'mahdi',
  database : 'xte'
});
// ----------------------------------------------------------

// Exports
module.exports = (function() {
	connection.connect(function(err) {
	  if (err) {
	    console.error('Mysql error connecting -> ' + err.stack);
	    return;
	  }
	  console.log('Mysql connected as id -> ' + connection.threadId);
	});

	return connection;
})()
// ----------------------------------------------------------

// Close database connection
// connection.end(function(err) {
// 	console.log('Mysql connection closed');
// });
// ----------------------------------------------------------
