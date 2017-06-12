angular.module('dcbia-jobs')
.directive('dcbiaMfsda', function($routeParams, dcbia, clusterauth, clusterpostService) {

	function link($scope, $attrs, $filter){
		clusterauth.getUser()
		.then(function(res){
			$scope.user = res;
		})

		clusterauth.getScopes()
		.then(function(res){
			$scope.userScopes = res.data[0];
		});

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


		$scope.projects.selectProject = function(project){
			if($scope.projects.selectedProject){
				$scope.projects.projectsProperties[$scope.projects.selectedProject._id].class = "";
			}
			$scope.projects.selectedProject = project;
			$scope.projects.projectsProperties[project._id].class = "alert alert-info";
			$scope.clinicalDataCollection.selectedCollections = [];
			$scope.morphologicalDataCollection.selectedCollections = [];

			if(_.isObject($scope.projects.selectedProject.collections)){
				$scope.clinicalDataCollection.selectedCollections = $scope.projects.selectedProject.collections.clinicalDataCollection;
				$scope.morphologicalDataCollection.selectedCollections = $scope.projects.selectedProject.collections.morphologicalDataCollection;

				return Promise.all([
					Promise.all(_.map($scope.clinicalDataCollection.selectedCollections, dcbia.getClinicalData))
					.then(function(res){
						var merged = [];
						_.each( _.compact(_.pluck(res, "data")), function(coll){
							merged = $scope.projects.mergeCollections(merged, coll);
						})						
						return merged;
					}),
					Promise.all(_.map($scope.morphologicalDataCollection.selectedCollections, dcbia.getMorphologicalData))
					.then(function(res){						
						var merged = [];
						_.each( _.compact(_.pluck(res, "data")), function(coll){
							merged = $scope.projects.mergeCollections(merged, coll);
						})						
						return merged;
					})
				])
				.then(function(res){					
					$scope.projects.selectedProjectData = $scope.projects.mergeCollections(res[0], res[1]);
					$scope.projects.selectedProjectDataKeys = $scope.projects.getProjectDataKeys($scope.projects.selectedProjectData);
					$scope.projects.selectedProjectPatients = _.map($scope.projects.selectedProjectData, function(item){ return item.patientId; });
				});

			}else{
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
				Promise.all([$scope.clinical.getSelectedProjectData(),$scope.morphological.getSelectedProjectData()])
				.then(function(){
					$scope.projects.selectedProjectData = $scope.projects.mergeCollections($scope.clinical.data,$scope.morphological.data);
					$scope.projects.selectedProjectDataKeys = $scope.projects.getProjectDataKeys($scope.projects.selectedProjectData);
					$scope.projects.selectedProjectPatients = _.map($scope.projects.selectedProjectData, function(item){ return item.patientId; });
				});
			}
		};		


		$scope.projects.getFilteredAttachments = function(attachments){			
			if($scope.projects.analysis.attachmentsRegex && $scope.projects.analysis.attachmentsRegex != ""){
				var re = new RegExp("^" + $scope.projects.analysis.attachmentsRegex.split("*").join(".*") + "$");
				var filteredkeys = _.filter(_.keys(attachments), function(key){				
						return re.test(key);
				});
				return _.pick(attachments, filteredkeys);
			}else{
				return attachments;
			}

		}

		$scope.projects.setGroupProjectDataDisplayed = function(){
			_.each($scope.projects.analysis.selectedProjectDataDisplayed, function(row){
				row.group = $scope.projects.analysis.group;
			});
		}

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

		$scope.projects.getProjectItems = function(project){
			var sum = 0;
			if(_.isObject(project.collections) && !_.isArray(project.collections)){
				_.each(project.collections.clinicalDataCollection, function(cdcid){
					var collection = _.find($scope.clinicalDataCollection.collections, function(clinicalCollection){
						return cdcid === clinicalCollection._id;
					});
					if(collection){
						sum+= collection.items.length;
					}
				});
				_.each(project.collections.morphologicalDataCollection, function(mcid){
					var collection = _.find($scope.morphologicalDataCollection.collections, function(morphologicalCollection){
						return mcid === morphologicalCollection._id;
					});
					if(collection){
						sum+= collection.items.length;
					}
				});
			}else{
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
			}
			return sum;
		};		

		$scope.projects.mergeCollections = function(collection1, collection2){
			_.each(collection2, function(col2) {

				if(col2 && col2._attachments && col2._id){
					var att = {};
					att[col2._id] = col2._attachments;

					col2.attachments = att;
					delete col2._attachments;
				}
				if(col2._id){
					delete col2._id;
				}
				if(col2._rev){
					delete col2._rev;
				}
				if(col2.owners){
					delete col2.owners;
				}
				if(col2.owner){
					delete col2.owner;
				}
				
		        var mergedCollection = _.find(collection1, function(mergedCollection) {
		            return mergedCollection["patientId"] === col2["patientId"];
		        });			        
		        mergedCollection ? _.extend(mergedCollection, col2) : collection1.push(col2);		        
			});
			_.each(collection1, function(col1){
				if(col1.type !== "mergedCollection"){
					col1.type = "mergedCollection";
				}
			})
			return collection1;
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

		$scope.clinicalDataCollection.getClinicalDataCollections = function(){
			return dcbia.getClinicalDataCollections()
			.then(function(res){
				$scope.clinicalDataCollection.collections = res.data;
			})
			.catch(console.error);
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

  		

  		$scope.projects.showSubset = function(index){
			var analysis = $scope.projects.selectedProject.analyses[index];
			
			var selectedProjectData = _.filter($scope.projects.selectedProjectData, function(data){
				return analysis.selectedPatients.indexOf(data.patientId) !== -1;				
			});


			selectedProjectData = _.map(selectedProjectData, function(data){
				return _.pick(data, function(value, key, object) {
				  return analysis.selectedVariables.indexOf(key) !== -1;
				});
			});

			$scope.projects.analysis = {};
			$scope.projects.analysis.name = analysis.name;
			$scope.projects.analysis.selectedProjectData = selectedProjectData;
			$scope.projects.analysis.selectedProjectDataKeys = analysis.selectedVariables;

			// $scope.projects.selectedProjectData;
			// projects.analysis.selectedPatients.indexOf(row.patientId)>-1">
			// 			<td ng-repeat="key in projects.analysis.selectedVariables
			// projects.selectedProjectData
			// projects.analysis.selectedPatients

		}

		$scope.projects.selectVisibleAttachments = function(select){
			_.each($scope.projects.analysis.selectedProjectDataDisplayed, function(pdata){
				_.each(pdata.attachments, function(col){
					_.each($scope.projects.getFilteredAttachments(col), function(att){
						att.selected = select;
					});
				});
			});
		}
		
		$scope.clusterpost = {};
		$scope.mfsda = {};
		$scope.mfsda.submitJob = function(){

	// -shapeData <filename, .txt list with vtk filenames, 1 file per line>
	// -coordData <filename, .vtk shape template>
	// -covariates <filename, .txt with covariates dim = n x p0 (comma separated or tabulation, without header, the first column is the group)>
	// -covariateInterest <filename, .txt (dim = 1xp0 vector comma separated, 1 or 0 value to indicate covariate of interest)>
	// -covariateType <filename, .txt (dim= 1xsum(covariateInterest) vector comma separated, 1 or 0 to indicate type of covariate double or int)>
	// -outputDir <output directory>
	// mfsda.shapeData 
	// mfsda.coordData 
	// mfsda.covariates 
	// mfsda.covariateInterest 
	// mfsda.covariatesType 
	// mfsda.shapes = filelistobj;
	// mfsda.template = template;

			var mfsda = $scope.mfsda.getData();			

  			var job = {};  			

  			if($scope.mfsda.name){
  				job.name = $scope.mfsda.name;
  			}
  			job.executable = "MFSDA.sh";
  			job.parameters = [
  				{
  					flag: "-shapeData",
  					name: "shapeData.txt"
  				},
  				{
  					flag: "-coordData",
  					name: "template.vtk",
  				},
  				{
  					flag: "-covariates",
  					name: "covariates.txt"
  				},
  				{
  					flag: "-covariateInterest",
  					name: "covariateInterest.txt"
  				},
  				{
  					flag: "-covariateType",
  					name: "covariateType.txt"
  				},
  				{
  					flag: "-outputDir",
  					name: "./output"
  				}
  			];

  			job.type = "job";
  			job.inputs = mfsda.inputs;
  			job.executionserver = $scope.clusterpost.selectedServer.name;
  			job.outputs = [{
  				name: "output",
  				type: "tar.gz"
  			}]
  			job.userEmail = $scope.user.email;

  			return clusterpostService.createAndSubmitJob(job, _.pluck(mfsda.data, "name"), _.pluck(mfsda.data, "data"))
  			.then(function(res){
  				console.log(res);
  			})
  		}

  		$scope.mfsda.download = function(){
  			
  			var mfsda = $scope.mfsda.getData();

  			console.log(mfsda);
  		}

  		$scope.mfsda.getData = function(){

  			var mfsda = {};
  			$scope.mfsda.showWarningTemplate = false;

  			var covariatesName = _.clone($scope.projects.analysis.selectedProjectDataKeys);
  			var covariates = _.clone($scope.projects.analysis.selectedProjectData);
  			var mapnames = {};

  			var templates = _.map(covariates, function(cov){
  				if(cov.isTemplate){
  					return _.map(cov.attachments, function(att, colid){
						return _.map(att, function(a, name){
							if(a.selected){
								var obj = {
									name: '',
									local: {
										uri: ''
									}
								};
								obj.local.uri = colid + "/" + name;
								if(mapnames[name]){				  					
				  					obj.name = mapnames[name] + "_" + name;
				  					mapnames[name] += 1;
				  				}else{
				  					mapnames[name] = 1;
				  					obj.name = name;
				  				}
								return obj;
							}
							return '';
						});
					})
  				}
  			});
  			
  			var template = _.compact(_.flatten(templates));
  			if(template.length != 1){
  				$scope.mfsda.showWarningTemplate = true;
  			}

  			covariatesName.splice(0, 0, 'group');
  			covariatesName.splice(_.indexOf(covariatesName, 'patientId'), 1);
  			covariatesName.splice(_.indexOf(covariatesName, 'attachments'), 1);
  			
  			try {
				var result = json2csv({ data: covariates, fields: covariatesName}).split('\n');
				result.splice(0,1);
				covariatescsv = result.join('\n');
			} catch (err) {
				// Errors are thrown for bad options, or if the data is empty and no fields are provided. 
				// Be sure to provide fields if it is possible that your data array will be empty. 
				console.error(err);
			}

  			var covariatesInterest = _.map(covariatesName, function(){
  				return "1";
  			}).join(",");
  			var covariatesType = _.map(covariatesName, function(cn){
  				var data = _.pluck(covariates, cn);
  				var datatype = _.map(data, function(d){
  					if(_.isNumber(d)){
  						return Number.isInteger(d);
  					}
  					return 1;
  				});
  				return Number(!eval(datatype.join("&&")));
  			}).join(",");
  			
  			var filelistobj = _.compact(_.flatten(_.map(covariates, function(cov){
  				if(!cov.isTemplate){
  					return _.compact(_.flatten(_.map(cov.attachments, function(att, colid){
						return _.map(att, function(a, name){
							if(a.selected){
								var obj = {
									name: '',
									local: {
										uri: ''
									}
								};
								obj.local.uri = colid + "/" + name;
								if(mapnames[name]){				  					
				  					obj.name = mapnames[name] + "_" + name;
				  					mapnames[name] += 1;
				  				}else{
				  					mapnames[name] = 1;
				  					obj.name = name;
				  				}
								return obj;
							}
							return '';
						});
					})));
  				}
  				return null;
  			})));

  			mfsda.data = [];
  			mfsda.data.push({
  				name: "shapeData.txt",
  				data: _.pluck(filelistobj, "name").join("\n")
  			});

  			mfsda.data.push({
  				name: "covariates.txt",
  				data: covariatescsv
  			});

  			mfsda.data.push({
  				name: "covariatesInterest.txt",
  				data: covariatesInterest
  			});

  			mfsda.data.push({
  				name: "covariatesType.txt",
  				data: covariatesType
  			});

  			
  			mfsda.inputs = filelistobj;
  			if(template.length == 1){
  				mfsda.inputs.push(template[0]);
  			}

  			return mfsda;
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
				    // collection.data = _.map(collection.data, function(d){
				    // 	if(d._attachments){
				    // 		_.extend(d, {
				    // 			attachments: _.keys(d._attachments)
				    // 		});
				    // 	}
				    // 	delete d._attachments;
				    // 	return d;
				    // });
					$scope.morphological.data = ($scope.morphological.data.length) ? $scope.projects.mergeCollections($scope.morphological.data,collection.data) : collection.data;
				})
				return $scope.morphological.data;
			});
		}

		$scope.clusterpost = {};

		clusterpostService.getExecutionServers()
		.then(function(res){
			$scope.clusterpost.servers = res.data;
      		$scope.clusterpost.selectedServer = res.data[0];			
		})
		
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
	    templateUrl: './src/dcbia-mfsda.template.html'
	}

});