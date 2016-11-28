
// Requires
var validator = require('validator')
// ----------------------------------------------------------

// Functions
validate = function(value, attributes){
	attributes = (typeof attributes=='object'?attributes:[attributes])
	var inverse = false, options = '', result = true
	value = typeof value=='string'?value.toString().trim():value
	attributes.forEach(function(attribute){
		if(!result) return result
		inverse = (attribute[0]=='!'?true:false)
		if(inverse) attribute = attribute.substr(1)
		options = attribute.match(/\(.+\)/g)
		options = (options==null?'':options[0].replace(/[\(\)]/g, ''))
		attribute = attribute.replace(/\(.*\)/g, '')
		if(typeof validator[attribute] != 'function') return
		result = validator[attribute](value, options)
		result = inverse?!result:result
	})

	return result
}
// ----------------------------------------------------------

// Exports
module.exports = (function validate_values(values, attributes){
	var result = true
	if(typeof values != 'object') values = [values]
	values.forEach(function(value) {
		if(!result) return result
		if(typeof value == 'undefined') return result = false
		if(typeof value == 'object') validate_values(value, attributes)
		else result = validate(value, attributes)
	});
	return result
})
// ----------------------------------------------------------
