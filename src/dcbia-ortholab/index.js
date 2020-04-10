exports.plugin = {};
exports.plugin.register = function (server, options) {
	server.path(__dirname);
	
	server.route({
		path: '/{path*}',
		method: 'GET',
		config: {
			handler: {
				directory: { path: './node_modules/dcbia-react-main/build', listing: false, index: true }
			},
			description: 'This route serves the static website of DCBIA.'
		}
	});
};

exports.plugin.pkg= require('./package.json');