
module.exports = function (server, io, conf) {
	var handler = {};
	var crontab = require('node-crontab');
	var _ = require('underscore');

	handler.hello = function(socket){
		socket.emit('connected', {msg:"hola"});
	}

	handler.executeTasks = function () {
		//TODO select tasks in queue from server
		//Select a socket (slicer app)
		//send task id
		var tasks = ["id1", "id2"];

		_.each(io.sockets.connected, function(socket){
			socket.emit("execute_task", "id1")
		})
		
	};

	server.method({
	    name: 'dcbia.executeTasks',
	    method: handler.executeTasks,
	    options: {}
	});

	crontab.scheduleJob("1 * * * * *", function(){
		server.methods.dcbia.executeTasks();
	});

	return handler;
}