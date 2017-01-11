angular.module('dcbia-jobs')
.directive('jobs', function($routeParams, dcbia, clusterauth) {

	function link($scope, $attrs, $filter){
	}

	return {
		restrict : 'E',
	    link : link,
	    templateUrl: './src/dcbia-jobs.template.html'
	}

});