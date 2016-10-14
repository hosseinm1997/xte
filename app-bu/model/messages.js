
// Requires
var database = require('../config/database');
// ----------------------------------------------------------

// Exports
this.create = function(message, callback){
	database.query({
	  sql: 'INSERT INTO messages SET ?;',
	  values: {sender: message.sender, text: message.text}
	},
	function (error, results) {
		callback(error, results);
	});
}

this.read = function(bunch, callback){
	bunch = bunch<1?1:bunch;bunch=bunch-1;
	database.query({
	  sql: 'SELECT ?? FROM messages ORDER BY time DESC limit ?, ?;',
	  values: [['sender', 'text'], bunch*17, 17]
	},
	function (error, results) {
		callback(error, results);
	});
}
// ----------------------------------------------------------
