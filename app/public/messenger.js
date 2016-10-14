
    angular
	            .module('firstApplication', ['ngMaterial'])
	            .controller('messageCtrl', ['$scope', '$http', function(scope, http){
		           	http.get('/api/messages').then(function(response){
		           		scope.messages=response.data
		           	}).then(function(error){})
	            }]);  
