import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar} from 'react-bootstrap'

import {Trash2, Folder, Plus, ArrowLeft, ArrowDown, ArrowRight, MinusSquare, PlusSquare, CheckSquare, XSquare, X, CornerDownLeft, FolderMinus, FolderPlus, MoreVertical, ChevronLeft, ChevronsLeft, Share2, Circle, Download, File, UploadCloud, Move, Edit3, Edit2, Copy} from 'react-feather'

import Dropzone from 'react-dropzone'


import DcbiaReactService from './dcbia-react-service'


const _ = require('underscore');
const Promise = require('bluebird');
var JSZip = require("jszip");


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


			projectFilesList: [],


			treeMap: null,	
			filesList: {},
			loadingUpload: false,

			showUploadDragDrop: false,

			searchFiles: false,
			currentFolder: ".",

			// pop up
			showCreateFolder: false,
			// showUpload: false,
			showImportProject: false,
			showMove: false,
			showErrorCreateFolder: false,

			selectMode: false,


			showDelete: false,
			fileToDelete: "",

			selected: false,

			dirToShare: null,
			showPopUpShare: false,

			showPopupRename: false,
			
			suggestions: []
			}

		this.updateDirectoryMap = this.updateDirectoryMap.bind(this)

	}

	getTree(optionnalSearch=null) {
		const {treeMap, currentFolder} = this.state

		if (optionnalSearch!==null) {
			var objToFind = optionnalSearch
			return this.findInMap(treeMap, objToFind)
		
		} else {

			if (currentFolder == '.') { 
					return(treeMap)
			} else {
				var objToFind = currentFolder.slice(2)
				return this.findInMap(treeMap,objToFind)
			}
		}
	}	

	findInMap(map,objToFind) {
		var found
	    Object.keys(map).forEach(key => {
	    	if (found) {return found}
	    	if (map[key].path == objToFind) {
	    		found = map[key].files
	    		
	    	} else if (map[key].type == 'd') {
	    		found = this.findInMap(map[key].files,objToFind)
	    	}
		})
	    return found
	}



	componentDidMount() {
		const self = this

		this.dcbiareactservice = new DcbiaReactService();
		this.dcbiareactservice.setHttp(this.props.http);	

		self.updateDirectoryMap()
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

			if (file.path[0]!=='/') {
				uploadPath = currentFolder+'/'+file.path
			} else {
				uploadPath = currentFolder+file.path
			}

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

	// popUpUpload() {
	// 	if (document.getElementById('inputUpload').value == '') {return} else {
	// 	return (
	// 		<Modal show={this.state.showUpload} onHide={() => this.setState({showUpload: false})}>
	// 			<Modal.Header closeButton>
	// 				<Modal.Title>Upload file</Modal.Title>  
	// 			</Modal.Header>

	// 			<Modal.Body>
	// 				Confirm Uploading - <strong>{document.getElementById("inputUpload").value}</strong> in <strong>{this.state.currentFolder}</strong>
	// 			</Modal.Body>
	// 			<Modal.Footer>
	// 				<Button variant="danger" onClick={() => this.setState({showUpload: false})} >
	// 					Cancel
	// 				</Button>
	// 				{this.state.loadingUpload ? 
	// 				<Button variant="info" disabled>
	// 				<Spinner variant="dark" animation="border" size="sm" role="status"/>
	// 				<span className="sr-only">Loading...</span>
	// 				</Button> :
	// 				<Button variant="info" onClick={() => this.handleUpload()}> Upload </Button>}

	// 			</Modal.Footer>
	// 		</Modal>
	// 	)}
	// }





	



	updateDirectoryMap(){
		const self = this;
		var user = this.props.user

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
		var filesList = this.state.filesList

		if (Object.keys(filesList).includes(f.path)) {
			return true
		} else {
			filesList[f.path] = data
			this.setState({filesList: filesList})
			return false
		}

	}



	

	addSelectedFiles(f) {
		
		var {filesList} = this.state
		var bool = filesList[f.path].selected
		filesList[f.path].selected = !bool
		this.setState({filesList: filesList})
		
		if (this.props.createtask) {
			const {projectFilesList} = this.state
				
			if (projectFilesList.length==0){
				var data = {name: f.path} 
			} else {
				var data = Object.assign({}, projectFilesList[0])
				data.name = f.path
			}

			projectFilesList.push(data)
			this.setState({projectFilesList: projectFilesList})	

		}
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
		return (
			<Modal show={this.state.showDelete} onHide={() => this.setState({showDelete: false, fileToDelete: ""})}>
				<Modal.Header closeButton>
					<Modal.Title>Deleting file ?</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					<text style={{"word-break": "break-all"}}> Confirm delete file - <strong>{this.state.fileToDelete.name}</strong> located at <strong>{this.state.fileToDelete.path}</strong></text>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showDelete: false, fileToDelete: ""})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.deleteF()}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
	  	)
	}


	deleteF() {
		const self = this
		var fileToDelete = self.state.fileToDelete.path
		// erase deleted file from file list
		var pathname = self.state.fileToDelete.path
		var files = self.state.filesList
		delete files[pathname]

		self.setState(
			{showDelete: false, fileToDelete: "", filesList: files}
		)
		self.dcbiareactservice.deleteFile(fileToDelete)
		.then(res => { 
			self.updateDirectoryMap();
		})
	}





	handleSearchFile(e) {
		const self = this
		var search = e.target.value
		// var bool = this.state.searchFiles
		const {treeMap} = self.state

		if (search == '') {this.setState({searchFiles: false})} 
			else {this.setState({searchFiles: true})}

		var result = []
		var searchRecurs = function(data, directory){
			Object.values(directory).forEach(element => {
				if (element.type=='d'){
					if (element.name.toUpperCase().includes(data.toUpperCase())){
						result.push({type: element.type, name: element.name, path: element.path})
					}
					searchRecurs(search, element.files)	
				}else{
					if (element.name.toUpperCase().includes(data.toUpperCase())){
						result.push({type: element.type, name: element.name, path: element.path})
					}
				}
			})
			return result
		}
		

		var found = searchRecurs(search, treeMap)
		self.setState({suggestions: found})
	}


	displaySearchedFiles() {
		if (this.state.suggestions.length==0) {
			return <div>Nothing found</div>
		} else {
			return (	
				<Container>
					{this.state.suggestions.map(f => 
						<Row style={f.type=='d' ? {color: "white"} : {color: "black"}}>
							{/*<Plus onClick={() => this.addFileProject(f)}/>*/}
							<CornerDownLeft style={{cursor:'pointer'}} onClick={() => this.goToFile(f.path)}/>
							{f.name} &nbsp;
							{f.type=='d' ? <Folder/> : <File/>}&nbsp;
							<i>{f.path}</i>
						</Row>
					)}
				</Container>
			)
		}
	}


	handleDrop(e,f) {
		const self = this
		
	    e.preventDefault();
	    e.stopPropagation();

		var sourcePath = e.dataTransfer.getData("filepath")
		var sourceType = e.dataTransfer.getData("type")

	    if (f.type=="d" && !f.path.includes("sharedFiles") && !sourcePath.includes("sharedFiles")) {
			self.handleMoveFiles(e.dataTransfer.getData("filepath"),f.path)
		}

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
		e.dataTransfer.setData("filepath",f.path);
		e.dataTransfer.setData("type",f.type);
	    e.stopPropagation();
	}

