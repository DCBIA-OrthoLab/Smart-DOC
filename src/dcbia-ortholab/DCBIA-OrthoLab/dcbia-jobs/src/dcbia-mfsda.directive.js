angular.module('dcbia-jobs')
.directive('dcbiaMfsda', function($routeParams, dcbia, clusterauth, clusterpostService, dcbiaVTKService) {

	function link($scope, $attrs, $filter){

		var minimist = require('minimist');
		var stringArgv = require('string-argv');

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


		$scope.projects.getFilteredAttachments = function(attachments, colid){
			var filteredatt = attachments;
			if($scope.projects.analysis.attachmentsRegex && $scope.projects.analysis.attachmentsRegex != ""){
				var re = new RegExp("^" + $scope.projects.analysis.attachmentsRegex.split("*").join(".*") + "$");
				var filteredkeys = _.filter(_.keys(attachments), function(key){				
						return re.test(key);
				});
				filteredatt = _.pick(attachments, filteredkeys);
			}
			if(colid && $scope.projects.analysis.isSelectedAttachments){
				return _.pick(filteredatt, _.compact(_.map($scope.projects.analysis.isSelectedAttachments[colid], function(selected, name){
					return selected? name: '';
				})));
			}
			return filteredatt;
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

  		$scope.projects.showSubset = function(analysis){
			//var analysis = $scope.projects.selectedProject.analyses[index];
			
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
			$scope.projects.analysis.isSelectedAttachments = analysis.isSelectedAttachments;

			var indexgroup = $scope.projects.analysis.selectedProjectDataKeys.indexOf('group');
			if(indexgroup !== -1){
				$scope.projects.analysis.hasGroup = true;
				$scope.projects.analysis.selectedProjectDataKeys.splice(indexgroup, 1);//Remove group
				$scope.projects.analysis.selectedProjectDataKeys.splice(0,0,'group');//Add group first
			}else{
				$scope.projects.analysis.hasGroup = false;
			}
			
			var projectDataKeys = _.clone($scope.projects.analysis.selectedProjectDataKeys);
			if(projectDataKeys.indexOf('attachments') != -1){
				projectDataKeys.splice(projectDataKeys.indexOf('attachments'), 1);
			}
  			$scope.mfsda.covariateType = _.map(projectDataKeys, function(cn){
  				
				var data = _.pluck($scope.projects.analysis.selectedProjectData, cn);
  				var datatype = _.map(data, function(d){
  					if(_.isNumber(d)){
  						return Number.isInteger(d);
  					}
  					return 1;
  				});
  				return Number(!eval(datatype.join("&&")));
  				
  			});

			// $scope.projects.selectedProjectData;
			// projects.analysis.selectedPatients.indexOf(row.patientId)>-1">
			// 			<td ng-repeat="key in projects.analysis.selectedVariables
			// projects.selectedProjectData
			// projects.analysis.selectedPatients

		}

		$scope.projects.selectVisibleAttachments = function(select){
			_.each($scope.projects.analysis.selectedProjectDataDisplayed, function(pdata){
				_.each(pdata.attachments, function(col, keycol){
					_.each($scope.projects.getFilteredAttachments(col, keycol), function(att){
						att.selected = select;
					});
				});
			});
		}
		
		$scope.clusterpost = {};
		$scope.mfsda = {
			editJobParameters: true,
			jobParameters: $scope.jobParameters
		};
		$scope.vtk = {};

		$scope.mfsda.submitJob = function(){

	// -shapeData <filename, .txt list with vtk filenames, 1 file per line>
	// -coordData <filename, .vtk shape template>
	// -covariate <filename, .txt with covariate dim = n x p0 (comma separated or tabulation, without header, the first column is the group)>
	// -covariateInterest <filename, .txt (dim = 1xp0 vector comma separated, 1 or 0 value to indicate covariate of interest)>
	// -covariateType <filename, .txt (dim= 1xsum(covariateInterest) vector comma separated, 1 or 0 to indicate type of covariate double or int)>
	// -outputDir <output directory>
	// mfsda.shapeData 
	// mfsda.coordData 
	// mfsda.covariate 
	// mfsda.covariateInterest 
	// mfsda.covariateType 
	// mfsda.shapes = filelistobj;
	// mfsda.template = template;			

			var mfsda = $scope.mfsda.getData();
			
			mfsda.data.push({
  				name: "covariateType.csv",
  				data: $scope.mfsda.covariateType.join(',')
  			});  

			mfsda.inputs.push({
  				name: "covariateType.csv"
  			});

  			var job = {};  			

  			if($scope.mfsda.name){
  				job.name = $scope.mfsda.name;
  			}
  			job.executable = "MFSDAv2.0.0.sh";
  			job.version = "2.0.0";
  			job.parameters = [
  				{
  					flag: "--shapeData",
  					name: "shapeData.txt"
  				},
  				{
  					flag: "--coordData",
  					name: mfsda.template.name,
  				},
  				{
  					flag: "--covariate",
  					name: "covariate.csv"
  				},
  				// {
  				// 	flag: "-covariateInterest",
  				// 	name: "covariateInterest.csv"
  				// },
  				{
  					flag: "--covariateType",
  					name: "covariateType.csv"
  				},
  				{
  					flag: "--outputDir",
  					name: "./output"
  				}//,
  				// {
  				// 	flag: "-exportJSON",
  				// 	name: ""
  				// }
  			];

  			job.type = "job";
  			job.inputs = mfsda.inputs;
  			job.executionserver = $scope.clusterpost.selectedServer.name;
  			job.outputs = [{
  				name: "output",
  				type: "tar.gz",  				
  			},
  			{
  				name: "stdout.out",
  				type: "file"
  			},
  			{
  				name: "stderr.err",
  				type: "file"
  			},
  			{
  				name: "efit.json",
  				type: "file",
  				path: "./output/efit.json"
  			},
  			{
  				name: "pvalues.json",
  				type: "file",
  				path: "./output/pvalues.json"
  			}];
  			job.userEmail = $scope.user.email;
  			job.jobparameters = [];

  			var jobParameters = minimist(stringArgv($scope.mfsda.jobParameters));

  			_.each(jobParameters, function(val, key){
  				if(_.isArray(val)){
  					_.each(val, function(v){
  						job.jobparameters.push({
	  						name: v,
	  						flag: "-" + key
	  					});
  					});
  				}else{
  					job.jobparameters.push({
  						name: val,
  						flag: "-" + key
  					});
  				}
  			})

  			return clusterpostService.createAndSubmitJob(job, _.pluck(mfsda.data, "name"), _.pluck(mfsda.data, "data"))
  			.then(function(res){
  				console.log(res);
  				$scope.mfsda.taskSubmitted = true;  				
  			})
  		}

  		$scope.mfsda.download = function(job){

  			if(job){
  				
  				var jobname = job._id;
  				if(job.name){
  					jobname = job.name;
  				}

				var zip = new JSZip();
				var allpromise = [];
				_.each(job.inputs, function(input){
					allpromise.push(clusterpostService.getAttachment(job._id, input.name, 'arraybuffer')
					.then(function(ab){
						return {
							name: input.name,
							arraybuffer: ab.data
						}
					}));					
				});

				if(job._attachments['efit.json']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'efit.json', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'efit.json',
							arraybuffer: ab.data
						}
					}));
				}

				
				if(job._attachments['pvalues.json']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'pvalues.json', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'pvalues.json',
							arraybuffer: ab.data
						}
					}));
				}
									

				return Promise.all(allpromise)
				.then(function(filecontent){
					_.each(filecontent, function(fc){
						zip.file(jobname + "/" + fc.name, fc.arraybuffer);
					});

					return zip.generateAsync({type:"blob"})
					.then(function(bb) {						
						
						saveAs(bb, jobname + ".zip");
						
					});

				});
  			}
  		}

  		$scope.mfsda.getData = function(){

  			var mfsda = {};
  			$scope.mfsda.showWarningTemplate = false;

  			var covariateName = _.clone($scope.projects.analysis.selectedProjectDataKeys);
  			var covariate = _.clone($scope.projects.analysis.selectedProjectData);

  			var mapnames = {};

  			var templates = _.map(covariate, function(cov){
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


  			covariate = _.compact(_.map(covariate, function(cov){
  				if(!cov.isTemplate){
  					_.each(covariateName, function(covkey){
	  					if(cov[covkey] === undefined){
	  						cov[covkey] = 0;
	  					}
	  				});
	  				return cov;
  				}
  				return null;
  			}));
  			
  			var template = _.compact(_.flatten(templates));
  			if(template.length != 1){
  				$scope.mfsda.showWarningTemplate = true;
  				return;
  			}
  			
  			var covariateNameIndex = _.indexOf(covariateName, 'patientId')
  			if(_.indexOf(covariateName, 'patientId') != -1){
  				covariateName.splice(covariateNameIndex, 1);
  			}

  			var covariateNameIndex = _.indexOf(covariateName, 'attachments')
  			if(_.indexOf(covariateName, 'attachments') != -1){
  				covariateName.splice(covariateNameIndex, 1);
  			}

  			var covariateNameIndex = _.indexOf(covariateName, 'template')
  			if(_.indexOf(covariateName, 'template') != -1){
  				covariateName.splice(covariateNameIndex, 1);
  			}
  			
  			try {
				var result = json2csv({ data: covariate, fields: covariateName}).split('\n');
				result.splice(0,1);
				covariatecsv = result.join('\n');
			} catch (err) {
				// Errors are thrown for bad options, or if the data is empty and no fields are provided. 
				// Be sure to provide fields if it is possible that your data array will be empty. 
				console.error(err);
			}

  			var covariateInterest = _.map(covariateName, function(){
  				return "1";
  			}).join(",");
  			
  			
  			var filelistobj = _.compact(_.flatten(_.map(covariate, function(cov){
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
  				name: "covariate.csv",
  				data: covariatecsv
  			});

  			// mfsda.data.push({
  			// 	name: "covariateInterest.txt",
  			// 	data: covariateInterest
  			// });

  			// mfsda.data.push({
  			// 	name: "covariateType.csv",
  			// 	data: covariateType
  			// });  			
  			
  			if(template.length == 1){
  				filelistobj.push(template[0]);
  			}

  			filelistobj.push({
  				name: "shapeData.txt"
  			});

  			filelistobj.push({
  				name: "covariate.csv"
  			});

  			// filelistobj.push({
  			// 	name: "covariateInterest.txt"
  			// });

  			// filelistobj.push({
  			// 	name: "covariateType.csv"
  			// });

  			mfsda.inputs = filelistobj;
  			mfsda.template = template[0];

  			return mfsda;
  		}

  		$scope.mfsda.hueSlider = {
			min: 0,
			max: 1,
			options: {
				step: 0.01,
				precision: 2,
				ceil: 1, 
				floor: 0
			}
		};

		$scope.mfsda.covariateSlider = {
			value: 0,
			options: {				
				step: 1,
				minLimit: 0,
				maxLimit: 8,
				ceil: 8
			}
		};

		$scope.mfsda.componentSlider = {
			value: 0,
			options: {				
				step: 1,
				minLimit: 0,
				maxLimit: 2,
				ceil: 2
			}
		};

		$scope.mfsda.pvalueSlider = {
			value: 0,
			options: {				
				step: 1,
				minLimit: 0,
				maxLimit: 7,
				ceil: 7
			}
		};

  		$scope.mfsda.jobCallback = function(job){
  			
  			$scope.mfsda.job = job;
  			$scope.activeTab = 2;

  			var template = _.find(job.parameters, function(param){
  				return param.flag == "--coordData" || param.flag == "-coordData";
  			});
  			if(template){
  				template = template.name;
  			}else{
  				throw "template not found! mfsda.jobCallback";
  			}
  			

  			return Promise.all([
  				clusterpostService.getAttachment(job._id, "efit.json", "json"),
  				clusterpostService.getAttachment(job._id, "pvalues.json", "json"),
  				clusterpostService.getAttachment(job._id, template, "text")
			])  			
  			.then(function(res){

  				if($scope.vtk.actor){
  					$scope.$broadcast('removeActor', $scope.vtk.actor);
  				}

  				var data = _.compact(_.pluck(res, "data"));
  				$scope.vtk.vtkascii = data[2];
  				$scope.vtk.vtkPolyData = dcbiaVTKService.parsePolyData(data[2]);
  				if(!$scope.vtk.vtkPolyData){
  					return Promise.reject('Poly data is not loaded');
  				}
  				_.extend($scope.vtk, dcbiaVTKService.newActor($scope.vtk.vtkPolyData));
  				$scope.$broadcast('addActor', $scope.vtk.actor, true);

  				if(data.length > 0){  					
  					if(job.version){
  						$scope.mfsda.version = job.version.split('.');
  					}
  					$scope.mfsda.efit = data[0];
  					$scope.mfsda.Lpvals_fdr = data[1].Lpvals_fdr;
  					if($scope.mfsda.Lpvals_fdr.length > 0){
  						$scope.mfsda.pvalueSlider.maxLimit = $scope.mfsda.Lpvals_fdr[0].length - 1;
  						$scope.mfsda.pvalueSlider.options.ceil = $scope.mfsda.Lpvals_fdr[0].length - 1;
  					}

  					if($scope.mfsda.version && $scope.mfsda.version[0] >= "2" ){  						
	  				
		  				$scope.mfsda.covariateSlider.options.ceil = $scope.mfsda.efit.efitBetas.length - 1;
		  				$scope.mfsda.covariateSlider.options.maxLimit = $scope.mfsda.efit.efitBetas.length - 1;

		  				if($scope.mfsda.efit.efitBetas.length > 0 && $scope.mfsda.efit.efitBetas[0].length > 0){
		  					$scope.mfsda.componentSlider.options.ceil = $scope.mfsda.efit.efitBetas[0][0].length - 1;
		  					$scope.mfsda.componentSlider.options.maxLimit = $scope.mfsda.efit.efitBetas[0][0].length - 1;
		  				}else{
		  					$scope.mfsda.componentSlider.options.ceil = 2;
		  					$scope.mfsda.componentSlider.options.maxLimit = 2;
		  				}
  					}else{
  						var size = $scope.mfsda.efit.efitBetas._ArraySize_;
	  				
		  				$scope.mfsda.covariateSlider.options.ceil = size[0] - 1;
		  				$scope.mfsda.covariateSlider.options.maxLimit = size[0] - 1;

		  				$scope.mfsda.componentSlider.options.ceil = size[2] - 1;
		  				$scope.mfsda.componentSlider.options.maxLimit = size[2] - 1;
  					}
  					

					var colors = $scope.mfsda.getEfitBetas();
					dcbiaVTKService.addPointDataArray($scope.vtk.vtkPolyData, colors);
					$scope.vtk.updateActor();

					$scope.$broadcast('resetCamera');
					
  				}
  				$scope.$apply();
  			})
  			.catch(console.error)
  		}

  		$scope.mfsda.getEfitBetas = function(){
  			var efitBetas = [];

  			if($scope.mfsda.efit && $scope.mfsda.efit.efitBetas){
	  			if($scope.mfsda.version && $scope.mfsda.version[0] >= "2" ){
	  				if($scope.mfsda.covariateSlider.value < $scope.mfsda.efit.efitBetas.length){
	  					for(var i = 0; i < $scope.mfsda.efit.efitBetas[$scope.mfsda.covariateSlider.value].length; i++){
	  						if($scope.mfsda.componentSlider.value < $scope.mfsda.efit.efitBetas[$scope.mfsda.covariateSlider.value][i].length){
	  							efitBetas.push($scope.mfsda.efit.efitBetas[$scope.mfsda.covariateSlider.value][i][$scope.mfsda.componentSlider.value]);
	  						}else{
	  							console.error("WARNING! different size in efitBetas resul, index=", $scope.mfsda.covariateSlider.value, i, $scope.mfsda.componentSlider.value);
	  						}
						}
	  				}					
	  			}else{
	  				var arraydata = $scope.mfsda.efit.efitBetas._ArrayData_;
	  				var size = $scope.mfsda.efit.efitBetas._ArraySize_;	  				
							
					var start = $scope.mfsda.componentSlider.value * size[1] * size[0] + $scope.mfsda.covariateSlider.value;
					var end = start + size[1] * size[0];				
					
					var max = 0;
					
					for(var i = start; i < end && i < arraydata.length; i+=size[0]){					
						efitBetas.push(arraydata[i]);
					}	
	  			}
	  		}

  			return efitBetas;
  			
  		}

  		$scope.mfsda.getPvalues = function(){
  			var pvalues = [];
  			if($scope.mfsda.Lpvals_fdr){
  				for(var i = 0; i < $scope.mfsda.Lpvals_fdr.length; i++){
  					pvalues.push($scope.mfsda.Lpvals_fdr[i][$scope.mfsda.pvalueSlider.value]);
  				}
  			}
  			return pvalues;
  		}

  		$scope.mfsda.selectOutput = {
			options: [
				{
					name: 'betas'
				},
				{
					name: 'pValues'
				}
			]	
		}

		$scope.vtk.updateActor = function(hue){
  			
  			hue = hue? hue: $scope.mfsda.hueSlider;

  			if($scope.vtk.mapper){
	      		var lut = $scope.vtk.mapper.getLookupTable();
		        lut.setHueRange(hue.min, hue.max);
		        $scope.vtk.mapper.update();
		        $scope.$broadcast('renderWindow');
	      	}
  		}

  		$scope.vtk.download = function(){

  			if($scope.mfsda.job){
  				var job = {};
	  			job.executable = "generateShapes.sh";
	  			job.version = "1.0.0";
	  			job.parameters = [
	  				{
	  					flag: "--shape",
	  					name: "shape.vtk"
	  				},
	  				{
	  					flag: "--pvalues",
	  					name: "pvalues.json",
	  				},
	  				{
	  					flag: "--efit",
	  					name: "efit.json"
	  				},
	  				{
	  					flag: "--output",
	  					name: "output.vtk"
	  				}
	  			];

	  			job.type = "job";
	  			job.inputs = [{
	  				name: "pvalues.json",
	  				local: {
	  					uri: $scope.mfsda.job._id + "/pvalues.json"
	  				}
	  			},
	  			{
	  				name: "efit.json",
	  				local: {
	  					uri: $scope.mfsda.job._id + "/efit.json"
	  				}
	  			},
	  			{
	  				name: "shape.vtk"
	  			}];

	  			job.executionserver = "localhost";
	  			job.outputs = [{
	  				name: "output",
	  				type: "tar.gz",  				
	  			},
	  			{
	  				name: "stdout.out",
	  				type: "file"
	  			},
	  			{
	  				name: "stderr.err",
	  				type: "file"
	  			}];
	  			job.userEmail = $scope.user.email;
	  			job.jobparameters = [];

	  			return clusterpostService.createAndSubmitJob(job, ["shape.vtk"], [$scope.vtk.vtkascii])
	  			.then(function(res){
	  				console.log(res);
	  				$scope.mfsda.taskSubmitted = true;  				
	  			})
  			}
  			
  		}

  		$scope.mfsda.selectOutput.update = function(){
  			var colors = [];
  			if($scope.mfsda.selectOutput.option){
  				if($scope.mfsda.selectOutput.option.name === "betas"){
	  				colors = $scope.mfsda.getEfitBetas();
	  			}else if($scope.mfsda.selectOutput.option.name === "pValues"){
	  				colors = $scope.mfsda.getPvalues();
	  			}
	  			dcbiaVTKService.addPointDataArray($scope.vtk.vtkPolyData, colors);
	  			$scope.vtk.updateActor();
  			}
  		}

  		$scope.$watch('mfsda.covariateSlider.value', function(covariate){
  			if(covariate !== undefined && $scope.vtk.vtkPolyData){
  				var colors = $scope.mfsda.getEfitBetas();
  				dcbiaVTKService.addPointDataArray($scope.vtk.vtkPolyData, colors);
  				$scope.vtk.updateActor();
  			}
  		})

  		$scope.$watch('mfsda.componentSlider.value', function(component){
  			if(component !== undefined && $scope.vtk.vtkPolyData){
  				var colors = $scope.mfsda.getEfitBetas();
  				dcbiaVTKService.addPointDataArray($scope.vtk.vtkPolyData, colors);
  				$scope.vtk.updateActor();
  			}
  		})

  		$scope.$watch('mfsda.pvalueSlider.value', function(pValue){
  			if(pValue !== undefined && $scope.vtk.vtkPolyData){
  				var colors = $scope.mfsda.getPvalues();
  				dcbiaVTKService.addPointDataArray($scope.vtk.vtkPolyData, colors);
  				$scope.vtk.updateActor();
  			}
  		})



  		$scope.$watch('mfsda.fileTemplate', function(fileTemplate){
  			if(fileTemplate){
  				var reader = new FileReader();
	                
		        reader.onload = function(e) {
		          var vtk = e.target.result;
		          $scope.$broadcast('removeActor', $scope.vtk.actor);
		          $scope.vtk.vtkascii = vtk;
		          $scope.vtk.vtkPolyData = dcbiaVTKService.parsePolyData(vtk);
		          _.extend($scope.vtk, dcbiaVTKService.newActor($scope.vtk.vtkPolyData));
		          $scope.$broadcast('addActor', $scope.vtk.actor, true);
		          $scope.mfsda.selectOutput.update();
		        }

		        reader.onerror = function(e){
		          reject(e)
		        }
		        reader.readAsText(fileTemplate);
  			}
  		});

  		$scope.$watch('mfsda.hueSlider', function(hue){
	      if(hue){
	      	$scope.vtk.updateActor(hue);
	      }
	    }, true)

		// $scope.csv.export = function(project){
		// 	var prom;
		// 	if(!$scope.projects.selectedProject || project._id !== $scope.projects.selectedProject._id){
		// 		prom = $scope.projects.select(project);
		// 	}else{
		// 		prom = Promise.resolve(true);
		// 	}

		// 	prom
		// 	.then(function(){
		// 		var keys = $scope.projects.getProjectKeys([$scope.projects.selectedProject]);
		// 		var csv = 'name:,' + $scope.projects.selectedProject.name + '\n'
		// 		csv += 'description:,' + $scope.projects.selectedProject.description + '\n'
		// 		csv += 'patients:,' + $scope.projects.selectedProject.patients + '\n'
		// 		// if(keys.indexOf("scope") !== -1){
		// 		// 	csv += 'scope:,' + $scope.projects.selectedProject.scope + '\n'
		// 		// }
		// 		csv += '\n';
		// 		var collectionKeys = ['Name','Number of items','Type']
		// 		csv += collectionKeys.toString();
		// 		csv += '\n';
		// 		_.each($scope.projects.selectedProject.collections, function(collection, i){
		// 			_.each($scope.clinicalDataCollection.collections, function(clinicalCollection){
		// 				if(collection._id === clinicalCollection._id){
		// 					csv += clinicalCollection.name + ',' + clinicalCollection.items.length + ',' + clinicalCollection.type + '\n';
		// 				}
		// 			})
		// 			_.each($scope.morphologicalDataCollection.collections, function(morphologicalDataCollection){
		// 				if(collection._id === morphologicalDataCollection._id){
		// 					csv += morphologicalDataCollection.name + ',' + morphologicalDataCollection.items.length + ',' + morphologicalDataCollection.type + '\n';
		// 				}
		// 			})
		// 		})

		// 		var filename = $scope.projects.selectedProject.name;
		// 		if($scope.projects.selectedProject.name.indexOf('csv') === -1){
		// 			filename += '.csv';
		// 		}

		// 		return $scope.csv.download(filename, csv);
		// 	})
		// 	.catch(console.error);
			
		// }

		// $scope.csv.download = function(filename, csv){

		// 	var pom = document.createElement('a');
		// 	var bb = new Blob([csv], {type: 'text/plain'});

		// 	pom.setAttribute('href', window.URL.createObjectURL(bb));
		// 	pom.setAttribute('download', filename);

		// 	pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
		// 	pom.click();
			
		// }

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
	    scope: {
	    	jobParameters: "="
	    },
	    templateUrl: './src/dcbia-mfsda.template.html'
	}

});