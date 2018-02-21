angular.module('dcbia-jobs')
.directive('dcbiaPreprocessing', function($routeParams, dcbia, clusterauth, clusterpostService, dcbiaVTKService) {

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
  			$scope.preprocessing.Neutral = true;
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

			var indexgroup = $scope.projects.analysis.selectedProjectDataKeys.indexOf('group');
			if(indexgroup !== -1){
				$scope.projects.analysis.hasGroup = true;
				$scope.projects.analysis.selectedProjectDataKeys.splice(indexgroup, 1);//Remove group
				$scope.projects.analysis.selectedProjectDataKeys.splice(0,0,'group');//Add group first
			}else{
				$scope.projects.analysis.hasGroup = false;
			}

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
		$scope.preprocessing = {
			editJobParameters: true,
			jobParameters: $scope.jobParameters
		};

		$scope.preprocessing.getFilteredDataSet = function(){
			$scope.preprocessing.OA = false;
			$scope.preprocessing.Control = false;
			$scope.preprocessing.Neutral = true;
			var Control_Patient = _.clone($scope.preprocessing.type_Control);
			var OA_Patient = _.clone($scope.preprocessing.type_OA);
			var keys = _.clone($scope.projects.analysis.selectedProjectDataKeys);
			var data = _.clone($scope.projects.analysis.selectedProjectData);
			var item = 0;
			var tmp = 0;
			var newkeys = [];
			var index_group = 0;
			while(item < keys.length){
				if(keys[item] == 'group'){
					item += 1;
					index_group = item;
				}
				else if(keys[item] == 'patientId'){
					index_patientId = item;
					item += 1;
				}else{
					newkeys[tmp] = keys[item];
					tmp += 1;
					item += 1;
				}	
			}
			$scope.projects.analysis.selectedProjectDataKeys = newkeys;
			var newdataOA = [];
			var newdataControl = [];
			var newdataNeutral = [];
			var patient = 0;
			var newPatient = 0;
			if (Control_Patient && !OA_Patient){
				$scope.preprocessing.Control = true;
				$scope.preprocessing.Neutral = false;
				while(patient < data.length){
					if(data[patient].group == 0){
						newdataControl[newPatient] = data[patient];
						delete newdataControl.group;
						delete newdataControl.patientId;
						newPatient += 1;
						patient += 1;
					}else{
						patient += 1;
					}
				}
			}
			else if(OA_Patient && !Control_Patient){
				$scope.preprocessing.OA = true;
				$scope.preprocessing.Neutral = false;
				while(patient < data.length){
					if(data[patient].group == 1){
						newdataOA[newPatient] = data[patient];
						delete newdataOA.group;
						delete newdataOA.patientId;
						newPatient += 1;
						patient += 1;
					}else{
						patient += 1;
					}
				}
			}else if(OA_Patient && Control_Patient){
				$scope.preprocessing.Neutral = true;
				while(patient < data.length){
					newdataNeutral[patient] = data[patient];
					delete newdataNeutral.group;
					delete newdataNeutral.patientId;
					patient += 1;
				}
			}
			$scope.projects.analysis.selectedProjectDataNeutral = newdataNeutral;
			$scope.projects.analysis.selectedProjectDataOA = newdataOA;
			$scope.projects.analysis.selectedProjectDataControl = newdataControl;
			return;
		}

		$scope.preprocessing.submitJob = function(){

	// -csv <filename, .csv all the covariates for each patient>
	// -covariates <string, vector of covariate names, ex: mMP3P veCadherinP>
	// -output <output directory>
	// -num_components <number, number of components to keep in PCA>
	// -OA_Control <0 or 1, patient OA (1) or Control (0)>
	// preprocessing.csv 
	// preprocessing.covariates 
	// preprocessing.output
	// preprocessing.num_components 
	// preprocessing.OA_Control 
			
			var preprocessing = $scope.preprocessing.getData();	
  			var job = {};  	
  			
  			if($scope.preprocessing.name){
  				job.name = $scope.preprocessing.name;
  			}
  			job.executable = "preprocessing.sh";
  			job.parameters = [
  				{
  					flag: "--csv",
  					name: "covariates_Values.csv"
  				},
  				{
  					flag: "--num_components",
  					name: preprocessing.flags.num_components
  				},
  				{
  					flag: "--output",
  					name: "./output"
  				}
  			];

  			job.type = "job";
  			job.inputs = preprocessing.inputs;
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
  				name: "pearsoncorr.csv",
  				type: "file",
  				path: "./output/pearsoncorr.csv"
  			},
  			{
  				name: "pearsonFirst.csv",
  				type: "file",
  				path: "./output/pearsonFirst.csv"
  			},
  			{
  				name: "pvaluesFirst.csv",
  				type: "file",
  				path: "./output/pvaluesFirst.csv"
  			},
  			{
  				name: "pearsoncorr.json",
  				type: "file",
  				path: "./output/pearsoncorr.json"
  			},
  			{
  				name: "Plot_covariates_for_each_patient.pdf",
  				type: "file",
  				path: "./output/Plot_covariates_for_each_patient.pdf"
  			}
  			];
  			job.userEmail = $scope.user.email;
  			job.jobparameters = [];

  			var jobParameters = minimist(stringArgv($scope.preprocessing.jobParameters));
  			console.log("jobparameters" + jobParameters)
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

  			return clusterpostService.createAndSubmitJob(job, _.pluck(preprocessing.data, "name"), _.pluck(preprocessing.data, "data"))
  			.then(function(res){
  				console.log(res.config);
  			})
  		}

  		$scope.preprocessing.download = function(job){

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

				if(job._attachments['pearsoncorr.json']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'pearsoncorr.json', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'pearsoncorr.json',
							arraybuffer: ab.data
						}
					}));
				}

				
				if(job._attachments['Plot_covariates_for_each_patient.pdf']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'Plot_covariates_for_each_patient.pdf', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'Plot_covariates_for_each_patient.pdf',
							arraybuffer: ab.data
						}
					}));
				}


				if(job._attachments['pvaluesFirst.csv']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'pvaluesFirst.csv', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'pvaluesFirst.csv',
							arraybuffer: ab.data
						}
					}));
				}
				if(job._attachments['pearsonFirst.csv']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'pearsonFirst.csv', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'pearsonFirst.csv',
							arraybuffer: ab.data
						}
					}));
				}
				if(job._attachments['pearsoncorr.csv']){
					allpromise.push(clusterpostService.getAttachment(job._id, 'pearsoncorr.csv', 'arraybuffer')
					.then(function(ab){
						return {
							name: 'pearsoncorr.csv',
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

  		$scope.preprocessing.getData = function(){

  			var preprocessing = {};
  			$scope.preprocessing.showWarningNumComponent = false;
  			$scope.preprocessing.showWarningPatienttype = false;
  			$scope.preprocessing.numCovariates = 0; 
  			$scope.preprocessing.typeofPatient = 0;


  			var OA_Patient = _.clone($scope.preprocessing.type_OA);
  			var Control_Patient = _.clone($scope.preprocessing.type_Control);
  			var covariateName = _.clone($scope.projects.analysis.selectedProjectDataKeys);
  			var covariate = _.clone($scope.projects.analysis.selectedProjectData); 			 			
  			var num_components= _.clone($scope.preprocessing.num_components);
  			
  			if(OA_Patient && !Control_Patient){
				covariate = $scope.projects.analysis.selectedProjectDataOA;
			}else if(Control_Patient && !OA_Patient){
				covariate = $scope.projects.analysis.selectedProjectDataControl;
			}
			else{
				covariate = $scope.projects.analysis.selectedProjectDataNeutral;
			}
  			var covariateNames = _.compact(_.flatten(covariateName));
  			$scope.preprocessing.length = covariateNames.length;
  			if(num_components==0 || (num_components > covariateNames.length)){
  				$scope.preprocessing.showWarningNumComponent = true;
  				return;
  			}
  			num_components = parseInt(num_components);
  			if(OA_Patient){
  				$scope.preprocessing.typeofPatient = 1;
  			}else {
    			$scope.preprocessing.typeofPatient = 0;
			}


  			if((!OA_Patient) && (!Control_Patient)){
  				$scope.preprocessing.showWarningPatienttype = true;
  				return;
  			}
  			var mapnames = {};


  			covariate = _.compact(_.map(covariate, function(cov){
  					_.each(covariateName, function(covkey){
	  					if(cov[covkey] === undefined){
	  						cov[covkey] = 0;
	  					}
	  				});
	  				return cov;
  				return null;
  			}));
  			
  			
  			var covariateNameIndex = _.indexOf(covariateName, 'patientId')
  			if(covariateNameIndex != -1){
  				covariateName.splice(covariateNameIndex, 1);
  			}
  			
  			try {
				var result = json2csv({ data: covariate, fields: covariateName, quotes: ''}).split('\n');
				covariatecsv = result.join('\n');
			} catch (err) {
				// Errors are thrown for bad options, or if the data is empty and no fields are provided. 
				// Be sure to provide fields if it is possible that your data array will be empty. 
				console.error(err);
			}
  			var covariateType = _.map(covariateName, function(cn){
  				var data = _.pluck(covariate, cn);
  				var datatype = _.map(data, function(d){
  					if(_.isNumber(d)){
  						return Number.isInteger(d);
  					}
  					return 1;
  				});
  				return Number(!eval(datatype.join("&&")));
  			}).join(",");
  			
  			var filelistobj = _.compact(_.flatten(_.map(covariate, function(cov){
  				
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
  				
  				return null;
  			})));
  			OA_Control = parseInt($scope.preprocessing.typeofPatient)
  			preprocessing.data = [];

  			preprocessing.data.push({
  				name: "covariates_Values.csv",
  				data: covariatecsv
  			});

  			preprocessing.flags = {};
  			preprocessing.flags.covariates = covariateName.join(' ');


  			preprocessing.flags.num_components = String(num_components);

  			preprocessing.flags.OA_Control = String(OA_Control);

  			filelistobj.push({
  				name: "covariates_Values.csv"
  			});
  			preprocessing.inputs = filelistobj;

  			return preprocessing;
  		}

  		$scope.preprocessing.hueSlider = {
			min: 0,
			max: 1,
			options: {
				step: 0.01,
				precision: 2,
				ceil: 1, 
				floor: 0
			}
		};

		$scope.preprocessing.covariateSlider = {
			value: 0,
			options: {				
				step: 1,
				minLimit: 0,
				maxLimit: 8,
				ceil: 8
			}
		};

		$scope.preprocessing.componentSlider = {
			value: 0,
			options: {				
				step: 1,
				minLimit: 0,
				maxLimit: 2,
				ceil: 2
			}
		};

		$scope.preprocessing.pvalueSlider = {
			value: 0,
			options: {				
				step: 1,
				minLimit: 0,
				maxLimit: 7,
				ceil: 7
			}
		};

  		$scope.preprocessing.jobCallback = function(job){
  			$scope.preprocessing.showPlots = true;
  		}

  		// $scope.preprocessing.getEfitBetas = function(){
  		// 	var efitBetas = [];

  		// 	if($scope.preprocessing.efit && $scope.preprocessing.efit.efitBetas){
  		// 		var arraydata = $scope.preprocessing.efit.efitBetas._ArrayData_;
  		// 		var size = $scope.preprocessing.efit.efitBetas._ArraySize_;	  				
						
				// var start = $scope.preprocessing.componentSlider.value * size[1] * size[0] + $scope.preprocessing.covariateSlider.value;
				// var end = start + size[1] * size[0];				
				
				// var max = 0;
				
				// for(var i = start; i < end && i < arraydata.length; i+=size[0]){					
				// 	efitBetas.push(arraydata[i]);
				// }	
  		// 	}

  		// 	return efitBetas;
  			
  		// }

  		// $scope.preprocessing.getPvalues = function(){
  		// 	var pvalues = [];
  		// 	if($scope.preprocessing.Lpvals_fdr){
  		// 		for(var i = 0; i < $scope.preprocessing.Lpvals_fdr.length; i++){
  		// 			pvalues.push($scope.preprocessing.Lpvals_fdr[i][$scope.preprocessing.pvalueSlider.value]);
  		// 		}
  		// 	}
  		// 	return pvalues;
  		// }

  // 		$scope.preprocessing.selectOutput = {
		// 	options: [
		// 		{
		// 			name: 'betas'
		// 		},
		// 		{
		// 			name: 'pValues'
		// 		}
		// 	]	
		// }

  		// $scope.$watch('preprocessing.covariateSlider.value', function(covariate){
  		// 	if(covariate !== undefined && $scope.preprocessing.vtkPolyData){
  		// 		var colors = $scope.preprocessing.getEfitBetas();
  		// 		$scope.preprocessing.vtkPolyData.addPointDataArray(new Float32Array(colors), "pointScalars", "Float32Array");
  		// 	}
  		// })

  		// $scope.$watch('preprocessing.componentSlider.value', function(component){
  		// 	if(component !== undefined && $scope.preprocessing.vtkPolyData){
  		// 		var colors = $scope.preprocessing.getEfitBetas();
  		// 		$scope.preprocessing.vtkPolyData.addPointDataArray(new Float32Array(colors), "pointScalars", "Float32Array");
  		// 	}
  		// })

  		// $scope.$watch('preprocessing.pvalueSlider.value', function(pValue){
  		// 	if(pValue !== undefined && $scope.preprocessing.vtkPolyData){
  		// 		var colors = $scope.preprocessing.getPvalues();
  		// 		$scope.preprocessing.vtkPolyData.addPointDataArray(new Float32Array(colors), "pointScalars", "Float32Array");
  		// 	}
  		// })



  		$scope.$watch('preprocessing.fileTemplate', function(fileTemplate){
  			if(fileTemplate){
  				var reader = new FileReader();
	                
		        reader.onload = function(e) {
		          var vtk = e.target.result;
		          $scope.preprocessing.vtkPolyData = dcbiaVTKService.parseVTK(vtk);
		          $scope.preprocessing.selectOutput.update();
		        }

		        reader.onerror = function(e){
		          reject(e)
		        }
		        reader.readAsText(fileTemplate);
  			}
  		})

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
	    scope: {
	    	jobParameters: "="
	    },
	    templateUrl: './src/dcbia-preprocessing.template.html'
	}

});