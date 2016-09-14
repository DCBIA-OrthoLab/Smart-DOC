angular.module('tmj-survey')
.directive('tmjSurvey', function($rootScope, $location, $anchorScroll) {

	function link($scope){
		
		if(!$scope.formData || ($scope.formData && $scope.formData.formId !== 'TMJSurvey')){
			$scope.formData = {};
			$scope.formData.formId = 'TMJSurvey';
			$scope.formData.date = new Date();
		}

		$scope.goToScroll = function(location) {
	      // set the location.hash to the id of
	      // the element you wish to scroll to.
	      $location.hash(location);

	      // call $anchorScroll()
	      $anchorScroll();
	    };
	}
	return {
    	restrict : 'E',
    	link : link,
    	scope: {
	    	formData : "=",
	    	editFields: "="
	    },
    	templateUrl: 'bower_components/tmj-survey/TMJSurvey.template.html'
	}


});
