var couchUpdateViews = require('couch-update-views');

couchUpdateViews.migrateUp('http://localhost:5984/shinytooth', './src/dcbia-model/views');
