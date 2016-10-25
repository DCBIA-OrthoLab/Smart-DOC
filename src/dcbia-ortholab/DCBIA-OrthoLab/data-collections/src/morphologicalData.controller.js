angular.module('data-collections')
.controller('morphologicalData', ['$scope','$http', 'dcbia', 'clusterauth', function($scope, $http, dcbia, clusterauth) {

	clusterauth.getUser()
	.then(function(res){
		$scope.user = res;
	})
	$scope.morphologicalDataSectionDisplay = {
		section: 0
	};

	$scope._ = _;

	$scope.morphologicalDataCollection = {
		newCollection: {
			items: [],
			type: "morphologicalDataCollection",
			name: ""
		},
		collections: [],
		collectionsProperties: {
			"defaultMorphologicalDataCollection": {
				class: ''
			}
		},
		section: -1
	};

	$scope.morphologicalData = {
		data: {}
	};

	$scope.defaultMorphologicalDataCollection = {
		_id: "defaultMorphologicalDataCollection",
		name: "All morphological data",
		type: "morphologicalDataCollection",
		items: 0
	}


	$scope.morphologicalDataCollection.getMorphologicalDataCollections = function(){
		return dcbia.getMorphologicalDataCollections()
		.then(function(res){
			delete $scope.morphologicalDataCollection.selectedCollection;
			$scope.morphologicalDataCollection.collections = res.data;
			_.each($scope.morphologicalDataCollection.collections, function(collection){
				$scope.morphologicalDataCollection.collectionsProperties[collection._id] = {
					class : ""
				};
			});
		})
		.catch(console.error);
	}

	$scope.morphologicalDataCollection.create = function(newCollection){
		dcbia.createMorphologicalDataCollection(newCollection)
		.then(function(res){
			return $scope.morphologicalDataCollection.getMorphologicalDataCollections();
		})
		.catch(console.error);
	}

	$scope.morphologicalDataCollection.selectCollection = function(collection){
		if($scope.morphologicalDataCollection.selectedCollection){
			$scope.morphologicalDataCollection.collectionsProperties[$scope.morphologicalDataCollection.selectedCollection._id].class = "";
		}
		$scope.morphologicalDataCollection.selectedCollection = collection;
		$scope.morphologicalDataCollection.collectionsProperties[collection._id].class = "alert alert-info";
	}

	$scope.morphologicalDataCollection.getDataCollectionKeys = function(collectiondata){
		var collectionDataKeys = {};
		_.each(collectiondata, function(item){
			_.extend(collectionDataKeys, item);
		});

		if(collectionDataKeys._id){
			delete collectionDataKeys._id;
		}

		if(collectionDataKeys._rev){
			delete collectionDataKeys._rev;
		}

		if(collectionDataKeys._attachments){
			delete collectionDataKeys._attachments;
		}

		collectionDataKeys.attachments = {};

		return _.keys(collectionDataKeys);
	}

	$scope.morphologicalDataCollection.select = function(collection){
		
		$scope.morphologicalDataCollection.selectCollection(collection);
		var prom;
		if(collection._id === 'defaultMorphologicalDataCollection'){
			prom = dcbia.getAllMorphologicalData()
			.then(function(res){
				$scope.defaultMorphologicalDataCollection.items = _.map(res.data, function(doc){
					if(!doc.patientId){
						doc.patientId = 'null';
					}
					return {
						_id: doc._id
					}
				});
				return res;
			});
		}else{
			prom = dcbia.getMorphologicalData(collection._id);
		}

		return prom
		.then(function(res){
			var selectedCollectionData = res.data;
		    $scope.morphologicalDataCollection.selectedCollectionData = _.map(selectedCollectionData, function(d){
		    	if(d._attachments){
		    		_.extend(d, {
		    			attachments: _.keys(d._attachments)
		    		});
		    	}
		    	return d;
		    	
		    });
			$scope.morphologicalDataCollection.selectedCollectionDataKeys = $scope.morphologicalDataCollection.getDataCollectionKeys(selectedCollectionData);


		})
		.catch(console.error);
	}

	$scope.morphologicalDataCollection.delete = function(collection){
		
		if (confirm("Are you sure you want to delete the collection?")) {
		    dcbia.deleteMorphologicalDataCollection(collection._id)
			.then(function(res){
				return $scope.morphologicalDataCollection.getMorphologicalDataCollections();
			})
			.catch(console.error);
		} 
		
	}

	$scope.morphologicalDataCollection.download = function(collection){
		console.log("TODO");
	}
	

	$scope.morphologicalDataCollection.addMorphologicalData = function(){
		if ($scope.morphologicalData.data.date == undefined) {
			var dt = new Date();
			$scope.morphologicalData.data.date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
		}
		var morphologicalData = {
			patientId: $scope.morphologicalData.data.patientId,
			date: $scope.morphologicalData.data.date,
			owners: [],
			type: "morphologicalData"
		}
		morphologicalData.owners.push({
			user: $scope.user.email
		});
		dcbia.createMorphologicalData(morphologicalData)
		.then(function(res){
			$scope.morphologicalDataCollection.selectedCollection.items.push({
				_id: res.data.id
			});
			return Promise.all([dcbia.addAttachement(res.data.id, $scope.morphologicalData.data.file.name, $scope.morphologicalData.data.file), dcbia.updateMorphologicalDataCollection($scope.morphologicalDataCollection.selectedCollection)]);
		})
		.then(function(res){
			console.log(res);
		})
		.catch(function(err){
			alert(JSON.stringify(err));
		})
		
	}

	$scope.morphologicalData.delete = function(m){
		console.log(m);
	}

	$scope.morphologicalData.viewAttachment = function(mdata, att){
		$scope.morphologicalData.surface = null;
		 dcbia.getAttachement(mdata._id, att, "arraybuffer")
		 .then(function(res){
		 	$scope.morphologicalData.surface = res.data;
		 });
		
	}

	$scope.morphologicalDataCollection.getMorphologicalDataCollections();
	

}]);