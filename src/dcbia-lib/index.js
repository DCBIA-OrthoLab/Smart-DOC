
var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
var _ = require('underscore');
var Joi = require('joi');
var qs = require('querystring');
var os = require('os');
var hapijwtcouch = require('hapi-jwt-couch-lib');
var csvtojson = require('csvtojson');

var configfilename = '.dcbia-config.json'
var joiconf = Joi.object().keys({
        uri: Joi.string().uri(),
        token: Joi.string()
    });

var dcbia = {};

_.extend(dcbia, hapijwtcouch);

dcbia.getConfigFile = function () {
  try {
    // Try to load the user's personal configuration file in the current directory
    var conf = require(path.join(process.cwd(), configfilename));
    Joi.assert(conf, joiconf);
    return conf;
  } catch (e) {
    // Else, read the default configuration file
    return null;
  }
};

dcbia.setConfigFile = function (config) {
  try {
    // Try to load the user's personal configuration file in the current directory
    fs.writeFileSync(path.join(process.cwd(), configfilename), JSON.stringify(config));
  } catch (e) {
    console.error(e);
  }
};

dcbia.start = function(){
    var config = dcbia.getConfigFile();
    if(config){
        
        dcbia.setServer(config.uri);
        if(dcbia.testUserToken(config)){
            dcbia.setUserToken(config);
            return Promise.resolve();
        }else{
            return dcbia.promptUsernamePassword()
            .then(function(user){
                return dcbia.userLogin(user);
            })
            .then(function(token){
                _.extend(token, {
                    uri: dcbia.getServer()
                });
                dcbia.setConfigFile(token);
            });
        }
    }else{
        return dcbia.promptServer()
        .then(function(server){
            dcbia.setServer(server);
            return dcbia.promptUsernamePassword();
        })
        .then(function(user){
            return dcbia.userLogin(user);
        })
        .then(function(token){
            _.extend(token, {
                uri: dcbia.getServer()
            });
            dcbia.setConfigFile(token);
        });
    }
}

/*
*   Uploads a file to the database. 
*   docid is required
*   filename is required
*   name is optional. 
*/
dcbia.uploadFile = function(docid, filename, name){
    Joi.assert(docid, Joi.string().alphanum())
    Joi.assert(filename, Joi.string())
	return new Promise(function(resolve, reject){

        if(name === undefined){
            name = path.basename(filename);
        }else{
            name = encodeURIComponent(name);
        }

        try{
            var options = {
                url : dcbia.getServer() + "/dcbia/" + docid + "/" + name,
                method: "PUT",
                agentOptions: dcbia.agentOptions,
                headers: { 
                    "Content-Type": "application/octet-stream"
                },
                auth: dcbia.auth
            }

            var fstat = fs.statSync(filename);
            if(fstat){

                var stream = fs.createReadStream(filename);

                stream.pipe(request(options, function(err, res, body){
                        if(err){
                            reject(err);
                        }else{
                            resolve(JSON.parse(body));
                        }
                    })
                );
            }else{
                reject({
                    "error": "File not found: " + filename
                })
            }
        }catch(e){
            reject(e);
        }

	});
}

dcbia.uploadFiles = function(docid, filenames, names){
    return Promise.map(filenames, function(filename, index){
        if(names !== undefined){
            return uploadFile(docid, filename, names[index]);
        }
        return uploadFile(docid, filename);
    }, {concurrency: 1})
    .then(function(allupload){
        return allupload;
    });
}

dcbia.getClinicalData = function(patientId, date){
    return new Promise(function(resolve, reject){
        var options = {
            url : dcbia.getServer() + "/dcbia/clinical/data",
            method: "GET",
            qs: {
                patientId: patientId, 
                date: date
            },
            agentOptions: dcbia.agentOptions,
            auth: dcbia.auth
        }
        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(body));
            }
        })
    })
}

dcbia.getMorphologicalData = function(patientId, date){
    return new Promise(function(resolve, reject){
        var options = {
            url : dcbia.getServer() + "/dcbia/morphological/data",
            method: "GET",
            qs: {
                patientId: patientId, 
                date: date
            },
            agentOptions: dcbia.agentOptions,
            auth: dcbia.auth
        }
        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(body));
            }
        })
    })
}

dcbia.createMorphologicalData = function(doc){
    return new Promise(function(resolve, reject){
        var options = {
            url : dcbia.getServer() + "/dcbia/morphological/data",
            method: "POST",
            json: doc,
            agentOptions: dcbia.agentOptions,
            auth: dcbia.auth
        }

        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        })
    });    
}

dcbia.createClinicalData = function(doc){
    return new Promise(function(resolve, reject){
        var options = {
            url : dcbia.getServer() + "/dcbia/clinical/data",
            method: "POST",
            json: doc,
            agentOptions: dcbia.agentOptions,
            auth: dcbia.auth
        }
        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        })
    });    
}

dcbia.readCSV = function(filename){
    return new Promise(function(resolve, reject){
        var objarr = [];
        csvtojson()
        .fromFile(filename)
        .on('json', function(jsonObj){
            objarr.push(jsonObj);
        })
        .on('end', function(){
            resolve(objarr);
        })
        .on('error', function(err){
            reject(err);
        })
    });
}

dcbia.importMorphologicalData = function(filename, root){        

    return dcbia.readCSV(filename)
    .then(function(res){
        return Promise.map(res, function(obj){
            return dcbia.getMorphologicalData(obj.patientId, obj.date)
            .then(function(res){

                if(res.length == 0 || (res.statusCode && res.statusCode !== 200)){
                    var morphodata = {
                        type: "morphologicalData",
                        patientId: obj.patientId,
                        date: obj.date, 
                        timestamp: new Date()
                    }
                    return dcbia.createMorphologicalData(morphodata);
                }else if(res.length > 0){
                    return {
                        id: res[0]._id
                    };
                }else{
                    return Promise.reject(res);
                }
            })
            .then(function(res){
                
                var fullpath = root? path.join(root, obj.filename) : obj.filename;
                var importname = obj.rename? obj.rename: path.basename(fullpath);
                
                return dcbia.uploadFile(res.id, fullpath, importname);
            });
        }, {
            concurrency: 1
        })
        .catch(function(err){
            console.error(err);
        });
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(err){
        console.error(err);
    });
    
}

_.extend(exports, dcbia);