
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('joi');	

	var clinicaldatapost = Joi.object({
        	type: Joi.string().valid('clinicalData').required(),
        	patientId: Joi.any().required()
        }).unknown();

	var clinicaldata = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
        	type: Joi.string().valid('clinicalData').required(),
        	patientId: Joi.any().required()
        }).unknown();

	var clinicalcollectionpost = Joi.object({
			name: Joi.string().required(),
        	type: Joi.string().valid('clinicalDataCollection'),
        	items: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum().required()
        	}))
        });

	var clinicalcollection = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
        	type: Joi.string().valid('clinicalDataCollection').required(),
        	name: Joi.string().required(),
        	items: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum()
        	}))
        });


	server.route({
		path: '/dcbia/clinical/collections',
		method: 'GET',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.getClinicalCollections,
			validate: {
				query: false,
		        payload: false,
		        params: false
			},
			response: {
				schema: Joi.array().items(clinicalcollection)
			},
			description: 'This route will be used to post job documents to the couch database.'
		}
	});

	server.route({
		path: '/dcbia/clinical/collection',
		method: 'POST',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.createDocument,
			validate: {
				query: false,
		        payload: clinicalcollectionpost,
		        params: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to post job documents to the couch database.'
		}
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/collection/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.getDocument,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			response: {
				schema: clinicalcollection
			},
			description: 'Get the job document posted to the database'
	    }
	});

	server.route({
		path: '/dcbia/clinical/collection/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.deleteDocument,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to delete job documents from the database'
		}
	});

	server.route({
		path: '/dcbia/clinical/collection',
		method: 'PUT',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.updateDocument,
			validate: {
				query: false,
		        payload: clinicalcollection,
		        params: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to update a job document in the couch database.'
		}
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/collection/data",
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.getAllClinicalCollectionData,
			validate: {
			  	query: false,
			    params: false, 
			    payload: false
			},
			response: {
				schema: Joi.array().items(clinicaldata)
			},
			description: 'Get all clinical data'
	    }
	});


	server.route({
		method: 'GET',
		path: "/dcbia/clinical/collection/data/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.getClinicalCollectionData,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			response: {
				schema: Joi.array().items(clinicaldata)
			},
			description: 'Get the job document posted to the database'
	    }
	});


	server.route({
		path: '/dcbia/clinical/data',
		method: 'POST',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.createDocument,
			validate: {
				query: false,
		        payload: clinicaldatapost,
		        params: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to post job documents to the couch database.'
		}
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/data/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.getDocument,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			description: 'Get the job document posted to the database'
	    }
	});

	server.route({
		path: '/dcbia/clinical/data/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.deleteDocument,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to delete job documents from the database'
		}
	});

	server.route({
		path: '/dcbia/clinical/data',
		method: 'PUT',
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.updateDocument,
			validate: {
				query: false,
		        payload: clinicaldata,
		        params: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to update a job document in the couch database.'
		}
	});

	server.route({
		method: 'PUT',
		path: "/dcbia/{id}/{name}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['clusterpost']
            },
			handler: handlers.addAttachment,
	      	validate: {
		      	query: false,
		        params: {
		        	id: Joi.string().alphanum().required(),
		        	name: Joi.string().required()
		        },
		        payload: true
		    },
		    payload: {
	        	maxBytes: 1024 * 1024 * 1024,
	    		output: 'stream'
	        },
		    description: 'Add attachment data'
	    }
	});
	

}
