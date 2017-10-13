angular.module('data-collections')
.directive('morphologicalData', function($routeParams, dcbia, clusterauth) {

	function link($scope, $attrs, $filter){

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

		$scope.csv = {};

		$scope.$watch('csv.file', function(){
			if($scope.csv.file){
				$scope.csv.readFile()
				.then(function(){
					$scope.$apply();
				});
			}
		});

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

		$scope.morphologicalDataCollection.update = function(collection){
			return dcbia.updateMorphologicalDataCollection(collection)
			.then(function(res){
				return $scope.morphologicalDataCollection.refreshSelectedCollection();
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

		$scope.morphologicalDataCollection.refreshSelectedCollection = function(){
			return $scope.morphologicalDataCollection.select($scope.morphologicalDataCollection.selectedCollection)
			.then(function(res){
				return dcbia.getMorphologicalDataCollection($scope.morphologicalDataCollection.selectedCollection._id)
				.then(function(res){
					$scope.morphologicalDataCollection.selectedCollection = res.data
					$scope.morphologicalDataCollection.collections = _.map($scope.morphologicalDataCollection.collections, function(morphologicalDataCollection){
						if(morphologicalDataCollection._id === $scope.morphologicalDataCollection.selectedCollection._id){
							return $scope.morphologicalDataCollection.selectedCollection;
						}
						return morphologicalDataCollection;
					});
				});
			});
		};

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

		$scope.morphologicalDataCollection.addMorphologicalData = function(morphologicalData, update){

			var prom;

			if(!morphologicalData){
				if ($scope.morphologicalData.data.date == undefined) {
					var dt = new Date();
				}
				else{
					var dt = $scope.morphologicalData.data.date
				}
				var year = dt.getFullYear();
				var month = ((dt.getMonth()+1)>=10)? (dt.getMonth()+1) : '0' + (dt.getMonth()+1);
				var day = ((dt.getDate())>=10)? (dt.getDate()) : '0' + (dt.getDate());
				$scope.morphologicalData.data.date = year + "-" + month + "-" + day;
				var morphologicalData = {
					patientId: $scope.morphologicalData.data.patientId,
					date: $scope.morphologicalData.data.date,
					scope: [],
					owners: [],
					type: "morphologicalData"
				}
				morphologicalData.owners.push({
					user: $scope.user.email
				});

				prom = dcbia.createMorphologicalData(morphologicalData)
				.then(function(res){
					return dcbia.addAttachement(res.data.id, $scope.morphologicalData.data.file.name, $scope.morphologicalData.data.file);
				})
				.then(function(res){
					$scope.morphologicalData.clear();
				});
			}else{
				prom = Promise.resolve({
					data: {
						id: morphologicalData._id
					}
				})
			}
			
			return prom
			.then(function(res){

				var index = _.indexOf($scope.morphologicalDataCollection.selectedCollection.items, function(it){
					return res.data.id == it._id;
				});

				if(index == -1){
					$scope.morphologicalDataCollection.selectedCollection.items.push({
						_id: res.data.id
					});
					if(update){
						return dcbia.updateMorphologicalDataCollection($scope.morphologicalDataCollection.selectedCollection)
						.then(function(){
							return $scope.morphologicalDataCollection.refreshSelectedCollection();
						});
					}
				}

				
				return Promise.resolve();
			})
			.catch(function(err){
				alert(JSON.stringify(err));
			})
			
		}

		$scope.morphologicalDataCollection.addAllMorphologicalData = function(){
			return Promise.all(_.map($scope.morphologicalDataCollection.displayedCollectionDataSelect, function(morphologicalData){
				return $scope.morphologicalDataCollection.addMorphologicalData(morphologicalData, false);
			}))
			.then(function(res){
				return dcbia.updateMorphologicalDataCollection($scope.morphologicalDataCollection.selectedCollection);
			})
			.then(function(res){
				return $scope.morphologicalDataCollection.refreshSelectedCollection();
			})
			.catch(function(err){
				console.error(err);
			})
		}

		$scope.morphologicalDataCollection.getAllMorphologicalDataSelect = function(){
			return dcbia.getAllMorphologicalData()
			.then(function(res){

				$scope.morphologicalDataCollection.collectionDataSelectInCollection = {};

				_.each($scope.morphologicalDataCollection.selectedCollectionData, function(morphologicalData){
					$scope.morphologicalDataCollection.collectionDataSelectInCollection[morphologicalData._id] = true;
				});

			    $scope.morphologicalDataCollection.collectionDataSelect = _.map(res.data, function(d){
			    	if(d._attachments){
			    		_.extend(d, {
			    			attachments: _.keys(d._attachments)
			    		});
			    	}
			    	return d;
			    	
			    });
				$scope.morphologicalDataCollection.collectionDataSelectKeys = $scope.morphologicalDataCollection.getDataCollectionKeys($scope.morphologicalDataCollection.collectionDataSelect);

			})
			.catch(console.error);
		}


		$scope.morphologicalDataCollection.getMorphologicalDataCollections()
		.then(function(){
			if($routeParams.collectionId){
				var col = _.find($scope.morphologicalDataCollection.collections, function(col){
					return col._id === $routeParams.collectionId;
				});
				$scope.morphologicalDataCollection.section = 0;
				return $scope.morphologicalDataCollection.select(col);
			}
		})
		.catch(console.error);

		$scope.morphologicalData.remove = function(item, accept, update){
			if(accept? accept : confirm("Do you want to remove the current item?")){
				var index = _.indexOf($scope.morphologicalDataCollection.selectedCollection.items, function(it){
					return it._it === item._id;
				});
				$scope.morphologicalDataCollection.selectedCollection.items.splice(index, 1);
				if(update){
					return $scope.morphologicalDataCollection.update($scope.morphologicalDataCollection.selectedCollection)
					.then(function(){
						return $scope.morphologicalDataCollection.refreshSelectedCollection();
					});
				}
			}
			return Promise.resolve(true);
		}

		$scope.morphologicalData.delete = function(item, accept, update){
			if(accept? accept : confirm("Do you want to delete the current item?")){
				return dcbia.deleteMorphologicalData(item._id)
				.then(function(){
					return $scope.morphologicalData.remove(item, true, update);
				});
			}
		}

		$scope.morphologicalData.removeAll = function(){
			if(confirm("Do you want to remove all the displayed items from the collection?")){
				return Promise.all(_.map($scope.morphologicalDataCollection.displayedCollection, function(item){
					return $scope.morphologicalData.remove(item, true, false);
				}))
				.then(function(res){
					return $scope.morphologicalDataCollection.update($scope.morphologicalDataCollection.selectedCollection);
				})
				.then(function(res){
					return $scope.morphologicalDataCollection.refreshSelectedCollection();
				})
				.then(function(res){
					console.log(res);
				});
			}
		}

		$scope.morphologicalData.deleteAll = function(){
			if(confirm("Do you want to delete all the displayed items?")){
				return Promise.all(_.map($scope.morphologicalDataCollection.displayedCollection, function(item){
					return $scope.morphologicalData.delete(item, true, false);
				}))
				.then(function(res){
					return $scope.morphologicalDataCollection.update($scope.morphologicalDataCollection.selectedCollection);
				})
				.then(function(res){
					return $scope.morphologicalDataCollection.refreshSelectedCollection();
				})
				.then(function(res){
					console.log(res);
				});
			}
		}

		$scope.morphologicalData.clear = function(){
			$scope.morphologicalData.data = {};
		}
	

		$scope.morphologicalData.viewAttachment = function(mdata, att){
			$scope.morphologicalData.surface = null;
			 dcbia.getAttachement(mdata._id, att, "arraybuffer")
			 .then(function(res){
			 	$scope.morphologicalData.surface = res.data;
			 });
			
		}

		$scope.csv.export = function(collection){
			var prom;
			if(!$scope.morphologicalDataCollection.selectedCollection || collection._id !== $scope.morphologicalDataCollection.selectedCollection._id){
				prom = $scope.morphologicalDataCollection.select(collection);
			}else{
				prom = Promise.resolve(true);
			}

			prom
			.then(function(){
				var keys = $scope.morphologicalDataCollection.getDataCollectionKeys($scope.morphologicalDataCollection.selectedCollectionData);
				var csv = keys.toString();
				csv += '\n';

				_.each($scope.morphologicalDataCollection.selectedCollectionData, function(row, i){
					_.each(keys, function(key, j){
						var value;
						if(Array.isArray(row[key])){
							var objectKeys = {};						
							_.each(row[key], function(item,k){
								if(typeof(item) === "object"){
									objectKeys = Object.keys(item);
									_.each(objectKeys,function(key,l){
										if(k === 0 && l ===0){
											value = item[key]? item[key]: '';
										}
										else{
											value += ' ' + (item[key]? item[key]: '');
										}
									})
								}else{
									if(k === 0){
										value = item? item: '';
									}else{
										value += ' ' + (item? item: '');
									}
								}
							})
						}else{
							value = row[key]? row[key]: '';
						}
						csv += value;
						if(j < keys.length -1){
							csv += ","
						}
					});
					if( i < $scope.morphologicalDataCollection.selectedCollectionData.length - 1){
						csv += "\n";
					}
				});

				var filename = $scope.morphologicalDataCollection.selectedCollection.name;
				if($scope.morphologicalDataCollection.selectedCollection.name.indexOf('csv') === -1){
					filename += '.csv';
				}

				return $scope.csv.download(filename, csv);
			});
			
		}

		$scope.csv.download = function(filename, csv){

			var pom = document.createElement('a');
			var bb = new Blob([csv], {type: 'text/plain'});

			pom.setAttribute('href', window.URL.createObjectURL(bb));
			pom.setAttribute('download', filename);

			pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
			pom.click();
			
		}

		

	}

	return {
		restrict : 'E',
	    link : link,
	    templateUrl: './src/morphologicalData.template.html'
	}	

});