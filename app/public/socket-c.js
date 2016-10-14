var socket = io.connect(':7620');
socket.on('message', function(message){
	console.log('Sender', message.data.sender);
	console.log('Text', message.data.text);
});