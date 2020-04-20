
exports.plugin = {};
exports.plugin.register = async function (server, conf) {
  
  require('./dataprovider.routes')(server, conf);
  
};

exports.plugin.pkg = require('./package.json');
