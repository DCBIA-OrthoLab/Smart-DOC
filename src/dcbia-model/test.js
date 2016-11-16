var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');

const Joi = require('joi');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');


var agentOptions = {};
var token = {}

var getServer = function(){
    return "http://localhost:8180"
}

var joiokres = Joi.object().keys({
                ok: Joi.boolean().valid(true),
                id: Joi.string(),
                rev: Joi.string()
            });

var userLogin = function(user){
    return new Promise(function(resolve, reject){
        var options = {
            url: getServer() + "/auth/login",
            method: 'POST',
            json: user,
            agentOptions: agentOptions
        }

        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

var deleteUser = function(token){
    return new Promise(function(resolve, reject){
        var options = {
            url: getServer() + "/clusterauth/user",
            method: 'DELETE',
            agentOptions: agentOptions,
            headers: { authorization: token }
        }

        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

var createClinicalData = function (token,data){
    return new Promise(function(resolve,reject){
        var options = {
            url: getServer() + "/dcbia/clinical/data",
            method: 'POST',
            json: data,
            headers: { "Authorization": "Bearer " + token }
      }
        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

var deleteClinicalData = function (token,id){
    return new Promise(function(resolve,reject){
        var options = {
            url: getServer() + "/dcbia/clinical/data/" + id,
            method: 'DELETE',
            headers: { "Authorization": "Bearer " + token }
      }
        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

var getClinicalDataWithId = function (token,id){
    return new Promise(function(resolve,reject){
        var options = {
            url: getServer() + "/dcbia/clinical/data/" + id,
            method: 'GET',
            headers: { "Authorization": "Bearer " + token }
      }
        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

var getClinicalDataOwners = function(token){
    return new Promise(function(resolve,reject){
        var options = {
            url: getServer() + "/dcbia/clinical/data/owner",
            method: 'GET',
            headers: { "Authorization": "Bearer " + token }
      }

        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

var getClinicalDataOwner = function(token,email){
    return new Promise(function(resolve,reject){
        var options = {
            url: getServer() + '/dcbia/clinical/data/owner?email=' + email,
            method: 'GET',
            headers: { "Authorization": "Bearer " + token }
      }

        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}
var getClinicalData = function(token,collectionId){
    return new Promise(function(resolve,reject){
        var options = {
            url: getServer() + '/dcbia/clinical/collection/data/' + collectionId,
            method: 'GET',
            headers: { "Authorization": "Bearer " + token }
      }

        request(options, function(err, res, body){
            if(err){
                reject(err);
            }else{
                resolve(body);
            }
        });
    });
}

lab.experiment("Test clusterpost auth jwt", function(){

    var user = {
        email: "clement.mirabel@gmail.com",
        password: "Password1234"
    }

    var clinicaldatapost = {
        "patientId": "Patient1",
        "type": "clinicalData",
        "formId": "TMJSurvey",
        "scope": ["dentist"],
        "date": "2016-12-17",
        "owner": "emailaddress@dentist.com"
    }

    var wrongScopeClinicalDatapost = {
        "patientId": "Patient1",
        "type": "clinicalData",
        "formId": "TMJSurvey",
        "scope": ["wrongScope"],
        "date": "2016-12-17",
        "owner": "emailaddress@dentist.com"
    }

    var id = "";
    var idWrongScope = "";

    lab.test('returns true when new user is login.', function(){

        return userLogin(user)
        .then(function(res){
            Joi.assert(res.token, Joi.string().required());
            token = res.token;
        });
        
    });

    lab.test('returns true if the document is posted.', function(){
        return createClinicalData(token,clinicaldatapost)
        .then(function(res){
            id = res["id"];
            Code.expect(id != "").to.be.true();
        });
        
    });

    lab.test('returns true when return the surveys owners.', function(){
        return getClinicalDataOwners(token)
        .then(function(res){
            Code.expect(JSON.parse(res).length > 0).to.be.true();
        });
        
    });

    lab.test('returns true when return the right owner.', function(){
        return getClinicalDataOwner(token,"emailaddress@dentist.com")
        .then(function(res){
            Code.expect(JSON.parse(res)[0]["_id"] === id).to.be.true();
        });
        
    });

    lab.test('returns true when the user scope fits the document scope.', function(){
        return getClinicalDataWithId(token,id)
        .then(function(res){
            Code.expect(JSON.parse(res).hasOwnProperty('error')).to.be.false();
        });
        
    });

    lab.test('returns true when the user scope does not fit the document scope.', function(){
        createClinicalData(token,wrongScopeClinicalDatapost)
        .then(function(res){
            idWrongScope = res["id"];
        });
        return getClinicalDataWithId(token,idWrongScope)
        .then(function(res){
            Code.expect(JSON.parse(res).hasOwnProperty('error')).to.be.true();
        });
        
    });

    lab.test('returns true if the document is deleted.', function(){
        return deleteClinicalData(token,id)
        .then(function(res){
            Code.expect(JSON.parse(res)["ok"]).to.be.true();
        });
        
    });

    lab.test('returns true if the document is deleted.', function(){
        return deleteClinicalData(token,idWrongScope)
        .then(function(res){
            Code.expect(JSON.parse(res)["ok"]).to.be.true();
        }); 
    });
    


    // lab.test('returns true if same user fails to be created.', function(){

        
    //     return createUser(user)
    //     .then(function(res){
    //         Joi.assert(res.token, Joi.object().keys({ 
    //             statusCode: Joi.number().valid(409),
    //             error: Joi.string(),
    //             message: Joi.string()
    //         }));
    //     });
    // });

    // var token = "";

    // lab.test('returns true when user is login.', function(){

    //     var user = {
    //         email: "algiedi85@gmail.com",
    //         password: "Some808Password!"
    //     }

    //     return userLogin(user)
    //     .then(function(res){
    //         Joi.assert(res.token, Joi.string().required())
    //         token = "Bearer " + res.token;
    //     });
        
    // });

    // lab.test('returns true when unauthorized user access api.', function(){

    //     return deleteUser()
    //     .then(function(res){
    //         Joi.assert(res, Joi.object().keys({ 
    //             statusCode: Joi.number().valid(401),
    //             error: Joi.string(),
    //             message: Joi.string()
    //         }));
    //     });
        
    // });

    // lab.test('returns true when valid user deletes itself.', function(){

    //     return deleteUser(token)
    //     .then(function(res){
    //         Joi.assert(res, Joi.object().keys({ 
    //             ok: Joi.boolean(),
    //             id: Joi.string(),
    //             rev: Joi.string()
    //         }));
    //     });
        
    // });

});