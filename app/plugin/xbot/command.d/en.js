
// Requires
var wikipedia = require('wikipedia-js')
// ----------------------------------------------------------

module.exports = function(xbot){
	
	// Commands
	xbot.on(['hi', 'hello'], function(agent, options, response){
		return response([`Hi dear ${agent} :)`, `Hello ${agent}`, `Hi ${agent}, How are you ;)`]._rand())
	})
	xbot.on(['how are you'], function(agent, options, response){
		return response([`thanks`, `thanks ${agent}, what about you`, `greate ;)`, `thank you so much ${agent}`]._rand())
	})
	xbot.on('how old are you', function(agent, options, response){
		var born_date = new Date('10/11/2016')
		var now = new Date()
		var time_diff = Math.abs(born_date.getTime() - now.getTime())
		var diff_day = Math.ceil(time_diff / (1000 * 3600 * 24))
		return response(`I'm newborn and i'm ${diff_day}-day-old`, `${diff_day}-day-old :D`)
	})
	xbot.on(['whats your name', 'what is your name'], function(agent, options, response){
		return response(`its clear, my name is xbot also xb & x are my nicknames`, `xbot, xb & x :)`)
	})
	xbot.on(['what is', 'tell me about', 'what do you know about'], function ask(agent, options, response){
		query = options.replace(/(and|[ ,،&و])/ig, ' ').replace(/ {2,}/, ' ').replace(/ {2,}/, ' ').trim()
		query = query.split(' ')
		query = query[0].trim()==''?query.shift() : query

		// Search for `query` in wikipedia
		var params = { query: query[0], format: 'html', summaryOnly: true, lang: 'en' }
		wikipedia.searchArticle(params, function(error, wiki_text){
			if(error || wiki_text == null || wiki_text.match('may refer to:') != null){
				response(`Sorry i don't know anything about ${query[0]} :(`)
			} else {
				wiki_text=wiki_text.replace(/\((.*?)\)/g, '')
				wiki_text=wiki_text.replace(/<[\/]?em>/g, '')
				wiki_text=wiki_text.replace(/<[^>]*>/g, '')
				wiki_text=wiki_text.match(/^[^.]*.(\.)?[^.]*(\.)?/)[0]
				response(`Whats i know about ${query[0]}\n${wiki_text}`)
			}
			if(query.length > 1) ask(agent, query.toString().replace(query[0], ''), response)
		})
	})
	// ----------------------------------------------------------

}