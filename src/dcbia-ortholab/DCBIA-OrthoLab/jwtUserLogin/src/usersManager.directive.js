
angular.module('jwt-user-login')
.directive('users', function($routeParams, $location, $rootScope, dcbia, clusterauth) {

	function link($scope,$attrs,$filter){
		clusterauth.getUsers()
		.then(function(res){
			$scope.userdata = res.data;
		});

		clusterauth.getScopes()
		.then(function(res){
			$scope.appScopes = res.data[0];
			$scope.userScopes = $scope.appScopes.scopes;
		})
		.catch(function(e){
			console.error(e);
		});

		$scope.newScope = "";

		$scope.createScope = function(){
			if($scope.newScope != ""){
				if(!$scope.appScopes){
					$scope.appScopes = {
						"type": "scopes",
						"scopes": $scope.userScopes
					}
				}
				if($scope.appScopes.scopes.indexOf($scope.newScope) == -1){
					$scope.appScopes.scopes.push($scope.newScope);
					$scope.newScope = "";

					clusterauth.updateScopes($scope.appScopes)
					.then(function(res){
						return clusterauth.getScopes();
					})
					.then(function(res){
						$scope.appScopes = res.data[0];
						$scope.userScopes = $scope.appScopes.scopes;
					});
				}
			}
		}


		$scope.addRemoveScope = function(user, scope){
			if($scope.hasScope(user, scope)){
				user.scope.splice(user.scope.indexOf(scope), 1);
			}else{
				user.scope.push(scope);
			}

			return clusterauth.updateUser(user)
			.then(function(res){
				_.each($scope.userdata, function(us){
					if(us.email === user.email){
						us._rev = res.data.rev;
					}
				});

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