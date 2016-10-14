
// Requires
var express = require('express');
// var server = require('http').createServer(express);
// var io = require('socket.io')(server); server.listen(7625);
var async = require('async');
var validate = require('../library/validation');
var messages = require('../model/messages');
var guys = require('../model/guys');
var xbot = require('../library/xbot');
// ----------------------------------------------------------

// Exports
module.exports = (function() {
    'use strict';
    var api = express.Router();

    // Guys
    api.route('/guys')
    // .post(function(request, response) {
    //     // Validation
    //     if(!validate(
    //         request.body.fullname,
    //         '!isEmpty'))
    //         return response.json({status:1, error:'Invalid input'});
    
    // 	guys.create(request.body.fullname, function(error, results){
    // 		response.json({{status:0, data:results});
    // 	});
    // })
    // .delete(function(request, response) {
    //     // Validation
    //     if(!validate(
    //         request.body.fullname,
    //         '!isEmpty'))
    //         return response.json({status:1, error:'Invalid input'});
    
    // 	guys.delete(request.body.fullname, function(error, results){
    // 		response.json({status:0, data:results});
    // 	});
    // })
    .get(function(request, response) {
    	guys.read(function(error, results){
    		response.json({status:0, data:results});
    	});
    });
    // ----------------------------------------------------------

    // Messages
    api.route('/messages')
   .post(function(request, response) {
    
        // Validation
        if(!validate(
            [request.body.sender, request.body.text],
            '!isEmpty'))
            return response.json({status:1, error:'Invalid input'});

        guys.check_exist(request.body.sender, function(exist){
            if(!exist){return response.json({status:3, error:'User(sender) doesn\'t exist'})}

            // Powerfull XBOT runs here
            xbot(request.body.sender, request.body.text);

            // Emit new message to users
            //io.emit('message', {status:0, data:request.body});

    		messages.create(request.body, function(error, results){
    			response.json({status:0, data:results});
    		});

        });
    })
    .get(function(request, response) {
    	messages.read(0, function(error, results){
    		response.json({status:0, data:results});
    	});
    });
    
    api.get('/messages/:bunch', function(request, response) {
        
        // Validation
        if(!validate(
            request.params.bunch,
            'isNumeric'))
            return response.json({status:1, error:'Invalid input'});

    	messages.read(request.params.bunch, function(error, results){
    		response.json({status:0, data:results});
    	});
    });
    // ----------------------------------------------------------

    // Login
    api.post('/login', function(request, response) {
        // Validation
        if(!validate(
            request.body.fullname,
            '!isEmpty'))
            return response.json({status:1, error:'Invalid input'});

        guys.check_exist(request.body.fullname, function(exist){
            if(exist){return response.json({status:2, error:'User exist'})}
            
            // Emit new guy to users
            //io.emit('guyOn', {status:0, data:request.body});

            async.parallel({
                messages: messages.read.bind(null, 1),
                guys: guys.read.bind(null),
                login: guys.create.bind(null, request.body.fullname)
            }, function(error, results) {
                response.json({
                    status:0,
                    data:{
                        messages:results.messages,
                        guys:results.guys
                    }
                });
            });
        });
    });
    // ----------------------------------------------------------

    // Logout
    api.post('/logout', function(request, response) {
        // Validation
        if(!validate(
            request.body.fullname,
            ['!isEmpty', '!equals("xbot")']))
            return response.json({status:1, error:'Invalid input'});

        // Emit new guy to users
        //io.emit('guyOff', {status:0, data:request.body});

        guys.check_exist(request.body.fullname, function(exist){
            if(!exist){return response.json({status:3, error:'User doesn\'t exist'})}

        	guys.delete(request.body.fullname, function(error, results){
        		response.json({status:0, data:results});
        	});

        });
    });
    // ----------------------------------------------------------    


    // Tests APIs
    api.get('/dlo/messages', function(request, response) {
        // Delete last one(message)
        if(process.env.NODE_ENV != 'test') return response.status(404).send('Cannot GET /api/dlo/messages');

        messages.dlo(function(error, results){
            response.json({status:0, data:results});
        });
    });
    // ----------------------------------------------------------

    return api;
})();
// ----------------------------------------------------------