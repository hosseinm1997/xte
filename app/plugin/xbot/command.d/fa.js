
// Requires
var wikipedia = require('wikipedia-js')
// ----------------------------------------------------------

module.exports = function(xbot){

	// Commands
	xbot.on(['salam', 'سلام'], function(agent, options, response){
		return response([`سلام ${agent} عزیز :)`, `سلام ${agent} ;)`, `سلام :)`]._rand())
	})
	xbot.on(['حالت چطوره', 'چطوری', 'خوبی', 'halet chetore', 'chetori', 'chetory', 'khubi', 'khoobi', 'khoubi'], function(agent, options, response){
		return response([`مرسی ;)`, `عزیزی ${agent} :*`, `عالی :D`, `ممنونم، تو خوبی ${agent} :)`, `خوبم ${agent}، تو چطوری :?`]._rand())
	})
	xbot.on(['چند سالته', 'چن سالته', 'chand salete', 'chan salete'], function(agent, options, response){
		var born_date = new Date('10/11/2016')
		var now = new Date()
		var time_diff = Math.abs(born_date.getTime() - now.getTime())
		var diff_day = Math.ceil(time_diff / (1000 * 3600 * 24))
		return response([`من تازه متولد شدم و ${diff_day} روزمه`, `فقط ${diff_day} روزمه :D`]._rand())
	})
	xbot.on(['اسمت چیه', 'اسمت', 'esmet chie'], function(agent, options, response){
		return response(['خب معلومه xbot و میتونی xb یا حتی x صدام کنی', 'xbot، xb و x هر کدوم رو راختی صدام کن']._rand())
	})
	xbot.on(['چیه', 'چی میدونی درباره', 'chie'], function soal(agent, options, response){
		query = options.replace(/(and|[ ,،&و])/ig, ' ').replace('  ', ' ').replace(/ {2,}/, ' ').replace(/ {2,}/, ' ').trim()
		query = query.split(' ')
		query = query[0].trim()==''?query.shift() : query

		// Search for `input options` in wikipedia
		var params = { query: query[0], format: 'html', summaryOnly: true, lang: 'fa' }
		wikipedia.searchArticle(params, function(error, wiki_text){
			if(error || wiki_text == null || wiki_text.match('may refer to:') != null) {
				response(`شرمنده چیزی درباره ${query[0]} نمیدونم :(`)
			} else {
				wiki_text=wiki_text.replace(/\((.*?)\)/g, '')
				wiki_text=wiki_text.replace(/<[\/]?em>/g, '')
				wiki_text=wiki_text.replace(/<[^>]*>/g, '')
				wiki_text=wiki_text.match(/^[^.]*.(\.)?[^.]*(\.)?/)[0]
				response(`چیزی که من درباره ${query[0]} میدونم\n${wiki_text}`)
			}
			if(query.length > 1) soal(agent, query.toString().replace(query[0], ''), response)
		})
	})
	// ----------------------------------------------------------

}