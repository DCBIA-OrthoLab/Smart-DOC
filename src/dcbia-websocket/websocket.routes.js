
module.exports = function(server, io, conf){

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
}
	