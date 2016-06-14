
angular.module('cTRIVIAL')
.directive('d3Plots', function($routeParams, $location, $rootScope, clusterauth){

	function link($scope){

		$scope.update = function(){
			
		}

		$scope.$watch('data', function(){
			if($scope.data){
				$scope.update();
			}
		})
	};

	return {
    	restrict : 'E',
    	link : link,
    	scope: {
	    	data : "="
	    },
    	templateUrl: 'views/directives/directiveD3Plots.html'
	}

});