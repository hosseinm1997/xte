
// Requires
var messages = require('../model/messages');
var guys = require('../model/guys');
// ----------------------------------------------------------
// Variables
var actions = {}
// ----------------------------------------------------------
// Functions
function on(command, act){ actions[command] = act; }
function send(message){
	messages.create({sender:'xbot', text:message}, function(error, results){
		//io.emit('message', {status:0, data:{sender:'xbot',text:message}});
	});
}
// ----------------------------------------------------------
// Exports
module.exports = function(agent, text){
	if(text == '@x' || text == '@xb' || text == '@xbot') return actions['/'](agent) // run root command
	if(text.search(/^\@xb?(bot)? .+/)==-1) return // retrun if message is not for bot
	var command = text.match(/ [^ ]*/)[0].trim().toLowerCase() // grab command from text string
	var options = text.replace(/^\@xb?(bot)? [^ ]*/, '').trim().toLowerCase() // grab options from text string
	if(typeof actions[command] == 'function') return actions[command](agent, options) // run commands
}
// ----------------------------------------------------------

// Commands
on('/', function(agent){
	send(`Hi @${agent} i'm xbot and ready to service to you :)\n..just tell me what do you need ;)`);
})
on('hi', function(agent, options){
	send(`Hi dear @${agent}`);
})

// ----------------------------------------------------------