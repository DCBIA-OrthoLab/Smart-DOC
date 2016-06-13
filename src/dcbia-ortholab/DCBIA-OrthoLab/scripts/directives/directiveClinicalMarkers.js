angular.module('cTRIVIAL')
.directive('clinicalMarkers', function($rootScope) {


	function link($scope){

		if(!$scope.formData){
			$scope.formData = {};
		}
		if(!$scope.formData.formId){
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
