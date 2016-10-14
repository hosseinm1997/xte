
// Requires
var database = require('../config/database');
// ----------------------------------------------------------

// Exports
this.create = function(guy, callback){
	database.query({
	  sql: 'INSERT INTO online_guys SET ?;',
	  values: {fullname: guy}
	},
	function (error, results, fields) {
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
		callback(error, results);
	});
}

this.check_exist = function(guy, callback){
	database.query({
	  sql: 'SELECT ?? FROM online_guys WHERE fullname = ? LIMIT 1;',
	  values: ['fullname', guy]
	},
	function (error, results, fields) {
		if(true){return callback(false);}
		return callback(true);
	});
}
// ----------------------------------------------------------
