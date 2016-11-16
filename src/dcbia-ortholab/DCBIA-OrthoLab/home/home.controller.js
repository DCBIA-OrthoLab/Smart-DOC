
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
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontSize: 10,
          boxWidth: 25
        }
      },
      tooltips:{
        callbacks: {
          title: function(tooltipItems, data) {
            return "";
          },
          label: function(tooltipItem, data) {
            var value = data.datasets[0].data[tooltipItem.index];
            var total = 0;
            _.each(data.datasets[0].data,function(items){
              total += items;
            })
            var percentage = Math.round(value / total * 100);
            return percentage + " %";
          }
        }
      }
    }
  };

  $scope.progressionChart = {
    labels: ["Done","Left"],
    data: [0,24],
    percentage: 0,
    colors: [
      "#FF0000",
      "#DCDCDC"
    ],
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
      circumference: Math.PI,
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          title: function(tooltipItems, data) {
            return data.labels[tooltipItems[0].index];
          },
          label: function(tooltipItem, data) {
            var value = data.datasets[0].data[tooltipItem.index];
            var total = data.datasets[0].data[0] + data.datasets[0].data[1];
            var percentage = Math.round(value / total * 100);
            return percentage + '%';
          }
        }
      },
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

  $scope.topUserData = {
    labels:[],
    data: [[],[]],
    options:{
      title:{
        text: "Top users",
        display: true,
        fontSize: 17
      },
      scales:{
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            display:false
          }
        }],
        yAxes: [{
          stacked: true,
          gridLines: {
            display:false,
          }
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          title: function(tooltipItems, data) {
            return "";
          },
          label: function(tooltipItem, data) {
            return data.datasets[0].data[tooltipItem.index];
          }
        }
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
            $scope.topUserData.labels.push(owner.owner);
            $scope.surveysPerUserChart.data.push(1);
            $scope.topUserData.data[0].push(1);
          }
          else{
            $scope.surveysPerUserChart.data[index]+=1;
            $scope.topUserData.data[0][index]+=1;
          }
        })
        $scope.progressionChart.percentage = Math.round($scope.progressionChart.data[0]*100/($scope.progressionChart.data[0]+$scope.progressionChart.data[1]));
        var green = Math.min(Math.round($scope.progressionChart.percentage*2.4*2),240)
        var red = Math.min(Math.round(480-$scope.progressionChart.percentage*2.4*2),240)
        $scope.progressionChart.colors[0] = "#" + red.toString(16) + green.toString(16) + "00";
        var tempArrayData = JSON.parse(JSON.stringify($scope.topUserData.data[0]));
        var tempArrayLabel = [];
        tempArrayData.sort().reverse();
        _.each(tempArrayData,function(item){
          tempArrayLabel.push($scope.topUserData.labels[$scope.topUserData.data[0].indexOf(item)]);
        })
        $scope.topUserData.labels = tempArrayLabel;
        $scope.topUserData.data[0] = tempArrayData;
        for(i=0;i<$scope.topUserData.data[0].length;i++){
          $scope.topUserData.data[1].push($scope.topUserData.data[0].reduce(function(a, b) { return a + b; }, 0));
        }
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

