angular.module('cTRIVIAL')
.controller('morphologicalData', ['$scope','$http', 'dcbia', 'clusterauth', function($scope, $http, dcbia, clusterauth) {

	clusterauth.getUser()
	.then(function(res){
		$scope.user = res;
	})
	$scope.morphologicalDataSectionDisplay = {
		section: 0
	};

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

	$scope.defaultMorphologicalDataCollection = {
		_id: "defaultMorphologicalDataCollection",
		name: "All morphological data",
		type: "morphologicalDataCollection",
		items: 0
	}

	$scope.morphologicalData = {};


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
		    $scope.morphologicalDataCollection.selectedCollectionData = selectedCollectionData;
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
	

	$scope.morphologicalDataCollection.addMorphologicalData = function(collection){
		$scope.morphologicalDataCollection.selectCollection(collection);
	}

	$scope.morphologicalDataCollection.getMorphologicalDataCollections();
	

}]);