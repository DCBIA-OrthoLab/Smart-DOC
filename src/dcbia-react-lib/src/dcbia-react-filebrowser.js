import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Alert, Col, Row, DropdownButton, Dropdown, Form, Modal, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar, ListGroup} from 'react-bootstrap'

import {Trash2, Folder, Plus, ArrowLeft, ArrowDown, ArrowRight, MinusSquare, PlusSquare, CheckSquare, XSquare, X, CornerDownLeft, FolderMinus, FolderPlus, MoreVertical, ChevronLeft, ChevronsLeft, Share2, Circle, Download, File, UploadCloud, Move, Edit3, Edit2, Copy, Clipboard, Scissors} from 'react-feather'

import Dropzone from 'react-dropzone'


import DcbiaReactService from './dcbia-react-service'



const _ = require('underscore');
const Promise = require('bluebird');
const path = require('path');

class Filebrowser extends Component {
	constructor(props) {
		super(props)

		this.state = {


			fileToUpload: null,
			uploadPath: null,
			
			uploadValue: 0,
			showUploadBar: false,
			
			downloadValue: 0,
			showDownloadBar: false,

			treeMap: {},	
			filesMap: {},
			directoryMap: {},

			searchShareUser: "",

			projectFilesList: [],

			showUploadDragDrop: false,

			showSearchFiles: false,
			currentFolder: "",
			createFolderName: "",

			showCreateFolder: false,
			showErrorMesssage: false,

			selectMode: false,


			showDelete: false,

			selected: false,

			fileToShare: null,
			showPopUpShare: false,

			showPopupRename: false,
			
			searchSuggestions: [], 

			filesToCopy: {},
			filesToMove: {},
			selectedUsers: {}
			}

		this.updateDirectoryMap = this.updateDirectoryMap.bind(this)

	}

	componentDidMount() {
		const self = this

		this.dcbiareactservice = new DcbiaReactService();
		this.dcbiareactservice.setHttp(this.props.http);	

		self.updateDirectoryMap()

		document.addEventListener("keydown", (e)=>{self.handleKeyDown(e)});
		document.addEventListener("keyup", (e)=>{self.handleKeyUp(e)});
	}

	getTree(optionnalSearch=null) {
		const {treeMap, currentFolder} = this.state

		if (optionnalSearch!==null) {
			var objToFind = optionnalSearch
			return this.findInMap(treeMap, objToFind)
		
		} else {

			if (currentFolder == ""){ 
					return treeMap
			} else {
				return this.findInMap(treeMap, path.normalize(currentFolder), 0)
			}
		}
	}	

	findInMap(tree_map, full_path, root_path_index) {
		const self = this;

		var full_path_split = full_path.split("/")
		var root_path = full_path_split[root_path_index]
		
		var tree = _.find(tree_map, (v)=>{
			return v.name == root_path;
		});
		if (tree){
			if (path.normalize(tree.path) == full_path){
				return tree.files
			}else{
				root_path_index += 1
				return self.findInMap(tree.files, full_path, root_path_index)
			}		
		}
		return tree_map
	}



	

	handleKeyDown(e){
		const self = this;
		self.setState({...self.state, shiftKey: e.shiftKey})
	}

	handleKeyUp(e){
		const self = this;
		self.setState({...self.state, shiftKey: e.shiftKey})
	}


	isInFolder(map, file) {
		var found = false
		const self = this
		
		Object.keys(map).forEach(key => {
		
			if (found) {return found}
			if ('./'+map[key].path == file) {
				found = true}
			else if (map[key].type == 'd') {
				found = self.isInFolder(map[key].files,file)
			}
		})
		return found
	}

