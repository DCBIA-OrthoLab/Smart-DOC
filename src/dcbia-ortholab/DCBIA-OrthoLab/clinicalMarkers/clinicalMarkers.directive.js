angular.module('clinical-markers')
.directive('clinicalMarkers', function($rootScope, $location) {

	function link($scope){

		if(!$scope.formData || ($scope.formData && $scope.formData.formId !== 'clinicalMarkers')){
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
    	templateUrl: 'bower_components/clinical-markers/clinicalMarkers.template.html'
	}


});
