var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');

const Joi = require('@hapi/joi');
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();

const Code = require('@hapi/code');
const expect = Code.expect;

var DCBIALib = require("./index");


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


var dcbia = new DCBIALib();

dcbia.setAgentOptions({
    rejectUnauthorized: false
})
dcbia.setServer("http://localhost:8180")


lab.experiment("Test dcbia lib", function(){

    var user = {
        email: "sbrosset@umich.edu",
        password: "Sbrosset0"
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
        return dcbia.userLogin(user)
        .then(function(res){
            Joi.assert(res.token, Joi.string().required());
            // console.log(res)
        });
        
    });

    // lab.test('returns true if the document is posted.', function(){
    //     return dcbia.createClinicalData(clinicaldatapost)
    //     .then(function(res){
    //         console.log(res)
            
    //     });
        
    // });

    // lab.test('returns true when return the surveys owners.', function(){
    //     return dcbia.getClinicalDataOwners()
    //     .then(function(res){
    //         Code.expect(JSON.parse(res).length > 0).to.be.true();
    //     });
        
    // });

    // lab.test('returns true when return the right owner.', function(){
    //     return dcbia.getClinicalDataOwner("emailaddress@dentist.com")
    //     .then(function(res){
    //         Code.expect(JSON.parse(res)[0]["_id"] === id).to.be.true();
    //     });
        
    // });

    // lab.test('returns true when the user scope fits the document scope.', function(){
    //     return dcbia.getClinicalDataWithId(token,id)
    //     .then(function(res){
    //         Code.expect(JSON.parse(res).hasOwnProperty('error')).to.be.false();
    //     });
        
    // });

    // lab.test('returns true when the user scope does not fit the document scope.', function(){
    //     return dcbia.createClinicalData(token,wrongScopeClinicalDatapost)
    //     .then(function(res){
    //         idWrongScope = res["id"];
    //     });
    //     return getClinicalDataWithId(token,idWrongScope)
    //     .then(function(res){
    //         Code.expect(JSON.parse(res).hasOwnProperty('error')).to.be.true();
    //     });
        
    // });

    // lab.test('returns true if the document is deleted.', function(){
    //     return dcbia.deleteClinicalData(token,id)
    //     .then(function(res){
    //         Code.expect(JSON.parse(res)["ok"]).to.be.true();
    //     });
        
    // });

    // lab.test('returns true if the document is deleted.', function(){
    //     return dcbia.deleteClinicalData(token,idWrongScope)
    //     .then(function(res){
    //         Code.expect(JSON.parse(res)["ok"]).to.be.true();
    //     }); 
    // });


/////////////////////////////////////////////////

    lab.test('returns true when user folder map exist', function(){
        return dcbia.getDirectoryMap()
        .then(function(res){
            res = JSON.parse(res)[0]
            console.log(res)
            expect(res).to.be.an.object()
        }); 
    });



    lab.test('returns true when user upload a file', function(){
        
        var filename = 'filetest.txt';
        var target = 'test/filetest.txt';

        return dcbia.upload(target, filename)
        .then(function(res){
            expect(res).to.equal('File uploaded!')
        }); 
    });

    lab.test('returns true when user upload a file that does not exist', function(){
        
        var filename = 'filetest_does_not_exists.txt';
        var target = 'test/filetest_does_not_exists.txt';

        return dcbia.upload(target, filename)
        .catch(function(err){
            expect(err).to.be.an.error(Error)
        }); 
    });



    var newfolder = 'test%2Ffoldername'
    lab.test('returns true when user creates a new folder', function(){
        return dcbia.createFolder(newfolder)
        .then(function(res){
            expect(res).to.equal('true');
        }); 
    });

    lab.test('returns false when user try to create an existing folder', function(){
        return dcbia.createFolder(newfolder)
        .then(function(res){
            expect(res).to.equal('false');
        }); 
    });



    var data = 'test'
    lab.test('returns true when user search and find files', function(){
        return dcbia.searchFiles(data)
        .then(function(res){
            expect(res).to.include({filename: 'filetest.txt', path: 'data/sbrosset@umich.edu/test/filetest.txt', isDir: false})
        }); 
    });    
    var falsedata = 'fileNotExist'
    lab.test('returns false when user search a file which doesnt exist', function(){
        return dcbia.searchFiles(falsedata)
        .then(function(res){
            expect(res[0]).to.be.undefined()    
        }); 
    }); 



    var fileToDelete = 'test/foldername'
    lab.test('returns true when user delete a folder', function(){
        return dcbia.deleteFile(fileToDelete)
        .then(function(res){
            expect(res).to.equal('File deleted!')

        }); 
    });
    


    var infos = {
        users: [
            'sbrosset@umich.edu'
        ],
        directory: "./test/testfile.txt"
    }
    lab.test('returns true when user share a folder with another user', function(){
        return dcbia.shareFiles(infos)
        .then(function(res){
            expect(res).to.be.true()
        })
    });
    // var infos = {
    //     users: [
    //         'fakeuser@umich.edu'
    //     ],
    //     directory: "./test/testfile.txt"
    // }
    // lab.test('returns false when user share a folder with an non existing user', function(){
    //     return dcbia.shareFiles(infos)
    //     .then(function(res){
    //         console.log(res)
    //     })
    // });



    // var files = ["filetest.txt"]
    // lab.test('returns true when user download a file', function(){
    //     return dcbia.downloadFiles(files)
    //     .then(function(res){
    //         console.log(res)
    //     }); 
    // });




    
    // lab.test('returns true when user has moved files to the current folder', function(){
    //     var infos = {
    //         source: 'filetest.txt',
    //         target: 'folderTest'
    //     }

    //     return dcbia.moveFiles(infos)
    //     .then(function(res){
    //         console.log(res)
    //     }); 
    // });





















    





});