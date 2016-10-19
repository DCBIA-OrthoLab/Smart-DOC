
angular.module('jwt-user-login')
.controller('users', ['$scope','$http', '$filter', 'dcbia', 'clusterauth', function($scope, $http, $filter, dcbia, clusterauth) {

	$scope.userscopes = {};

	clusterauth.getUsers()
	.then(function(res){
		$scope.userdata = res.data;
		_.each($scope.userdata, function(u){
			$scope.userscopes[u._id] = {
				default: u.scope.indexOf('default') >= 0,
				dentist: u.scope.indexOf('dentist') >= 0,
				admin: u.scope.indexOf('admin') >= 0
			}
		})
	})

	$scope.addRemoveScope = function(user){
		var scopes = $scope.userscopes[user._id];
		user.scope = [];
		if(scopes.default){
			user.scope.push('default');
		}
		if(scopes.dentist){
			user.scope.push('dentist');
		}
		if(scopes.admin){
			user.scope.push('admin');
		}

		clusterauth.updateUser(user)
		.then(function(res){
			console.log(res);
		})
		.catch(alert)

	}

	$scope.deleteUser = function(user){
		console.log("TOOD delete", user);
	}

}]);