	handleUpload(filelist) {
		const self = this
		const {currentFolder, uploadRate} = self.state;
		
		self.setState({...self.state, showUploadDragDrop: false, showUploadBar: true})

		let uploadPath

		if (filelist.length==1) {
			var value = 50
			self.setState({...self.state, uploadValue: value})
		} else {
			var value = 100/filelist.length
		}

		return Promise.map(filelist, (file)=>{

			uploadPath = path.normalize(path.join(currentFolder, file.path))

			if (self.isInFolder(self.state.treeMap, uploadPath))
			{
				return Promise.resolve('File already uploaded')
			} else {
				return self.dcbiareactservice.uploadFile(uploadPath, file)
				.then(()=>{
					self.setState({uploadValue: self.state.uploadValue+value})
				})
				
			}


		}, {concurrency:1}
		)
		.then(()=>{
			self.updateDirectoryMap();
		})
	}


	updateDirectoryMap(){
		const self = this;
		const user = this.props.user

		if (user !== undefined) {

			// var username = user["name"]
			self.dcbiareactservice.getDirectoryMap()
			.then(function(res){
				var treeMap = res.data
				self.setState({treeMap: treeMap})

			})
		}


	}

	updateFilesList(f) {	
		
		var data = {expand: false, selected: false}
		var filesMap = this.state.filesMap

		if (Object.keys(filesMap).includes(f.path)) {
			return true
		} else {
			filesMap[f.path] = data
			this.setState({filesMap: filesMap})
			return false
		}

	}
	

	addSelectedFiles(f) {
		const self = this
		
		var {filesMap, shiftKey} = self.state

		if(!shiftKey){
			filesMap = {};
		}
		
		filesMap[f.path] = f

		self.setState({filesMap})
	}

	manageCreateTask() {
		const self = this
		const {filesMap} = self.state

		self.props.startCreatetask(filesMap)		
	}


 	isInProjectFilesList(f) {
 		var _ = require('underscore')

 		var b = false
 		var dataProject = {folder: this.state.currentFolder, file: f}
 		var currentFilesProject = this.state.filesProject

 		currentFilesProject.forEach((element) => {
 			if(_.isEqual(dataProject, element)) {b = true}
 		})
 		return b
 	}

