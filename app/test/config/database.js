
// Requires
var mysql = require('mysql');
// ----------------------------------------------------------

// Connection info
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'mahdi',
  database : 'test_xte'
});
// ----------------------------------------------------------

// Exports
module.exports = (function() {
	// connection.connect(function(error) {
	//   if (error) {
	//     console.error('Mysql error connecting -> ' + error.stack);
	//     return;
	//   }
	//   console.log('Mysql connected as id -> ' + connection.threadId);
	// });

	return connection;
})()
// ----------------------------------------------------------

// Close database connection
// connection.end(function(err) {
// 	console.log('Mysql connection closed');
// });
// ----------------------------------------------------------
