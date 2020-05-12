var request = require('request');
var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');

const Joi = require('@hapi/joi');
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();

const Code = require('@hapi/code');
const expect = Code.expect;

const _ = require('underscore');

const md5File = require('md5-file')

var DCBIALib = require("./index");


var agentOptions = {};
var token = {}

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
            expect(res).to.be.an.array()
        }); 
    });



    lab.test('returns true when user upload a file', function(){
        
        var filename = 'filetest.txt';
        var target = 'test/filetest.txt';

        if(!fs.existsSync(filename)){
            fs.writeFileSync(filename, "This is some data for the test file");
        }

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


    var newfolder = 'test/foldername'
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


    var fileToDelete = 'test'
    lab.test('returns true when user delete a folder', function(){
        return dcbia.deleteFile(fileToDelete)
        .then(function(res){
            expect(res).to.equal('File deleted!')

        }); 
    });

    lab.test('returns true when a whole directory structure is created', function(){
        
        var directory_root = 3;
        var directory_deep = 3;
        var files_directory = 3;
        var root_dir = 'my_deep_test';

        const create_recursive = (path_current, current_directory_deep)=>{
            fs.mkdirSync(path_current, {recursive: true});

            _.map(_.range(files_directory), ()=>{
                var full_path = path.join(path_current, _.uniqueId("f"))
                fs.writeFileSync(full_path, _.uniqueId("Some text"));
            });

            current_directory_deep--;

            if(current_directory_deep > 0){
                create_recursive(path.join(path_current, _.uniqueId("d d")), current_directory_deep)    
            }
        }

        _.map(_.range(directory_root), (r)=>{
            var path_current = path.join(root_dir, _.uniqueId("d"));
            
            create_recursive(path_current, directory_deep);
        });

    
    });


    lab.test('returns true when user upload a directory', function(){
        
        var dirname = 'my_deep_test';
        var target = 'test/my_deep_test/';

        return dcbia.uploadDirectory(target, dirname)
        .then(function(res){
            expect(res).to.be.an.array().to.include('File uploaded!');
        }); 
    });


    lab.test('returns true when user download a directory one file by one', function(){

        return dcbia.getDirectoryMap()
        .then((dirmap)=>{
            var file_list = _.filter(dcbia.flattenDirectoryMap(dirmap), (fname)=>{
                return fname.match(new RegExp("test/my_deep_test"));
            });
            
            return Promise.map(file_list, (filename)=>{
                return new Promise((resolve, reject)=>{
                    
                    var rstream = dcbia.downloadFileStream(filename);
                    var writer = fs.createWriteStream("temp_file");
                
                    rstream.pipe(writer);

                    writer.on('finish', ()=>{
                        var orig_filename = filename.replace('test/', '');
                        return Promise.all([md5File("temp_file"), md5File(orig_filename)])
                        .spread((temp_hash, orig_hash)=>{
                            expect(temp_hash).to.include(orig_hash);
                            fs.unlinkSync("temp_file");
                            resolve();
                        })
                        
                    });
                });
            }, {concurrency: 1});
        }); 
    });

    lab.test('returns true when user download a whole directory', function(){

        return Promise.resolve(dcbia.downloadFileStream("test/my_deep_test/"))
        .then(function(res){
            return new Promise((resolve, reject)=>{
                var writer = fs.createWriteStream("my_deep_test.zip");
            
                res.pipe(writer);

                writer.on('finish', ()=>{
                    md5File("my_deep_test.zip").then((hash) => {
                      expect(hash).to.be.string();
                      fs.unlinkSync("my_deep_test.zip");
                      resolve();
                    });
                })
            });
        }); 
    });

    lab.test('returns true when user copy a whole directory', function(){
        var copy_obj = {
            source: 'test/my_deep_test',
            target: 'my_deep_test_copy/inner_copy'
        }

        return dcbia.copyFiles(copy_obj)
        .then(function(res){
            expect(res).to.be.true();
        }); 

    });

    lab.test('returns true when user deletes a whole directory', function(){

        return dcbia.deleteFile("my_deep_test_copy")
        .then(function(res){
            expect(res).to.equal('File deleted!')
        }); 

    });

    lab.test('returns true when user copy a file into a non existant directory', function(){
        var copy_obj = {
            source: 'test/my_deep_test/d22/d d29/d d36/f41',
            target: 'my_deep_test_copy_single_file/'
        }

        return dcbia.copyFiles(copy_obj)
        .then(function(res){
            expect(res).to.be.an.object().to.include({statusCode: 400});
        }); 

    });

    lab.test('returns true when user copy a file', function(){
        var copy_obj = {
            source: 'test/my_deep_test/d22/d d29/d d36/f41',
            target: 'my_deep_test_copy_single_file_f41'
        }

        return dcbia.copyFiles(copy_obj)
        .then(function(res){
            expect(res).to.be.true();
        }); 

    });

    lab.test('returns true when user copy a file into existing directory', function(){
        var copy_obj = {
            source: 'test/my_deep_test/d22/d d29/d d36/f41',
            target: 'test/my_deep_test/'
        }

        return dcbia.copyFiles(copy_obj)
        .then(function(res){
            expect(res).to.be.true();
        }); 

    });

    lab.test('returns true when user copy a file relative path', function(){
        var copy_obj = {
            source: 'test/my_deep_test/d22/d d29/d d36/f41',
            target: '../my_deep_test_copy_single_file_f41'
        }

        return dcbia.copyFiles(copy_obj)
        .then(function(res){
            expect(res).to.be.an.object().to.include({statusCode: 400});
        }); 

    });

    lab.test('returns true when user deletes a file with relative path', function(){

        return dcbia.deleteFile("../my_deep_test_copy_single_file_f41")
        .then(function(res){
            expect(res).to.be.an.object().to.include({statusCode: 404});
        }); 

    });

    lab.test('returns true when user deletes a file', function(){
        return dcbia.deleteFile("my_deep_test_copy_single_file_f41")
        .then(function(res){
            expect(res).to.equal('File deleted!')
        }); 
    });

    lab.test('returns true when user moves a file to another directory', function(){
        var infos = {
            source: 'test/my_deep_test/d22/d d29/d d36/f41',
            target: 'test/'
        }

        return dcbia.moveFiles(infos)
        .then(function(res){
            expect(res).to.be.true();
        }); 
    });

    lab.test('returns true when user moves a whole directory to another directory', function(){
        var infos = {
            source: 'test/my_deep_test',
            target: 'test_next/'
        }

        return dcbia.createFolder("test_next")
        .then(()=>{
            return dcbia.moveFiles(infos)
            .then(function(res){
                expect(res).to.be.true();
            });     
        })
        
    });

    lab.test('returns true when user moves a whole directory with relative path', function(){
        var infos = {
            source: 'test/my_deep_test',
            target: 'test_next/../'
        }

        return dcbia.createFolder("test_next")
        .then(()=>{
            return dcbia.moveFiles(infos)
            .then(function(res){
                expect(res).to.be.an.object().to.include({statusCode: 400});
            });     
        })
        
    });
   
    lab.test('returns false when user share a folder with a user', function(){
        var infos = {
            users: ['juanprietob@gmail.com'],
            directory: "test_next"
        }
        return dcbia.shareFiles(infos)
        .then(function(res){
            expect(res).to.part.include({ ok: true });
        });
    });

    lab.test('returns true when user gets the shared doc', function(){
        return dcbia.myShareFiles("test_next")
        .then(function(res){
            expect(res).to.satisfy((r)=>{
                return r.type == "shared" && expect(r.users).to.include("juanprietob@gmail.com");
            });
        });
    });

    lab.test('returns false when user unshare folder with a user', function(){
        var infos = {
            users: ['juanprietob@gmail.com'],
            directory: "test_next"
        }
        return dcbia.unshareFiles(infos)
        .then(function(res){
            expect(res).to.part.include({ ok: true });
        });
    });

    lab.test('returns true when user gets the shared doc and user is not there', function(){
        return dcbia.myShareFiles("test_next")
        .then(function(res){
            expect(res).to.satisfy((r)=>{
                return r.type == "shared" && expect(r.users).to.not.include("juanprietob@gmail.com");
            });
        });
    });

    lab.test('returns true when user share a folder with self', function(){
        var infos = {
            users: ['sbrosset@umich.edu'],
            directory: "test_next"
        }
        return dcbia.shareFiles(infos)
        .then(function(res){
            expect(res).to.part.include({ ok: true });
        });
    });


    lab.test('returns false when user downloads shared Folder', function(){
        return Promise.resolve(dcbia.downloadFileStream("sharedFiles/test_next"))
        .then(function(res){
            return new Promise((resolve, reject)=>{
                var writer = fs.createWriteStream("my_shared_deep_test.zip");
            
                res.pipe(writer);

                writer.on('finish', ()=>{
                    md5File("my_shared_deep_test.zip").then((hash) => {
                      expect(hash).to.be.string();
                      fs.unlinkSync("my_shared_deep_test.zip");
                      resolve();
                    });
                })
            });
        }); 
    });

    lab.test('returns true when user deletes deep_test', function(){

        return dcbia.deleteFile("test_next")
        .then(function(res){
            expect(res).to.equal('File deleted!')
        }); 

    });


});