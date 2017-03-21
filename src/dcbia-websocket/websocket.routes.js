
module.exports = function(server, conf){

	const SocketIO = require('socket.io');
	if(conf.connection_label){
		var server_socket = server.select(conf.connection_label);
	}else{
		console.log("Using default connection 'websocket'");
		console.log("If you want to get rid of this message add 'connection_label' to the plug-in configuration:",
			JSON.stringify({
				connection_label: 'somelabel'
			}, null, 4));
		var server_socket = server.select("websocket");
	}
    
    const io = SocketIO.listen(server_socket.listener);

	var handlers = require('./websocket.handlers')(server, io, conf);

	io.sockets.on('connection', (socket) => {

			socket.on('emit_with_callback', function(fn) {
				if(fn){
					fn("Awesome callback")
				}

			});

			socket.on('disconnect', function(){});

			handlers.hello(socket);

			server.methods.dcbia.executeTasks()
	});
	
	server.route({
	    method: '*',
	    path: '/suscribe/{path*}',
	    handler: {
	        proxy: {
				mapUri: function(req, callback){
					var path = req.url.path.replace("/suscribe", server_socket.info.uri);
					callback(null, path);
				},
				rejectUnauthorized: false
	        }
	    },
	    config: {
	    	plugins: {
		        good: {
		            suppressResponseEvent: true
		        }
		    }
	    }
	});
	
}
	