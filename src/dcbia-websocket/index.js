exports.register = function (server, options, next) {
    var Nes = require('nes');
    const srv = server.connection({port:80,host:'localhost',labels:'wesocket'});
    console.log("Websocket is listening on port 80.")
    srv.register(Nes, function (err) {
        srv.route({
            method: 'GET',
            path: '/h',
            config: {
                id: 'hello',
                handler: function (request, reply) {
                    return reply('world!');
                }
            }
        });
    });

    return next();
};

exports.register.attributes = {
    pkg: require('./package.json'),
    connections: false
};