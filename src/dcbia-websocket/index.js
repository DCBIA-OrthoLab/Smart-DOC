exports.register = function (server, conf, next) {

    require('./websocket.routes')(server, conf);

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};