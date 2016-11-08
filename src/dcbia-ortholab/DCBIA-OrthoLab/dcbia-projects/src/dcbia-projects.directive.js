angular.module('dcbia-projects')
.directive('projects', function($routeParams, dcbia, clusterauth) {

	function link($scope, $attrs, $filter){

		clusterauth.getUser()
		.then(function(res){
			$scope.user = res;
		})

		$scope.projects = {
			newProject: {
				items: [],
				type: "project",
				name: ""
			},
			projects: [],
			projectsProperties: {
				"defaultProject": {
					class: ''
				}
			},
			section: -1
		};

		$scope.chat = 1;


		$scope.projects.getProjects = function(){
			return dcbia.getProjects()
			.then(function(res){
				delete $scope.projects.selectedProject;
				$scope.projects.projects = res.data;
				_.each($scope.projects.projects, function(project){
					$scope.projects.projectsProperties[project._id] = {
						class : ""
					};
				});
			})
			.catch(console.error);
		}
		
		$scope.projects.getProjects();

	}

	return {
		restrict : 'E',
	    link : link,
	    templateUrl: 'node_modules/dcbia-projects/src/dcbia-projects.template.html'
	}	

});