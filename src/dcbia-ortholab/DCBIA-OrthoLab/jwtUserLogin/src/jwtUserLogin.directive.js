angular.module('jwt-user-login')
.directive('userLogin', function($routeParams, $location, $rootScope, $timeout, clusterauth){
	function link($scope,$attrs,$filter){
	
	$scope.showLogin = true;
	$scope.newUser = {};
	$scope.user = {};

	$scope.resetUser = false;

	if($routeParams.token){
		$scope.showLogin = false;
		$scope.resetUser = {
			token: $routeParams.token
		}
	}
	
	$scope.createUser = function(){
		clusterauth.createUser($scope.newUser)
		.then(function(){
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/home');
		})
		.catch(function(e){
			if(e.status === 409){
				$('#inputEmailCreate').popover('show');
				$timeout(function(){
					$('#inputEmailCreate').popover('hide');
				}, 6000);
			}
		});
	}

	$scope.recoverPassword = function(email, popup){
		if(!email)
		{
			$scope.inputEmailPopup = 'Please enter your email address';
			$('#' + popup).popover('show');
			$timeout(function(){
				$('#' + popup).popover('hide');
			}, 6000);
		}else{
			clusterauth.sendRecoverPassword({
				email: email
			})
			.then(function(res){
				alert(res.data);
			})
			.catch(function(e){
				if(e.status === 401)
				{
					$scope.inputEmailPopup = 'You need to create an account first.';
					$('#' + popup).popover('show');
					$timeout(function(){
						$('#' + popup).popover('hide');
					}, 6000);
				}
			})
		}
	}

	$scope.resetPassword = function(){
		$scope.errorMsg = "";
		if($scope.resetUser.password0 === $scope.resetUser.password1){
			clusterauth.updatePassword({
				password: $scope.resetUser.password1
			}, $scope.resetUser.token)
			.then(function(){
				return clusterauth.getUser();
			})
			.then(function(res){
				$rootScope.user = res.data;
				$location.path('/home');
			})
			.catch(function(e){
				console.error(e);
			});
		}
		else
		{
			alert('Passwords are not the same');
			return false;
		}
	}

	$scope.login = function(){
		$scope.errorMsg = "";
		clusterauth.login($scope.user)
		.then(function(){
			$('#loginbutton').popover('hide');
			$('#inputEmail').popover('hide');
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/home');
		})
		.catch(function(e){
			if(e.status === 401 && $scope.user.password)
			{
				$('#loginbutton').popover('show');
				$timeout(function(){
					$('#loginbutton').popover('hide');
				}, 6000);
			}
			
		});
	}

	$scope.switchForm = function(){
		$scope.errorMsg="";
		$scope.showLogin=!$scope.showLogin;
	}
};

return {
    restrict : 'E',
    link : link,
    templateUrl: './src/jwtUserLogin.template.html'
}

});

