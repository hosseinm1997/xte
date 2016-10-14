
// Variables
var express = require('express');
// ----------------------------------------------------------

// Requires
var messages = require('../model/messages');
var guys = require('../model/guys');
// ----------------------------------------------------------

// Exports
module.exports = (function() {
    'use strict';
    var api = express.Router();

    // Guys
    //api.route('/guys')
    // .post(function(request, response) {
    // 	guys.create(request.body.fullname, function(error, results){
    // 		response.json(results);
    // 	});
    // })
    // .delete(function(request, response) {
    // 	guys.delete(request.body.fullname, function(error, results){
    // 		response.json(results);
    // 	});
    // })
    // .get(function(request, response) {
    // 	guys.read(function(error, results){
    // 		response.json(results);
    // 	});
    // });
    // ----------------------------------------------------------

    // Messages
    api.route('/messages')
   .post(function(request, response) {
   		// SOCKET PROGRAMMING
		messages.create(request.body, function(error, results){
			response.json(results);
		});
    })
    // .get(function(request, response) {
    // 	messages.read(0, function(error, results){
    // 		response.json(results);
    // 	});
    // });
    
    api.get('/messages/:bunch', function(request, response) {
    	messages.read(request.params.bunch, function(error, results){
    		response.json(results);
    	});
    });
    // ----------------------------------------------------------

    // Login
	    api.get('/login', function(request, response) {
	    	guys.check_exist(request.body.fullname, function(exist){
	    		if(exist){return response.json({status:'fail'})}
	    		messages.read(1, function(error, messages_results){
		    		guys.read(function(error, guys_results){
			    		guys.create(request.body.fullname, function(error, results){
			    			response.json({status:'success', messages:messages_results, guys:guys_results});
			    		});
			    	});
		    	});
	    	});
	    });
    // ----------------------------------------------------------

    // Logout
    api.post('/Logout', function(request, response) {
    	guys.delete(request.body.fullname, function(error, results){
    		response.json(results);
    	});
    });
    // ----------------------------------------------------------    

    return api;
})();
// ----------------------------------------------------------