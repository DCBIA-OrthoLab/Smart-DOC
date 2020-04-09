
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('@hapi/joi');	
	
	var infos = Joi.object({
        	directory: Joi.string(),
        	files: Joi.array(),
        });

	var shareInfos = Joi.object({
		users: Joi.array(),
		directory: Joi.string(),
	})



	server.route({
	    method: 'POST',
	    path: '/dcbia/data',
	    config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
		    payload: {
				maxBytes: 20971520000,
				output: 'stream',
				parse: true
		    },	        
	        handler: handlers.uploadZipFile,
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
            validate: {
			  	query: Joi.object().keys({
			    	email: Joi.string().email()
			    }).optional(),
			    params: null, 
			    payload: false
			},
			handler: handlers.getDirectoryMap
		}
	})




	server.route({
		method: 'DELETE',
		path: '/dcbia/{file*}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },

			handler: handlers.deleteFile,
			description: "delete file"
		}
	})

	server.route({
		method: 'GET',
		path: '/dcbia/search/{data*}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.searchFiles
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
		    payload: {
				maxBytes: 2097152,
				output: 'data',
				parse: true
		    },	        
	        handler: handlers.createFolder,
		} 
	})

	server.route({
		method: 'GET',
		path: '/dcbia/download/{filesList*}',
		config: {
			auth: {
                strategy: 'token',
                scope: ['dentist']
            },
			handler: handlers.downloadFiles
		}
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
			    payload: shareInfos,
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
			    payload: infos,
			    params: null		    
			},
		}
	})




}