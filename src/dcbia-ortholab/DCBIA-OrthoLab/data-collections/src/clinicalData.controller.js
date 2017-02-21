
angular.module('data-collections')
.directive('clinicalData', function($routeParams, dcbia, clusterauth) {

	function link($scope, $attrs, $filter){

		clusterauth.getUser()
		.then(function(res){
			$scope.user = res;
		})
		$scope.clinicalDataSectionDisplay = {};

		$scope.clinicalDataCollection = {
			showCreate: false,
			newCollection: {
				items: [],
				type: "clinicalDataCollection",
				name: ""
			},
			collections: [],
			collectionsProperties: {
				"defaultClinicalDataCollection": {
					class: ''
				}
			},
			selectedForm: -1
		};

		$scope.defaultClinicalDataCollection = {
			_id: "defaultClinicalDataCollection",
			name: "All clinical data",
			type: "clinicalDataCollection",
			items: 0
		};


		$scope.clinicalDataCollection.getClinicalDataCollections = function(){
			return dcbia.getClinicalDataCollections()
			.then(function(res){
				delete $scope.clinicalDataCollection.selectedCollection;
				$scope.clinicalDataCollection.collections = res.data;
				_.each($scope.clinicalDataCollection.collections, function(collection){
					$scope.clinicalDataCollection.collectionsProperties[collection._id] = {
						class : ""
					};
				});
			})
			.catch(console.error);
		}

		$scope.clinicalDataCollection.create = function(newCollection){
			dcbia.createClinicalDataCollection(newCollection)
			.then(function(res){
				$scope.clinicalDataCollection.getClinicalDataCollections();
			})
			.catch(console.error);
		}

		$scope.clinicalDataCollection.selectCollection = function(collection){
			if($scope.clinicalDataCollection.selectedCollection){
				$scope.clinicalDataCollection.collectionsProperties[$scope.clinicalDataCollection.selectedCollection._id].class = "";
			}
			$scope.clinicalDataCollection.selectedCollection = collection;
			$scope.clinicalDataCollection.collectionsProperties[collection._id].class = "alert alert-info";
		}

		$scope.clinicalDataCollection.getDataCollectionKeys = function(collectiondata){
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

		$scope.clinicalDataCollection.select = function(collection){
			
			$scope.clinicalDataCollection.selectCollection(collection);
			var prom;
			if(collection._id === 'defaultClinicalDataCollection'){
				prom = dcbia.getAllClinicalData()
				.then(function(res){
					$scope.defaultClinicalDataCollection.items = _.map(res.data, function(doc){
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
				prom = dcbia.getClinicalData(collection._id);
			}

			return prom
			.then(function(res){
				var selectedCollectionData = res.data;
			    $scope.clinicalDataCollection.selectedCollectionData = selectedCollectionData;
				$scope.clinicalDataCollection.selectedCollectionDataKeys = $scope.clinicalDataCollection.getDataCollectionKeys(selectedCollectionData);

			})
			.catch(console.error);
		}

		$scope.clinicalDataCollection.delete = function(collection){
			
			if (confirm("Are you sure you want to delete the collection?")) {
			    dcbia.deleteClinicalDataCollection(collection._id)
				.then(function(res){
					return $scope.clinicalDataCollection.getClinicalDataCollections();
				})
				.catch(console.error);
			} 
			
		}

		$scope.clinicalDataCollection.refreshSelectedCollection = function(){
			$scope.clinicalDataCollection.select($scope.clinicalDataCollection.selectedCollection)
			.then(function(res){
				return dcbia.getClinicalDataCollection($scope.clinicalDataCollection.selectedCollection._id)
				.then(function(res){
					$scope.clinicalDataCollection.selectedCollection = res.data
					$scope.clinicalDataCollection.collections = _.map($scope.clinicalDataCollection.collections, function(clinicalDataCollection){
						if(clinicalDataCollection._id === $scope.clinicalDataCollection.selectedCollection._id){
							return $scope.clinicalDataCollection.selectedCollection;
						}
						return clinicalDataCollection;
					});
				});
			});
		};

		$scope.clinicalDataCollection.addClinicalData = function(collection){
			$scope.clinicalDataCollection.selectCollection(collection);
		}
		

		$scope.clinicalDataCollection.update = function(collection){
			return dcbia.updateClinicalDataCollection(collection)
			.then(function(res){
				collection._rev = res.data.rev;
			});
		}

		$scope.clinicalDataCollection.selectForm = function(formId){
			if($scope.clinicalDataCollection.selectedForm === -1){
				$scope.clinicalDataCollection.selectedForm = formId;
			}else if($scope.clinicalDataCollection.selectedForm !== formId && confirm("You will lose the current changes in this form. Do you want to continue?")){
				$scope.clinicalDataCollection.selectedForm = formId;
			}
		}

		$scope.clinicalDataCollection.getClinicalDataCollections()
		.then(function(){
			if($routeParams.collectionId){
				var col = _.find($scope.clinicalDataCollection.collections, function(col){
					return col._id === $routeParams.collectionId;
				});
				$scope.clinicalDataCollection.showSection = 0;
				return $scope.clinicalDataCollection.select(col)
			}
		})
		.catch(console.error);


		$scope.clinical = {
			data: {}
		};

		$scope.clinical.clearForm = function(force){
			var clear = false;
			if(!force){
				force = confirm("Do you want to clear the current changes?");
			}
			if(force){
				$scope.clinical.data = {};
				$scope.clinical.data.formId = "";
				var dt = new Date();
				var year = dt.getFullYear();
				var month = ((dt.getMonth()+1)>=10)? (dt.getMonth()+1) : '0' + (dt.getMonth()+1);
				var day = ((dt.getDate())>=10)? (dt.getDate()) : '0' + (dt.getDate());
				$scope.clinical.data.date = year + "-" + month + "-" + day;
			}
			
		}

		$scope.clinical.create = function(){
			var selectedCollection = $scope.clinicalDataCollection.selectedCollection;
			if(!selectedCollection){
				alert("You need to select a collection first!");
			}else if($scope.clinical.data){
				$scope.clinical.data = $scope.clinical.checkProblemsAnswers($scope.clinical.data)
				$scope.clinical.createClinicalData($scope.clinical.data)
				.then(function(res){
					selectedCollection.items.push({_id:res.data.id});
					return $scope.clinicalDataCollection.update(selectedCollection);
				})
				.catch(console.error);
			}
		}

		$scope.clinical.createClinicalData = function(clinical){
			clinical.type = "clinicalData";
			return dcbia.createClinicalData(clinical)
			.catch(console.error);
		}

		$scope.clinical.deleteAllFiltered = function(clinicalData){
			if(confirm("Do you want to delete the items beign displayed?")){
				Promise.all(_.map(clinicalData, function(item){
					$scope.clinicalDataCollection.selectedCollection.items.splice(_.findIndex($scope.clinicalDataCollection.selectedCollection.items,{"_id":item._id}),1);
					return dcbia.deleteClinicalData(item._id);
				}));
			}
			$scope.clinicalDataCollection.update($scope.clinicalDataCollection.selectedCollection);
			$scope.clinicalDataCollection.select($scope.clinicalDataCollection.selectedCollection);
		}

		$scope.clinical.delete = function(item){
			if(confirm("Do you want to delete the current item?")){
				return dcbia.deleteClinicalData(item._id)
				.then(function(){
					$scope.clinicalDataCollection.refreshSelectedCollection();
				});
			}
			
		}

		$scope.clinical.edit = function(item){
			$scope.clinical.dataEdit = _.clone(item);
		}

		$scope.clinical.update = function(item){

			item = $scope.clinical.checkProblemsAnswers(item);
			dcbia.updateClinicalData(item)
			.then(function(res){
				$scope.clinical.showSection = -1;
				$scope.clinicalDataCollection.select($scope.clinicalDataCollection.selectedCollection);
			})
		}

		$scope.clinical.checkProblemsAnswers = function(data){
			var problemList = ["problemOrPreventChewing", 
			"problemOrPreventDrinking",
			"problemOrPreventExercising",
			"problemOrPreventEatingHardFoods",
			"problemOrPreventEatingSoftFoods",
			"problemOrPreventSmilingLaughing",
			"problemOrPreventSexualActivity",
			"problemOrPreventCleaningTeethOrFace",
			"problemOrPreventYawning",
			"problemOrPreventSwallowing",
			"problemOrPreventTalking",
			"problemOrPreventHavingUsualFaceAppearance"];
			var problemListValues = []
			_.each(problemList,function(problemName){
				problemListValues.push(data[problemName])
			})
			if(problemListValues.indexOf(true) !== -1){
				_.each(problemListValues,function(value,i){
					if(value){
						data[problemList[i]] = "yes";
					}else{
						data[problemList[i]] = "no";
					}
				})
			}
			return data;
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

		$scope.csv.readFile = function(){
			return $scope.csv.open($scope.csv.file)
			.then(function(selectedCollectionData){

				var selectedCollectionDataKeys = {};

				_.each(selectedCollectionData, function(item){
					_.extend(selectedCollectionDataKeys, item);
				});

				if(selectedCollectionDataKeys['patientId'] === undefined){
					$scope.csv.selectPatientId = true;
				}

				selectedCollectionDataKeys = _.keys(selectedCollectionDataKeys);

			    $scope.csv.selectedCollectionData = selectedCollectionData;
				$scope.csv.selectedCollectionDataKeys = selectedCollectionDataKeys;



			})
		}

		$scope.csv.open = function(file){

			return new Promise(function(resolve, reject){
				var reader = new FileReader();
	                
		        reader.onload = function(e) {
		          var csv = e.target.result;
		          if(csv.indexOf('\r\n') === -1 && csv.indexOf('\r') !== -1){
		            csv = csv.replace(new RegExp("\r", 'g'), "\n");
		          }

		          resolve($scope.csv.JSON(csv));
		          
		        }

		        reader.onerror = function(e){
		          reject(e)
		        }
		        reader.readAsText(file);
			});
		}

		$scope.csv.camelize = function(str) {
		  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		  	if(index == 0  && !isNaN(parseInt(letter))){
		  		return '';	
		  	}
		    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
		  }).replace(/\s+/g, '')
		  .replace(/-/g, '');
		}

		$scope.csv.JSON = function(csv){

		    var lines = csv.split("\n");
		    var result = [];
		    var headers = _.map(lines[0].split(","), function(val){
		      try{
		        return eval(val);
		      }catch(e){
		      	if(_.isString(val)){
		      		return $scope.csv.camelize(val);
		      	}
		      	return val;
		      }
		    });
		    for(var i=1;i<lines.length;i++){
		      var obj = {};
		      var currentline= _.map(lines[i].split(","), function(val){
		        try{
		          return eval(val);
		        }catch(e){
		          return val;
		        }
		      });
		      for(var j=0;j<headers.length;j++){
		        obj[headers[j]] = currentline[j];
		      }
		      result.push(obj);
		    }
		    return result;
		}

		$scope.csv.create = function(){

			if($scope.csv.selectPatientId && !$scope.csv.selectedPatientId){
				alert('Please select a patientId from the available column headers!');
			}else{
				Promise.all(_.map($scope.csv.selectedCollectionData, function(row){
					var rowclone = _.clone(row);
					if($scope.csv.selectPatientId){
						rowclone.patientId = row[$scope.csv.selectedPatientId];
						delete rowclone[$scope.csv.selectedPatientId];
					}
					if(rowclone.owner === undefined){
						rowclone.owner = $scope.user.email;
					}
					if(rowclone.formId === undefined){
						rowclone.formId = "imported-csv";
					}
					if(rowclone.date === undefined){
						var dt = new Date();
						var year = dt.getFullYear();
						var month = ((dt.getMonth()+1)>=10)? (dt.getMonth()+1) : '0' + (dt.getMonth()+1);
						var day = ((dt.getDate())>=10)? (dt.getDate()) : '0' + (dt.getDate());
						rowclone.date = year + "-" + month + "-" + day;
					}
					return $scope.clinical.createClinicalData(rowclone);
					
				}))
				.then(function(res){
					_.each(_.pluck(res, 'data'), function(status){
						$scope.clinicalDataCollection.selectedCollection.items.push({
							_id: status.id
						});
					});
					return $scope.clinicalDataCollection.update($scope.clinicalDataCollection.selectedCollection);
				})
				.then(function(res){
					delete $scope.csv.selectedCollectionData;
					delete $scope.csv.selectedCollectionDataKeys;
					return $scope.clinicalDataCollection.select($scope.clinicalDataCollection.selectedCollection);
				})
				.catch(console.error);
			}
			
		}

		$scope.csv.export = function(collection){
			var prom;
			if(!$scope.clinicalDataCollection.selectedCollection || collection._id !== $scope.clinicalDataCollection.selectedCollection._id){
				prom = $scope.clinicalDataCollection.select(collection);
			}else{
				prom = Promise.resolve(true);
			}

			prom
			.then(function(){
				var keys = $scope.clinicalDataCollection.getDataCollectionKeys($scope.clinicalDataCollection.selectedCollectionData);
				var csv = keys.toString();
				csv += '\n';

				_.each($scope.clinicalDataCollection.selectedCollectionData, function(row, i){
					_.each(keys, function(key, j){
						var value;
						if(Array.isArray(row[key])){					
							_.each(row[key], function(item,k){
								if(k === 0){
									value = item? item: '';
								}else{
									value += ' ' + (item? item: '');
								}
							})
						}else{
							if(row[key] === undefined || row[key] === null){
								value = "";
							}
							else{
								value = row[key].toString()? row[key].toString(): '';
							}
						}
						csv += value;
						if(j < keys.length -1){
							csv += ","
						}
					});
					if( i < $scope.clinicalDataCollection.selectedCollectionData.length - 1){
						csv += "\n";
					}
				});

				var filename = $scope.clinicalDataCollection.selectedCollection.name;
				if($scope.clinicalDataCollection.selectedCollection.name.indexOf('csv') === -1){
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
	    templateUrl: './src/clinicalData.template.html'
	}

});