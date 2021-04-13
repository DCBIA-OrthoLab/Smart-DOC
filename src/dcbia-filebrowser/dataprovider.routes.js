
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('@hapi/joi');	

	server.route({
	    method: 'GET',
	    path: '/dcbia/users',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.getUserEmails,
		    validate : {
		    	query: false,
		    	params: null,
		    	payload: false
		    },
		    response: {
		    	schema: Joi.array().items(Joi.object({
					email: Joi.string().email()
				}))
		    },
	        description: 'Get dsci user emails'
	    }
	});
	

	server.route({
	    method: 'POST',
	    path: '/dcbia/upload/{target_path*}',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.uploadFile,
		    validate : {
		    	query: false,
		    	params: Joi.object({
					target_path: Joi.string().required().pattern(/(\.\.)/, { invert: true })
		    	}),
		    	payload: true
		    },
		    payload: {
				maxBytes: 1024 * 1024 * 1024,
				output: 'stream',
				parse: true
		    },	        
	        description: 'upload a file on the server'
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
			response: {
		    	schema: Joi.array().items(Joi.object(
		    	{
		    		type: Joi.string(),
		    		name: Joi.string(),
		    		path: Joi.string(),
		    		files: Joi.array(),
		    		link: Joi.boolean()
		    	}
		    	))
		    }
		}
	})




	server.route({
		method: 'DELETE',
		path: '/dcbia/delete/{target_path*}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.deleteFile,
			validate: {
				query: false,
				params: Joi.object({
					target_path: Joi.string().required().pattern(/(\.\.)/, { invert: true })
		    	}),
				payload: false
			},
			payload:{
				output: 'data'
			},
			description: "delete a file from the server"
		}
	})


	server.route({
		method: 'POST',
		path: '/dcbia/createfolder/{newfolder*}',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.createFolder,
	        validate: {
	        	query: false,
	        	params: Joi.object({
	        		newfolder: Joi.string().required().pattern(/(\.\.)/, { invert: true })
	        	}),
	        	payload: false
	        },
	    	description: 'create a folder at the path in the user personnal space'
	    }
	})

	server.route({
		method: 'GET',
		path: '/dcbia/download/{file*}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.downloadFile,
			validate: {
				query: false,
				payload: false,
				params: Joi.object({
					file: Joi.string().pattern(/(\.\.)/, { invert: true })
				})
				
			},
			description: 'download file/directory. If directory, the stream will be a zipped file'
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
					directory: Joi.string().pattern(/(\.\.)/, { invert: true }),
				}),
			    params: null		    
			},
		}
	});
	

	server.route({
		method: 'PUT',
		path: '/dcbia/copyFiles',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.copyFiles,
			validate: {
				query: false,
			    payload: Joi.object({
			    	source: Joi.string().pattern(/(\.\.)/, { invert: true }),
			    	target: Joi.string().pattern(/(\.\.)/, { invert: true }).allow(""),
			    }),
			    params: null		    
			},
		}
	})


	server.route({
		method: 'PUT',
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
			    	source: Joi.string().pattern(/(\.\.)/, { invert: true }),
			    	target: Joi.string().pattern(/(\.\.)/, { invert: true }).allow(""),
			    }),
			    params: null		    
			},
		}
	})
	

}