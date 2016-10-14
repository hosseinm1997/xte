
// Requires
var cnf = process.env.NODE_ENV == 'test' ? 'test/' : ''; // Relative config path
var database = require(`../${cnf}config/database`); // Connect test database if NODE_ENV is `test`
var express = require('express');
var server = require('http').createServer(express);
var io = require('socket.io')(server); server.listen(7625);
// ----------------------------------------------------------

// Exports
this.create = function(guy, callback){
	database.query({
	  sql: 'INSERT INTO online_guys SET ?;',
	  values: {fullname: guy}
	},
	function (error, results, fields) {
		io.emit('guyOn', {status:0, data:{fillname:guy}});
		callback(error, results);
	});
}

this.read = function(callback){
	database.query({
	  sql: 'SELECT ?? FROM online_guys',
	  values: ['fullname']
	},
	function (error, results, fields) {
		callback(error, results);
	});
}

this.delete = function(guy, callback){
	database.query({
	  sql: 'DELETE FROM online_guys WHERE fullname = ?;',
	  values: guy
	},
	function (error, results, fields) {
		io.emit('guyOff', {status:0, data:{fillname:guy}});
		callback(error, results);
	});
}

this.check_exist = function(guy, callback){
	database.query({
	  sql: 'SELECT ?? FROM online_guys WHERE fullname = ? LIMIT 1;',
	  values: ['fullname', guy]
	},
	function (error, results, fields) {
		if(results.length>0){return callback(true);}
		return callback(false);
	});
}
// ----------------------------------------------------------
