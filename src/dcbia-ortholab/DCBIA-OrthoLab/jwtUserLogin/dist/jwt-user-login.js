angular.module('jwt-user-login', []);
angular.module('jwt-user-login')
.config(['$httpProvider', '$provide', function ($httpProvider, $provide) {
  // register the interceptor as a service
  $provide.factory('jwtInterceptor', function($q, $location) {
    return {
      // optional method
      'request': function(config) {
        // do something on success
        var token = localStorage.getItem('clusterpost_token');
        if(token){
          config.headers.authorization = "Bearer " + token;
        }
        
        return config;
      },

      // optional method
     'requestError': function(rejection) {
        // do something on error
        // if (canRecover(rejection)) {
        //   return responseOrNewPromise
        // }
        return $q.reject(rejection);
      },



      // optional method
      'response': function(response) {
        // do something on success
        return response;
      },

      // optional method
     'responseError': function(rejection) {
        

        if(rejection.status === 401 && !localStorage.getItem('clusterpost_token')){
          $location.path('/');
        }

        if(rejection.status === 404) {
          $location.path('/notFound');
        }
        
        
        return $q.reject(rejection);
      }
    };
  });

  $httpProvider.interceptors.push('jwtInterceptor');

}])
.factory('clusterauth', function ($q, $http, $location, $rootScope) {
  return {
    createUser: function(user){
      return $http({
        method: 'POST',
        url: '/auth/user',
        data: user
      })
      .then(function(res){
        localStorage.setItem('clusterpost_token', res.data.token);
      });
    }, 
    getUsers: function(){
      return $http({
          method: 'GET',
          url: '/auth/users'
        });
    },
    getUser: function(){
      if($rootScope.user){
        return Promise.resolve($rootScope.user);
      }else{
        return $http({
          method: 'GET',
          url: '/auth/user'
        }).then(function(res){
          $rootScope.user = res.data;
          return res.data;
        });
      }
    },    
    deleteUser: function(user){
      return $http({
        method: 'DELETE',
        url: '/auth/user',
        data: user
      });
    },
    login: function(user){
      return $http({
        method: 'POST',
        url: '/auth/login',
        data: user
      })
      .then(function(res){
        localStorage.setItem('clusterpost_token', res.data.token);
      });
    },
    updatePassword: function(user, token){
      return $http({
        method: 'PUT',
        url: '/auth/login',
        data: user,
        headers: {
          authorization: "Bearer " + token
        }
      })
      .then(function(res){
        localStorage.setItem('clusterpost_token', res.data.token);
      });
    },
    sendRecoverPassword: function(email){
       return $http({
        method: 'POST',
        url: '/auth/reset',
        data: email
      });
    },
    logout: function(){
      localStorage.removeItem('clusterpost_token');
      $location.path('/');
    },
    updateUser: function(user){
      return $http({
        method: 'PUT',
        url: '/auth/users',
        data: user
      });
    }
  }
})
angular.module('jwt-user-login')
.directive('userLogin', function($routeParams, $location, $rootScope, clusterauth){
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
		$scope.errorMsg = "";
		clusterauth.createUser($scope.newUser)
		.then(function(){
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/home');
		})
		.catch(function(e){
			if(e.status === 409)
			{
				$scope.errorMsg = "An account already exist with this email address. Login with your account or create a new one with a new email address";
				//alert("An account already exist with this email address. Recover password or create a new account with a new email address");
			}
			throw e;
		});
	}

	$scope.recoverPassword = function(){
		$scope.errorMsg = "";
		if(!$scope.user.email)
		{
			alert("No email address specified in email field.");
			return false;
		}
		clusterauth.sendRecoverPassword({
			email: $scope.user.email
		})
		.then(function(res){
			alert(res.data);
		})
		.catch(function(e){
			if(e.status === 401)
			{
				$scope.errorMsg = "I don't know who you are, you need to create an account first!"
			}
		})
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
				alert('Password must contains 6 characters including at least one uppercase letter and one number - special characte allowed')
				console.error(e);
				throw e;
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
			return clusterauth.getUser();
		})
		.then(function(res){
			$rootScope.user = res.data;
			$location.path('/home');
		})
		.catch(function(e){
			if(e.status === 401 && $scope.user.password)
			{
				$scope.errorMsg = "Wrong identification - check if email and password are corrects";
				//alert("Wrong identification - check if email and password are corrects");
			}
			console.log(e);

			throw e;
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


angular.module('jwt-user-login').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('./src/jwtUserLogin.template.html',
    "<div class=\"ng-col-12 se-slope\" >\n" +
    "  <div class=\"row\">\n" +
    "    <div ng-if=\"showLogin && !resetUser\" class=\"containerLogin\">\n" +
    "      <form class=\"form-login\">\n" +
    "        <h2 class=\"form-login-heading\">Please login</h2>\n" +
    "        <label for=\"inputEmail\" class=\"sr-only\">Email address</label>\n" +
    "        <input id=\"inputEmail\" class=\"form-control\" placeholder=\"Email address\" required=\"\" autofocus=\"\" type=\"email\" ng-model=\"user.email\">\n" +
    "        <label for=\"inputPassword\" class=\"sr-only\">Password</label>\n" +
    "        <input id=\"inputPassword\" class=\"form-control\" placeholder=\"Password\" required type=\"password\" ng-model=\"user.password\" pattern=\"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}\" title=\"Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters\">\n" +
    "\n" +
    "        <div style=\"color:red;\"> {{errorMsg}}</div>\n" +
    "\n" +
    "        <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\" ng-click=\"login()\">Login</button>\n" +
    "        <div class=\"etc-login-form\">\n" +
    "    			<p>forgot your password? <a href=\"\" ng-click=\"recoverPassword()\">click here</a></p>\n" +
    "    			<p>new user? <a href=\"\" ng-click=\"switchForm()\">create new account</a></p>\n" +
    "    		</div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"!showLogin && !resetUser\" class=\"containerLogin\">\n" +
    "      <form class=\"form-login\">\n" +
    "        <h2 class=\"form-login-heading\">Create an account</h2>\n" +
    "        <label for=\"inputName\" class=\"sr-only\">User Name</label>\n" +
    "        <input id=\"inputName\" class=\"form-control\" placeholder=\"User name\" required=\"\" autofocus=\"\" type=\"text\" ng-model=\"newUser.name\">\n" +
    "        <label for=\"inputEmail\" class=\"sr-only\">Email address</label>\n" +
    "        <input id=\"inputEmail\" class=\"form-control\" placeholder=\"Email address\" required=\"\" autofocus=\"\" type=\"email\" ng-model=\"newUser.email\">\n" +
    "        <label for=\"inputPassword\" class=\"sr-only\" >Password</label> \n" +
    "        <input id=\"inputPassword\" class=\"form-control\" placeholder=\"Password\" required=\"\" type=\"password\" ng-model=\"newUser.password\" pattern=\"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}\" title=\"Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters\"> <a href=\"\" data-toggle=\"tooltip\" title=\"Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters\"> Help <i class=\"glyphicon glyphicon-info-sign\"> </i> </a>\n" +
    "\n" +
    "        <div style=\"color:red;\"> {{errorMsg}}</div>\n" +
    "\n" +
    "        <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\" ng-click=\"createUser()\">Create and Login</button>\n" +
    "        <div class=\"etc-login-form\">\n" +
    "          <p>existing user? <a href=\"\" ng-click=\"switchForm()\">Login with your account</a></p>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"resetUser\" class=\"containerLogin\">\n" +
    "      <form class=\"form-rest-password\" >\n" +
    "        <h2 class=\"form-login-heading\">Reset your password</h2>\n" +
    "        <label for=\"inputPassword0\" class=\"sr-only\">Password</label>\n" +
    "        <input id=\"inputPassword0\" class=\"form-control\" placeholder=\"Password\" required=\"\" type=\"password\" ng-model=\"resetUser.password0\" autocomplete=\"off\">\n" +
    "        <label for=\"inputPassword1\" class=\"sr-only\">Confirm Password</label>\n" +
    "        <input id=\"inputPassword1\" class=\"form-control\" placeholder=\"Confirm assword\" required=\"\" type=\"password\" ng-model=\"resetUser.password1\" autocomplete=\"off\">\n" +
    "        <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\" ng-click=\"resetPassword()\">Reset and Login</button>\n" +
    "\n" +
    "        <p> <a href=\"#/welcome\">Login page</a> </p>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );

}]);