	popUpDelete() {
		const self = this;
		
		const {filesMap} = self.state

		var listGroup = _.map(filesMap, (f)=>{
			return (<ListGroup.Item>{f.path}</ListGroup.Item>)
		})

		return (
			<Modal show={this.state.showDelete} onHide={() => this.setState({showDelete: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Deleting file ?</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					<ListGroup>
						{
							listGroup
						}
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showDelete: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() =>{
						self.deleteFiles()
					}}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
	  	)
	}


	deleteFiles() {
		const self = this;
		const {filesMap} = self.state

		return Promise.map(_.values(filesMap), (f)=>{
			return self.dcbiareactservice.deleteFile(f.path);
		}, {concurrency: 1})
		.then(()=>{

			return self.setState(
				{showDelete: false, filesMap: {}}
			)
		})
		.then(res => { 
			self.updateDirectoryMap();
		})
		.catch((res)=>{
			self.setState({showErrorMessage: true, showCreateFolder: false, errorMessage: "This file is in a shared directory and you don't own it.", showDelete: false, filesMap: {}})
		});
	}

	searchFiles(search, treeMap){
		const self = this

		return _.compact(_.flatten(_.map(treeMap, (t)=>{
			var filesFound = []
			
			var search_escape = search.replace(".", "\\.").replace("*", ".*")

			var pattern = ".*" + search_escape + ".*"

			var regex = new RegExp(pattern, "i")

			if (regex.test(t.name)){
				filesFound.push(t)
			}
			if(t.type == 'd'){
				filesFound.push(self.searchFiles(search, t.files))
			}
			return filesFound
		})))
	}


	handleSearchFile(e) {
		const self = this
		const {treeMap, showSearchFiles} = self.state

		var search = e.target.value
		if(search != ""){
			self.setState({searchSuggestions: self.searchFiles(search, treeMap), showSearchFiles: true})	
		}else{
			self.setState({searchSuggestions: [], showSearchFiles: false})
		}
	}


	displaySearchedFiles() {
		const self = this

		var {searchSuggestions} = self.state

		return (	
			<ListGroup>
				<ListGroup.Item variant='success'>Searching...</ListGroup.Item>
				{_.map(searchSuggestions, (f)=>{
					return (<ListGroup.Item id={_.uniqueId(f.name)}
						variant={f.type == 'd'? 'warning' : 'info'}
						action onClick={(e)=>{
							if(f.type == 'd'){
								self.goToFolder(f.path)
								self.setState({searchSuggestions: [], showSearchFiles: false})	
							}else{

								self.goToFolder(path.dirname(f.path))
								self.setState({searchSuggestions: [], showSearchFiles: false})	
							}
						}}
						>
							{
								f.type=='d' ? 
									<Folder style={{height: 15, color: "SteelGreen"}}/>
									: <File style={{height: 15, color: "SteelBlue"}}/>
							}
							&nbsp;
							{f.name}
					</ListGroup.Item>)
				})}
			</ListGroup>
		)
		
	}


	handleDrop(e,f) {
		const self = this
		var {filesMap} = self.state
		
	    e.preventDefault();
	    e.stopPropagation();

		self.setState({filesToMove: filesMap}, ()=>{
			self.pasteFiles(f)
		})

	}
	
	handleDragOver(e) {
	    e.preventDefault();
	    e.stopPropagation();
	}

	handleDragLeave(e) {
	    e.preventDefault();
	    e.stopPropagation();
	}

	handleDragEnter(e) {
	    e.preventDefault();
	    e.stopPropagation();
	}

	handleDrag(e) {
	    e.preventDefault();
	    e.stopPropagation();
	}

	handleDragStart(e,f) {
		const self = this;
		var {filesMap} = self.state
		filesMap[f.path] = f
		self.setState({filesMap})

	    e.stopPropagation();
	}

	popUpRename() {
		const self = this
		var {fileToRename, fileToRenameNewName} = self.state

		return (
			
			<Modal show={this.state.showPopupRename} onHide={() => this.setState({showPopupRename: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Rename {fileToRename.name}</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<Form.Control id="formRename" type="text" value={fileToRenameNewName} className="mr-sm-2" autoComplete="off" onChange={(e) => {fileToRenameNewName = e.target.value; self.setState({fileToRenameNewName})}}/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showPopupRename: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => {this.handleRename(fileToRename, fileToRenameNewName); this.setState({showPopupRename: false})}}>
						Rename
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}



	handleRename(fileToRename, newName) {
		const self = this
		var target_path = path.join(path.dirname(fileToRename.path), newName)
		return self.handleMoveFiles(fileToRename.path, target_path)
	}

	handleMoveFiles(source, target) {
		const self = this

		var infos = {}

    	infos["source"] = source 
		infos["target"] = target

		self.dcbiareactservice.moveFiles(infos)
		 .then(response => { 
			self.updateDirectoryMap()
		})
		.catch(err => {
			console.error(err.response)
		});
	}

	copyFiles(){
		const self = this;
		const {filesMap} = self.state

		self.setState({...self.state, filesToCopy: filesMap})
	}

	cutFiles(){
		const self = this;
		const {filesMap} = self.state

		self.setState({...self.state, filesToMove: filesMap});
	}

	pasteFiles(target) {
  		const self = this
  		const {filesToCopy, filesToMove} = self.state

  		var target_directory = ""

  		if(target.type == "d"){
  			target_directory = target.path	
  		}else{
  			target_directory = self.getParentDir(target.path)
  		}

  		return Promise.map(_.values(filesToCopy), (f)=>{

  			var info = {
  				source: f.path,
  				target: target_directory
  			}
			return self.dcbiareactservice.copyFiles(info)
		}, {concurrency: 1})
		.then(()=>{
			return Promise.map(_.values(filesToMove), (f)=>{
				var info = {
	  				source: f.path,
	  				target: target_directory
	  			}
				return self.dcbiareactservice.moveFiles(info)
			}, {concurrency: 1});
		})
		.then(()=>{
			self.setState({...self.state, filesToCopy: {}, filesToMove: {}}, ()=>{
				self.updateDirectoryMap()		
			})
		})
		.catch((e)=>{
			console.error(e);
		})
			
  	}

	getParentDir(file_path){
		var parent_directory = path.normalize(file_path).split("/")
		parent_directory.pop()
		return parent_directory.join("/")
	}


	downloadFiles() {
		const self = this

		const {filesMap} = self.state

		var filesToDownload = _.values(filesMap)

		self.setState({showDownloadBar: true})
    	
		return Promise.map(filesToDownload, (file, index)=>{

			return self.dcbiareactservice.downloadFiles(file.path)
			.then((response) => {

				name = file.path.split('/').pop()

				if (file.type == "d") {
					name += ".zip"
				}

		        var pom = document.createElement('a');
		        pom.setAttribute('href', window.URL.createObjectURL(new Blob([response.data])));
		        pom.setAttribute('download', name);

		        pom.dataset.downloadurl = ['application/octet-stream', pom.download, pom.href].join(':');

		        document.body.appendChild(pom);
		        pom.click();
		    })
		    .then(()=>{
					self.setState({downloadValue: index/filesToDownload.length*100.0})
			})	

		}, {concurrency: 1})
		.then(()=>{
			self.setState({downloadValue: 0, showDownloadBar: false})
		})
			
	}


	handleCreateFolder(folderName) {
		const self = this
		const {currentFolder, createFolderName} = this.state

		if (createFolderName){

			var newfolder = encodeURIComponent(path.join(currentFolder, createFolderName))

			this.dcbiareactservice.createFolder(newfolder)
			.then(res => { 
				
				// error in creation
				if (!res.data) {
					self.setState({showErrorMessage: true, showCreateFolder: false, errorMessage: "Error creating folder."})
				} else {

					self.updateDirectoryMap()
					self.setState({showCreateFolder: false})
				}
			})
			.catch((res)=>{
				self.setState({showErrorMessage: true, showCreateFolder: false, errorMessage: res.message})
			})
		}	

	}


	popUpError() {
		const self = this;
		var {errorMessage} = self.state

		return (
			<Modal show={this.state.showErrorMessage} onHide={() => this.setState({showErrorMessage: false})}> 
				<Modal.Header closeButton>
					<Modal.Title>Error</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					<Alert variant='info'>
						{errorMessage}
					</Alert>
				</Modal.Body>
			</Modal>

				)
	}

	popUpCreateFolder() {
		const self = this
		const {currentFolder, createFolderName} = self.state

		return (
			<Modal show={this.state.showCreateFolder} onHide={() => this.setState({showCreateFolder: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Create folder</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<Form.Label> create at location <i>{currentFolder}</i></Form.Label>
					<Form.Control id="formFolderName" type="text" placeholder="folder name" value={createFolderName} className="mr-sm-2" autoComplete="off" onChange={(e) => {self.setState({...self.state, createFolderName: e.target.value})}}/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showCreateFolder: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.handleCreateFolder()}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}




	handleShareFiles() {
		const self = this
		const {fileToShare, selectedUsers} = self.state

		var usersList = _.compact(_.map(selectedUsers, (selected, email)=>{
			if(selected){
				return email
			}
		}))

		self.setState({showPopUpShare: false})

		var infosShare = {}
		infosShare["users"] = usersList
		infosShare["directory"] = fileToShare

		self.dcbiareactservice.shareFiles(infosShare)
		.then(()=>{
			self.setState({selectedUsers: {}})
		})
	}

	popUpShare() {
		const self = this
		const {users} = self.props
		const {fileToShare, searchShareUser, selectedUsers} = self.state

		var userList = _.compact(_.map(users, (user)=>{
			if(user.email.includes(searchShareUser) || searchShareUser == ""){
				return (<li>
    				{user.email}
    				&nbsp;
    				<input type="checkbox" defaultChecked={selectedUsers[user.email]} onChange={(e) => {selectedUsers[user.email] = e.target.checked; self.setState({selectedUsers})}}/>
    			</li>)
			}
		}))

		return (
			<Modal show={self.state.showPopUpShare} onHide={() => self.setState({showPopUpShare: false})}>
				<Modal.Header closeButton>
					<Modal.Title> 					
						Share : <i style={{color: 'SteelBlue'}}>{fileToShare}</i>
					</Modal.Title>  
				</Modal.Header>
				<Modal.Body>
				<FormControl size="sm" placeholder="search user" type="text" autoComplete="off" onChange={(e)=> self.setState({...self.state, searchShareUser: e.target.value})}/>
				<div style={{overflow: "auto", display: "block",  height: "500px"}}>
				{userList}
				</div>
				</Modal.Body>
				<Modal.Footer>

				<Button variant="outline-danger" onClick={() => self.handleShareFiles()}> Share
				 </Button>
				</Modal.Footer>
			</Modal>
		)
	}



	displayPath() {
		const self = this;
		const {currentFolder} = self.state;

		if (currentFolder == "" || currentFolder == "." || currentFolder == "./"){
			return (
				<Dropdown>
					<Dropdown.Toggle as={
						React.forwardRef(({ children, onClick }, ref) => (
						  <a
						    ref={ref}
						    onContextMenu={(e) => {e.preventDefault(); onClick(e)}}
						    onClick={(e) => {
						      e.preventDefault();
						    }}
						  >
						  	{children}
						  </a>
						))

					} id={"dropbread-dropdown-custom-components"}>
						<Breadcrumb onDragOver={(e)=>{self.handleDragOver(e)}} onDrop={(e)=>{self.handleDropHome(e)}}>
							<Breadcrumb.Item onClick={() => self.goToFolder("")}>{"home"}</Breadcrumb.Item>
						</Breadcrumb>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item onClick={() => self.pasteFiles({type:"d",path: currentFolder})} ><Clipboard style={{color: "black", height: 15, cursor:"pointer"}} /> Paste </Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			)
		}

		var all_folders = _.compact(currentFolder.split('/'))
		var cumulative = ""
		
		var cumulative_paths = _.map(all_folders, (p, i)=>{
			cumulative += p + "/"
			return {
				name: p,
				path: cumulative
			}
		})

		cumulative_paths.unshift({name: "home", path: ""});

		return (
			<Dropdown>
				<Dropdown.Toggle as={
					React.forwardRef(({ children, onClick }, ref) => (
					  <a
					    ref={ref}
					    onContextMenu={(e) => {e.preventDefault(); onClick(e)}}
					    onClick={(e) => {
					      e.preventDefault();
					    }}
					  >
					  	{children}
					  </a>
					))

				} id={"dropbread-dropdown-custom-components"}>
					<Breadcrumb>
							{cumulative_paths.map((f, index) =>  <Breadcrumb.Item onClick={() => self.goToFolder(f.path)}> {f.name} </Breadcrumb.Item>)}
					</Breadcrumb>
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item onClick={() => self.pasteFiles({type:"d",path: currentFolder})} ><Clipboard style={{color: "black", height: 15, cursor:"pointer"}} /> Paste </Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		)
	}

	goToFolder(folder_path) {
		this.setState({currentFolder: path.normalize(folder_path)})
	}

	displayNextLevel(f){
		const self = this
		const {directoryMap} = self.state

		if(f.type == 'd' && directoryMap[f.path]){
			return (<Row><Col sm={{offset:"1"}}>{self.displayFiles(f.files)}</Col></Row>)
		}
	}

	handleDropHome(e){
		const self = this
		var {filesMap} = self.state
		
	    e.preventDefault();
	    e.stopPropagation();

		self.setState({filesToMove: filesMap}, ()=>{
			self.pasteFiles({
				type: 'd',
				path: './'
			})
		})
	}

	getFileListItem(f){
		const self = this
		const {directoryMap, filesMap} = self.state
		return (
			<Row>
				<Col>
					<Dropdown
						draggable={true}
						onDrag={(e) => self.handleDrag(e)}
						onDragStart={(e) => self.handleDragStart(e,f)}
						onDrop={(e) => self.handleDrop(e,f)}
						onDragOver={(e) => self.handleDragOver(e)}
						onDragLeave={(e) => self.handleDragLeave(e)}
						onDragEnter={(e) => self.handleDragEnter(e)}
						onClick={(e)=>{
							if (e.detail === 2) {
								if(f.type === 'd'){
									self.goToFolder(f.path)
								}
							}
						}}>
						<Dropdown.Toggle as={
							React.forwardRef(({ children, onClick }, ref) => (
							  <a
							    ref={ref}
							    onContextMenu={(e) => {e.preventDefault(); onClick(e)}}
							    onClick={(e) => {
							      e.preventDefault();
							    }}
							  >
							  	{children}
							  </a>
							))

						} id={_.uniqueId(f.name)}>
							<ListGroup.Item id={_.uniqueId(f.name)}
								variant={filesMap[f.path]? 'primary' : f.link? 'warning' : ''}
								action onClick={(e)=>{
									self.addSelectedFiles(f)
								}}
								>
									{
										f.type=='d' ? 
											directoryMap[f.path]? 
												<FolderMinus style={{color: "red", cursor:"pointer"}} onClick={() => {directoryMap[f.path] = false; self.setState({...self.state, directoryMap})}}/>:
												<FolderPlus style={{color: "green", cursor:"pointer"}} onClick={() => {directoryMap[f.path] = true; self.setState({...self.state, directoryMap})}}/> 
											: <File style={{height: 15, color: "SteelBlue"}}/>
									}
									&nbsp;
									{f.name}
							</ListGroup.Item>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => self.setState({fileToRename: f, fileToRenameNewName: f.name, showPopupRename: true})} ><Edit3 style={{color: "black", height: 15, cursor:"pointer"}}/> Rename</Dropdown.Item>
							<Dropdown.Item onClick={() => self.copyFiles()} ><Copy style={{color: "black", height: 15, cursor:"pointer"}} /> Copy </Dropdown.Item>
							<Dropdown.Item onClick={() => self.cutFiles()} ><Scissors style={{color: "black", height: 15, cursor:"pointer"}} /> Cut </Dropdown.Item>
							<Dropdown.Item onClick={() => self.pasteFiles(f)} ><Clipboard style={{color: "black", height: 15, cursor:"pointer"}} /> Paste </Dropdown.Item>
							<Dropdown.Item onClick={() => self.setState({fileToShare: f.path, showPopUpShare: true})}><Share2 style={{color: "red", height: 15, cursor:"pointer"}}/> Share</Dropdown.Item>
							<Dropdown.Item onClick={()=>self.setState({showDelete: true})} ><Trash2 style={{color: "black", height: 15, cursor:"pointer"}}/> Delete </Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					{
						self.displayNextLevel(f)
					}
				</Col>
			</Row>
		)
	}


	displayFiles(tree) {

		const self = this

		if (_.isEmpty(tree)) 
		{
			return (<ListGroup.Item>Empty folder</ListGroup.Item>)
		}else{
			var listItems = _.compact(_.map(tree, (f)=>{
				if(f.name != 'sharedWithMe'){
					return self.getFileListItem(f)
				}
			}))
			var sharedWithMe = _.find(tree, (f)=>{
				return f.name == 'sharedWithMe'
			});
			if(sharedWithMe){
				listItems.unshift(self.getFileListItem(sharedWithMe))	
			}
			
			return listItems
		}
	}

	getDisplayFilesOrSearch(){
		const self = this

		var {searchSuggestions, showSearchFiles} = self.state

		if(searchSuggestions.length > 0 || showSearchFiles){
			return self.displaySearchedFiles()	
		}else{
			return self.displayFiles(self.getTree())
		}
	}

	getFileManager(){
		const self = this;
		const {selectMode, selected, currentFolder, showUploadDragDrop} = self.state;

		return (
			<Alert className="mt-3" style={{borderColor: "#1b273e", borderWidth: 3, borderRadius: 10}} >
				<Navbar bg="light">
					<Nav className="mr-auto">
						<Form inline>
							<FormControl id="searchFilesForm" onChange={(e)=>{self.handleSearchFile(e)}} type="text" placeholder="search file/folder" className="mr-sm-2" autoComplete="off"/>
							<Button hidden={self.props.createtask} variant="outline-primary" onClick={() => self.setState({...self.state, showCreateFolder: true})}>
								create folder
							</Button>
						</Form>
					</Nav>



					<Row>

						<Button className="mr-sm-2" variant="outline-success" hidden={!self.props.createtask} onClick={() => self.manageCreateTask()}> Validate Files Selection </Button>
					
						<Col>
							<OverlayTrigger overlay={<Tooltip>Download files</Tooltip>} placement={'top'}>
								<Button hidden={self.props.createtask} variant="success" onClick={() => self.downloadFiles()}>
									<Download style={{"color": "white"}}> </Download>
								</Button>
							</OverlayTrigger>
						</Col>
						<Col>
							<OverlayTrigger overlay={<Tooltip>Upload files</Tooltip>} placement={'top'}>
								<Button hidden={self.props.createtask} variant="primary" onClick={()=>{self.setState({...self.state, showUploadDragDrop: true})}}>
									<UploadCloud/>
								</Button>
							</OverlayTrigger>

							<Modal
								show={showUploadDragDrop}
								onHide={() =>{self.setState({...self.state, showUploadDragDrop: false})}}
								size='xl'
								>
						        <Modal.Header closeButton>
						        	<Modal.Title id="example-custom-modal-styling-title">
						        		Upload 
					        		</Modal.Title>
				        		</Modal.Header>
				        		<Modal.Body>
				        			<Dropzone onDrop={(acceptedFiles)=>{self.handleUpload(acceptedFiles).then(()=>{self.setState({...self.state, uploadValue: 0, showUploadBar: false})})}}>
				        				{({getRootProps, getInputProps}) => (
						        			<Container fluid="true" style={{padding: 0, height: "50vh"}} {...getRootProps()}>
						        				<Alert variant="primary" style={{height: "100%"}}>
						        					<Alert.Heading>Drag & Drop some files</Alert.Heading>
						        					<Col md={{ span: 8, offset: 2 }} style={{"text-align": "center"}}>
						        						<UploadCloud size={"40vh"}/>
					        							<input {...getInputProps()} />
					        						</Col>
					        						<hr />
					        					</Alert>
								            </Container>
							            )}
									</Dropzone>
			        			</Modal.Body>
							</Modal>
						</Col>
						<Col xs={10} md={10}>
							{self.state.showUploadBar ? <ProgressBar className={"mt-2"}  animated now={self.state.uploadValue}/> : null}
							{self.state.showDownloadBar ? <ProgressBar className={"mt-2"}  animated now={self.state.downloadValue}/> : null}
						</Col>
					</Row>
				</Navbar>


				<Card.Body >
					<Container>
						<Row>
							<Col>
								{this.displayPath()}
							</Col>
						</Row>
						<Card>
							<ListGroup>
								{self.getDisplayFilesOrSearch()}	
							</ListGroup>
						</Card>
					</Container>
				</Card.Body>
			</Alert>);
	}

	getFileManagerOrSearch(){
		const self = this
		
	}


	render() {
		const self = this

		return(
			<Container fluid="true">

				{this.state.showDelete ? this.popUpDelete() : null}
				{this.state.showCreateFolder ? this.popUpCreateFolder() : null}
				{this.state.showPopUpShare ? this.popUpShare() : null}
				{this.state.showErrorMessage ? this.popUpError() : null}
				{this.state.showPopupRename ? this.popUpRename() : null}
				<Row>
					<Col>
						{self.getFileManager()}
					</Col>
				</Row>
			</Container>
		)
	}
}








const mapStateToProps = (state, ownProps) => {
  return {
    user: state.jwtAuthReducer.user,
    http: state.jwtAuthReducer.http,
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     thisprop: (StateSendCreateTaskTEST) => {
//       dispatch({
//         StateSendCreateTaskTEST: StateSendCreateTaskTEST
//       });
//     }
//   }
// }

export default connect(mapStateToProps)(Filebrowser);
