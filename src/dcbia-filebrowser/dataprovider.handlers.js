
const _ = require('underscore');
const Promise = require('bluebird');
const Boom = require('@hapi/boom');
const spawn = require('child_process').spawn;
const path = require('path');
const qs = require('querystring');
const fs = require('fs');
const admZip = require('adm-zip');

module.exports = function (server, conf) {
	
	
	const deleteRecursive = (filepath)=>{
		try{
			if(fs.statSync(filepath).isDirectory()){
				fs.readdirSync(filepath).forEach(function(file) {
					var currentpath = path.join(filepath, file);
					deleteRecursive(currentpath);
				});
				fs.rmdirSync(filepath);
			}else{
				fs.unlinkSync(filepath);
			}
		    return true;	
		}catch(e){
			console.error(e);
			return false;
		}
		
	}

	var handler = {};
	/*
	*/

	handler.uploadFile = async (req, h) => {
		const {auth, params, payload} = req;
		const {credentials} = auth;
		const {target_path} = params;

		return new Promise((resolve, reject)=>{
			
			var filename = path.join(conf.datapath, credentials.email, target_path);
			var dirname = path.dirname(filename);

			if(!fs.existsSync(path)){
				fs.mkdirSync(dirname, { recursive: true }, (err) => {if (err) reject(err)});
			}

			payload.pipe(fs.createWriteStream(filename))

			payload.on('end',function() {
				resolve("File uploaded!");
			});
		});
	}


	handler.deleteFile = async (req, h) => {
		const {auth, params, payload} = req;
		const {credentials} = auth;
		const {target_path} = params;

		return new Promise((resolve, reject)=>{
			var filename = path.join(conf.datapath, credentials.email, target_path);
			if(deleteRecursive(filename)){
				resolve("File deleted!");
			}else{
				reject("Cannot delete:", target_path);
			}
		});
	}


	handler.getDirectoryMap = async (req, h) => {
		const {query, auth} = req;
		var credentials = auth.credentials;
		var user = query.email ? query.email : credentials.email;

	    var getMap = function(directory, root_folder){
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
	    			directoryMap.push({type:'d', name: filename, path: path.relative(root_folder, fullPath), files: getMap(fullPath, root_folder)})
	    		} else {
	    			directoryMap.push({type:'f', name: filename, path: path.relative(root_folder, fullPath)})
	    		}
	    	})
	    	return directoryMap
	    }

	    var personnalPath = path.join(conf.datapath, user)

	    if (!fs.existsSync(personnalPath)) {
			fs.mkdirSync(path.join(personnalPath,'myFiles'), { recursive: true }, (err) => {if (err) throw err})
			fs.mkdirSync(path.join(personnalPath,'sharedFiles'), (err) => {if (err) throw err})
	    }
	    
		return getMap(personnalPath, personnalPath);
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
