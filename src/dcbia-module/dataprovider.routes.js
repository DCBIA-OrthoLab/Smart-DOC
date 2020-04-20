
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('@hapi/joi');	
	

	server.route({
	    method: 'POST',
	    path: '/dcbia/uploadZipFile',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.uploadZipFile,
		    validate : {
		    	query: false,
		    	params: null,
		    	payload: true
		    },
		    payload: {
				maxBytes: 1024 * 1024 * 1024,
				output: 'stream',
				parse: true
		    },	        
	        description: 'upload a zipfile on server'
	    }
	});


	server.route({
		method: 'GET',
		path: '/dcbia/map',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.getDirectoryMap,
           	validate: {
			  	query: Joi.object().keys({
			    	email: Joi.string().email()
			    }).optional(),
			    params: null, 
			    payload: false
			},
		}
	})




	server.route({
		method: 'DELETE',
		path: '/dcbia/delete',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.deleteFile,
			validate: {
				query: false,
				params: null,
				payload: true
			},
		    payload: {
				maxBytes: 1024 * 1024 * 1024,
				output: 'data',
		    },	        

			description: "delete a file from the server"
		}
	})






	server.route({
		method: 'GET',
		path: '/dcbia/search/{data}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.searchFiles,
			validate: {
				query: false,
				params: Joi.object({
					data: Joi.string().required()
				}),
				payload: false
			},
			description: 'search for a file in the user personnal space'
		}
	})

	server.route({
		method: 'POST',
		path: '/dcbia/createfolder',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.createFolder,
	        validate: {
	        	query: false,
	        	payload: Joi.object({
	        		name: Joi.string().required(),
	        		path: Joi.string().required()
	        	}),
	        	params: null
	        },
	    description: 'create a folder at the path in the user personnal space'
	    }
	})

	server.route({
		method: 'POST',
		path: '/dcbia/download',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.downloadFiles,
			validate: {
				query: false,
				payload: true,
				params: null
			},
		description: 'download list of selected files'
		},
	})

	server.route({
		method: 'POST',
		path: '/dcbia/shareFiles',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.shareFiles,
			validate: {
				query: false,
			    payload: Joi.object({
					users: Joi.array(),
					directory: Joi.string(),
				}),
			    params: null		    
			},
		}
	})


	server.route({
		method: 'POST',
		path: '/dcbia/moveFiles',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.moveFiles,
			validate: {
				query: false,
			    payload: Joi.object({
			    	directory: Joi.string(),
			    	files: Joi.array(),
			    }),
			    params: null		    
			},
		}
	})




}