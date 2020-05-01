import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar} from 'react-bootstrap'

import {Trash2, Folder, Plus, ArrowLeft, ArrowDown, ArrowRight, MinusSquare, PlusSquare, CheckSquare, XSquare, X, CornerDownLeft, FolderMinus, FolderPlus, MoreVertical, ChevronLeft, ChevronsLeft, Share2, Circle, Download, File, UploadCloud, Move, Edit3} from 'react-feather'

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

	getTree() {
	if (this.state.currentFolder == '.') { 
			return(this.state.treeMap)
		} else {
			var objToFind = this.state.currentFolder.slice(2)
			return this.findInMap(this.state.treeMap,objToFind)
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
		
		let uploadPath
		var value = 100/filelist.length

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

		// if (f.type=='d' && !bool==true) {
		// 	Object.keys(filesList).forEach(file => {
		// 		console.log(file)
	 //    		if (file.includes(f.path)) {
		// 			filesList[file].selected = true
	 //    		}
		// 	})

		// } else if (f.type=='d' && bool==true) {
		// 	Object.keys(filesList).forEach(file => {
		// 		console.log(file)
	 //    		if (file.includes(f.path)) {
		// 			filesList[file].selected = false
	 //    		}
		// 	})
		// }

		this.setState({filesList: filesList})

		// var somethingSelected = false
  //   	Object.keys(files).forEach(key => {
  //   		if (files[key].selected == true) {
  //   			somethingSelected = true
  //   		}
  //   	})
  //   	if (somethingSelected) {
  //   		this.setState({selected: true})
  //   	} else {
  //   		this.setState({selected: false})
  //   	}
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





// faire la reconnaissance debut du mot + reconnaissance sans majuscule
	handleSearchFile(e) {
		const self = this
		var search = e.target.value

		var bool = this.state.searchFiles
		if (search !== '') {this.setState({searchFiles: true})} 
			else {this.setState({searchFiles: false})}

		self.dcbiareactservice.searchFiles(search)
			.then(res => { 
				// console.log(res)
				self.setState({suggestions: res.data})
			})
	}
	

	displaySearchedFiles() {
		if (this.state.suggestions.length==0) {
			return <div>Nothing found</div>
		} else {
			return (	
				<Container>
					{this.state.suggestions.map(f => 
						<Row style={f.isDir ? {color: "white"} : {color: "black"}}>
							{/*<Plus onClick={() => this.addFileProject(f)}/>*/}
							<CornerDownLeft style={{cursor:'pointer'}} onClick={() => this.goToFile(f.path)}/>
							{f.filename} &nbsp;
							{f.isDir ? <Folder/> : <File/>}&nbsp;
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
		console.log(e.dataTransfer.getData("filepath"))
	    if (f.type=="d" && !f.path.includes("sharedFiles") && !e.dataTransfer.getData("filepath").includes("sharedPath")) {
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
					<Form.Control id="formRename" type="text" placeholder="folder name" className="mr-sm-2" autoComplete="off"/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showPopupRename: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.handleRename(document.getElementById("formRename").value)}>
						Create
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

		// f = f.split('/').join('%2F')
		// newName = newName.split('/').join('%2F')
		
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
						{f.type=='d' && !f.path.includes("sharedFiles") ? <Share2 style={{color: "red", height: 15, cursor:"pointer"}} onClick={() => this.setState({dirToShare: f.path, showPopUpShare: true})} /> : null}
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

	

	displaySelectedFiles() {
		var projectFiles = []
		var files = this.state.filesList
		for (var elem in files) {
			if (files[elem].selected == true) {
				projectFiles.push({name: elem})
			}
		}
		return (
			<Container>
					{projectFiles.map(f => 
						<Row>
							 {/*<CornerDownLeft style={{cursor:'pointer'}} onClick={() => this.goToFile(f.name)}/>*/}
							&nbsp; <X style={{color: "red", cursor: "pointer"}} onClick={() => this.addSelectedFiles({path: f.name})}/>
							&nbsp; <i style={{"word-break": "break-all"}}>{f.name}</i>
						</Row>
					)}			
	
			</Container>	
		)
	}							


	goToFile(param) {
		var files = this.state.filesList
		var path = param.split("/")
		var l = path.length
		var Rpath = path.reverse()

		for (var ind in path) {

			this.updateFilesList({path: param})

			if (ind == l-1) {
				this.setState({filesList: files})
			} else {
				files[param].expand = true
				param = param.slice(0,param.indexOf("/"+Rpath[ind]))
			}
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

    	if (filesToDownload.length !== 0) {

			var zip = new JSZip();
			return Promise.map(filesToDownload, (file)=>{


				return self.dcbiareactservice.downloadFiles(file)
				.then((res) => {


					// zip.file(file, res.data)
					// console.log(zip)

					var data = window.URL.createObjectURL(new Blob([res.data]));

				    var link = document.createElement("a");
				    link.download = file;
				    link.href = data;
				    link.click();

				})
				
			})

		}
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
		return (
			<Modal show={this.state.showImportProject} onHide={() => this.setState({showImportProject: false})}>
				<Modal.Header closeButton>
					<Modal.Title> 					
						<Dropdown>
						  <Dropdown.Toggle>
						    Choose Project
						  </Dropdown.Toggle>
						  <Dropdown.Menu>
						    <Dropdown.Item>Project name</Dropdown.Item>
						    <Dropdown.Item>Another project name</Dropdown.Item>
						    <Dropdown.Item>Again project</Dropdown.Item>
						  </Dropdown.Menu>
						</Dropdown>
					</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					<strong>Files list</strong>
					{this.displaySelectedFiles()}
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
					<Button className="mr-3" variant="secondary" onClick={() => self.setState({showImportProject: true})}> Create task </Button>
					<Button className="mr-3" variant="secondary" onClick={() => self.cleanSelecteFiles()}> Clear all </Button>
				</Navbar>
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
				        			<Dropzone onDrop={(acceptedFiles)=>{self.handleUpload(acceptedFiles).then(()=>{self.setState({...self.state, showUploadDragDrop: false, uploadValue: 0})})}}>
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
									<ProgressBar animated now={self.state.uploadValue} />
			        			</Modal.Body>
							</Modal>
						</Col>
						<Col>
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
