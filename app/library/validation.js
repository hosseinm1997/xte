
// Requires
var validator = require('validator');
// ----------------------------------------------------------

// Functions
validate = function(value, attributes){
	attributes = (typeof attributes=='object'?attributes:[attributes])
	var inverse = false, options = '', result = true;
	attributes.forEach(function(attribute){
		inverse = (attribute[0]=='!'?true:false);
		if(inverse) attribute = attribute.substr(1);
		options = attribute.match(/\(.+\)/g);
		options = (options==null?'':options[0].replace(/[\(\)]/g, ''))
		attribute = attribute.replace(/\(.*\)/g, '');
		if(eval(`typeof validator.${attribute}`) != 'function') return;
		if(options.length>0) options = `, ${options}`
		inverse = inverse?'!':''
		//console.log(`result=${inverse}!!validator.${attribute}("${value}"${options})`)
		eval(`result=${inverse}!!validator.${attribute}("${value}"${options})`);
		if(!result) return result;
	});
	return result;
}
// ----------------------------------------------------------

// Exports
module.exports = (function validate_values(values, attributes){
	var result = true
	if(typeof values != 'object') values = [values]
	for(i in values){
		if(typeof values[i] == 'undefined') return false
		if(typeof values[i] == 'object') validate_values(values[i], attributes);
		else result = validate(values[i].toString().trim(), attributes);
		if(!result) return result;
	}
	return result;
})
// ----------------------------------------------------------