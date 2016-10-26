
angular.module('home')
.controller('home', ['$scope','$http','dcbia','clusterauth', function($scope, $http, dcbia, clusterauth) {
  
  clusterauth.getUser()
  .then(function(res){
    $scope.user = res;
  })

  $scope.surveysPerUserChart = {
    labels: [],
    data: [],
    options: {
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
  };

  $scope.progressionChart = {
    labels: ["Done","Left"],
    data: [0,48],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Progression',
        fontSize: 17
      },
      animation:{
        animateScale:true
      },
      rotation: Math.PI,
      circumference: Math.PI
    }
  };


  $scope.lineChartData = {
    selectedDates: 0,
    labels: [],
    series: ["Surveys done"],
    data: [[]],
    options: {
      title: {
        text: "Contribution activity",
        display: true,
        fontSize: 17
      }
    }
  };


  // $scope.surveysPerUserChart.getDataOwners = function(){
    dcbia.getClinicalDataOwners()
      .then(function(res){
        $scope.ownersData = res.data;
        $scope.progressionChart.data[0]=res.data.length;
        $scope.progressionChart.data[1]-=res.data.length;
        _.each($scope.ownersData,function(owner){
          
          index = $scope.surveysPerUserChart.labels.indexOf(owner.owner);
          if( index == -1) {
            $scope.surveysPerUserChart.labels.push(owner.owner);
            $scope.surveysPerUserChart.data.push(1);
          }
          else{
            $scope.surveysPerUserChart.data[index]+=1;
          }
        })
    })
  // }

  var date = new Date();
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
  ];

  $scope.lineChartData.showOneWeek = function(){
    $scope.lineChartData.selectedDates = 1;
    $scope.lineChartData.labels = [];
    $scope.lineChartData.data = [[]];
    for (var i = 0; i < 7; i++){
      var tempDate = new Date();
      tempDate.setDate(date.getDate()-(6-i));
      var str = monthNames[tempDate.getMonth()] + " " + tempDate.getDate();
      $scope.lineChartData.labels.push(str);
      $scope.lineChartData.data[0].push(0);
    }
    dcbia.getClinicalDataOwner($scope.user.email)
    .then(function(res){
      _.each(res.data,function(survey){
        var date = monthNames[parseInt(survey.date.toString().substr(5,2))-1] + " " + survey.date.toString().substr(8,2);
        index = $scope.lineChartData.labels.indexOf(date);
        if( index != -1) {
          $scope.lineChartData.data[0][index]+=1;
        }
      })
    })
  };

  $scope.lineChartData.showOneMonth = function(){
    $scope.lineChartData.selectedDates = 2;
    $scope.lineChartData.labels = [];
    $scope.lineChartData.data = [[]];
    for (var i = 0; i < 31; i++){
      var tempDate = new Date();
      tempDate.setDate(date.getDate()-(30-i));
      var str = monthNames[tempDate.getMonth()] + " " + tempDate.getDate();
      $scope.lineChartData.labels.push(str); 
      $scope.lineChartData.data[0].push(0); 
    }
    dcbia.getClinicalDataOwner($scope.user.email)
    .then(function(res){
      _.each(res.data,function(survey){
        var date = monthNames[parseInt(survey.date.toString().substr(5,2))-1] + " " + survey.date.toString().substr(8,2);
        index = $scope.lineChartData.labels.indexOf(date);
        if( index != -1) {
          $scope.lineChartData.data[0][index]+=1;
        }
      })
    })
  };

  $scope.lineChartData.showOneYear = function(){
    $scope.lineChartData.selectedDates = 3;
    $scope.lineChartData.labels = [];
    $scope.lineChartData.data = [[]];
    for (var i = 0; i < 12; i++){
      var tempDate = new Date();
      tempDate.setDate(date.getDate()-(31*(11-i)));
      var str = monthNames[tempDate.getMonth()] + " " + tempDate.getFullYear().toString().substr(2,2);
      $scope.lineChartData.labels.push(str);  
      $scope.lineChartData.data[0].push(0);
    }
    dcbia.getClinicalDataOwner($scope.user.email)
    .then(function(res){
      _.each(res.data,function(survey){
        var date = monthNames[parseInt(survey.date.toString().substr(5,2))-1] + " " + survey.date.toString().substr(2,2);
        index = $scope.lineChartData.labels.indexOf(date);
        if( index != -1) {
          $scope.lineChartData.data[0][index]+=1;
        }
      })
    })
  };

}]);

