
angular.module('jwt-user-login')
.directive('users', function($routeParams, $location, $rootScope, clusterauth) {

	function link($scope,$attrs,$filter){

		clusterauth.getUsers()
		.then(function(res){
			$scope.userdata = res.data;
		});

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