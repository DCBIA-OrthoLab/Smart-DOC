angular.module('cTRIVIAL')
.directive('clinicalMarkers', function($rootScope, $location) {

	function link($scope){

		if(!$scope.editFields){
			$scope.formData = {};
			$scope.formData.formId = 'clinicalMarkers';
			$scope.formData.date = new Date();
		}
		
	}
	return {
    	restrict : 'E',
    	link : link,
    	scope: {
	    	formData : "=",
	    	editFields: "="
	    },
    	templateUrl: 'views/directives/directiveClinicalMarkers.html'
	}


});
