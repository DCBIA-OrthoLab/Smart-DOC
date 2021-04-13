
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
	

	couchUpdateViews.migrateUp(server.methods.dcbia.getCouchDBServer(), path.join(__dirname, "views"), true);

	var handler = {};
	/*
	*/

	handler.getUserEmails = (req, h)=>{

		return server.methods.dcbia.getView('_design/user/_view/info')
		.then(function(info){
			return _.pluck(info, 'value');
		})
		.then(function(users){
			return _.map(users, (user)=>{
				return {
					email: user.email
				}
			})
		})
		.catch(function(err){
			return Boom.badImplementation(err);
		})
	}

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
		
		var target = path.join(conf.datapath, credentials.email, target_path);

		var real_target = fs.realpathSync(target)

		if(real_target.indexOf(credentials.email) != -1){
			if(fs.statSync(real_target).isDirectory()){
				console.log(real_target)
				fs.rmdirSync(real_target, {recursive: true})
			}else{
				fs.unlinkSync(real_target)
			}
			return true
		}
		return Boom.forbidden("You don't own a parent directory or the file!")
	}

	const getDirectoryMap = (directory, root_folder)=>{
		return _.map(fs.readdirSync(directory), (filename)=>{
			var fullPath = path.join(directory, filename);
			
			if(fs.lstatSync(fullPath).isSymbolicLink() && !fs.existsSync(fullPath)){
				fs.unlinkSync(fullPath);
				return null;
			}
			
			if (fs.statSync(fullPath).isDirectory()){
    			return {type:'d', name: filename, path: path.relative(root_folder, fullPath), files: _.compact(getDirectoryMap(fullPath, root_folder)), link: fs.lstatSync(fullPath).isSymbolicLink()}
    		} else {
    			return {type:'f', name: filename, path: path.relative(root_folder, fullPath), link: fs.lstatSync(fullPath).isSymbolicLink()};
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
			    var sharedFolder = path.join(personnalPath,'sharedWithMe')
			    if (!fs.existsSync(sharedFolder)) {
					fs.mkdirSync(sharedFolder, { recursive: true }, (err) => {if (err) reject(err)});
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

			if(fs.existsSync(directorypath)){
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
						var sharedFolder = path.resolve(path.join(conf.datapath, user, 'sharedWithMe'));
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

	const copyFiles = (source, target)=>{
		const self = this;

		if(fs.existsSync(target) && fs.statSync(target).isFile()){
			//If both file exist then don't copy. It's a conflict
			return Promise.reject(Boom.conflict("File Exists!"));
		}

		if(source != target){
			if(fs.existsSync(target) && fs.statSync(target).isDirectory()){
				//If the target is a directory, it means the source needs to be copy inside the directory
				//Apend the name of the source
				target = path.join(target, path.basename(source));
			}

			if(source != target){
				if(fs.existsSync(source) && fs.statSync(source).isDirectory()){
					//Copy recursively everthing in source if it is a directory
					fs.mkdirSync(target, {recursive: true});
					
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
							resolve(true);
						});

						writer.on('error', (err)=>{
							reject(Boom.badRequest(err));
						});
					});	
				}
			}
		}

		return Promise.reject(Boom.conflict("Source and target are the same!"))
  }

  handler.copyFiles = (req, h) => {  
  	const {credentials} = req.auth;
  	const {source, target} = req.payload;

  	const sourcePath = path.join(conf.datapath, credentials.email, source);
  	var targetPath = path.join(conf.datapath, credentials.email, target);

  	return copyFiles(sourcePath, targetPath);
  }

  handler.moveFiles = (req, h) => {  
  	const {credentials} = req.auth;
  	var {source, target} = req.payload;

  	if(source == 'sharedWithMe'){
  		return Boom.forbidden("This is the only directory you can't move")
  	}

  	source = path.join(conf.datapath, credentials.email, source);
  	target = path.join(conf.datapath, credentials.email, target);

  	var real_target = target

  	if (fs.existsSync(real_target)){
  		real_target = fs.realpathSync(real_target)
  	}

  	if(fs.existsSync(target) && fs.statSync(target).isDirectory()){
		//If the target is a directory, it means the source needs to be moved inside the directory
		//Apend the name of the source
		target = path.join(target, path.basename(source));
	}

	try{
		var stat = fs.lstatSync(source)
		if(stat.isSymbolicLink()){

			var real_path = fs.realpathSync(source)
			real_path = path.relative(path.dirname(target), real_path)

			if(target.indexOf(source) == 0){
				return Boom.forbidden("You are moving a shared folder into one of the sub folders")
			}else{
				fs.symlinkSync(real_path, target)
				fs.unlinkSync(source)	
			}

		}else{
			var real_source = fs.realpathSync(source)

			if(real_source.indexOf(credentials.email) == -1 && real_target.indexOf(credentials.email) != -1){
				//This means the file is shared and it should not be moved but it can be copied
				return copyFiles(real_source, target)
			}else{
				if(!fs.existsSync(target)){
					fs.renameSync(source, target)		
				}else{
					return Boom.conflict("File exists!")
				}
			}
		}
	}catch(e){
		console.error(e);
		return Boom.boomify(e)
	}	

	
  	return true
  }


	return handler;
}