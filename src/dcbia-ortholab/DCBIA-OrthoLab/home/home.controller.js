
angular.module('home')
.controller('home', ['$scope','$http','$q','dcbia','clusterauth', function($scope, $http, $q, dcbia, clusterauth) {

	clusterauth.getUser()
	.then(function(res){
		$scope.user = res;
	})
	$scope._ = _;

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
		data: [],
		percentage: [],
		// [
		// "#FF0000",
		// "#DCDCDC"
		// ]
		colors: [],
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
		data: [],
		options:{
			title:{
				text: "Top users",
				display: true,
				fontSize: 17
			},
			scales:{
				xAxes: [{
					ticks: {
						suggestedMin: 0,
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

	$scope.projects = [];
		
	$scope.projects.mergeCollections = function(collection1, collection2){
		_.each(collection2, function(col) {
		        var mergedCollection = _.find(collection1, function(mergedCollection) {
		            return mergedCollection["patientId"] === col["patientId"];
		        });
		        mergedCollection ? _.extend(mergedCollection, col) : collection1.push(col.patientId);
		});
		return collection1;
	}
	dcbia.getClinicalDataOwners()
  	.then(function(res){
		$scope.ownersData = res.data;
		$scope.ownersData.owners = _.map($scope.ownersData,function(data){return data.owner})
	})


	dcbia.getProjects()
	.then(function(res){
		$scope.projects = res.data;

		_.each($scope.projects,function(project,i){
			$scope.projects[i].items = [];
			var patients = [];

			function getProjectClinicalData(patients){
				return Promise.all(_.map(_.map(project.collections,function(col){ return col._id }),dcbia.getClinicalData))
				.then(function(res) {
					_.each(res,function(collection){
						patients = _.union(patients,_.map(collection.data, function(data){$scope.projects[i].items.push(data._id); return data.patientId;}))
					})
					return patients
				});
			}
			function getProjectMorphologicalData(patients){
				return Promise.all(_.map(_.map(project.collections,function(col){ return col._id }),dcbia.getMorphologicalData))
				.then(function(res) {
					_.each(res,function(collection){
						patients = _.union(patients,_.map(collection.data, function(data){$scope.projects[i].items.push(data._id); return data.patientId;}))
					})
					return patients;
				});
			}

			$q.all([getProjectClinicalData(patients),getProjectMorphologicalData(patients)])
			.then(function(values){
				patients = _.union(values[0],values[1])
				$scope.progressionChart.data.push([patients.length, Number(project.patients)-patients.length]);
				$scope.progressionChart.percentage.push(Math.round($scope.progressionChart.data[i][0]*100/($scope.progressionChart.data[i][0]+$scope.progressionChart.data[i][1])));
				var green = Math.min(Math.round($scope.progressionChart.percentage[i]*2.4*2),240)
				var red = Math.min(Math.round(480-$scope.progressionChart.percentage[i]*2.4*2),240)
				$scope.progressionChart.colors.push(["#" + red.toString(16) + green.toString(16) + "00","#DCDCDC"]);
				var surveysPerUserLabel = [];
				var surveysPerUserData = [];
				_.each($scope.ownersData,function(owner){
					if(project.items.indexOf(owner._id)!==-1){
						index = surveysPerUserLabel.indexOf(owner.owner);
						if( index === -1) {
							surveysPerUserLabel.push(owner.owner);
							surveysPerUserData.push(1);
						}
						else{
							surveysPerUserData[index]+=1;
						}
					}
				})
				var tempArrayData = JSON.parse(JSON.stringify(surveysPerUserData));
				var tempArrayLabel = [];
				tempArrayData.sort().reverse();
				_.each(tempArrayData,function(item){
					tempArrayLabel.push(surveysPerUserLabel[surveysPerUserData.indexOf(item)]);
				})
				var scaleData = []
				_.each(tempArrayData,function(data,i){
					scaleData.push(tempArrayData[0]);
				})
				$scope.surveysPerUserChart.labels.push(surveysPerUserLabel);
				$scope.surveysPerUserChart.data.push(surveysPerUserData);
				$scope.topUserData.labels.push(tempArrayLabel);
				$scope.topUserData.data.push([tempArrayData,scaleData]);
			})
		})
	})

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

