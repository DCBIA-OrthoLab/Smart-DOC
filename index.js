var clusterpostserver = require('clusterpost-server');


var plugins = [];

var plugin = {};
plugin.register = require("dcbia-ortholab");
plugin.options = {};

plugins.push(plugin);

var dcbimodel = {};
dcbimodel.register = require("dcbia-model");
dcbimodel.options = {
	"default" : "clusterjobs",
	"clusterjobs" : {
		"hostname": "http://localhost:5984",
		"database": "clusterjobs"
	}
};

plugins.push(dcbimodel);

clusterpostserver.server.register(plugins, function(err){
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    clusterpostserver.server.start(function () {
	   clusterpostserver.server.log('info', 'Server running at: ' + clusterpostserver.server.info.uri);
	});
    
});
