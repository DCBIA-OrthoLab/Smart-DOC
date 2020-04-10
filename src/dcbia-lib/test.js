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
            console.log(res)
        });
        
    });

    lab.test('returns true if the document is posted.', function(){
        return dcbia.createClinicalData(clinicaldatapost)
        .then(function(res){
            console.log(res)
            
        });
        
    });

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






/////////////

    // lab.test('returns true when user folder map does not exists', function(){
    //     return dcbia.getDirectoryMap()
    //     .then(function(res){
    //         console.log(res)
    //         // expect(res[0].name == "myFiles").to.be.true()
    //         // expect(1+1).to.be.equal(2)
    //     }); 
    // });
    lab.test('returns true when user folder map is returned', function(){
        return dcbia.getDirectoryMap()
        .then(function(res){
            console.log(res)

            //Check that map is equal to test.zip
            // Code.expect(JSON.parse(res)["ok"]).to.be.true();
        }); 
    });



    lab.test('returns true when user search and find files', function(){
        return dcbia.searchFiles()
        .then(function(res){
            // console.log(res)
            // expect(res[0].name == "myFiles").to.be.true()
            // expect(1+1).to.be.equal(2)
        }); 
    });
    

    // var fileToDelete = 'data/sbrosset@umich.edu/myFiles/scanToDelete.nii'

    // lab.test('returns true when user delete files', function(){
    //     return dcbia.deleteFile(fileToDelete)
    //     .then(function(res){
    //         console.log(res)
    //         // expect(res[0].name == "myFiles").to.be.true()
    //         // expect(1+1).to.be.equal(2)
    //     }); 
    // });


    // var zipfile = 
    // lab.test('returns true when user upload a zipfile', function(){
    //     return dcbia.uploadZipFile()
    //     .then(function(res){
    //         // console.log(res)
    //         // expect(res[0].name == "myFiles").to.be.true()
    //         // expect(1+1).to.be.equal(2)
    //     }); 
    // });



    // var formData = new FormData()
    // formData.append("name", "folderName")
    // formData.append("path", 'data/sbrosset@umich.edu/myFiles')

    // lab.test('returns true when user creates a folder', function(){
    //     return dcbia.createFolder(formData)
    //     .then(function(res){
    //         console.log(res)
    //         // expect(res[0].name == "myFiles").to.be.true()
    //         // expect(1+1).to.be.equal(2)
    //     }); 
    // });









    // var infos = {
    //     directory: '../data/dcbia-server/sbrosset@umich.edu/myFiles/scans_2',
    //     files: [
    //         '../dcbia-server/data/sbrosset@umich.edu/myFiles/scans/scan_1.nii',
    //         '../data/sbrosset@umich.edu/myFiles/scans/scan_2.nii'
    //     ]
    // }

    // lab.test('returns true when user has moved files to the current folder', function(){
    //     return dcbia.moveFiles(infos)
    //     .then(function(res){
    //         console.log(res)
    //         expect(res).to.be.true()
    //     }); 
    // });



// var infos = {
//     users: [
//         'sbrosset@umich.edu'
//     ],
//     directory: '../dcbia-server/data/sbrosset@umich.edu/myFiles/dirToShare'
// }

//     lab.test('returns true when user share a folder with another user', function(){
//         return dcbia.shareFiles(infos)
//         .then(function(res){
//             console.log(res)
//             // expect(res[0].name == "myFiles").to.be.true()
//             // expect(1+1).to.be.equal(2)
//         }); 
//     });


    // lab.test('returns true when user download files ', function(){
    //     return dcbia.downloadFiles()
    //     .then(function(res){
    //         // console.log(res)
    //         // expect(res[0].name == "myFiles").to.be.true()
    //         // expect(1+1).to.be.equal(2)
    //     }); 
    // });




    // lab.test('returns false when user search and don\'t find files', function(){
    //     return dcbia.searchFiles()
    //     .then(function(res){
    //         // console.log(res)
    //         // expect(res[0].name == "myFiles").to.be.true()
    //         // expect(1+1).to.be.equal(2)
    //     }); 
    // });









    // lab.test('returns true when user uploads zip file', function(){

    // lab.test('returns true when admin user gets folder of another user', function(){

    // lab.test('returns true when user creates a directory', function(){

    // lab.test('returns true when user uploads a single file', function(){

    // lab.test('returns true when user downloads a single file', function(){

    // lab.test('returns true when user downloads a folder', function(){

    // lab.test('returns true when user deletes a file', function(){


});