
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('joi');	

	var clinicaldatapost = Joi.object({
        	type: Joi.string().valid('clinicalData').required(),
        	patientId: Joi.any().required(),
        	date: Joi.date().required(),
        	scope: Joi.array().items(Joi.string()).optional()
        }).unknown();

	var clinicaldata = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
        	type: Joi.string().valid('clinicalData').required(),
        	patientId: Joi.any().required(),
        	date: Joi.date().optional(),
        	scope: Joi.array().items(Joi.string()).optional(),
        	owner: Joi.string().email().optional()
        }).unknown();

	var clinicalcollectionpost = Joi.object({
			name: Joi.string().required(),
        	type: Joi.string().valid('clinicalDataCollection'),
        	items: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum().required()
        	})),
        	scope: Joi.array().items(Joi.string()).optional(),
        	owner: Joi.string().email().optional()
        });

	var clinicalcollection = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
        	type: Joi.string().valid('clinicalDataCollection').required(),
        	name: Joi.string().required(),
        	scope: Joi.array().items(Joi.string()).required(),
        	items: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum()
        	})),
        	scope: Joi.array().items(Joi.string()).optional(),
        	owner: Joi.string().email().optional()
        });

	var morphologicaldatapost = Joi.object({
        	type: Joi.string().valid('morphologicalData').required(),
        	patientId: Joi.any().required(),
        	date: Joi.date().required(),
        	scope: Joi.array().items(Joi.string()).optional()
        }).unknown();

	var morphologicaldata = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
        	type: Joi.string().valid('morphologicalData').required(),
        	patientId: Joi.any().required(),
        	date: Joi.date().optional(),
        	scope: Joi.array().items(Joi.string()).optional(),
        	owner: Joi.string().email().optional()
        }).unknown();

	var morphologicalcollectionpost = Joi.object({
			name: Joi.string().required(),
        	type: Joi.string().valid('morphologicalDataCollection'),
        	items: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum().required()
        	})),
        	scope: Joi.array().items(Joi.string()).optional(),
        	owner: Joi.string().email().optional()
        });

	var morphologicalcollection = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
        	type: Joi.string().valid('morphologicalDataCollection').required(),
        	name: Joi.string().required(),
        	scope: Joi.array().items(Joi.string()).required(),
        	items: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum()
        	})),
        	scope: Joi.array().items(Joi.string()).optional(),
        	owner: Joi.string().email().optional()
        });

	var dataowned = Joi.object({
			_id: Joi.string().alphanum().required(),
			formId: Joi.string().required(),
			patientId: Joi.any().required(),
			owner: Joi.string().required(),
			date: Joi.string().required()
		}).unknown();
	
	var project = Joi.object({
			_id: Joi.string().alphanum().required(),
			_rev: Joi.string().required(),
			type: Joi.string().valid('project').required(),
			name: Joi.string().required(),
			patients: Joi.string().alphanum().optional(),
			description: Joi.string().required(),
			collections: Joi.allow(Joi.array().items(Joi.object().keys({
				_id: Joi.string().alphanum()
			})), Joi.object().optional()),
			scope: Joi.array().items(Joi.string()).optional(),
			analyses: Joi.array().items(Joi.object()).optional(),
			owner: Joi.string().email().optional()
		});

	var projectpost = Joi.object({
			name: Joi.string().required(),
        	type: Joi.string().valid('project').required(),
        	description: Joi.string().required(),
        	patients: Joi.string().alphanum().optional(),
        	collections: Joi.array().items(Joi.object().keys({
        		_id: Joi.string().alphanum().required()
        	})),
        	owner: Joi.string().email().optional()
        });


	server.route({
		path: '/dcbia/clinical/collections',
		method: 'GET',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
			description: 'Get all the clinical data collections in the database.'
		}
	});

	server.route({
		path: '/dcbia/clinical/collection',
		method: 'POST',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
			description: 'Create a new clinical data collection.'
		}
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/collection/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
			description: 'Get a clinical data collection document from the database'
	    }
	});

	server.route({
		path: '/dcbia/clinical/collection/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
			description: 'Delete a clinical collection from the database'
		}
	});

	server.route({
		path: '/dcbia/clinical/collection',
		method: 'PUT',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
			description: 'Update a clinical data collection.'
		}
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/collection/data",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
                scope: ['dentist']
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
			description: 'Get the data from a clinical data collection'
	    }
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/data/owner",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getClinicalDataOwner,
			validate: {
			  	query: {
			    	email: Joi.string().optional()
			    },
			    params: false, 
			    payload: false
			},
			response: {
				schema: Joi.array().items(dataowned)
			},
			description: 'Get clinical data by the owner who created the collection'
	    }
	});

	server.route({
		path: '/dcbia/clinical/data',
		method: 'GET',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getClinicalData,
			validate: {
				query: {
			    	patientId: Joi.string().optional(),
			    	date: Joi.date().optional()
			    },
		        payload: false,
		        params: false
			},
			response: {
				schema: Joi.array().items(clinicaldata)
			},
			description: 'Get clinical data from the database using optional query parameters patientId and/or date'
		}
	});

	server.route({
		path: '/dcbia/clinical/data',
		method: 'POST',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
			description: 'Create a new clinical data item'
		}
	});

	server.route({
		method: 'GET',
		path: "/dcbia/clinical/data/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
				schema: clinicaldata
			},
			description: 'Get a clinical data item from the database'
	    }
	});

	server.route({
		path: '/dcbia/clinical/data/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
                scope: ['dentist']
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
		path: '/dcbia/morphological/collections',
		method: 'GET',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getMorphologicalCollections,
			validate: {
				query: false,
		        payload: false,
		        params: false
			},
			response: {
				schema: Joi.array().items(morphologicalcollection)
			},
			description: 'This route will be used to post job documents to the couch database.'
		}
	});

	server.route({
		path: '/dcbia/morphological/collection',
		method: 'POST',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.createDocument,
			validate: {
				query: false,
		        payload: morphologicalcollectionpost,
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
		path: "/dcbia/morphological/collection/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
				schema: morphologicalcollection
			},
			description: 'Get the job document posted to the database'
	    }
	});

	server.route({
		path: '/dcbia/morphological/collection/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
		path: '/dcbia/morphological/collection',
		method: 'PUT',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.updateDocument,
			validate: {
				query: false,
		        payload: morphologicalcollection,
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
		path: "/dcbia/morphological/collection/data",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getAllMorphologicalCollectionData,
			validate: {
			  	query: false,
			    params: false, 
			    payload: false
			},
			response: {
				schema: Joi.array().items(morphologicaldata)
			},
			description: 'Get all morphological data'
	    }
	});


	server.route({
		method: 'GET',
		path: "/dcbia/morphological/collection/data/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getMorphologicalCollectionData,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			response: {
				schema: Joi.array().items(morphologicaldata)
			},
			description: 'Get the job document posted to the database'
	    }
	});


	server.route({
		path: '/dcbia/morphological/data',
		method: 'POST',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.createDocument,
			validate: {
				query: false,
		        payload: morphologicaldatapost,
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
		path: "/dcbia/morphological/data/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
				schema: morphologicaldata
			},
			description: 'Get the job document posted to the database'
	    }
	});

	server.route({
		method: 'GET',
		path: "/dcbia/morphological/data/patientId/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getMorphologicalDataByPatientId,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string().alphanum().required()
			    }, 
			    payload: false
			},
			response: {
				schema: Joi.array(morphologicaldata)
			},
			description: 'Get the morphological data by patientId'
	    }
	});

	server.route({
		method: 'GET',
		path: "/dcbia/morphological/data",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getMorphologicalData,
			validate: {
			  	query: {
			    	patientId: Joi.string().optional(),
			    	date: Joi.date().optional()
			    },
			    params: false, 
			    payload: false
			},
			response: {
				schema: Joi.array(morphologicaldata)
			},
			description: 'Get the morphological data by patientId'
	    }
	});

	server.route({
		path: '/dcbia/morphological/data/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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
		path: '/dcbia/morphological/data',
		method: 'PUT',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.updateDocument,
			validate: {
				query: false,
		        payload: morphologicaldata,
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
		path: "/dcbia/{id}/{name}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getAttachment,
	      	validate: {
		      	query: false,
		        params: {
		        	id: Joi.string().alphanum().required(),
		        	name: Joi.string().required()
		        },
		        payload: false
		    },
		    description: 'Get attachment data'
	    }
	});

	server.route({
		method: 'PUT',
		path: "/dcbia/{id}/{name}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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

	server.route({
		method: 'GET',
		path: "/dcbia/projects",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getProjects,
			validate: {
			  	query: false,
			    params: false, 
			    payload: false
			},
			response: {
				schema: Joi.array().items(project)
			},
			description: 'Get the job document posted to the database'
	    }
	});

	server.route({
		method: 'GET',
		path: "/dcbia/project/{id}",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getDocument,
			validate: {
			  	query: false,
			    params: {
			    	id: Joi.string()
			    }, 
			    payload: false
			},
			response: {
				schema: project
			},
			description: 'Get the job document posted to the database'
	    }
	});	

	server.route({
		path: '/dcbia/projects',
		method: 'PUT',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.updateDocument,
			validate: {
				query: false,
		        payload: project,
		        params: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to update a job document in the couch database.'
		}
	});


	server.route({
		method: 'POST',
		path: "/dcbia/projects",
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.createDocument,
			validate: {
				query: false,
		        payload: projectpost,
		        params: false
			},
			payload:{
				output: 'data'
			},
			description: 'This route will be used to post job documents to the couch database.'
		}
	});

	server.route({
		path: '/dcbia/project/{id}',
		method: 'DELETE',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
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


}
