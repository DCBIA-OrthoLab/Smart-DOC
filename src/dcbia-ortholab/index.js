exports.plugin = {};
exports.plugin.register = function (server, options) {
	server.path(__dirname);
	
	server.route({
		path: '/{path*}',
		method: 'GET',
		config: {
			handler: {
				directory: { path: './DCBIA-OrthoLab', listing: false, index: true }
			},
			description: 'This route serves the static website of ProbtrackBrainConnectivity. Everything inside the plugins/static/public/ directory will be directly accessible under this route.'
		}
	});
};

exports.plugin.pkg= require('./package.json');