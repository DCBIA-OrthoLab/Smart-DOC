
var clusterpostserver = require('clusterpost-server');

var plugins = [];

var dcbiaModel = {};
dcbiaModel.register = require('dcbia-model');
dcbiaModel.options = {
	"default": "clusterjobs",
	"clusterjobs": {
		"hostname": "http://localhost:5984",
		"database": "clusterjobs"
	}
};


var dcbiaOrtho = {};
dcbiaOrtho.register = require('dcbia-ortholab');
dcbiaOrtho.options = {}

plugins.push(dcbiaModel);
plugins.push(dcbiaOrtho);


clusterpostserver.server.register(plugins, function(err){
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    clusterpostserver.server.start(function () {
	   clusterpostserver.server.log('info', 'Server running at: ' + clusterpostserver.server.info.uri);
	});
    
});