var request = require('request');
var _ = require('underscore');
var Promise = require('bluebird');
var Boom = require('@hapi/boom');
var spawn = require('child_process').spawn;
var couchUpdateViews = require('couch-update-views');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var admZip = require('adm-zip');

module.exports = function (server, conf) {
	
	

	var handler = {};
	/*
	*/

	handler.uploadZipFile = async (req, h) => {
		var doc = req.payload.file			
		var uploadPath = req.payload.path

		var filename = doc.hapi.filename

		var zipPath = path.join(uploadPath,filename)

		var out = fs.createWriteStream(zipPath)
		doc.pipe(out)

		doc.on('end',function() {

			var zip = new admZip(zipPath)

		    // false for not overwrite ? 
			zip.extractAllTo(uploadPath,false)
		    
		    fs.unlinkSync(zipPath)

			// MacOs file //
		// 	fs.rmdir(`${uploadPath}`+"/__MACOSX", (err) => {
		// 		if (err) throw err; })
		
		});
		return true;
	}


	handler.deleteFile = async (req, h) => {
		var path = req.payload;

		if(!fs.existsSync(path)) 
        	return false;


		var stats = fs.statSync(path)

		if(stats.isDirectory()){
			// fs.rmdir(path, { recursive: true }, (err) => {
			fs.rmdir(path, (err) => {
				if (err) throw err;
			});
		} else {
			fs.unlink(path, (err) => {
				if (err) throw err;
			})
		}

		return true;
	}


	handler.getDirectoryMap = async (req, h) => {
		const {query, auth} = req;
		var credentials = auth.credentials;
		var user = query.email ? query.email : credentials.email;

	    var getMap = function(directory){
	    	var directoryMap = []
	    	_.each(fs.readdirSync(directory), function(filename){
	    		var fullPath = path.join(directory, filename)

	    		//  delete dead symlinks from shared folders
	    		fs.lstat(fullPath, function(err,stats) {
	    			if (stats.isSymbolicLink()) {
	    				fs.exists(fullPath, function(link) {
	    					if (!link) { 
								fs.unlink(fullPath, (err) => {
									if (err) throw err;
								})

	    						return directoryMap
	    					}
	    				})
	    			}
	    		})

	    		var stats = fs.statSync(fullPath)
	    		if (stats.isDirectory()){
	    			directoryMap.push({type:'d', name:filename, path:fullPath, files:getMap(fullPath)})
	    		} else {
	    			directoryMap.push({type:'f', name:filename, path:fullPath})
	    		}
	    	})
	    	return directoryMap
	    }



	    var personnalPath = path.join(conf.datapath, user)

	    if (!fs.existsSync(personnalPath)) {
			fs.mkdirSync(path.join(personnalPath,'myFiles'), { recursive: true }, (err) => {if (err) throw err})
			fs.mkdirSync(path.join(personnalPath,'sharedFiles'), (err) => {if (err) throw err})
	    } 

		return getMap(path.join(conf.datapath, user));
	}

			 
	


 

	handler.searchFiles = async (req, h) => {

		const {query, auth} = req;
		var user = auth.credentials.email;

		var fileSearched = req.params.data

		var result = []
		var dir = path.join(conf.datapath,user)

		if (fileSearched == ''){return result}

		var searchRecurs = function(fileSearched,directory){
			
			_.each(fs.readdirSync(directory), function(file){	
				var fullPath = path.join(directory,file)
				var stats = fs.statSync(fullPath)
				if(stats.isDirectory()){
					searchRecurs(fileSearched,fullPath)
				}else{
					if (file.toUpperCase().includes(fileSearched.toUpperCase())){
						result.push({ filename: file, path: fullPath})
					}
				}
			})
			return result
		}
		return searchRecurs(fileSearched,dir)
	}



	handler.createFolder = async (req, h) => {
		const {query, auth} = req;
		var currentUser = auth.credentials.email

		var dirname = req.payload.name
		var createpath = req.payload.path
		var dirpath = path.join(createpath,dirname)

		if (path.basename(createpath) == currentUser
			|| dirpath.includes('sharedFiles') 
			|| fs.existsSync(dirpath) 
			|| dirname.match("^[0-9a-zA-Z]+$") == null)
		{
			return false

		} else {
			fs.mkdir(dirpath, (err) => {
				if (err) throw err
			})	
		}
		return true
	}	
		

	handler.downloadFiles = async (req, h) => {
		var files = req.payload

		list = Object.values(files)

		var zip = new admZip()

		list.forEach((element) => {
 			zip.addLocalFile(element);
 		})

		var sendThis = zip.toBuffer();
		
		return sendThis
	}







  handler.shareFiles = async (req, h) => {
  	
  	const {query, auth} = req;
  	// params
  	var filepath = req.payload.directory
  	var users = req.payload.users  	
  	var currentUser = auth.credentials.email

	var relativePath = path.relative(__dirname,filepath)
	sourcePath = path.join(__dirname,relativePath)

	foldername = path.basename(filepath)


	let sharePath, shareName
  	users.forEach((user) => {

  		sharePath = path.join(conf.datapath,user,"sharedFiles",user.concat('-',foldername))
	  	if (!fs.existsSync(sharePath)) {
	  		fs.symlink(sourcePath, sharePath, (err) => {
				if (err) throw err
	 		})
	  	} else { console.log("already shared")}
  	})

  	return true
  }




  handler.moveFiles = async (req, h) => {
  	console.log(req.payload)

  	var files = req.payload.files
  	var dir = req.payload.directory
	let filename
	
  	files.forEach(function(file) {

  		filename = path.basename(file)
  		
  		fs.rename(file,path.join(dir,filename), (err) => {
  			if (err) {throw err} 
  		})
  	})
  	return true
  }



	return handler;
}