// 	handleClick(e,f) {
// 	  	e.preventDefault()
// 	  	console.log(f)
// 	  	this.setState({...this.state, showPopupRename: !this.state.showPopupRename, fileToRename: f})
// }





	popUpRename() {
		const self = this
		var {currentFolder, fileToRename} = self.state
		return (
			
			<Modal show={this.state.showPopupRename} onHide={() => this.setState({showPopupRename: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Rename {fileToRename.name}</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<Form.Control id="formRename" type="text" placeholder={fileToRename.name} className="mr-sm-2" autoComplete="off"/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showPopupRename: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.handleRename(document.getElementById("formRename").value)}>
						Rename
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}



	handleRename(newName) {
		const self = this
		const {fileToRename, filesList} = self.state
		
		Object.keys(filesList).forEach(file => {
			if (file.includes(fileToRename.name)) {
				delete filesList[file]
			}
		})

		var f = fileToRename.path
		filesList[f.replace(fileToRename.name, newName)] = {expand: false, selected: false}
		
		var infos = {}
		infos["source"] = f 
		infos["newname"] = newName

		self.dcbiareactservice.renameFile(infos)
			.then(res => {
				self.updateDirectoryMap()
				self.setState({filesList: filesList, showPopupRename: false, fileToRename: null})
			})
			.catch(err => {
				console.log(err)
			})	
	}






	displayFiles(param) {
		var _ = require('underscore')
		const {filesList, selectMode} = this.state

		if(param !== null){

			if (_.isEmpty(param)) {return <React.Fragment> Empty folder </React.Fragment>}
			else {
			return (
				param.map(f => 
					

					
					<React.Fragment>


				{/*Card DragNDrop*/}
				<Card 
					id={f.name}
					style={{backgroundColor: "#D7D8D9", borderColor: "#D7D8D9"}}
					onDrop={(e) => this.handleDrop(e,f)}
					onDragOver={(e) => this.handleDragOver(e)}
					onDragLeave={(e) => this.handleDragLeave(e)}
					onDragEnter={(e) => this.handleDragEnter(e)}
					>

{/*onContextMenu={(e) => this.handleClick(e,f)}*/}



				

						<Row>
						<Col>
				{/*add files now as we display them so we do operation on it: expand, inproject, etc*/}
					{this.updateFilesList(f)}
						
{/*						{f.type=='f' && this.state.projectMode && this.state.filesList[f.path].inProject ? <CheckSquare color='#FF0000' size="20" /> : null}
*/}
						
						
				
						{f.type=='d' ? 
							filesList[f.path].expand==false ? 
								<FolderPlus style={{color: "green", cursor:"pointer"}} onClick={() => this.testOnClickArrowDown(f)}/> 
								: <FolderMinus style={{color: "red", cursor:"pointer"}} onClick={() => this.testOnClickArrowDown(f)}/> 
							: <File style={{height: 15, color: "SteelBlue"}}/>
						} &nbsp;

					

						{f.type=='d' ? 
							f.name=='sharedFiles' ? 
								<Badge size="11" 
									   onClick={() => this.setState({currentFolder: './'+f.path})}
									   style={{backgroundColor: '#4f6185' ,cursor:'pointer'}}
									><text style={{color: "white"}}>{f.name}</text></Badge> 
								: <Badge pill
										 onClick={() => this.setState({currentFolder: './'+f.path})}
										 style={{cursor:'pointer', backgroundColor: '#9796b4'}}
										 draggable={!this.props.createtask}
										 onDrag={(e) => this.handleDrag(e)}
										 onDragStart={(e) => this.handleDragStart(e,f)}
									><text value={f} style={{color: "white"}}>{f.name}</text></Badge> 
							:  <i 		draggable={!this.props.createtask}
										 onDrag={(e) => this.handleDrag(e)}
										 onDragStart={(e) => this.handleDragStart(e,f)}
										style={{color: 'SteelBlue'}}>{f.name}</i>
						} 
						
						{!f.path.includes("sharedFiles") ? <Edit3 style={{color: "black", height: 15, cursor:"pointer"}} onClick={() => this.setState({fileToRename: f, showPopupRename: true})} /> : null}
						{f.type=='d' && !f.path.includes("sharedFiles") && !this.props.createtask ? <Share2 style={{color: "red", height: 15, cursor:"pointer"}} onClick={() => this.setState({dirToShare: f.path, showPopUpShare: true})} /> : null}
						{f.type=='d' && f.name!=="sharedFiles" && !this.props.createtask ? <Copy style={{color: "black", height: 15, cursor:"pointer"}} onClick={() => this.copyFiles(f.path)} /> : null}
						&nbsp;




						</Col>
						<Col md="auto">


						{f.name!=="myFiles" && f.name!=="sharedFiles" && !(f.path.includes("sharedFiles")&&f.type=='f') && selectMode==false
						? <Trash2 hidden={this.props.createtask} style={{color: "black", height: 15, cursor:"pointer"}} onClick={()=>this.setState({showDelete: true, fileToDelete: f})}/>
						: null}


						{(selectMode == true || this.props.createtask==true) && f.name!=='sharedFiles' ? 
						<input type="checkbox" checked={filesList[f.path].selected} onClick={() => this.addSelectedFiles(f)}/>						
						: null} 

						</Col>
						</Row>
				</Card>
						<Row>
						<Col md={{offset:"1"}}>
					{f.type=='d' && filesList[f.path].expand == true ? this.displayFiles(f.files):null}
						</Col>
						</Row>
					</React.Fragment>

				)
			)}
		}
	}




	expandFolder(f) {
		var filesList = this.state.filesList
		let bool = filesList[f.path].expand
		filesList[f.path].expand = !bool
		this.setState({filesList: filesList})
	}
	testOnClickArrowDown(f) {
		this.expandFolder(f)
	}

//   Object.values(users).forEach(value => {
	// // items.push(<Dropdown.Item eventKey={value["name"]}>{value["name"]}</Dropdown.Item>)
//  		items.push(
//  			<li>
//  				{value["email"]}
//  				&nbsp;
//  				<input type="checkbox" onChange={() => selectedUsers[value["email"]] = !selectedUsers[value["email"]]}/>
//  			</li>)
//  		selectedUsers[value["email"]] = false
//  	})






	// 		<Container>
	// 				{projectFiles.map(f => 

	// 					<Row>
	// 						&nbsp; <X style={{color: "red", cursor: "pointer"}} onClick={() => this.addSelectedFiles({path: f.name})}/>
	// 						&nbsp; <i style={{"word-break": "break-all"}}>{f.name}</i>
	// 					</Row>
	// 				)}			
	
	// 		</Container>	
			
	// 	)
	// }							



	goToFile(param) {
		var {filesList} = this.state
		var arrayPath = param.split("/")
		var l = arrayPath.length
		var Rarraypath = arrayPath.reverse()

		for (var ind in arrayPath) {
			this.updateFilesList({path: param})

			filesList[param].expand = true
			param = param.slice(0,param.indexOf("/"+Rarraypath[ind]))

		}
		this.setState({filesList: filesList})

	}





 

  	copyFiles(target) {
  		const self = this
  		const {filesList} = self.state
  		var filesToCopy = []

  		Object.keys(filesList).forEach(key => {
  			if (filesList[key].selected == true) {
  				filesToCopy.push(key)
  			}
  		})

  		if (filesToCopy.length !== 0) {
  			var infos = {}
  			return Promise.map(filesToCopy, (file)=>{
  				infos["source"] = file
  				infos["target"] = target
  				return self.dcbiareactservice.copyFiles(infos)
  				.then(res => {
  					self.updateDirectoryMap()
  				})
  			}, {concurrency:1}
			)
			// .then((response) => {
			// 	self.updateDirectoryMap()
			// })
  		}
  	}


	downloadFiles() {
		const self = this

		var filesToDownload = []
		var files = this.state.filesList


    	Object.keys(files).forEach(key => {
    		if (files[key].selected == true) {
    			filesToDownload.push(key)
    		}
    	})

		if (filesToDownload.length==1) {
			var value = 50
			self.setState({...self.state, downloadValue: value, showDownloadBar: true})
		} else {
			var value = 100/filesToDownload.length
			self.setState({showDownloadBar: true})
		}



    	if (filesToDownload.length !== 0) {

			var name;
			return Promise.map(filesToDownload, (file)=>{

				return self.dcbiareactservice.downloadFiles(file)
				.then((response) => {

					name = file.split('/').pop()
					if (name.split('.').length <= 1) {
						name = name + ".zip"
					}

			        var pom = document.createElement('a');
			        pom.setAttribute('href', window.URL.createObjectURL(new Blob([response.data])));
			        pom.setAttribute('download', name);

			        pom.dataset.downloadurl = ['application/octet-stream', pom.download, pom.href].join(':');

			        document.body.appendChild(pom);
			        pom.click();
			    })
			    .then(()=>{
						self.setState({downloadValue: self.state.downloadValue+value})
				})	

			})
			.then(()=>{
				self.setState({downloadValue: 0, showDownloadBar: false})
			})

		}

				// console.log(file.split('.').pop())
				// return self.dcbiareactservice.downloadFiles(file)
				// .then((res) => {


				// 	// zip.file(file, res.data)
				// 	// console.log(zip)

				// 	var data = window.URL.createObjectURL(new Blob([res.data]));

				//     var link = document.createElement("a");
				//     link.download = file;
				//     link.href = data;
				//     link.click();

				// })
			
	}




	// popUpDrop() {
	// 	return (
	// 		<Modal show={this.state.showDragNDrop} onHide={() => this.setState({showDragNDrop: false, fileToUpload: ""})}>
	// 			<Modal.Header closeButton>
	// 				<Modal.Title>Upload zipfile</Modal.Title>  
	// 			</Modal.Header>

	// 			<Modal.Body>
	// 				Confirm upload - <strong>{this.state.fileToUpload.name}</strong> in directory <strong>dirname</strong>
	// 			</Modal.Body>
	// 			<Modal.Footer>
	// 				<Button variant="danger" onClick={() => this.setState({showDragNDrop: false, fileToUpload: ""})} >
	// 					Cancel
	// 				</Button>
	// 				<Button variant="success" onClick={() => this.handleUpload()}>
	// 					Upload
	// 				</Button>
	// 			</Modal.Footer>
	// 		</Modal>
	// 	)
	// }



// const iterate = (obj) => {
//     Object.keys(obj).forEach(key => {

//     console.log(`key: ${key}, value: ${obj[key]}`)

//     if (typeof obj[key] === 'object') {
//             iterate(obj[key])
//         }
//     })
// }
// 





	handleCreateFolder(folderName) {
		const self = this
		const {currentFolder} = this.state

		if (folderName){

			document.getElementById("formFolderName").value = ""

			var newfolder = currentFolder + '%2F' + folderName
			newfolder = newfolder.split('/').join('%2F')

			this.dcbiareactservice.createFolder(newfolder)
			.then(res => { 
				
				// error in creation
				if (!res.data) {
					this.setState({showErrorCreateFolder: true, showCreateFolder: false})
				} else {

					this.updateDirectoryMap()
					this.setState({showCreateFolder: false})
				}
			})
		}	

	}


	popUpError() {
		return (
			<Modal show={this.state.showErrorCreateFolder} onHide={() => this.setState({showErrorCreateFolder: false})}> 
				<Modal.Header closeButton>
					<Modal.Title>Error</Modal.Title>  
				</Modal.Header>

				<Modal.Body><text>
				<Col>
					<Row>1. Wrong path to create</Row> 
					<Row> &nbsp; or </Row>
					<Row>2. folder already exist please change folder name</Row>
					<Row> &nbsp; or </Row>
					<Row>3. wrong character in name</Row>
				</Col>
				</text></Modal.Body>
			</Modal>

				)
	}

	popUpCreateFolder() {
		const self = this
		var {currentFolder} = self.state
		return (
			<Modal show={this.state.showCreateFolder} onHide={() => this.setState({showCreateFolder: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Create folder</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<Form.Label> create at location <i>{currentFolder}</i></Form.Label>
					<Form.Control id="formFolderName" type="text" placeholder="folder name" className="mr-sm-2" autoComplete="off"/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showCreateFolder: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.handleCreateFolder(document.getElementById("formFolderName").value)}>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}



	// shareFilesGroup() {
	// 	var users = this.props.users
	// 	var items = []

 //    	Object.values(users).forEach(value => {
	// 		items.push(<Dropdown.Item eventKey={value["name"]}>{value["name"]}</Dropdown.Item>)
 //    	})
		
	// 	return (
	// 		<ButtonGroup>
	// 		<Button size="sm" variant="outline-danger" onClick={() => this.handleShareFiles()}>share files to {this.state.usersToShare}</Button>
	// 		<DropdownButton id="dropdownShare" size="sm" variant="danger" value onSelect={(e) => this.setState({usersToShare: e})} title="Users">
	// 			{items}
	// 		</DropdownButton>
	// 		</ButtonGroup>
	// 	)
	// }

	handleShareFiles(f, users) {
		const self = this

		var infos = {}
    	Object.keys(users).forEach(key => {
    		if (users[key]==false) {
    			delete users[key]
    		}
    	})

		infos["users"] = Object.keys(users)
		infos["directory"] = f

		self.dcbiareactservice.shareFiles(infos)
		.then(response => { 
			this.setState({showPopUpShare: false, dirToShare: null})			
		})


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
			console.log(err.response)
		});
	}
	
	popUpMoveFiles() {
		return (
			<Modal show={this.state.showMove} onHide={() => this.setState({showMove: false})}>
				<Modal.Header closeButton>
					<Modal.Title>move files</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					Confirm move files - <strong>files</strong> to <strong>{this.state.currentFolder}</strong>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showMove: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.handleMoveFiles()}>
						Move
					</Button>
				</Modal.Footer>
			</Modal>
	  	)
	}



	cleanSelecteFiles() {
		var {filesList} = this.state

    	Object.values(filesList).forEach(value => {
    		value["selected"] = false
    	})
    	this.setState({filesList: filesList, selected: false})

	}




	popUpShare() {
		var string = this.state.dirToShare.split("").reverse().join("")
		var ind = string.indexOf('/')
		var dir = string.slice(0,ind).split("").reverse().join("")

		var users = this.props.users
		var items = []
    	var selectedUsers = {}

    	Object.values(users).forEach(value => {
			// items.push(<Dropdown.Item eventKey={value["name"]}>{value["name"]}</Dropdown.Item>)
    		items.push(
    			<li>
    				{value["email"]}
    				&nbsp;
    				<input type="checkbox" onChange={() => selectedUsers[value["email"]] = !selectedUsers[value["email"]]}/>
    			</li>)
    		selectedUsers[value["email"]] = false
    	})


		return (
			<Modal show={this.state.showPopUpShare} onHide={() => this.setState({showPopUpShare: false})}>
				<Modal.Header closeButton>
					<Modal.Title> 					
						Share folder <i style={{color: 'SteelBlue'}}>{dir}</i>
					</Modal.Title>  
				</Modal.Header>
				<Modal.Body>
				{items}
				</Modal.Body>
				<Modal.Footer>

				<Button variant="outline-danger" onClick={() => this.handleShareFiles('./'+this.state.dirToShare, selectedUsers)}> Share </Button>
				</Modal.Footer>
			</Modal>
		)
	}




	popUpImportProject() {
		const {projectFilesList} = this.state

		return (
			<Modal show={this.state.showImportProject} size="xl" onHide={() => this.setState({showImportProject: false})}>
				<Modal.Header closeButton>
					<Modal.Title> 
						Task					
					</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					{projectFilesList.length!==0 ? this.displaySelectedFiles() : null}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showImportProject: false})} >
						Cancel
					</Button>
					<Button variant="success" disabled onClick={() => console.log("project")}>
						Import
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}



	editrow(e){
		const self = this
		const {projectFilesList} = self.state

		const id = e.target.id
		const row = id.split('_')[1]
		console.log(self.state.projectFilesList[row])
	}

	editParamName(header){
		console.log("change value for : ", header)
	}	

	editparam(e){
		const self = this
		const {projectFilesList} = self.state
		const id = e.target.id
		const row = id.split('_')[0]
		const col = id.split('_')[1]

		const h = Object.keys(projectFilesList[0])[col]

		projectFilesList[row][h] = e.target.value
		self.setState({projectFilesList: projectFilesList})
	}


	addParam(){
		const self = this
		const {projectFilesList} = self.state

		Object.keys(projectFilesList).forEach(id => {
			console.log(id)
			projectFilesList[id][document.getElementById('entryname').value] = document.getElementById('defaultvalue').value
		})
		document.getElementById('defaultvalue').value = ''
		document.getElementById('entryname').value = ''
		self.setState({projectFilesList: projectFilesList})
	} 

	searchExp() {
		const self = this
		const {projectFilesList} = self.state
		const search = new RegExp(document.getElementById('searchPattern').value)
		const newParam = document.getElementById('newParam').value
		const newParamValue = document.getElementById('newParamValue').value
		console.log(search)

		if (document.getElementById('searchPattern').value) {
			
			var filesAlreadyIn = []
			Object.keys(projectFilesList).forEach(key => {
				filesAlreadyIn.push(projectFilesList[key].name)
			})

			var patients = self.getTree(projectFilesList[0].name)
			patients.forEach(patient => {
				patient.files.forEach(file => {
					
					if (filesAlreadyIn.includes(file.name)) {
						Object.keys(projectFilesList).forEach(key => {
							if (projectFilesList[key].name == file.name) {
								if (search.test(file.name)) {
									projectFilesList[key][newParam] = newParamValue
								} else {
									projectFilesList[key][newParam] = ""
								}
							}
						})
					} else {
						
						var data = Object.assign({}, projectFilesList[0])
						data.name = file.name

						if (search.test(file.name)) {	
							data[newParam] = newParamValue
						} else {
							data[newParam] = ""
						}
						projectFilesList.push(data) 

					}			
				})
			})
			projectFilesList[0][newParam] = ""
			self.setState({projectFilesList: projectFilesList})
		}
	}

	displaySelectedFiles() {		
		const self = this
		var {projectFilesList} = self.state

		var headers = []
		Object.keys(projectFilesList[0]).forEach(header => {
			headers.push(
				<th>
					<Edit2 id={header} style={{height: 15, cursor: 'pointer'}} onClick={() => this.editParamName(header)}/>
					{header}
				</th>
			)
		})

		var projectList = []
		var line = []
		var i = 0
		var j = 0
		Object.values(projectFilesList).forEach(fileline => { 
			line = []
			j = 0
			Object.values(fileline).forEach(param => {
				line.push(
					<td> 
					<Col>
						{Object.keys(projectFilesList[0])[j]=='name' ? <Row>{param}</Row> :
						<Row><input id={i+"_"+j} type="text" placeholder={param} onChange={(e) => this.editparam(e)}/></Row>}
					</Col>
					</td>
				)
				j = j + 1
			})
			projectList.push(
			<tr id={"row"+i} onClick={(e) => this.editrow(e)}>
				{line}
			</tr>
			)
			i = i + 1
		})

		return (
			<React.Fragment>
			<Container>
			<Row>
			<Col>
					<Button size="sm" variant="outline-primary" onClick={() => this.addParam()}> add for all</Button>
					<FormControl size="sm" id="entryname" placeholder="parameter" type="text" autoComplete="off"/>
					<FormControl size="sm" id="defaultvalue" placeholder="default value" type="text" autoComplete="off"/>
			</Col>
			<Col>
					<Button size="sm" variant="outline-primary" onClick={() => this.searchExp()}> add </Button>
					<FormControl size="sm" id="searchPattern" placeholder="pattern" type="text" autoComplete="off"/>
					<FormControl size="sm" id="newParam" placeholder="parameter" type="text" autoComplete="off"/>
					<FormControl size="sm" id="newParamValue" placeholder="default value" type="text" autoComplete="off"/>
			</Col>
			</Row>
			</Container>
{/*		<FormControl id="newparamvalue" autoComplete="off"/>
*/}			<Table responsive striped bordered hover>
				<thead>
					<tr>
					{headers}
					</tr>
				</thead>

				<tbody>
					{projectList}
				</tbody>	
			</Table>
{/*			<Button onClick={()=> console.log(self.state.projectFilesList)}/>
*/}			</React.Fragment>
		)
	}




	displayPath() {
		const self = this;
		const {currentFolder} = self.state;

		const path = currentFolder.split('/')

		return (		
			<Breadcrumb color="red">
					{path.map((f, index) => 
						<Breadcrumb.Item active={index==path.length-1} onClick={() => self.goToFolder(f)}>{f=='.' ? "..." : f}</Breadcrumb.Item>
					)}				
			</Breadcrumb>	

		)
	}

	goToFolder(folder) {
		const self = this
		const {currentFolder} = this.state

		var path = this.state.currentFolder.split('/')
		var lastFolder = path[path.length-1]
		
		while (folder !== lastFolder) {
			path.pop()
			lastFolder = path[path.length-1]

		} 
		this.setState({currentFolder: path.join('/')})		
	}

	// backFolder() {

	// 	var history = this.state.histTest
	// 	history.pop()

	// 	if (history.length == 0) {
	// 		this.setState({
	// 			histTest: [],
	// 			currentFolder: './root',
	// 		})
	// 	} else {

	// 		var string = this.state.currentFolder.split("").reverse().join("")
	// 		var ind = string.indexOf('/')
	// 		var currentFolder = string.slice(ind+1).split("").reverse().join("")

	// 		this.setState({
	// 			histTest: history,
	// 			currentFolder: currentFolder
	// 		})
	// 	}
	// }



	getFileManager(){
		const self = this;
		const {searchFiles, selectMode, selected, currentFolder, showUploadDragDrop} = self.state;

		return (
			<Card className="mt-3" style={{borderColor: "#1b273e", borderWidth: 3, borderRadius: 10}}>
				<Card.Header as="h5" className="info" style={{color: "#1b273e", backgroundColor: "#e0e4ec", borderRadius: 10}}>
					{self.props.createtask ? <text>Select files to create new task</text> : <text>Manage Files</text>}
				</Card.Header>
				<Navbar bg="dark" hidden={!self.props.createtask}>
				<Form inline>	
					<Button className="mr-3" variant="secondary" onClick={() => self.setState({showImportProject: true})}> Create task </Button>
					<Button className="mr-3" variant="secondary" onClick={() => self.cleanSelecteFiles()}> Clear all </Button>
{/*					<FormControl id="searchFilesForm" onChange={(e)=>{self.handleSearchFile(e)}} type="text" placeholder="file name" className="mr-sm-2" autoComplete="off"/>
*/}				</Form></Navbar>

				<Navbar bg="light" hidden={self.props.createtask}>
					<Nav className="mr-auto">
						<Form inline>
							<Button variant="outline-primary">Search files</Button>
							<FormControl id="searchFilesForm" onChange={(e)=>{self.handleSearchFile(e)}} type="text" placeholder="file name" className="mr-sm-2" autoComplete="off"/>

							<Overlay target={document.getElementById("searchFilesForm")} show={searchFiles} placement="right">
								{({placement,...props}) => (
									<div {...props}
										style={{
										backgroundColor: '#53A451',
										color: 'white',
										borderRadius: 7,
										padding: '10px 10px',
										...props.style,}}>
										{self.displaySearchedFiles()}
									</div>
								)}
							</Overlay>

							<Button variant="outline-primary" type="submit" onClick={() => self.setState({...self.state, showCreateFolder: true})}>
								create folder
							</Button>
						</Form>
					</Nav>



					<Row className="ml-3">

							<Button style={{backgroundColor: '#66B2FF', borderColor: "#66B2FF"}} type='radio' className="mr-sm-2" onClick={() => self.setState({...self.state, selectMode: !self.state.selectMode})}>Select files</Button>
					
						<Col>
							<OverlayTrigger overlay={<Tooltip>Download files</Tooltip>} placement={'top'}>
								<Button variant="success" onClick={() => self.downloadFiles()}>
									<Download style={{"color": "white"}}> </Download>
								</Button>
							</OverlayTrigger>
						</Col>
						<Col>
							<OverlayTrigger overlay={<Tooltip>Upload files</Tooltip>} placement={'top'}>
								<Button variant="primary" onClick={()=>{self.setState({...self.state, showUploadDragDrop: true})}}>
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
						<Alert variant="dark">
						{this.displayFiles(this.getTree())}
						</Alert>
					</Container>
{/*					<Row>
						<Col md='auto'>
							<OverlayTrigger overlay={<Tooltip>back to previous folder</Tooltip>}
											placement={'right'}>
							<ChevronLeft style={{cursor:'pointer'}} onClick={() => this.backFolder()}/>
							</OverlayTrigger>
						</Col>
						<Col md='auto'>
							<OverlayTrigger overlay={<Tooltip>back to main folder</Tooltip>}
											placement={'right'}>
							<ChevronsLeft style={{cursor:'pointer'}} onClick={() => this.setState({currentFolder: './root', histTest: []})}/> 
							</OverlayTrigger>
						</Col>
					</Row>
*/}			</Card.Body>
		</Card>);
	}


	// getUploadManager(){
	// 	const self = this;
	// 	const {loadingUpload, currentFolder} = self.state;
	// 	return (
	// 	<Container>
	// 		<Row>
	// 			<Col>
	// 				<Card className="mt-3 mb-3" style={{borderRadius: 10, borderColor: "#1b273e", borderWidth: 1}}> 
	// 					<Card.Header as="h5" className="info" style={{color: "#1b273e", backgroundColor: "#e0e4ec", borderRadius: 10}}>
	// 						Upload files
	// 					</Card.Header>
	// 					<Card.Body>
	// 						<Card.Title>
	// 							<input id="inputUpload" type="file" name="myZipFile"/>
	// 						</Card.Title>
	// 						<Card.Text>
	// 							{loadingUpload ? 
	// 								<Button variant="info" disabled>
	// 								<Spinner variant="dark" animation="border" size="sm" role="status"/>
	// 								<span className="sr-only">Loading...</span>
	// 								</Button> :
	// 								<Button variant="info" onClick={() => this.setState({showUpload: true})}> Upload </Button>}
	// 							&nbsp; <i>Upload in</i> <strong style={{color: "Navy"}}>{currentFolder}</strong>
	// 							</Card.Text>
	// 						</Card.Body>
	// 		  			</Card>
	//   			</Col>
	// 		</Row>
	// 		<Row>
	// 			<Col>
	// 				<Card className="mt-3 mb-3" style={{borderColor: "#1b273e", borderRadius: 10, borderWidth: 1}}>
	// 					<Card.Header as="h5" className="info" style={{color: "#1b273e", backgroundColor: "#e0e4ec", borderRadius: 10}}>
	// 						Selected files
	// 					</Card.Header>
	// 					<Card.Body>
	// 						{this.displaySelectedFiles()}
	// 					</Card.Body>
	// 				</Card>
	// 			</Col>
	// 		</Row>
	// 	</Container>)
	// }

///////////////////////////////////////////////////////////////////////////////////////

	render() {
		const self = this

		return(
			<Container fluid>

				{this.state.showDelete ? this.popUpDelete() : null}
				{this.state.showCreateFolder ? this.popUpCreateFolder() : null}
{/*				{this.state.showUpload ? this.popUpUpload() : null}*/}
				{this.state.showImportProject ? this.popUpImportProject() : null}
				{this.state.showPopUpShare ? this.popUpShare() : null}
				{this.state.showMove ? this.popUpMoveFiles() : null}
				{this.state.showErrorCreateFolder ? this.popUpError() : null}
				{this.state.showPopupRename ? this.popUpRename() : null}
				<Row>
					<Col>
						{self.getFileManager()}
					</Col>
{/*					<Col xs={4} md={4}>
						{self.getUploadManager()}
					</Col>
					<
*/}				</Row>
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

export default connect(mapStateToProps)(Filebrowser);
