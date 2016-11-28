
// Requires
var express = require('express');
var server = require('http').createServer(express); server.listen(7620);
var io = require('socket.io')(server);
var async = require('async');
var validate = require('../library/validation');
var messages = require('../model/messages');
var guys = require('../model/guys');
var xbot = require('../plugin/xbot/index');
var ws = require("nodejs-websocket").createServer(function (connection) {
    console.log("Web socket connection stablished")
    connection.sendText('I Love you ;)')
    connection.on("text", function (str) {})
    connection.on("close", function (code, reason) {
        console.log("Web socket connection closed")
    })
}).listen(7621)
// ----------------------------------------------------------

// Exports
module.exports = (function() {

    var api = express.Router();
    var online_guys = [];
    // Get list of guys to track idle guys
    guys.read(function(error, results){
        results.forEach( function(guy){
            if(guy.fullname=='xbot') return;
            online_guys[guy.fullname] = new Date();
        });
    });

    // Guys
    api.route('/guys')
    .get(function(request, response) {
    	guys.read(function(error, results){
    		response.json({status:0, data:results});
    	});
    });
    // ----------------------------------------------------------

    // Messages
    api.route('/messages')
   .post(function post_message(request, response) {
        // Validation
        if(!validate(
            [request.body.sender, request.body.text],
            '!isEmpty'))
            return response.json({status:1, error:'Invalid input'});

        guys.check_exist(request.body.sender, function(exist){
            //if(!exist){return response.json({status:3, error:'User(sender) doesn\'t exist'})}

            // Emit new message to users
            io.emit('message', {status:0, data:request.body});
            ws.connections.forEach(function (connection) {
                connection.sendText(`{status:0, dataType:'message', data:${request.body}}`)
            })

            messages.create(request.body, function(error, results){
    			response.json({status:0, data:results})
                if(!online_guys[request.body.sender]) login({body:{fullname:request.body.sender}},{json:function(results){}});
                else online_guys[request.body.sender] = new Date();
    		});

            // Powerfull XBOT runs here
            xbot(request.body.sender, request.body.text, function(message){
                post_message({body:{sender:'xbot', text:message}},{json:function(results){}})
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
            ['isNumeric']))
            return response.json({status:1, error:'Invalid input'});

    	messages.read(request.params.bunch, function(error, results){
            if(results.length < 1) return response.json({status:4, error:`There's no older message`});
    		return response.json({status:0, data:results});
    	});
    });
    // ----------------------------------------------------------

    // Login
    var login = function(request, response) {
        // Validation
        if(!validate(
            request.body.fullname,
            ['!isEmpty', '!equals("x")', '!equals("xb")']))
            return response.json({status:1, error:'Invalid input'});

        guys.check_exist(request.body.fullname, function(exist){
            if(exist){return response.json({status:2, error:'User exist'})}
            
            // Emit new guy to users
            io.emit('guyOn', {status:0, data:request.body});
            ws.connections.forEach(function (connection) {
                connection.sendText(`{status:0, dataType:'guyOn', data:${request.body}}`)
            })

            async.parallel({
                messages: messages.read.bind(null, 1),
                guys: guys.read.bind(null),
                login: guys.create.bind(null, request.body.fullname)
            }, function(error, results) {
                // Make xbot first guy
                var swap = results.guys[0]
                if(swap.fullname != 'xbot'){
                    results.guys.forEach( function(guy, index){
                        if(guy.fullname == 'xbot'){
                            results.guys[0] = guy
                            results.guys[index] = swap
                        }
                    })
                } /**/
                response.json({
                    status:0,
                    data:{
                        messages:results.messages,
                        guys:results.guys
                    }
                });
                online_guys[request.body.fullname] = new Date();
            });
        });
    }; api.post('/login', login);

    io.on('connect', function(socket){
        socket.on('typing', function(response){
            if(!response.data.fullname) return
            online_guys[response.data.fullname] = new Date();
            io.emit('typing', {status:0, data:response.data});
            //io.emit('typing', {status:0, data:{fullname:false}});
        })
    })

    // Logout
    var logout = function (request, response) {
        // Validation
        if(!validate(
            request.body.fullname,
            ['!isEmpty', '!equals("xbot")']))
            return response.json({status:1, error:'Invalid input'});

        guys.check_exist(request.body.fullname, function(exist){
            if(!exist){return response.json({status:3, error:'User doesn\'t exist'})}

            // Emit logged out guy to users
            io.emit('guyOff', {status:0, data:request.body});
            ws.connections.forEach(function (connection) {
                connection.sendText(`{status:0, dataType:'guyOff', data:${request.body}}`)
            })


            guys.delete(request.body.fullname, function(error, results){
                response.json({status:0, data:results});
            });

        });
    }; api.post('/logout', logout);

    // Logout idle guys ------------------------------------
    var idle_time = 1 // minute idle for logout user
    setInterval(function(){
        Object.keys(online_guys).forEach(function(guy, index){
            var now = new Date()
            minutes_diff = Math.round((( (now - this[guy]) % 86400000) % 3600000) / 60000);
            if(minutes_diff >= idle_time){
                console.log(`Logging out ${guy} ->`, `(idle for ${minutes_diff} minutes)`)
                logout({body:{fullname:guy}},{json:function(results){
                    delete online_guys[guy];
                }})
            }
        }, online_guys);
    }, 60000 * idle_time);
    // ----------------------------------------------------------

    // xbot APIs
    api.route('/xbot')
    .post(function(request, response){
        xbot(request.body.sender, request.body.text, function(message){
            response.json({sender:'xbot', text:message});
        });
    });
    api.get('/xbot/:command', function(request, response){
        xbot('Anonymous', '@xbot ' + request.params.command, function(message){
            response.send(message);
        });
    });
    // ----------------------------------------------------------

    // Test APIs
    api.get('/OK', function(request, response) {
        response.send('OK');
    });

    api.get('/dlo/messages', function(request, response) {
        // Delete last one(message)
        if(process.env.NODE_ENV != 'test') return response.status(404).send('Cannot GET /api/dlo/messages');

        messages.dlo(function(error, results){
            response.json({status:0, data:results});
        });
    })
    // ----------------------------------------------------------

    // Add xbot on start
    login({body:{fullname:'xbot'}},{json:function(results){}})
    // ----------------------------------------------------------

    return api;
})();
// ----------------------------------------------------------
