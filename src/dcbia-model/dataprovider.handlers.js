var request = require('request');
var _ = require('underscore');
var Promise = require('bluebird');
var Boom = require('boom');
var spawn = require('child_process').spawn;
var couchUpdateViews = require('couch-update-views');
var path = require('path');
var qs = require('querystring');

module.exports = function (server, conf) {
	

	couchUpdateViews.migrateUp(server.methods.dcbia.getCouchDBServer(), path.join(__dirname, 'views'), true);

	const validateOwnership = function(doc, credentials){
		return new Promise(function(resolve, reject){
			if(credentials.scope.indexOf('admin') !== -1 || doc.owner === credentials.email || !doc.scope){
				resolve(doc);
			}else if(doc.scope){
				var authorize = false;
				for(var i = 0; i < doc.scope.length && !authorize; i++){
					if(credentials.scope.indexOf(doc.scope[i]) !== -1){
						authorize = true;
					}
				}
				if(authorize){
					resolve(doc);
				}else{
					reject(Boom.unauthorized("You are not allowed to access this job document!"));
				}
			}else{
				reject(Boom.unauthorized("You are not allowed to access this job document!"));
			}
		});
	}

	server.method({
	    name: 'dcbia.validateOwnership',
	    method: validateOwnership,
	    options: {}
	});

	var handler = {};
	/*
	*/
	handler.createDocument = function(req, rep){
		
		var doc = req.payload;

		server.methods.dcbia.uploadDocuments(doc)
		.then(function(res){
			if(res.length === 1){
				return res[0];
			}else{
				return res;
			}
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.badRequest(e));
		});
		
	}

	/*
	*/
	handler.getDocument = function(req, rep){
		
		server.methods.dcbia.getDocument(req.params.id)
		.then(function(doc){
			return server.methods.dcbia.validateOwnership(doc, req.auth.credentials);
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
		
	}

	/*
	*/
	handler.updateDocument = function(req, rep){

		var doc = req.payload;
		var credentials = req.auth.credentials;

		server.methods.dcbia.uploadDocuments(doc)
		.then(function(res){
			rep(res[0]);
		})
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	/*
	*/
	handler.addAttachment = function(req, rep){
		server.methods.dcbia.getDocument(req.params.id)
		.then(function(doc){
			return server.methods.dcbia.addDocumentAttachment(doc, req.params.name, req.payload);
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	/*
	*/
	handler.getAttachment = function(req, rep){
		var docid = req.params.id;
		var name = req.params.name;

		server.methods.dcbia.getDocument(docid)
		.then(function(doc){
			return server.methods.dcbia.validateOwnership(doc, req.auth.credentials);
		})
		.then(function(doc){
			if(doc._attachments && doc._attachments[name]){
				rep.proxy(server.methods.dcbia.getDocumentURIAttachment(docid + "/" + req.params.name));
			}else{
				rep(Boom.notFound(docid + "/" + name));
			}
		})
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	handler.deleteDocument = function(req, rep){

		server.methods.dcbia.getDocument(req.params.id)
		.then(function(doc){
			return server.methods.dcbia.deleteDocument(doc);
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	/*
	*/
	handler.getClinicalCollections = function(req, rep){

		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchClinicalData/_view/collectionName?include_docs=true';

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	/*
	*/
	handler.getAllClinicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchClinicalData/_view/patientId?include_docs=true';

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	/*
	*/
	handler.getClinicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/getClinicalDataCollection/_view/items?include_docs=true&key="' + req.params.id + '"';

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			if(docs.length !== compactdocs.length){
				return server.methods.dcbia.getDocument(req.params.id)
				.then(function(col){
					col.items = _.compact(_.map(rows, function(row){
						if(row.doc !== null){
							return row.value;
						}else{
							return null;
						}
					}));
					return server.methods.dcbia.uploadDocuments(col)
					.then(function(){
						return compactdocs;
					});
				});
			}else{
				return compactdocs;
			}
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	handler.getClinicalDataOwner = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;

		var useremail = req.query.email;

		var view;

		if(credentials.scope.indexOf('admin') !== -1 && useremail){
			view = '_design/getSurvey/_view/userItems?key="' + useremail +'"';
		}else if(credentials.scope.indexOf('admin') !== -1){
			view = '_design/getSurvey/_view/userItems';
		}else{
			view = '_design/getSurvey/_view/userItems?key="' + email +'"';
		}

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'value');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	handler.getMorphologicalCollections = function(req, rep){

		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchMorphologicalData/_view/collectionName?include_docs=true';

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	
	}

	handler.getAllMorphologicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchMorphologicalData/_view/patientId?include_docs=true';

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	}

	const getMorphologicalCollectionData = function(collectionId){
		return new Promise(function(resolve, reject){

			var params = {
				include_docs: true,
				key: JSON.stringify(collectionId)
			}
			var view = '_design/getMorphologicalDataCollection/_view/items?' + qs.stringify(params);
			
			return server.methods.dcbia.getView(view)
			.then(function(rows){
				var docs = _.pluck(rows, 'doc');
				var compactdocs = _.compact(docs);
				if(docs.length !== compactdocs.length){
					return server.methods.dcbia.getDocument(req.params.id)
					.then(function(col){
						col.items = _.compact(_.map(rows, function(row){
							if(row.doc !== null){
								return row.value;
							}else{
								return null;
							}
						}));
						return server.methods.dcbia.uploadDocuments(col)
						.then(function(){
							return compactdocs;
						});
					});
				}else{
					return compactdocs;
				}
			})
			.then(resolve)
			.catch(function(e){
				reject(Boom.badData(e))
			});
		});
	}

	/*
	*/
	handler.getMorphologicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		getMorphologicalCollectionData(req.params.id)
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
		
	}

	/*
	*/
	handler.getMorphologicalDataByPatientId = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchMorphologicalData/_view/patientId?include_docs=true&key="' + req.params.id + '"';

		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			rep(docs);
		})
		.catch(function(err){
			rep(Boom.wrap(err));
		});

	}

	handler.getProjects = function(req, rep){
		
		var view = '_design/getProject/_view/projectItems?include_docs=true';
		
		server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
	
	}

	handler.getMorphologicalDataByCollectionIdPatientId = function(req, rep){
			

		getMorphologicalCollectionData(req.params.collectionId)
		.then(function(rows){
			//TODO filter by patient Id

			return _.filter(rows,function(morphologicalData){
				return morphologicalData.patientId==req.params.patientId;

			});
		})
		.then(rep)
		.catch(function(e){
			rep(Boom.wrap(e));
		});
		
	
	
	}
	

	return handler;
}
