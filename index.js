var Hapi = require('hapi');
var fs = require('fs');
var good = require('good');
var path = require('path');

var env = process.env.NODE_ENV;

if(!env) throw "Please set NODE_ENV variable.";


const getConfigFile = function () {
  try {
    // Try to load the user's personal configuration file
    return require(process.cwd() + '/conf.my.' + env + '.json');
  } catch (e) {
    // Else, read the default configuration file
    return require(process.cwd() + '/conf.' + env + '.json');
  }
}

const startServer = function(cluster){

    var conf = getConfigFile();
    
    var server = new Hapi.Server();

    if(conf.connections){
        Object.keys(conf.connections).forEach(function(connection_label){
            var connection = conf.connections[connection_label];
            if(connection.tls){
                const tls = {
                    key: fs.readFileSync(connection.tls.key),
                    cert: fs.readFileSync(connection.tls.cert)
                }
            }
            
            server.connection({ 
                host: connection.host,
                port: connection.port,
                labels: [connection_label],
                tls: tls
            });
        });

    }else{
        console.log("Please modify your configuration file by adding a connections section. (tls is optional to enable a secure connection)", JSON.stringify({
            "connections": {
                "http": {
                    "host": conf.host,
                    "port": conf.port,
                    "tls": {
                        "key": "/path/to/key",
                        "cert": "/path/to/key"
                    }
                },
                "websocket": {
                    "host": conf.host,
                    "port": conf.port + 1
                }
            },
            "plugins": "..."
        }, null, 4));

        if(conf.tls && conf.tls.key && conf.tls.cert){
            const tls = {
              key: fs.readFileSync(conf.tls.key),
              cert: fs.readFileSync(conf.tls.cert)
            };
        }

        server.connection({ 
            host: conf.host,
            port: conf.port,
            tls: tls
        });
    }

    var plugins = [];

    Object.keys(conf.plugins).forEach(function(pluginName){
        var plugin = {};
        plugin.register = require(pluginName);
        plugin.options = conf.plugins[pluginName];
        plugins.push(plugin);
    });

    plugins.push({
        register: good,
        options: {
            reporters: {
                myConsoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*' }]
                },
                {
                    module: 'dcbia-good',
                    name: 'Filter',
                    args: [{ log: '*', response: '*' }]
                },
                {
                    module: 'good-console'
                }, 'stdout'],
                myFileReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ ops: '*' }]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson'
                }, {
                    module: 'good-file',
                    args: ['all.log']
                }]
            }
        }
    });

    
    server.method({
        name: 'getCluster',
        method: function(){
            return cluster;
        },
        options: {}
    });
    

    server.register(plugins, function(err){
        if (err) {
            throw err; // something bad happened loading the plugin
        }

    });

    server.start(function () {
        server.connections.forEach(function(connection){
            server.log('info', 'server is listening port: ' + connection.info.uri + " label: " + connection.settings.labels);
        });
    });


}

if(env === 'production'){
    const cluster = require('cluster');
    const numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
      // Fork workers.
      for (var i = 0; i < 1; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log("worker ", worker.process.pid,"died");
      });
      
    } else {
        startServer(cluster);
    }
}else{

    startServer();
}
