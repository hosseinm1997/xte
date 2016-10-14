      angular
            .module('firstApplication', ['ngMaterial'])
            .controller('sideNavController', sideNavController);

          function sideNavController ($scope, $mdSidenav) {
             $scope.openLeftMenu = function() {
               $mdSidenav('left').toggle();
             };
			 $scope.openRightMenu = function() {
               $mdSidenav('right').toggle();
             };
         }	