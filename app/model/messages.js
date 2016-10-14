
// Requires
var cnf = process.env.NODE_ENV == 'test' ? 'test/' : ''; // Relative config path
var database = require(`../${cnf}config/database`); // Connect test database if NODE_ENV is `test`
var express = require('express');
var server = require('http').createServer(express);
var io = require('socket.io')(server); server.listen(7620);
// ----------------------------------------------------------

// Exports
this.create = function(message, callback){
	database.query({
	  sql: 'INSERT INTO messages SET ?;',
	  values: {sender: message.sender, text: message.text}
	},
	function (error, results) {
		io.emit('message', {status:0, data:message});
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

// Test functions
this.dlo = function(callback){
	database.query({
	  sql: 'DELETE FROM messages ORDER BY time DESC limit 1;'
	},
	function (error, results) {
		callback(error, results);
	});
}
// ----------------------------------------------------------
