
const _ = require('underscore');
const Promise = require('bluebird');
const Boom = require('@hapi/boom');
const spawn = require('child_process').spawn;
const path = require('path');
const qs = require('querystring');
const fs = require('fs');
const archiver = require('archiver');
const couchUpdateViews = require('couch-update-views');

module.exports = function (server, conf) {
	

	couchUpdateViews.migrateUp(server.methods.dcbia.getCouchDBServer(), path.join(__dirname, "views"));
	
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

	handler.uploadFile = (req, h) => {
		const {auth, params, payload} = req;
		const {credentials} = auth;
		const {target_path} = params;

		return new Promise((resolve, reject)=>{
			
			var filename = path.join(conf.datapath, credentials.email, target_path);
			var dirname = path.dirname(filename);
			
			if(!fs.existsSync(dirname)){
				fs.mkdirSync(dirname, { recursive: true }, (err) => {if (err) reject(err)});
			}

			payload.pipe(fs.createWriteStream(filename))

			payload.on('end',function() {
				resolve("File uploaded!");
			});
		});
	}


	handler.deleteFile = (req, h) => {
		const {auth, params, payload} = req;
		const {credentials} = auth;
		const {target_path} = params;
		
		return new Promise((resolve, reject)=>{
			var filename = path.join(conf.datapath, credentials.email, target_path);

			fs.lstat(filename, function(err,stats){
				if(stats.isSymbolicLink()){
					fs.unlinkSync(filename)
					resolve('Shared folder deleted!')
				} else if(deleteRecursive(filename)){
					resolve("File deleted!");
				}else{
					reject("Cannot delete:", target_path);
				}
			});
		});
	}

	const getDirectoryMap = (directory, root_folder)=>{
		return _.map(fs.readdirSync(directory), (filename)=>{
			var fullPath = path.join(directory, filename);
			
			if(fs.lstatSync(fullPath).isSymbolicLink() && !fs.existsSync(fullPath)){
				fs.unlinkSync(fullPath);
				return null;
			}
			
			if (fs.statSync(fullPath).isDirectory()){
    			return {type:'d', name: filename, path: path.relative(root_folder, fullPath), files: _.compact(getDirectoryMap(fullPath, root_folder))}
    		} else {
    			return {type:'f', name: filename, path: path.relative(root_folder, fullPath)};
    		}
		});
	}


	handler.getDirectoryMap = (req, h) => {

		return new Promise((resolve, reject)=>{
			const {query, auth} = req;
			var credentials = auth.credentials;
			var user = credentials.email;

			if(query.email && credentials.scope.indexOf('admin') == -1){
				reject(Boom.unauthorized('You are not an admin!'));
			}else{
			    var personnalPath = path.join(conf.datapath, user);
			    if (!fs.existsSync(personnalPath)) {
					fs.mkdirSync(path.join(personnalPath,'sharedFiles'), { recursive: true }, (err) => {if (err) reject(err)});
			    }
				resolve(_.compact(getDirectoryMap(personnalPath, personnalPath)));
			}
		})
	}


	handler.createFolder = (req, h) => {

		return new Promise((resolve, reject)=>{
			const {auth, params, payload} = req;
			const {credentials} = auth;
			const {newfolder} = params;

			var directorypath = path.join(conf.datapath, credentials.email, newfolder)

			if (directorypath.includes('sharedFiles')){
				reject(Boom.forbidden("Cannot create directory in sharedFiles!"));
			}else if(fs.existsSync(directorypath)){
				resolve(false);
			} else {
				fs.mkdirSync(directorypath, { recursive: true });
				resolve(true)
			}
		})
	}	
		

	handler.downloadFile = (req, h) => {
		const {auth, params} = req;
		const {credentials} = auth;
		const {file} = params;
		
		var fullPath = path.join(conf.datapath, credentials.email, file);

		if(fs.existsSync(fullPath)){
			if(fs.statSync(fullPath).isDirectory()){
				return new Promise((resolve, reject)=>{
					// create a file to stream archive data to.
					var output_zip = path.resolve(fullPath) + ".zip";
					var output = fs.createWriteStream(output_zip);

					var archive = archiver('zip', {
					  zlib: { level: 0 }
					});
					//When the output stream is closed we can resolve the promise
					output.on('close', ()=>{
						var outstream = fs.createReadStream(output_zip);
						outstream.on('close', ()=>{
					  		//When the outstream finishes we nuke the archive
					  		fs.unlinkSync(output_zip);
					  	})
					  	resolve(outstream);
					});

					archive.pipe(output);

					archive.directory(fullPath, path.basename(fullPath));

					archive.finalize();
				});
			}else{
				return fs.createReadStream(fullPath);
			}
		}else{
			return Boom.notFound(file);
		}
	}


	handler.shareFiles = async (req, h) => {
		const {query, auth, payload} = req;
		const {directory, users} = payload;
		const {credentials} = auth;

		var owner = credentials.email;
		var rootPath = path.join(conf.datapath, owner);
		var sourcePath = path.resolve(path.join(rootPath, directory));

		if(fs.existsSync(sourcePath)){
			return Promise.map(users, (user)=>{
				try{

					if(user != owner){
						var sharedFolder = path.resolve(path.join(conf.datapath, user, 'sharedFiles'));
						if(!fs.existsSync(sharedFolder)){
							fs.mkdirSync(sharedFolder, {recursive: true});
						}

						var targetPath = path.join(sharedFolder, path.basename(sourcePath))

					  	if (!fs.existsSync(targetPath)) {
							fs.symlinkSync(sourcePath, targetPath);
						}
						return user;		
					}else{
						return Promise.reject(Boom.badRequest("Cannot share with self!"));
					}
				}catch(e){
					console.error(e);
					return null;
				}
				
			})
			.then((users)=>{ return _.compact(users); })
			.then((users)=>{

				var view = '_design/sharedFolders/_view/shared';
				var query = {
					key: JSON.stringify([owner, directory]),
					include_docs: true
				}
				return server.methods.dcbia.getViewQs(view, query)
				.then(function(rows){
					var doc = _.pluck(rows, 'doc')[0];
					doc.users = _.union(doc.users, users);
					return server.methods.dcbia.uploadDocuments(doc);
				})
				.catch(function(e){
					var shared_users = {
						owner,
						directory,
						users,
						type: "shared"
					}
					return server.methods.dcbia.uploadDocuments(shared_users);
				});
			})
		}else{
			return Promise.reject(Boom.notFound("You don't own this folder"));
		}
	}

	handler.mySharedFiles = (req, h)=>{
		const {auth, params} = req;
		const {credentials} = auth;
		const {target_path} = params;

		var view = '_design/sharedFolders/_view/shared';

		var query = {
			key: JSON.stringify([credentials.email, target_path]),
			include_docs: true
		}
		
		return server.methods.dcbia.getViewQs(view, query)
		.then((res)=>{
			var docs = _.pluck(res, 'doc');
			if(docs.length > 0){
				return docs[0];
			}else{
				return [];
			}
		})
		.catch((e)=>{
			return Boom.notFound(e);
		});
	}

	handler.unshareFiles = async (req, h) => {
		const {query, auth, payload} = req;
		const {directory, users} = payload;
		const {credentials} = auth;
		const owner = credentials.email;

		const sourcePath = path.resolve(path.join(conf.datapath, credentials.email, directory));

		if(fs.existsSync(sourcePath)){
			return Promise.map(users, (user)=>{
				try{
					var sharedFolder = path.resolve(path.join(conf.datapath, user, 'sharedFiles'));
					var targetPath = path.join(sharedFolder, path.basename(sourcePath))

				  	if(fs.existsSync(targetPath) && fs.lstatSync(targetPath).isSymbolicLink()){
						fs.unlinkSync(targetPath);
						return user;
					}
					return null;
				}catch(e){
					console.error(e);
					return null;
				}
				
			})
			.then((users)=>{ return _.compact(users); })
			.then((users)=>{

				var view = '_design/sharedFolders/_view/shared';
				var query = {
					key: JSON.stringify([owner, directory]),
					include_docs: true
				}
		
				return server.methods.dcbia.getViewQs(view, query)
				.then(function(rows){
					var doc = _.pluck(rows, 'doc')[0];
					doc.users = _.difference(doc.users, _.intersection(doc.users, users));
					return server.methods.dcbia.uploadDocuments(doc);
				})
				.catch(function(e){
					return Promise.reject(Boom.notFound("You own the folder but never shared it before!"));
				});
			})
		}else{
			return Promise.reject(Boom.notFound("You don't own this folder"));
		}

		return true
	}

	const copyFiles = (source, target)=>{
		const self = this;

		if(fs.existsSync(target) && fs.statSync(target).isFile()){
			//If both file exist then don't copy. It's a conflict
			return Promise.reject(Boom.conflict("File Exists!"));
		}

		if(fs.existsSync(target) && fs.statSync(target).isDirectory()){
			//If the target is a directory, it means the source needs to be copy inside the directory
			//Apend the name of the source
			target = path.join(target, path.basename(source));
		}

		if(fs.existsSync(source) && fs.statSync(source).isDirectory()){
			//Copy recursively everthing in source if it is a directory
			return Promise.map(fs.readdirSync(source), (filename)=>{
				var source_path = path.join(source, filename);
				var target_path = path.join(target, filename);
				return copyFiles(source_path, target_path);
			})
		}else{
			//If source is anything but a directory
			//Copy the whole thing
			return new Promise((resolve, reject)=>{

				var target_dir = path.dirname(target);

				if(!fs.existsSync(target_dir)){
					fs.mkdirSync(target_dir, {recursive: true});
				}

				var reader = fs.createReadStream(source);
				var writer = fs.createWriteStream(target);
				reader.pipe(writer);

				writer.on('finish', ()=>{
					resolve();
				});

				writer.on('error', (err)=>{
					reject(Boom.badRequest(err));
				});
			});
		}
  }

  handler.copyFiles = (req, h) => {  
  	const {credentials} = req.auth;
  	const {source, target} = req.payload;

  	const sourcePath = path.join(conf.datapath, credentials.email, source);
  	var targetPath = path.join(conf.datapath, credentials.email, target);

  	return copyFiles(sourcePath, targetPath)
  	.then(()=>{
  		return true;
  	});
  }



  handler.moveFiles = (req, h) => {  
  	const {credentials} = req.auth;
  	const {source, target} = req.payload;

  	const sourcePath = path.join(conf.datapath, credentials.email, source);
  	var targetPath = path.join(conf.datapath, credentials.email, target);

  	return copyFiles(sourcePath, targetPath)
  	.then(()=>{
  		return deleteRecursive(sourcePath);
  	});
  }


  handler.renameFile = async(req, h) => {
	const {credentials} = req.auth;
	const {source, newname} = req.payload;

	const oldPath = path.join(conf.datapath, credentials.email, source)
	var targetPath = path.join(conf.datapath, credentials.email, path.dirname(source), newname)

	stats = fs.statSync(oldPath);
	if(!stats.isDirectory()){
		targetPath = targetPath
	}

	fs.rename(oldPath, targetPath, err => {
		if (err) {throw err};
	})

  	return true

  }


  handler.getscript = async(req, h) => {
	var view = '_design/tasksInfos/_view/tasksInfos';
	var query = {
		key: JSON.stringify(),
		include_docs: true
	}
	
	return server.methods.dcbia.getViewQs(view, query)
	.then((res)=>{
		var docs = _.pluck(res, 'doc');
		return docs
	})

  	return true
  }


  handler.uploadscript = async(req, h) => {
  	var {payload} = req

  	payload.type = "tasksInfos"

	return server.methods.dcbia.uploadDocuments(payload);

}


	return handler;
}