exports.register = function (server, conf, next) {
	
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

    require('./websocket.routes')(server, io, conf);

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};