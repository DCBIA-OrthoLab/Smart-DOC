
angular.module('cTRIVIAL')
.directive('navbar', function($routeParams, $location, $rootScope, clusterauth){

	function link($scope,$attrs,$filter){

		$scope.isAdmin = false;

		$scope.getName = function(){

			clusterauth.getUser()
			.then(function(user){
				$scope.login = user;
				$scope.isAdmin = $scope.login.scope.indexOf('admin') > -1;
			})
			.catch(function(e){
				console.error(e);
				throw e;
			})		
		};

		$scope.getName();

		$scope.logout = function(){
			clusterauth.logout();
		};
	};

	return {
    	restrict : 'E',
    	link : link,
    	templateUrl: 'views/directives/directiveNavbar.html'
	}

});