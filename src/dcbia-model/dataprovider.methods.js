var request = require('request');
var _ = require('underscore');
var Promise = require('bluebird');
var Stream = require('stream');
var Boom = require('boom');

module.exports = function (server, conf) {
	require('couch-provider')(server, conf, 'dcbia');
}
