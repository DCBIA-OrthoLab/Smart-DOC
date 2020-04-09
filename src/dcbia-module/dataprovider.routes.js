
module.exports = function (server, conf) {
	
	var handlers = require('./dataprovider.handlers')(server, conf);
	var Joi = require('@hapi/joi');	
	

	server.route({
	    method: 'POST',
	    path: '/dcbia/data',
	    config: {
		    payload: {
				maxBytes: 20971520000,
				output: 'stream',
				parse: true
		    },	        
	        handler: handlers.uploadFile,
	        description: 'upload a zipfile on server'
	    }
	});

	// server.route({
	// 	method: 'GET',
	// 	path: '/dcbia/{folder*}',
	// 	config: {
	// 		handler: handlers.getFiles,
	// 		description: 'get files'
	// 	}
	// });

	server.route({
		method: 'GET',
		path: '/dcbia/map/{username*}',
		config: {
			handler: handlers.getMap
		}
	})

	server.route({
		method: 'DELETE',
		path: '/dcbia/{body*}',
		config: {
			handler: handlers.delFile,
			description: "delete file"
		}
	})

	server.route({
		method: 'GET',
		path: '/dcbia/search/{data*}',
		config: {
			handler: handlers.searchFiles
		}
	})

	server.route({
		method: 'POST',
		path: '/dcbia/createfolder',
	    config: {
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
			handler: handlers.downloadFiles
		}
	})

	server.route({
		method: 'POST',
		path: '/dcbia/shareFiles',
		config: {
			payload: {
				maxBytes: 2097152, 
				output: 'data',
				parse: true
			},
			handler: handlers.shareFiles,
		}
	})

	server.route({
		method: 'POST',
		path: '/dcbia/moveFiles',
		config: {
			payload: {
				maxBytes: 2097152, 
				output: 'data',
				parse: true
			},
			handler: handlers.moveFiles,
		}
	})


}