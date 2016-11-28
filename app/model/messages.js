
// Requires
var cnf = process.env.NODE_ENV == 'test' ? 'test/' : ''; // Relative config path
var database = require(`../${cnf}config/database`); // Connect test database if NODE_ENV is `test`
// ----------------------------------------------------------

// Exports
this.create = function(message, callback){
	database.query({
	  sql: 'INSERT INTO messages SET ?;',
	  values: {sender: escape(message.sender), text: escape(message.text)}
	},
	function (error, results) {
		if(typeof callback=='function') return callback(error, results);
	});
}

this.read = function(bunch, callback){
	bunch = bunch<1?1:bunch;bunch=bunch-1;
	database.query({
	  sql: 'SELECT ?? FROM messages ORDER BY ordr DESC limit ?, ?;',
	  values: [['sender', 'text'], bunch*17, 17]
	},
	function (error, results) {
		
		results.forEach( function(message) {
			message.sender = unescape(message.sender)
			message.text = unescape(message.text)
		});

		if(typeof callback=='function') return callback(error, results);
	});
}

// Test functions
this.dlo = function(callback){
	database.query({
	  sql: 'DELETE FROM messages ORDER BY time DESC limit 1;'
	},
	function (error, results) {
		if(typeof callback=='function') return callback(error, results);
	});
}
// ----------------------------------------------------------
