module.exports = function(){
	var src  = 'src',
		dest = '.';
	return {
		src : {
			etc: `${src}/etc`,
			template: `${src}/template`,
			style: `${src}/style`,
			script: `${src}/script`
		},
		dest: {
			public: `${dest}/public`,
			view: `${dest}/view`,
			dist: `${src}/dist`
		},
	}
}