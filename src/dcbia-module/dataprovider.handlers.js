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





	    // create get fct to read and display files on react side?

	handler.uploadFile = async (req, h) => {
		var doc = req.payload.zipFile			
		var uploadPath = req.payload.path

		var filename = doc.hapi.filename
		var name = filename.split(".");	name = name[0]
		var path = uploadPath+"/"+filename


		var out = fs.createWriteStream(path)
		doc.pipe(out)

		doc.on('end',function() {

			var zip = new admZip(path)


    // var zipEntries = zip.getEntries(); // an array of ZipEntry records

		 	// console.log("-----UPLOAD HERE-------")
		  //   zipEntries.forEach(function(zipEntry) {
		  //       console.log(zipEntry['name']); 
		  //       console.log(zipEntry.toString())


		  //       zip.extractEntryTo(/*entry name*/zipEntry, /*target path*/"./data/sbrosset", /*maintainEntryPath*/false, /*overwrite*/true);

		  //   });


		    // false for not overwrite ? TO DO this case
			zip.extractAllTo(uploadPath,false)
		    
		    fs.unlinkSync(path)

			// MacOs file //
			fs.rmdir(`${uploadPath}`+"/__MACOSX", (err) => {
				if (err) throw err; })
		});

		return true;
	}




	// handler.getFiles = async (req, h) => {
	// 	var dirname = req.params.folder
	// 	// if (req.payload.folder == null) {
	// 	// 	folder = "./upload/"
	// 	// } else {
	// 	// 	folder = String(req.payload.folder)
	// 	// }
	// 	fileArray = [];
	// 	return new Promise((resolve, reject) => {

	// 		_.each(fs.readdirSync(dirname), function(filename){
	      		
	//       		var full_path = path.join(dirname, filename);
	// 			var stats = fs.statSync(full_path);
	// 			if (stats.isDirectory()) {
	// 				fileArray.push({ filename: filename, type: 'd'})
	// 			} else {
	// 				fileArray.push({ filename: filename, type: 'f'})
	// 			}
	// 	 //    fs.readdir(folder, function(err, items) {
	// 	 //    	console.log("items")
	// 	 //    	console.log(items)
	// 		// 	return resolve(items)
	// 		//     // for (var i=0; i<items.length; i++) {

	// 		//     //     files.push(items[i])
	// 		//     // }
	// 		//     // files.push(items)			
	// 		// })
	// 		});
	// 		return resolve(fileArray);
	// 	})

	// 	return true;
	// }


	handler.delFile = async (req, h) => {
		var body = req.params.body
		var data = body.split(",");	
		
		var name = data[0];
		var path = data[1];

		var stats = fs.statSync(path)

		if(stats.isDirectory()){
			fs.rmdir(path, { recursive: true }, (err) => {
				if (err) throw err;
			});
		} else {
			fs.unlink(path, (err) => {
				if (err) throw err;
			})
		}

		return true;
	}


	

	handler.getMap = async (req, h) => {
		console.log("GET MAP HERE")
		var username = req.params.username
		// var fullpath = req.params.path
		// var storeMap = {}
		    	
		// console.log(storeMap)

	    var getMap = function(directory){
	    	var directoryMap = []
	    	_.each(fs.readdirSync(directory), function(filename){
	    		var fullPath = path.join(directory, filename)



	    		// this is for delete all dead symlink with shared folders
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
	    			// directoryMap[filename] = getMap(fullPath)
	    		} else {
	    			directoryMap.push({type:'f', name:filename, path:fullPath})
	    			// directoryMap[filename] = fullPath
	    		}
	    	})
	    	return directoryMap
	    }
		return getMap("./data/"+username+"/");
	}


  



		


	handler.searchFiles = async (req, h) => {
		console.log("IN SEARCH HANDLER ---------")
		var data = req.params.data
		var d = data.split('&')
		var fileSearched = d[0]
		var user = d[1]
		
		var directory = "./data/" + user
		var result = []

		console.log(fileSearched)
		console.log(user)

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
		return searchRecurs(fileSearched,directory)
	}

	


	handler.createFolder = async (req, h) => {

		var name = req.payload.name
		var path = req.payload.path

		if (path.split('/').length < 4 
			|| path.includes('sharedFiles') 
			|| fs.existsSync(path+'/'+name) 
			|| name.match("^[0-9a-zA-Z]+$") == null)
		{
				return false		
		} else {
			fs.mkdir(path+'/'+name, (err) => {
				if (err) throw err
			})	
		}
			
		return true
	}	


		

	handler.downloadFiles = async (req, h) => {
		var list = req.params.filesList
		list = list.split(',')

		var zip = new admZip()

		list.forEach((element) => {
 			zip.addLocalFile(element);
 		})

		var sendThis = zip.toBuffer();
		return sendThis
		}


  // getDirectoryMap(dirname){
  //   const self = this;
  //   var directory_map = {};

  //   _.each(fs.readdirSync(dirname), function(filename){
  //     var full_path = path.join(dirname, filename);
  //     var stats = fs.statSync(full_path);
  //     if(stats.isDirectory()){
  //       directory_map[filename] = self.getDirectoryMap(full_path);
  //     }else{
  //       directory_map[filename] = full_path;
  //     }
  //   });
    
  //   return directory_map;
  // }



  // need to fix : current folder with props -> update directly to have the right path
  handler.shareFiles = async (req, h) => {

  	// params
  	var filepath = req.payload.directory
  	var users = req.payload.users  	
  	var currentUser = req.payload.user

  	// source path
  	var smthng = __dirname.split("").reverse().join("")
	var ind = smthng.indexOf('/')
	var dir = smthng.slice(ind+1).split("").reverse().join("")
	var sourcePath = dir+'/dcbia-server/'+filepath

	// share path
  	var f = filepath.split("").reverse().join("")
	var i = f.indexOf('/')
	var foldername = f.slice(0,i).split("").reverse().join("")
	let sharePath
	console.log(f)
	console.log(foldername)

  	users.forEach((user) => {

	  	sharePath = './data/'+user+'/sharedFiles/'+user+'-'+foldername

	  	if (!fs.existsSync(sharePath)) {
	  		fs.symlink(sourcePath, sharePath, (err) => {
				if (err) throw err
	 		})
	  	} else { console.log("already shared")}
  	})

  	return true
  }


  handler.moveFiles = async (req, h) => {
  	// params
  	var files = req.payload.files
  	var dir = req.payload.directory
	let filename, f, ind, name

  	files.forEach(function(file) {

	  	f = file.split("").reverse().join("")
		ind = f.indexOf('/')
		name = f.slice(0,ind).split("").reverse().join("")

  		fs.rename(file,dir+'/'+name, (err) => {
  			if (err) {throw err} 
  		})
  	})


  	return true
  }





	return handler;
}
