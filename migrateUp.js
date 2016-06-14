var couchUpdateViews = require('couch-update-views');

couchUpdateViews.migrateUp('http://localhost:5984/clusterjobs', './node_modules/clusterpost-server/views');
couchUpdateViews.migrateUp('http://localhost:5984/clusterjobs', './src/dcbia-model/views');
