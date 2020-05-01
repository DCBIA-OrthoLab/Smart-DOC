
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
					target_path: Joi.string().required()
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
					target_path: Joi.string().required()
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
		path: '/dcbia/createfolder/{newfolder}',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
	        handler: handlers.createFolder,
	        validate: {
	        	query: false,
	        	params: Joi.object({
	        		newfolder: Joi.string().required()
	        	}),
	        	payload: false
	        },
	    description: 'create a folder at the path in the user personnal space'
	    }
	})

	server.route({
		method: 'GET',
		path: '/dcbia/download/{file}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.downloadFiles,
			validate: {
				query: false,
				payload: false,
				params: Joi.object({
					file: Joi.string()
				})
				
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
			    	source: Joi.string(),
			    	target: Joi.string(),
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
		    		source: Joi.string(),
		    		newname: Joi.string()
		    	})
		    },
	        description: 'rename a file or folder'
	    }
	});

	// moveFiles parameters :
	// source
	// target

	// rename parameters :



}