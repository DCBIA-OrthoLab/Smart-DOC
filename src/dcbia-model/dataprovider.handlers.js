var request = require('request');
var _ = require('underscore');
var Promise = require('bluebird');
var Boom = require('boom');
var spawn = require('child_process').spawn;

module.exports = function (server, conf) {
	

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
			return server.methods.dcbia.validateJobOwnership(doc, req.auth.credentials);
		})
		.then(function(doc){
			return server.methods.dcbia.addDocumentAttachment(doc, req.params.name, req.payload);
		})
		.then(rep)
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
		})
	}
	

	return handler;
}
