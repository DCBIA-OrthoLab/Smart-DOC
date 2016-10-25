
angular.module('home')
.controller('home', ['$scope','$http','dcbia','clusterauth', function($scope, $http, dcbia, clusterauth) {
  
  $scope.pieLabels = [];
  $scope.pieData = [];  
  $scope.pieOptions = { 
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: true,
        text: 'Surveys done by user',
        fontSize: 17
    },
    animation:{
        animateScale:true
    }
  }

  clusterauth.getUser()
  .then(function(res){
    $scope.user = res;
  })  

  dcbia.getClinicalDataOwners()
    .then(function(res){
      $scope.ownersData = res.data;
      _.each($scope.ownersData,function(owner){
        index = $scope.pieLabels.indexOf(owner.owner);
        if( index == -1) {
          $scope.pieLabels.push(owner.owner);
          $scope.pieData.push(1);
        }
        else{
          $scope.pieData[index]+=1;
        }
      })
  })
    



}]);

