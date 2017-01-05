angular.module('dcbia-projects')
.directive('projects', function($q, $routeParams, dcbia, clusterauth) {

	function link($scope, $attrs, $filter){

		clusterauth.getUser()
		.then(function(res){
			$scope.user = res;
		})

		clusterauth.getScopes()
		.then(function(res){
			$scope.userScopes = res.data[0];
		});

		$scope._ = _;

		$scope.projects = {
			newProject: {
				collections: [],
				type: "project",
				patients: "",
				name: "",
				// scope: "",
				description: ""
			},
			projects: [],
			projectsProperties: {
				"defaultProject": {
					class: ''
				}
			},
			selectedProjectData: {},
			section: 0,
			showSection: 0
		};

		$scope.defaultProject = {
			_id: "defaultProject",
			name: "All projects",
			type: "project",
			items: 0
		};

		$scope.morphologicalDataCollection = {
			collections: [],
			selectedCollections: []
		};
		$scope.morphologicalCheckBox = false;

		$scope.clinicalDataCollection = {
			collections: [],
			selectedCollections: []
		};

		$scope.clinicalCheckBox = false;

		$scope.csv = {};

		$scope.$watch('csv.file', function(){
			if($scope.csv.file){
				$scope.csv.readFile()
				.then(function(){
					$scope.$apply();
				});
			}
		});

		$scope.projects.getProjects = function(){
			return dcbia.getProjects()
			.then(function(res){
				delete $scope.projects.selectedProject;
				$scope.projects.projects = res.data;
				_.each($scope.projects.projects, function(project){
					$scope.projects.projectsProperties[project._id] = {
						class : ""
					};
				});
			})
			.catch(console.error);
		};

		$scope.projects.create = function(newProject){
			_.each($scope.clinicalDataCollection.selectedCollections, function(collection){
				_.each($scope.clinicalDataCollection.collections, function(items){
					if(collection === items.name){
						$scope.projects.newProject.collections.push({"_id": items._id})
					}
				});
			});
			_.each($scope.morphologicalDataCollection.selectedCollections, function(collection){
				_.each($scope.morphologicalDataCollection.collections, function(items){
					if(collection === items.name){
						$scope.projects.newProject.collections.push({"_id": items._id})
					}
				});
			});
			// if($scope.projects.newProject.scope === ""){
			// 	delete $scope.projects.newProject.scope;
			// }
			dcbia.createProject(newProject)
			.then(function(res){
				return $scope.projects.getProjects();
			})
			.catch(console.error);
		};

		$scope.projects.update = function(project){
			project.collections = [];
			_.each($scope.clinicalDataCollection.selectedCollections, function(collection){
				_.each($scope.clinicalDataCollection.collections, function(items){
					if(collection === items.name){
						project.collections.push({"_id": items._id})
					}
				});
			});
			_.each($scope.morphologicalDataCollection.selectedCollections, function(collection){
				_.each($scope.morphologicalDataCollection.collections, function(items){
					if(collection === items.name){
						project.collections.push({"_id": items._id})
					}
				});
			});
			// if(project.scope === ""){
			// 	delete project.scope;
			// }
			dcbia.updateProject(project)
			.then(function(res){
				return $scope.projects.getProjects();
			})
			.catch(console.error);
		};

		$scope.projects.delete = function(project){
			if (confirm("Are you sure you want to delete the project?")) {
			    dcbia.deleteProject(project._id)
				.then(function(res){
					return $scope.projects.getProjects();
				})
				.catch(console.error);
			} 
		};


		$scope.projects.selectProject = function(project){
			if($scope.projects.selectedProject){
				$scope.projects.projectsProperties[$scope.projects.selectedProject._id].class = "";
			}
			$scope.projects.selectedProject = project;
			$scope.projects.projectsProperties[project._id].class = "alert alert-info";
			$scope.clinicalDataCollection.selectedCollections = [];
			$scope.morphologicalDataCollection.selectedCollections = [];
			_.each($scope.projects.selectedProject.collections, function(selectedProjectCollection){
		        var clinicalCollection = _.find($scope.clinicalDataCollection.collections, function(clinicalCollection) {
		            return clinicalCollection["_id"] === selectedProjectCollection["_id"];
		        });
		        if(clinicalCollection) $scope.clinicalDataCollection.selectedCollections.push(clinicalCollection.name);
		       	var morphologicalCollection = _.find($scope.morphologicalDataCollection.collections, function(morphologicalCollection) {
		            return morphologicalCollection["_id"] === selectedProjectCollection["_id"];
		        });
		        if(morphologicalCollection) $scope.morphologicalDataCollection.selectedCollections.push(morphologicalCollection.name);
			});
			$q.all([$scope.clinical.getSelectedProjectData(),$scope.morphological.getSelectedProjectData()])
			.then(function(){
				$scope.projects.selectedProjectData = $scope.projects.mergeCollections($scope.clinical.data,$scope.morphological.data);
				$scope.projects.selectedProjectDataKeys = $scope.projects.getProjectDataKeys($scope.projects.selectedProjectData);
				$scope.projects.selectedProjectPatients = _.map($scope.projects.selectedProjectData, function(item){ return item.patientId; });
			});
		};

		$scope.projects.getProjectKeys = function(project){
			var projectKeys = {};
			_.each(project, function(items){
				_.extend(projectKeys, items);
			});
			if(projectKeys._id){
				delete projectKeys._id;
			}

			if(projectKeys._rev){
				delete projectKeys._rev;
			}
			return _.keys(projectKeys);
		}

		$scope.projects.getProjectDataKeys = function(data){
			var projectDataKeys = {};
			_.each(data, function(items){
				_.extend(projectDataKeys,items);
			});		
			if(projectDataKeys._id){
				delete projectDataKeys._id;
			}

			if(projectDataKeys._rev){
				delete projectDataKeys._rev;
			}
			if(projectDataKeys.type){
				delete projectDataKeys.type;
			}
			if(projectDataKeys.owner){
				delete projectDataKeys.owner;
			}
			if(projectDataKeys.owners){
				delete projectDataKeys.owners;
			}
			if(projectDataKeys.formId){
				delete projectDataKeys.formId;
			}
			if(projectDataKeys.date){
				delete projectDataKeys.date;
			}
			if(projectDataKeys.scope){
				delete projectDataKeys.scope;
			}						
			return _.keys(projectDataKeys);
		}

		$scope.projects.select = function(project){
			return dcbia.getProject(project._id)
			.then(function(res){
				var selectedProject = res.data;
				$scope.projects.selectProject(selectedProject);
				$scope.projects.selectedProjectKeys = $scope.projects.getProjectKeys([selectedProject]);
			})
			.catch(console.error);
		};

		$scope.projects.clearForm = function(force){
			if(!force){
				force = confirm("Do you want to clear the current changes?");
			}
			if(force){
				$scope.projects.newProject = {
					collections: [],
					type: "project",
					name: "",
					patients: "",
					// scope: "",
					description: ""
				};
				$scope.morphologicalDataCollection.selectedCollections = [];
				$scope.clinicalDataCollection.selectedCollections = [];
			}
		};

		$scope.projects.getProjectItems = function(project){
			var sum = 0;
			_.each(project.collections,function(collection){
				_.each($scope.clinicalDataCollection.collections,function(clinicalCollection){
					if(collection._id == clinicalCollection._id){
						sum += clinicalCollection.items.length;
					}
				})
				_.each($scope.morphologicalDataCollection.collections,function(morphologicalDataCollection){
					if(collection._id == morphologicalDataCollection._id){
						sum += morphologicalDataCollection.items.length;
					}
				})
			})
			return sum;
		};

		$scope.projects.hasScope = function(project, scope){
			if(project.scope === undefined){
				project.scope = [];
			}
			return project.scope.indexOf(scope) >= 0;
		}

		$scope.projects.addRemoveScope = function(project, scope, checkbox){
			if($scope.projects.hasScope(project, scope)){
				project.scope.splice(project.scope.indexOf(scope), 1);
			}else{
				project.scope.push(scope);
			}
			dcbia.updateProject(project)
			.then(function(res){
				return $scope.projects.getProjects();
			})
			.catch(console.error);
			_.each(project.collections, function(collection){
				_.each($scope.morphologicalDataCollection.collections, function(items){
					if(collection._id === items._id){
						$scope.morphologicalDataCollection.addRemoveScope(items,scope,checkbox,project.name)
						dcbia.getMorphologicalData(items._id)
						.then(function(res){
							$scope.morphological.data = res.data;						
							_.each($scope.morphological.data, function(data){
								$scope.morphological.addRemoveScope(data,scope,checkbox,collection.name)
							})
						})
						.catch(console.error);
					}
				});
				_.each($scope.clinicalDataCollection.collections, function(items){
					if(collection._id === items._id){
						$scope.clinicalDataCollection.addRemoveScope(items,scope,checkbox,project.name)
						dcbia.getClinicalData(items._id)
						.then(function(res){
							$scope.clinical.data = res.data;						
							_.each($scope.clinical.data, function(data){
								$scope.clinical.addRemoveScope(data,scope,checkbox,collection.name)
							})
						})
						.catch(console.error);
					}
				});
			});

		}

		$scope.projects.mergeCollections = function(collection1, collection2){
			_.each(collection2, function(col) {
			        var mergedCollection = _.find(collection1, function(mergedCollection) {
			            return mergedCollection["patientId"] === col["patientId"];
			        });

			        mergedCollection ? _.extend(mergedCollection, col) : collection1.push(col);
			});
			return collection1;
		}

		$scope.morphologicalDataCollection.addRemoveScope = function(collection, scope, checkbox, projectName){
			if(collection.scope === undefined){
				collection.scope = [];
			}
			if(collection.scope.indexOf(scope) >= 0 && !checkbox){
				var removeScope = true;
				_.each($scope.projects.projects,function(project){
					_.each(project.collections, function(projectCollection){
						if((projectCollection._id === collection._id) && (project.name !== projectName)){
							if(project.scope.indexOf(scope) >= 0){
								removeScope = false;
							}
						}
					})
				})
				if(removeScope){
					collection.scope.splice(collection.scope.indexOf(scope), 1);
				}
			}else if(collection.scope.indexOf(scope) < 0 && checkbox){
				collection.scope.push(scope);
			}
			dcbia.updateMorphologicalDataCollection(collection)
			.then(function(res){
				return $scope.morphologicalDataCollection.getMorphologicalDataCollections();
			})
			.catch(console.error);

		}

		$scope.morphologicalDataCollection.getMorphologicalDataCollections = function(){
			return dcbia.getMorphologicalDataCollections()
			.then(function(res){
				$scope.morphologicalDataCollection.collections = res.data;
			})
			.catch(console.error);
		};

		$scope.morphologicalDataCollection.checkAll = function(checkbox) {
			$scope.morphologicalDataCollection.selectedCollections = [];
			if(checkbox){
				_.each($scope.morphologicalDataCollection.collections,function(collection){
					$scope.morphologicalDataCollection.selectedCollections.push(collection.name);
            	});
			}
  		};

    	$scope.morphologicalDataCollection.isCollectionInProject = function(collection){
  			var display = false;
  			_.each($scope.morphologicalDataCollection.selectedCollections,function(selectedCollection){
  				if(collection.name === selectedCollection){
  					display = true;
  				}
            });
            return display;
  		}

		$scope.clinicalDataCollection.addRemoveScope = function(collection, scope, checkbox, projectName){
			if(collection.scope === undefined){
				collection.scope = [];
			}
			if(collection.scope.indexOf(scope) >= 0 && !checkbox){
				var removeScope = true;
				_.each($scope.projects.projects,function(project){
					_.each(project.collections, function(projectCollection){
						if((projectCollection._id === collection._id) && (project.name !== projectName)){
							if(project.scope.indexOf(scope) >= 0){
								removeScope = false;
							}
						}
					})
				})
				if(removeScope){
					collection.scope.splice(collection.scope.indexOf(scope), 1);
				}
			}else if(collection.scope.indexOf(scope) < 0 && checkbox){
				collection.scope.push(scope);
			}
			dcbia.updateClinicalDataCollection(collection)
			.then(function(res){
				return $scope.clinicalDataCollection.getClinicalDataCollections();
			})
			.catch(console.error);

		}

		$scope.clinicalDataCollection.getClinicalDataCollections = function(){
			return dcbia.getClinicalDataCollections()
			.then(function(res){
				$scope.clinicalDataCollection.collections = res.data;
			})
			.catch(console.error);
		};

		$scope.clinicalDataCollection.checkAll = function(checkbox) {
			$scope.clinicalDataCollection.selectedCollections = [];
			if(checkbox){
				_.each($scope.clinicalDataCollection.collections,function(collection){
					$scope.clinicalDataCollection.selectedCollections.push(collection.name);
            	});
			}
  		};

  		$scope.clinicalDataCollection.isCollectionInProject = function(collection){
  			var display = false;
  			_.each($scope.clinicalDataCollection.selectedCollections,function(selectedCollection){
  				if(collection.name === selectedCollection){
  					display = true;
  				}
            });
            return display;
  		}

		$scope.csv.export = function(project){
			var prom;
			if(!$scope.projects.selectedProject || project._id !== $scope.projects.selectedProject._id){
				prom = $scope.projects.select(project);
			}else{
				prom = Promise.resolve(true);
			}

			prom
			.then(function(){
				var keys = $scope.projects.getProjectKeys([$scope.projects.selectedProject]);
				var csv = 'name:,' + $scope.projects.selectedProject.name + '\n'
				csv += 'description:,' + $scope.projects.selectedProject.description + '\n'
				csv += 'patients:,' + $scope.projects.selectedProject.patients + '\n'
				// if(keys.indexOf("scope") !== -1){
				// 	csv += 'scope:,' + $scope.projects.selectedProject.scope + '\n'
				// }
				csv += '\n';
				var collectionKeys = ['Name','Number of items','Type']
				csv += collectionKeys.toString();
				csv += '\n';
				_.each($scope.projects.selectedProject.collections, function(collection, i){
					_.each($scope.clinicalDataCollection.collections, function(clinicalCollection){
						if(collection._id === clinicalCollection._id){
							csv += clinicalCollection.name + ',' + clinicalCollection.items.length + ',' + clinicalCollection.type + '\n';
						}
					})
					_.each($scope.morphologicalDataCollection.collections, function(morphologicalDataCollection){
						if(collection._id === morphologicalDataCollection._id){
							csv += morphologicalDataCollection.name + ',' + morphologicalDataCollection.items.length + ',' + morphologicalDataCollection.type + '\n';
						}
					})
				})

				var filename = $scope.projects.selectedProject.name;
				if($scope.projects.selectedProject.name.indexOf('csv') === -1){
					filename += '.csv';
				}

				return $scope.csv.download(filename, csv);
			})
			.catch(console.error);
			
		}

		$scope.csv.download = function(filename, csv){

			var pom = document.createElement('a');
			var bb = new Blob([csv], {type: 'text/plain'});

			pom.setAttribute('href', window.URL.createObjectURL(bb));
			pom.setAttribute('download', filename);

			pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
			pom.click();
			
		}

		$scope.clinical = {
			data: []
		};

		$scope.morphological = {
			data: []
		};

		$scope.clinical.addRemoveScope = function(data, scope, checkbox, collectionName){
			if(data.scope === undefined){
				data.scope = [];
			}
			if(data.scope.indexOf(scope) >= 0 && !checkbox){
				var removeScope = true;
				_.each($scope.clinicalDataCollection.collections,function(collection){
					_.each(collection.items,function(item){
						if((item._id === data._id) && (collection.name !== collectionName)){
							if(collection.scope.indexOf(scope) >= 0){
								removeScope = false;
							}
						}
					})
				})
				if(removeScope){
					data.scope.splice(data.scope.indexOf(scope), 1);
				}
			}else if(data.scope.indexOf(scope) < 0 && checkbox){
				data.scope.push(scope);
			}
			dcbia.updateClinicalData(data)
			.catch(console.error);

		}

		$scope.clinical.getSelectedProjectData = function(){
			var mapId = _.map($scope.projects.selectedProject.collections,function(col){ return col._id });
			return Promise.all(_.map(mapId,dcbia.getClinicalData))
			.then(function(res) {
				_.each(res,function(collection){
					$scope.clinical.data = ($scope.clinical.data.length) ? $scope.projects.mergeCollections($scope.clinical.data,collection.data) : collection.data;
				})
				return $scope.clinical.data;
			});
		}

		$scope.morphological.getSelectedProjectData = function(){
			var mapId = _.map($scope.projects.selectedProject.collections,function(col){ return col._id });
			return Promise.all(_.map(mapId,dcbia.getMorphologicalData))
			.then(function(res) {
				_.each(res,function(collection){
				    collection.data = _.map(collection.data, function(d){
				    	if(d._attachments){
				    		_.extend(d, {
				    			attachments: _.keys(d._attachments)
				    		});
				    	}
				    	delete d._attachments;
				    	return d;
				    });
					$scope.morphological.data = ($scope.morphological.data.length) ? $scope.projects.mergeCollections($scope.morphological.data,collection.data) : collection.data;
				})
				return $scope.morphological.data;
			});
		}

		$scope.morphological.addRemoveScope = function(data, scope, checkbox, collectionName){
			if(data.scope === undefined){
				data.scope = [];
			}
			if(data.scope.indexOf(scope) >= 0 && !checkbox){
				var removeScope = true;
				_.each($scope.morphologicalDataCollection.collections,function(collection){
					_.each(collection.items,function(item){
						if((item._id === data._id) && (collection.name !== collectionName)){
							if(collection.scope.indexOf(scope) >= 0){
								removeScope = false;
							}
						}
					})
				})
				if(removeScope){
					data.scope.splice(data.scope.indexOf(scope), 1);
				}
			}else if(data.scope.indexOf(scope) < 0 && checkbox){
				data.scope.push(scope);
			}
			dcbia.updateMorphologicalData(data)
			.catch(console.error);

		}
		
		$scope.projects.getProjects()
		.then(function(){
			return $scope.morphologicalDataCollection.getMorphologicalDataCollections();
		})
		.then(function(){
			return $scope.clinicalDataCollection.getClinicalDataCollections();
		});
		
		
	}

	return {
		restrict : 'E',
	    link : link,
	    templateUrl: './src/dcbia-projects.template.html'
	}	

});