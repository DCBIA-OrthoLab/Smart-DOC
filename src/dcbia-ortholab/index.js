exports.register = function (server, options, next) {
	server.path(__dirname);
	
	server.route({
		path: '/',
		method: '*',
		handler: function (request, reply) {
			reply.redirect('/DCBIA-OrthoLab/public');
		}
	});
	
	server.route({
		path: '/DCBIA-OrthoLab/public/{path*}',
		method: 'GET',
		config: {
			handler: {
				directory: { path: './DCBIA-OrthoLab', listing: false, index: true }
			},
			description: 'This route serves the static website of ProbtrackBrainConnectivity. Everything inside the plugins/static/public/ directory will be directly accessible under this route.'
		}
	});
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};