angular.module('xte',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
.controller('AppCtrl', ['$scope', function($scope){
	$scope.currentNavItem = 'page1'
            .controller('inputController', inputController);

         function inputController ($scope) {
           $scope.project = {
              comments: 'Comments',    
           };
         } 
}]);


/*(function() {
  'use strict';
  angular.module('xte', ['ngMaterial','ngMessages','material.svgAssetsCache'])
      .controller('AppCtrl', AppCtrl);
  function AppCtrl($scope) {
    $scope.currentNavItem = 'page1';
  }
})();*/





