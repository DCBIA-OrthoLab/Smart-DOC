# DSCI Server

1. Install couchdb by following instructions [here](https://couchdb.apache.org/)
2. Go to current folder (dcbia-server)
3. Run the install command
```
npm install
```
4. Edit the configuration file conf.default.json
    1. Rename to conf.test.json
    2. Remove the 'tls' section if not using a certificate (only useful for deployment and running a https server)
    3. Edit the section hapi-jwt-couch
        1. Set a random text/key in the field 'privateKey'
        2. Make sure to set the configuration for the 'userdb' to point to the correct couchdb configuration
        3. Edit the section couch-provider with the configuration for the database 
        4. Edit the path for the "dcbia-filebrowser" this location will store user files uploaded to dsci. 
6. Start the server (production/test)

```
NODE_ENV=test node index.js
```

NOTE: The install command should deploy the views to couchdb. 

