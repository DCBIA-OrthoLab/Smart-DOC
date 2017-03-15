exports.register = function (server, conf, next) {
	
	const SocketIO = require('socket.io');
    var server_socket = server.select(conf.connection_label);
    const io = SocketIO.listen(server_socket.listener);

    require('./websocket.routes')(server, io, conf);

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};