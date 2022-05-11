var request = require('request');
var _ = require('underscore');
var Promise = require('bluebird');
var Boom = require('@hapi/boom');
var spawn = require('child_process').spawn;
var couchUpdateViews = require('couch-update-views');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var nodemailer = require('nodemailer');

module.exports = function (server, conf) {
	
	var handler = {};
	/*
	*/

	couchUpdateViews.migrateUp(server.methods.dcbia.getCouchDBServer(), path.join(__dirname, 'views'), true);

	var transporter;

	if(conf.mailer){
		if(conf.mailer.nodemailer === 'nodemailer-stub-transport'){
			transporter = nodemailer.createTransport(require(conf.mailer.nodemailer)());
		}else{
			transporter = nodemailer.createTransport(conf.mailer.nodemailer);
		}
		transporter.verify(function(error, success) {
			if (error) {
				console.log(error);
			}
		});
	}

	handler.sendUserMessage = function(req, h){

		var doc = req.payload;

		var mailOptions = {
		    from: doc.user,
		    to: "jprieto@med.unc.edu",
		    subject: 'DSCI full access',
		    html: doc.message
		};
		
		return new Promise(function(resolve, reject){
			if(transporter){
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        reject(Boom.badImplementation(error));
				    }else{
				    	resolve();
				    }
				});	
			}else{
				reject(Boom.badImplementation("Transporter not initialized"));
			}
			
		})
	}
	

	const validateOwnership = function(doc, credentials){
		
		if(credentials.scope.indexOf('admin') !== -1 || doc.owner === credentials.email || !doc.scope){
			return true;
		}else if(doc.scope){
			var authorize = false;
			for(var i = 0; i < doc.scope.length && !authorize; i++){
				if(credentials.scope.indexOf(doc.scope[i]) !== -1){
					authorize = true;
				}
			}
			return authorize;			
		}else{
			return false;
		}
	}

	server.method({
	    name: 'dcbia.validateOwnership',
	    method: validateOwnership,
	    options: {}
	});

	const validateOwnershipPromise = function(doc, credentials){
		return new Promise(function(resolve, reject){
			if(server.methods.dcbia.validateOwnership(doc, credentials)){
				resolve(doc);
			}else{
				reject(Boom.unauthorized("You are not allowed to access this job document!"));
			}			
		});
	}

	server.method({
	    name: 'dcbia.validateOwnershipPromise',
	    method: validateOwnershipPromise,
	    options: {}
	});


	handler.createDocument = function(req, h){
		
		var doc = req.payload;
		var credentials = req.auth.credentials;

		if(!doc.owner){
			doc.owner = credentials.email;
		}

		return server.methods.dcbia.uploadDocuments(doc)
		.then(function(res){
			if(res.length === 1){
				return res[0];
			}else{
				return res;
			}
		})
		.catch(function(e){
			return Boom.badRequest(e);
		});
		
	}

	/*
	*/
	handler.getDocument = function(req, h){
		
		return server.methods.dcbia.getDocument(req.params.id)
		.then(function(doc){
			return server.methods.dcbia.validateOwnershipPromise(doc, req.auth.credentials);
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
		
	}

	/*
	*/
	handler.updateDocument = function(req, rep){

		var doc = req.payload;
		var credentials = req.auth.credentials;

		return server.methods.dcbia.uploadDocuments(doc)
		.then(function(res){
			return res[0];
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	/*
	*/
	handler.addAttachment = function(req, rep){
		return server.methods.dcbia.getDocument(req.params.id)
		.then(function(doc){
			return server.methods.dcbia.addDocumentAttachment(doc, req.params.name, req.payload);
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	/*
	*/
	handler.getAttachment = function(req, rep){
		var docid = req.params.id;
		var name = req.params.name;

		return server.methods.dcbia.getDocument(docid)
		.then(function(doc){
			return server.methods.dcbia.validateOwnershipPromise(doc, req.auth.credentials);
		})
		.then(function(doc){
			if(doc._attachments && doc._attachments[name]){
				rep.proxy(server.methods.dcbia.getDocumentURIAttachment(docid + "/" + req.params.name));
			}else{
				return Boom.notFound(docid + "/" + name);
			}
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	handler.deleteDocument = function(req, rep){

		return server.methods.dcbia.getDocument(req.params.id)
		.then(function(doc){
			return server.methods.dcbia.deleteDocument(doc);
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	/*
	*/
	handler.getClinicalCollections = function(req, rep){

		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchClinicalData/_view/collectionName?include_docs=true';
		
		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	/*
	*/
	handler.getAllClinicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchClinicalData/_view/patientId?include_docs=true';

		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	/*
	*/
	handler.getClinicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/getClinicalDataCollection/_view/items?include_docs=true&key="' + req.params.id + '"';

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
		.catch(function(e){
			return Boom.wrap(e);
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

		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'value');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	handler.getClinicalData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;

		var patientId = req.query.patientId;
		var date = req.query.date;

		var view;

		if(patientId && date){			
			var d = new Date(date);
			var params = {
				key: JSON.stringify([patientId, d.getFullYear(), d.getMonth() + 1, d.getDate()]),
				include_docs: true
			};
			view = '_design/searchClinicalData/_view/patientIdDate?' + qs.stringify(params);
		}else if(patientId){			
			var params = {
				key: patientId,
				include_docs: true
			};
			view = '_design/searchClinicalData/_view/patientId?' + qs.stringify(params);
		}else if(date){
			var d = new Date(date);
			var params = {
				key: JSON.stringify([d.getFullYear(), d.getMonth() + 1, d.getDate()]),
				include_docs: true
			};
			view = '_design/searchClinicalData/_view/date?' + qs.stringify(params);
		}else{
			var params = {				
				include_docs: true
			};
			view = '_design/searchClinicalData/_view/patientId?' + qs.stringify(params);
		}

		return server.methods.dcbia.getView(view)
		.then(function(rows){			
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return _.filter(compactdocs, function(doc){
				return server.methods.dcbia.validateOwnership(doc, credentials);
			});
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	}

	handler.getMorphologicalCollections = function(req, rep){

		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchMorphologicalData/_view/collectionName?include_docs=true';

		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.catch(function(e){
			return Boom.wrap(e);
		});
	
	}

	handler.getAllMorphologicalCollectionData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchMorphologicalData/_view/patientId?include_docs=true';

		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.catch(function(e){
			return Boom.wrap(e);
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
					return server.methods.dcbia.getDocument(collectionId)
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
		
		return getMorphologicalCollectionData(req.params.id)
		.catch(function(e){
			return (Boom.wrap(e));
		});
		
	}

	/*
	*/
	handler.getMorphologicalDataByPatientId = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;
		
		var view = '_design/searchMorphologicalData/_view/patientId?include_docs=true&key="' + req.params.id + '"';

		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			return docs;
		})
		.catch(function(err){
			return (Boom.wrap(err));
		});

	}

	handler.getMorphologicalData = function(req, rep){
		var credentials = req.auth.credentials;
		var email = credentials.email;

		var patientId = req.query.patientId;
		var date = req.query.date;

		var view;

		if(patientId && date){
			var d = new Date(date);			
			var params = {
				key: JSON.stringify([patientId, d.getFullYear(), d.getMonth() + 1, d.getDate()]),
				include_docs: true
			};
			view = '_design/searchMorphologicalData/_view/patientIdDate?' + qs.stringify(params);
		}else if(patientId){			
			var params = {
				key: patientId,
				include_docs: true
			};
			view = '_design/searchMorphologicalData/_view/patientId?' + qs.stringify(params);
		}else if(date){
			var d = new Date(date);
			var params = {
				key: JSON.stringify([d.getFullYear(), d.getMonth() + 1, d.getDate()]),
				include_docs: true
			};
			view = '_design/searchMorphologicalData/_view/date?' + qs.stringify(params);
		}else{
			var params = {				
				include_docs: true
			};
			view = '_design/searchMorphologicalData/_view/patientId?' + qs.stringify(params);
		}

		return server.methods.dcbia.getView(view)
		.then(function(rows){		
			
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return _.filter(compactdocs, function(doc){
				return server.methods.dcbia.validateOwnership(doc, credentials);
			});
		})
		.catch(function(e){
			return (Boom.wrap(e));
		});
	}

	handler.getProjects = function(req, rep){
		
		var view = '_design/getProject/_view/projectItems?include_docs=true';
		
		return server.methods.dcbia.getView(view)
		.then(function(rows){
			var docs = _.pluck(rows, 'doc');
			var compactdocs = _.compact(docs);
			return compactdocs;
		})
		.catch(function(e){
			return (Boom.wrap(e));
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
		.catch(function(e){
			return (Boom.wrap(e));
		});
		
	
	
	}
	

	return handler;
}
