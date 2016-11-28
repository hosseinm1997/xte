


// Variables
actions = {}
xbot = this
// ----------------------------------------------------------

// Functions
this.on = function(commands, act){
	commands = typeof commands == 'object' ? commands : [commands]
	commands.forEach(function(command) {
		actions[command] = act
	})
}
// ----------------------------------------------------------

// Requires
// require('./fa.commands.xbot')(this)
// require('./en.commands.xbot')(this)
//require('require-dir')('./command.d', this)
require("fs").readdirSync(__dirname+'/command.d').forEach(function(file) {
	require("./command.d/" + file)(xbot)
});
// ----------------------------------------------------------

// Commands
this.on('/', function(agent, options, response){
	return response([`سلام ${agent} من xbot هستم و آماده سرویس دهی :)\n..فقط بگو چی میخوای :*`,
		`Hi dear ${agent} i'm xbot and ready to serve to you :D`,
		]._rand())
})

// this.on(['help', 'کمک'], function(agent, options, response){
// 	var commands = ''
// 	for(i in actions){
// 		commands += `${i},\n`
// 	} return response([`Defined commands:\n${commands}`]._rand())
// })

this.on('undefined', function(agent, options, response){
	return response([`متأسفم ${agent} عزیز نمیدونم باید چی بگم :(\n تقصیر محمد مهدیه`,
		`الان چی باید بگم؟`, `چی میگی؟`, `ها ؟`, 'نمیدونم باید چی بگم؟']._rand())
})
// ----------------------------------------------------------

// Exports
module.exports = function(agent, text, response){
	if(text.trim().toLowerCase().search(/^\@x(bot|b)?( .*)?$/)==-1) return; // find out is text a xbot command
	if(text.trim().toLowerCase().search(/^\@x(bot|b)?$/)!=-1) return actions['/'](agent, '', response) // run root command

	agent = `@${agent.trim()}`
	text = text.replace(/\?/, '') // remove ? sign of command string
	text = text.replace(/^\@x(bot|b)? /, '') // remove @x,@xb,@xbot from the beginning

	exact_action = ''

	for(action in actions){ // search for command function
		var matcher = new RegExp(`(^${action} | ${action} | ${action}$|${action}|${action} | ${action})`, 'ig');
		if(!matcher.test(text)) continue
		exact_action = exact_action.length<action.length?action:exact_action
		//return actions[action](agent, text.replace(action, '').trim(), response) // call command function with agent and options params
	}

	exact_action = exact_action==''?'undefined':exact_action
	return actions[exact_action](agent, text.replace(exact_action, '').trim(), response) // call command function with agent and options params
	//return actions['undefined'](agent, '', response) // run undefined command	
}
// ----------------------------------------------------------
