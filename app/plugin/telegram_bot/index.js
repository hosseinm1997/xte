// Requires
var http = require('http');
var querystring = require('querystring');
var socket = require('socket.io-client')('http://127.0.0.1:7620')
var TelegramBot = require('node-telegram-bot-api');
var token = '271862573:AAERHWlmucdZSTDerlhCQCOPMP_sX2QY3Jk';
var xteChatId = '-165635553';
var messages_queue = {}
///

// Setup
var bot = new TelegramBot (token, {polling: true});
///

// Functions
var xte = {}
xte.post = function(data, path, callback) {
	body = '';
	callback = typeof callback == 'function' ? callback : function(){}
	data = querystring.stringify(data);
	request = http.request({
		hostname: '127.0.0.1',
		port: 80,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(data)
		}
	}, function(response){
		response.on('data', function(chunk){ body += chunk; })
		response.on('end', function(){ 
			body = body.replace(/undefined/, '');
			callback(JSON.parse(body)) });
	});
	request.write(data);
	request.end();
}

xte.get = function(path, callback) {}
///

// Bot
bot.onText (/.*/, function (msg) {
	var chatId = msg.chat.id;
	var person = `${msg.from.first_name} ${msg.from.last_name} #${msg.from.username}`
	console.log(person)
	person = person.replace(/#?undefined/ig, '').trim()
	console.log(person)
	person = person.length > 17? person.replace(`#${msg.from.username}`, '').trim() : person.trim()
	console.log(person)
	person = person.length > 17? person.replace(`${msg.from.last_name}`, '').trim() : person.trim()
	console.log(person)
	person = person.length > 17? person.substring(0, 13) + '...' : person.trim()
	console.log(person)
	
	var text = msg.text
	if(msg.chat.id!=xteChatId){
		xte.post({ sender: person, text: '@xbot '+text.trim() }, '/api/xbot', function(response){
			bot.sendMessage(chatId, "```text\n" + response.text + "```", { parse_mode: 'Markdown' });
		});
	} else {
		if(!msg.from.last_name) msg.from.last_name = ''
		xte.post({ sender: person, text: text }, '/api/messages', function(response){});
		messages_queue[person.trim()+text.trim()] = 'pending'

	}
	// bot.sendMessage (chatId,`${msg.chat.first_name} ${msg.chat.last_name}\n${text}`);

});

socket.on('message', function(message){
	message = message.data;
	if(messages_queue[message.sender.trim()+message.text.trim()] == 'pending'){
		delete messages_queue[message.sender.trim()+message.text.trim()]
		return;
	}

	bot.sendMessage(xteChatId, "*@" + message.sender + "*\n```text\n" + message.text + "```", { parse_mode: 'Markdown' });
});
///

console.log ('Now telegram bot is running ...');


// TODO
// set guys online & offline
// sync from native app to telegram
// work just in group
