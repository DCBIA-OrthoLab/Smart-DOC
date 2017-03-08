exports.register = function (server, options, next) {
    require('websocket');
    
    // Port where we'll run the websocket server
    var webSocketsServerPort = 1337;

    // websocket and http servers
    // var webSocketServer = server;
    // var http = require('http');

    /*
    * Global variables
    */
    var history = [];
    var clients = [];

    /**
     * Helper function for escaping input strings
     */
    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    const srv = server.connection({
        port: webSocketsServerPort,
        host: 'localhost',
        labels: 'socket'
    });

    srv.route({
        path: '/',
        method: 'GET',
        handler: function (request, reply) {
            console.log(request)
            console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
            // var connection = request.accept(null, "test");
            // var index = clients.push(connection) - 1;
            // console.log((new Date()) + ' Connection accepted.');

            // user sent some messages
            // connection.on('message', function(message) {
    //         if (message.type === 'utf8') { // accept only text
    //             if (userName === false) { // first message sent by user is their name
    //                 // remember user name
    //                 userName = htmlEntities(message.utf8Data);
    //                 // get random color and send it back to the user
    //                 userColor = colors.shift();
    //                 connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
    //                 console.log((new Date()) + ' User is known as: ' + userName
    //                             + ' with ' + userColor + ' color.');

    //             } else { // log and broadcast the message
    //                 console.log((new Date()) + ' Received Message from '
    //                             + userName + ': ' + message.utf8Data);

    //                 // we want to keep history of all sent messages
    //                 var obj = {
    //                     time: (new Date()).getTime(),
    //                     text: htmlEntities(message.utf8Data),
    //                     author: userName,
    //                     color: userColor
    //                 };
    //                 history.push(obj);
    //                 history = history.slice(-100);

    //                 // broadcast message to all connected clients
    //                 var json = JSON.stringify({ type:'message', data: obj });
    //                 for (var i=0; i < clients.length; i++) {
    //                     clients[i].sendUTF(json);
    //                 }
    //             }
    //         }
    //     });

    //     // user disconnected
    //     connection.on('close', function(connection) {
    //         if (userName !== false && userColor !== false) {
    //             console.log((new Date()) + " Peer "
    //                 + connection.remoteAddress + " disconnected.");
    //             // remove user from the list of connected clients
    //             clients.splice(index, 1);
    //             // push back user's color to be reused by another user
    //             colors.push(userColor);
    //         }
    //     });

    // });
            return reply('hello');
        }
    });

    console.log((new Date()) + " WebSocket is listening on port " + webSocketsServerPort);
    

    return next();
};

exports.register.attributes = {
    pkg: require('./package.json'),
    connections: false
};