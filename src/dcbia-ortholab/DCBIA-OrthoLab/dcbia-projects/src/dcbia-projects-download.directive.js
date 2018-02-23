angular.module('dcbia-projects')
.directive('projectsDataDownload', function($q, $routeParams, dcbia, clusterauth) {
	


	function link($scope, $element, $attrs){


		$scope.patient = {
			isDownloading: false
		};

		dcbia.getProject($routeParams.projectId)		
		.then(function(res){
			$scope.project = res.data;
			var morphologicaldatacollections = $scope.project.collections.morphologicalDataCollection;
			var arrayofpromises = _.map(morphologicaldatacollections, function(collectionid){
				return dcbia.getMorphologicalDataByCollectionIdPatientId(collectionid, $routeParams.patientId)
			});
			return Promise.all(arrayofpromises)
			.then(function(res){
				return _.flatten(_.pluck(res, 'data'));
			});
		})
		.then(function(res){
			console.log(res);
			$scope.patient.morphologicaldata = res;
		});


		$scope.vtk = {};

		$scope.vtk.download = function(filename, morphologicaldata){


			//document.getElementById('loader').innerHTML = "<img src='/tenor.gif' alt='load'/><br/>Loading, please wait ...";

			return dcbia.getAttachement(morphologicaldata._id, filename, 'blob')
			.then(function(res){
				var pom = document.createElement('a');
				$element[0].appendChild(pom);
				var bb = res.data;

				pom.setAttribute('href', window.URL.createObjectURL(bb));
				pom.setAttribute('download', filename);

				pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
				pom.click();

				
			})
			
		}


		$scope.vtk.downloadAll=function(){

			$scope.patient.isDownloading = true;

			return Promise.all(_.flatten(_.map($scope.patient.displayedCollection, function(row){
				return _.map(row._attachments, function(value, key){
					return $scope.vtk.download(key, row);
				});
			})))
			.then(function(){
				$scope.patient.isDownloading = false;
				$scope.$apply();
			})
			.catch(function(e){
				console.error(e);
				$scope.patient.isDownloading = false;
				$scope.$apply();
			});

			// var width=60;
			// var height=40;
			// var dataLoading=true;
			// var text1="<button type='submit' ng-disabled="+dataLoading+" class='btn btn-primary'>Loading</button>";
   //          var text2="<img ng-if="+dataLoading+" src='dcbia-projects/src/loading.gif'/>";
			// var element=document.getElementById('loader').innerHTML= text1;
			// var element2=document.getElementById('loader').innerHTML= text2;
			// var row=filename[0]._attachments;
			// _.each(row, function(item, i){
			// 	$scope.vtk.download(i, filename[0]);
			// 	//dataLoading=false;
			// });
			// dataLoading=false;
		}


		$scope.myFunction=function(){
    		document.getElementById('loader').innerHTML = "<img src='dcbia-projects/src/tenor.gif' alt='load'/>";
		}



		// $scope.projectsDataDownload.vtk.export=function(attachmentId){
		// 	var filename = $scope.projectsDataDownload.patient.displayedCollection._attachments;
		// 	console.log(filename);
		// 	var vtk=$scope.projects.selectedProjectDataKeys._attachments;
		// 	return $scope.vtk.download(filename, vtk);
		// }

		


		
	}
	return {
		restrict : 'E',
	    link : link,
	    templateUrl: './src/dcbia-projects-download.template.html'
	}
});