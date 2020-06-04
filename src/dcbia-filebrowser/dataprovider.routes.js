
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('@hapi/joi');	
	

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
		method: 'GET',
		path: '/dcbia/mySharedFiles/{target_path*}',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.mySharedFiles,
			validate: {
				query: false,
			    payload: null,
			    params: Joi.object({
					target_path: Joi.string(),
				})		    
			},
		}
	});

	server.route({
		method: 'POST',
		path: '/dcbia/unshareFiles',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.unshareFiles,
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
			    	target: Joi.string().pattern(/(\.\.)/, { invert: true }),
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
			    	target: Joi.string().pattern(/(\.\.)/, { invert: true }),
			    }),
			    params: null		    
			},
		}
	})

	server.route({
	    method: 'PUT',
	    path: '/dcbia/rename',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.renameFile,
		    validate : {
		    	query: false,
		    	params: null,
		    	payload: Joi.object({
		    		source: Joi.string().pattern(/(\.\.)/, { invert: true }),
		    		newname: Joi.string().pattern(/(\.\.)/, { invert: true })
		    	})
		    },
	        description: 'rename a file or folder'
	    }
	});




	server.route({
		method: 'POST',
		path: '/dcbia/uploadscript',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.uploadscript,
			validate: {
				query: false,
			    payload: Joi.object({
					taskname: Joi.string(),
					desc: Joi.string(),
					pattern: Joi.object(),
				}),
			    params: null		    
			},
		}
	});

	server.route({
		method: 'GET',
		path: '/dcbia/getscript',
		config: {
			auth: {
				strategy: 'token',
				scope: ['dentist']
			},
			handler: handlers.getscript,
			validate: {
				query: false,
			    payload: null,
			    params: null		    
			},
		}
	});


}