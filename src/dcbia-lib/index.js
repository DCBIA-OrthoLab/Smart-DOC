
var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
var _ = require('underscore');
var Joi = require('@hapi/joi');
var qs = require('querystring');
var os = require('os');
var HapiJWTCouch = require('hapi-jwt-couch-lib');
var csvtojson = require('csvtojson');

module.exports = class DCBIALib extends HapiJWTCouch{
    constructor(){
        super()
        this.configfilename = '.dcbia-config.json';
        this.joiconf = Joi.object().keys({
            uri: Joi.string().uri(),
            token: Joi.string()
        });
    }

    getConfigFile() {
      try {
        // Try to load the user's personal configuration file in the current directory
        var conf = require(path.join(process.cwd(), this.configfilename));
        Joi.assert(conf, this.joiconf);
        return conf;
      } catch (e) {
        // Else, read the default configuration file
        return null;
      }
    };

    setConfigFile (config) {
      try {
        // Try to load the user's personal configuration file in the current directory
        fs.writeFileSync(path.join(process.cwd(), this.configfilename), JSON.stringify(config));
      } catch (e) {
        console.error(e);
      }
    };

    start(){
        var self = this;
        var config = self.getConfigFile();
        if(config){
            
            self.setServer(config.uri);
            self.setAgentOptions({
                rejectUnauthorized: false
            });
            if(self.testUserToken(config)){
                self.setUserToken(config);
                return Promise.resolve();
            }else{
                return self.promptUsernamePassword()
                .then(function(user){
                    return self.userLogin(user);
                })
                .then(function(token){
                    _.extend(token, {
                        uri: self.getServer()
                    });
                    self.setConfigFile(token);
                });
            }
        }else{
            return self.promptServer()
            .then(function(server){
                self.setServer(server);
                return self.promptUsernamePassword();
            })
            .then(function(user){
                return self.userLogin(user);
            })
            .then(function(token){
                _.extend(token, {
                    uri: self.getServer()
                });
                self.setConfigFile(token);
            });
        }
    }

    /*
    *   Uploads a file to the database. 
    *   docid is required
    *   filename is required
    *   name is optional. 
    */
    uploadFile(docid, filename, name){
        var self = this;
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
                    url : self.getServer() + "/dcbia/" + docid + "/" + name,
                    method: "PUT",
                    agentOptions: self.agentOptions,
                    headers: { 
                        "Content-Type": "application/octet-stream"
                    },
                    auth: self.auth
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

    uploadFiles(docid, filenames, names){
        var self = this;
        return Promise.map(filenames, function(filename, index){
            if(names !== undefined){
                return self.uploadFile(docid, filename, names[index]);
            }
            return self.uploadFile(docid, filename);
        }, {concurrency: 1})
        .then(function(allupload){
            return allupload;
        });
    }

    getClinicalData(patientId, date){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/clinical/data",
                method: "GET",
                qs: {
                    patientId: patientId, 
                    date: date
                },
                agentOptions: self.agentOptions,
                auth: self.auth
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

    getMorphologicalData(patientId, date){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/morphological/data",
                method: "GET",
                qs: {
                    patientId: patientId, 
                    date: date
                },
                agentOptions: self.agentOptions,
                auth: self.auth
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

    createMorphologicalData(doc){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/morphological/data",
                method: "POST",
                json: doc,
                agentOptions: self.agentOptions,
                auth: self.auth
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

    createClinicalData(doc){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/clinical/data",
                method: "POST",
                json: doc,
                agentOptions: self.agentOptions,
                auth: self.auth
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

    readCSV(filename){
        var self = this;
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

    importMorphologicalData(filename, root){        
        var self = this;

        return self.readCSV(filename)
        .then(function(res){
            return Promise.map(res, function(obj){
                return self.getMorphologicalData(obj.patientId, obj.date)
                .then(function(res){

                    if(res.length == 0 || (res.statusCode && res.statusCode !== 200)){
                        var morphodata = {
                            type: "morphologicalData",
                            patientId: obj.patientId,
                            date: obj.date, 
                            timestamp: new Date()
                        }
                        return self.createMorphologicalData(morphodata);
                    }else if(res.length > 0){
                        return {
                            id: res[0]._id
                        };
                    }else{
                        return Promise.reject(res);
                    }
                })
                .then(function(res){
                    console.log(obj)
                    var fullpath = root? path.join(root, obj.filename) : obj.filename;
                    var importname = obj.rename? obj.rename: path.basename(fullpath);
                    
                    return self.uploadFile(res.id, fullpath, importname);
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


    getDirectoryMap(){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/map",
                method: "GET",
                agentOptions: self.agentOptions,
                auth: self.auth,
                json: true

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

    flattenDirectoryMap(dmap){
        const self = this;
        return _.flatten(_.map(dmap, (dm)=>{
            if(dm.type == 'f'){
                return dm.path;
            }else{
                return self.flattenDirectoryMap(dm.files);
            }
        }));
    }


    shareFiles(infos){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/shareFiles",
                method: "POST",
                agentOptions: self.agentOptions,
                auth: self.auth,
                payload: Joi.object({
                    users: Joi.array(),
                    directory: Joi.string(),
                }),
                json: infos

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

    myShareFiles(target_path){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/mySharedFiles/" + target_path,
                method: "GET",
                agentOptions: self.agentOptions,
                auth: self.auth,
                json: true

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

    unshareFiles(infos){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/unshareFiles",
                method: "POST",
                agentOptions: self.agentOptions,
                auth: self.auth,
                payload: Joi.object({
                    users: Joi.array(),
                    directory: Joi.string(),
                }),
                json: infos

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

    downloadFile(filename){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/download/" + filename,
                method: "GET",
                agentOptions: self.agentOptions,
                auth: self.auth,
                responseType: 'blob'
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

    downloadFileStream(filename){
        var self = this;
        
        var options = {
            url : self.getServer() + "/dcbia/download/" + filename,
            method: "GET",
            agentOptions: self.agentOptions,
            auth: self.auth
        }
        return request(options);
    }
 

    createFolder(newfolder){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/createfolder/" + newfolder,
                method: "POST",
                agentOptions: self.agentOptions,
                auth: self.auth
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

    deleteFile(deletepath){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/delete/" + deletepath,
                method: "DELETE",
                agentOptions: self.agentOptions,
                auth: self.auth,
                json: true
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


    moveFiles(data){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/moveFiles",
                method: "PUT",
                agentOptions: self.agentOptions,
                auth: self.auth,
                json: data
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

    copyFiles(data){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/copyFiles",
                method: "PUT",
                agentOptions: self.agentOptions,
                auth: self.auth,
                json: data
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


    upload(target_path, filename){
        var self = this;
        return new Promise(function(resolve, reject){
            var options = {
                url : self.getServer() + "/dcbia/upload/" + target_path,
                method: "POST",
                agentOptions: self.agentOptions,
                headers: { 
                    "Content-Type": "application/octet-stream"
                },
                auth: self.auth
            }
            var stat = fs.statSync(filename);
            if(stat){
                var stream = fs.createReadStream(filename);
                stream.pipe(
                    request(options, function(err, res, body){
                        if(err){
                            reject(err);
                        }else{
                            resolve(body);
                        }
                    })
                );    
            }else{
                reject(stat);
            }
            
        });    
    }

    getDirectoryFiles(dirname){
        const self = this;
        return _.flatten(_.map(fs.readdirSync(dirname), (filename)=>{
            var fullpath = path.join(dirname, filename);
            if(fs.statSync(fullpath).isDirectory()){
                return self.getDirectoryFiles(fullpath);
            }else{
                return fullpath;
            }
        }));
    }

    uploadDirectory(target_path, dirname){
        var self = this;
        return Promise.map(self.getDirectoryFiles(dirname), (filename)=>{
            return self.upload(path.join(target_path, filename.replace(dirname, '')), filename);
        }, {concurrency: 1})
    }
    
}