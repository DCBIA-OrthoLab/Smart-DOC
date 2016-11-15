
angular.module('jwt-user-login')
.directive('users', function($routeParams, $location, $rootScope, dcbia, clusterauth) {

	function link($scope,$attrs,$filter){
		clusterauth.getUsers()
		.then(function(res){
			$scope.userdata = res.data;
		});

		clusterauth.getScopes()
		.then(function(res){
			$scope.userScopes = res.data[0];
		});

		$scope.projects = {
			projects: [],
			projectsProperties: {
				"defaultProject": {
					class: ''
				}
			},
			section: 0,
			showSection: 0
		};

		$scope.newScope = "";

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
		};

		$scope.projects.hasScope = function(project, scope){
			return project.scope.indexOf(scope) >= 0;
		}

		$scope.projects.addRemoveScope = function(project, scope){


			if($scope.projects.hasScope(project, scope)){
				project.scope.splice(project.scope.indexOf(scope), 1);
			}else{
				project.scope.push(scope);
			}
			dcbia.updateProject(project)
			.then(function(res){
				return $scope.projects.getProjects();
			})
			.catch(console.error);

		}

		$scope.createScope = function(){
			if($scope.newScope != ""){
				$scope.userScopes.scopes.push($scope.newScope);
				$scope.newScope = "";
				clusterauth.updateScopes($scope.userScopes)
				.then(function(res){
					clusterauth.getScopes().
					then(function(res){
						$scope.userScopes = res.data[0];
					})
				});
			}
		}


		$scope.addRemoveScope = function(user, scope){
			if($scope.hasScope(user, scope)){
				user.scope.splice(user.scope.indexOf(scope), 1);
			}else{
				user.scope.push(scope);
			}

			clusterauth.updateUser(user)
			.then(function(res){
				console.log(res);
			})
			.catch(alert)

		}

		$scope.deleteUser = function(user){
			if(confirm("Do you want to delete the user?")){
				clusterauth.deleteUser(user)
				.then(function(){
					for(var i = 0; i < $scope.userdata.length; i++){
						if($scope.userdata[i]._id === user._id){
							$scope.userdata.splice(i, 1);
						}
					}
				})
				.catch(console.error);
			}
		}

		$scope.hasScope = function(user, scope){
			return user.scope.indexOf(scope) >= 0;
		}

		$scope.projects.getProjects();
	}


	return {
	    restrict : 'E',
	    link : link,
	    scope: {
	    	userScopes: "="
	    },
	    templateUrl: './src/usersManager.template.html'
	}
});