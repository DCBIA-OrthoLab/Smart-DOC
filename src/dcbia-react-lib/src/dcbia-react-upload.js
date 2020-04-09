import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav} from 'react-bootstrap'

import {Trash2, Folder, Plus, ArrowLeft, ArrowDown, ArrowRight, MinusSquare, PlusSquare, CheckSquare, XSquare, X, CornerDownLeft, FolderMinus, FolderPlus, MoreVertical, ChevronLeft, ChevronsLeft, Share2, Circle} from 'react-feather'

import DcbiaReactService from './dcbia-react-service'


import {JWTAuth, JWTAuthInterceptor, JWTAuthProfile, JWTAuthService, JWTAuthUsers} from 'react-hapi-jwt-auth';


class Upload extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//things sure to use
			fileToUpload: null,
			uploadPath: null,
			treeMap: null,	
			filesList: {},
			loadingUpload: false,
			loadingDownload: false,


			searchFiles: false,

			// for expand folder
			// openFolder: false,
			currentFolder: this.props.user ? './data/'+this.props.user["email"] : null,

			// historyMap: [],
			histTest: [],

			// pop up
			showCreateFolder: false,
			showUpload: false,
			showImportProject: false,
			showMove: false,
			showErrorCreateFolder: false,

			projectMode: false,

			testvalue: "OUI",
			// for delete management (PopUp)
			showDelete: false,
			fileToDelete: "",


			dirToShare: null,
			showPopUpShare: false,

			downloadMode: false,
			// for DragNDrop management (PopUp)
			// showDragNDrop: false,
			// .. . .. use fileToUpload .. . .. 

			// for search files
			suggestions: []




			// things not sure to use there
			// currentFolder: "./data/",
			
			// checkboxProject: false,
			


			}
		this.updateDirectoryMap = this.updateDirectoryMap.bind(this)

	}




// one get Tree for all cases (displayfiles, go back, etc)
	getTree() {
		console.log("-------GET TREE-------")
		console.log(this.state.histTest)
		if (this.state.histTest.length == 0) { 
			return(this.state.treeMap)
		} else {
			var objToFind = this.state.histTest[this.state.histTest.length-1]
			return this.findInMap(this.state.treeMap,objToFind)
		}
	}
	// iterate to find element in obj
	

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

// 	var tree = iterate(this.state.treeMap)
// 	console.log("TREE")
// 	console.log(tree)
// 	return tree
// }




		// -------------- request component, current files and map -------------- //
	componentDidMount() {
		const self = this

		this.dcbiareactservice = new DcbiaReactService();
		this.dcbiareactservice.setHttp(this.props.http);	

		self.updateDirectoryMap()
	

	}





		// --------------  Choose and Upload file -------------- //

	handleInput(e) {
		var formData = new FormData()
		formData.append("zipFile", e.target.files[0])
		// formData.append("path",this.state.currentFolder)
		// formData.append("user",this.props.user["name"])
	    this.setState({
			fileToUpload: formData,
		})
	}

	handleUpload() {
		const self = this
		let data = this.state.fileToUpload

		if(data) {
			console.log("uploading file")

			data.append("path",this.state.currentFolder)
			
			this.setState({loadingUpload: true})
			
			self.dcbiareactservice.uploadZipFile(data)
			.then(response => { 
				console.log(response)
				this.setState({fileToUpload: null})

				setTimeout(() => {
				self.updateDirectoryMap()
				this.setState({loadingUpload: false, showUpload: false})
				}, 4000)

				document.getElementById("inputUpload").value = ""
				
			})

			.catch(error => {
			    console.log(error.response)
			});

			// 
			// self.update`FilesList({path: self.state.fileToUpload.get("path")+"/"+self.state.fileToUpload.get("zipFile").name})
		}
	}



	popUpUpload() {
		if (!this.state.fileToUpload) {return}
		return (
			<Modal show={this.state.showUpload} onHide={() => this.setState({showUpload: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Upload file</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					Confirm Uploading - <strong>{document.getElementById("inputUpload").value}</strong> in <strong>{this.state.currentFolder}</strong>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showUpload: false})} >
						Cancel
					</Button>
					{this.state.loadingUpload ? 
					<Button variant="info" disabled>
					<Spinner variant="dark" animation="border" size="sm" role="status"/>
					<span className="sr-only">Loading...</span>
					</Button> :
					<Button variant="info" onClick={() => this.handleUpload()}> Upload </Button>}

				</Modal.Footer>
			</Modal>
		)
	}





	


		// ---------- update files and map ---------- //

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

		// function called operations on file, to be sure it is in file list before
	updateFilesList(f) {	
		
		var data = {expand: false, selected: false}
		var filesList = this.state.filesList

		if (Object.keys(filesList).includes(f.path)) {
			// console.log("--- data already in list ---")
			return true
		} else {
			filesList[f.path] = data
			this.setState({filesList: filesList})
			return false
		}

	}


	testClick(e) {


		console.log("----TEST CLICK----")
		console.log(this.props.users)
		// this.updateDirectoryMap()
		// const jwtauth = new JWTAuthService();

	 //    jwtauth.getUsers()
	 //    .then(function(users){
	 //    	console.log("users")
	 //    	console.log(users)
	 //    })

	}

	iterateMap(obj) {
		
		    Object.keys(obj).forEach(key => {
		    	if (obj[key].type === "d") {
		    		console.log(obj[key])
			    	if (obj[key].path == "data/Archive") {

			    	} else {
			    		this.iterateMap(obj[key].files)
			    	}
	    		
		    	}

		    })
		}	

	addSelectedFiles(f) {
		var files = this.state.filesList
		var bool = files[f.path].selected
		files[f.path].selected = !bool
		this.setState({filesList: files})
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
					Confirm delete file - <strong>{this.state.fileToDelete.name}</strong> located at <strong>{this.state.fileToDelete.path}</strong>
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
			console.log(res)
			
			self.updateDirectoryMap()		

		})
	}





// faire la reconnaissance debut du mot + reconnaissance sans majuscule
	handleSearchFile(e) {
		const self = this
		var search = e.target.value
		var user = this.props.user["email"]

		var data = search + '&' + user
		// console.log("SEARCHED")
		// console.log(search)

		var bool = this.state.searchFiles
		if (search !== '') {this.setState({searchFiles: true})} 
			else {this.setState({searchFiles: false})}

		self.dcbiareactservice.searchFiles(data)
			.then(res => { 
				console.log(res)
				self.setState({suggestions: res.data})
			})
	}
	

	displaySearchedFiles() {
		if (this.state.suggestions.length==0) {
			return <div>No file found</div>
		} else {
			return (	
				<Container>
					{this.state.suggestions.map(f => 
						<Row>
							{/*<Plus onClick={() => this.addFileProject(f)}/>*/}
							<CornerDownLeft style={{cursor:'pointer'}} onClick={() => this.goToFile(f.path)}/>
							{f.filename} &nbsp;
							<i>{f.path}</i>
						</Row>
					)}
				</Container>
			)
		}
	}





	displayFiles(param) {
		var _ = require('underscore')

		if(param !== null){

			if (_.isEmpty(param)) {return <React.Fragment> Empty folder </React.Fragment>}
			else {
			return (
				param.map(f => 
					

					
					<React.Fragment>
						<Row>
						<Col>

				{/*add files now as we display them so we do operation on it: expand, inproject, etc*/}
					{this.updateFilesList(f)}
						
{/*						{f.type=='f' && this.state.projectMode && this.state.filesList[f.path].inProject ? <CheckSquare color='#FF0000' size="20" /> : null}
*/}
						{console.log(f)}
						
						{f.type=='d' ? 
							this.state.filesList[f.path].expand==false ? 
								<FolderPlus style={{color: "green", cursor:"pointer"}} onClick={() => this.testOnClickArrowDown(f)}/> 
								: <FolderMinus style={{color: "red", cursor:"pointer"}} onClick={() => this.testOnClickArrowDown(f)}/> 
							: null
						} &nbsp;

						
						{f.type=='d' ? <Badge pill variant="info" color="red"
										// onDrop={(e) => this.handleDrop(e,f)}
										// onDragOver={(e) => this.handleDragOver(e)}
										// onDragLeave={(e) => this.handleDragLeave(e)}
										// onDragEnter={(e) => this.handleDragEnter(e)}
										onClick={() => this.openFolder(f)}
										style={{cursor:'pointer'}}
										>{f.name}</Badge> 
						:  <i style={{color: 'SteelBlue'}}>{f.name}</i> 
						} 
						
						{f.type=='d' && f.name!=="myFiles" && !f.path.includes("sharedFiles") ? <Share2 style={{color: "#CC444B", height: 15, cursor:"pointer"}} onClick={() => this.setState({dirToShare: f.path, showPopUpShare: true})} /> : null}
						&nbsp;




						</Col>
						<Col md="auto">
{/*						{f.type=='f' && this.state.projectMode==true ?
							<OverlayTrigger overlay={<Tooltip>Add {f.name} to project</Tooltip>}>
							<input style={{'background-color': 'red'}} type="checkbox" checked={this.state.filesList[f.path].selected} onClick={() => this.addSelectedFiles(f)}/>								
        					</OverlayTrigger>
							: null 
						}*/}

						{this.state.projectMode || this.state.downloadMode || f.path.includes("sharedFiles") || f.name=="myFiles" ? null :
						<Trash2 style={{color: "black", height: 15, cursor:"pointer"}} onClick={()=>this.setState({showDelete: true, fileToDelete: f})}/>}
						
						{f.type=='f' && (this.state.downloadMode == true || this.state.projectMode == true) ? 
						<input type="checkbox" checked={this.state.filesList[f.path].selected} onClick={() => this.addSelectedFiles(f)}/>						
						: null} 

						{f.type=='d' && f.path.includes("sharedFiles") && f.name.includes(this.props.user["email"]) && f.name!=="sharedFiles"? 
						<Trash2 style={{color: "black", height: 15, cursor:"pointer"}} onClick={()=>this.setState({showDelete: true, fileToDelete: f})}/>
						: null}
						</Col>
						</Row>
						<Row>

						<Col md={{offset:"1"}}>
					{f.type=='d' && this.state.filesList[f.path].expand == true ? this.displayFiles(f.files):null}
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

	

	displayProjectFiles() {
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
							&nbsp; <i>{f.name}</i>
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

		// this.highlightPath(param)

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



		// need to remove color after use / after some time
	// highlightPath(path) {

	// 	this.updateFilesList({path: path})

	// 	var files = this.state.filesList
	// 	var bool = files[path].highlight


	// 	files[path].highlight = true		
	// 	this.setState({filesList: files})
	// }

	openFolder(f) {
		// let historyMap = this.state.historyMap
		// historyMap.push(f.files)

		var list = this.state.histTest
		list.push(f.path)

		this.setState({
			histTest: list,
			currentFolder: "./"+f.path
		})


		// this.setState({
		// 	openFolder: true,
		// 	historyMap: historyMap,
		// 	currentFolder: "./"+f.path
		// })
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
			this.setState({loadingDownload: true})

			
			self.dcbiareactservice.downloadFiles(filesToDownload)
				.then(response => { 
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', 'files.zip'); 
					document.body.appendChild(link);
					link.click();

					self.setState({loadingDownload: false})
				})
				.catch(error => {
				    console.log(error.response)
				});
		}
	}

	wut() {

		// this.setState({uploadPath: e.target.values})
		console.log("Output Here")

		console.log("tree map")
		console.log(this.state.treeMap)
		console.log("files list")
		console.log(this.state.filesList)
		console.log("history map")
		console.log(this.state.historyMap)

		// console.log("-----TEST-----")
		// console.log(this.state.filesList)
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





	handleCreateFolder(folderName, path = this.state.currentFolder) {
		// const self = this

		if (folderName){

			document.getElementById("formFolderName").value = ""
 			console.log("create folder in path")

			var formData = new FormData()
			formData.append("name", folderName)
			formData.append("path", path)

			this.dcbiareactservice.createFolder(formData)
			.then(res => { 
				console.log("RESPONSERTGHJ")
				
				// error in creation
				if (!res.data) {
					this.setState({showErrorCreateFolder: true})
				}

				this.updateDirectoryMap()

				this.setState({showCreateFolder: false})
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
		return (
			<Modal show={this.state.showCreateFolder} onHide={() => this.setState({showCreateFolder: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Create folder</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
					Confirm creating folder - <strong>{document.getElementById("formFolderName").value}</strong> at location <strong>{this.state.currentFolder}</strong>
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
			console.log(response)

			this.setState({showPopUpShare: false, dirToShare: null})			
		})


	}

	handleMoveFiles() {
		const self = this

		var files = this.state.filesList
		var filesToMove = []
		var directory = this.state.currentFolder

    	Object.keys(files).forEach(key => {
    		if (files[key].selected == true) {
    			filesToMove.push(key)
    		}
    	})

		var infos = {}

    	infos["directory"] = directory 
		infos["files"] = filesToMove


		self.dcbiareactservice.moveFiles(infos)
		.then(response => { 
			console.log(response)

			self.cleanSelecteFiles()
			self.setState({showMove: false})

			self.updateDirectoryMap()
		})
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



	// function to unselect all files
	cleanSelecteFiles() {
		var files = this.state.filesList

    	Object.values(files).forEach(value => {
    		value["selected"] = false
    	})
    	this.setState({filesList: files})

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

				<Button variant="outline-danger" onClick={() => this.handleShareFiles(this.state.dirToShare, selectedUsers)}> Share </Button>
				</Modal.Footer>
			</Modal>
		)
	}

	backFolder() {

		var history = this.state.histTest
		history.pop()

		if (history.length == 0) {
			this.setState({
				histTest: [],
				currentFolder: './data/'+this.props.user["email"],
			})
		} else {

			var string = this.state.currentFolder.split("").reverse().join("")
			var ind = string.indexOf('/')
			var currentFolder = string.slice(ind+1).split("").reverse().join("")

			this.setState({
				histTest: history,
				currentFolder: currentFolder
			})
		}
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
					{this.displayProjectFiles()}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showImportProject: false})} >
						Cancel
					</Button>
					<Button variant="success" disabled onClick={() => console.log("oui")}>
						Import
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}





		// var history = this.state.historyMap
		// history.pop()

		// if (history.length == 0) {
		// 	this.setState({
		// 		openFolder: false,
		// 		historyMap: [],
		// 		currentFolder: './data',
		// 	})
		// } else {

		// 	var string = this.state.currentFolder.split("").reverse().join("")
		// 	var ind = string.indexOf('/')
		// 	var currentFolder = string.slice(ind+1).split("").reverse().join("")

		// 	this.setState({
		// 		historyMap: history,
		// 		currentFolder: currentFolder
		// 	})
		// }
 


// ex for delete : 
// delete a file somewhere : parcours treeMap / historyMap
// -> delete file on every position it needs
// loop in map wth function google
// 
// 
// 
// 


///////////////////////////////////////////////////////////////////////////////////////
	// handleDrop(e,f = null) {
	// 	const self = this

	//     e.preventDefault();
	//     e.stopPropagation();

	// 	var formData = new FormData()
	// 	formData.append("zipFile", e.dataTransfer.files[0])
	// 	formData.append("path",f.path)

	// 	// self.dcbiareactservice.uploadFile(formData)
	// 	// .then(res => { 
	// 	// 	// self.updateDirectoryMap()
	// 	// 	// console.log("----call file list-----")
	// 	// 	// self.updateFilesList({path: f.path})

	// 	// })

	// 	this.setState({showDragNDrop: true, fileToUpload: f})
	// }


	// handleDragOver(e) {
	//     e.preventDefault();
	//     e.stopPropagation();
	// }

	// handleDragLeave(e) {
	//     e.preventDefault();
	//     e.stopPropagation();
	// }

	// handleDragEnter(e) {
	//     e.preventDefault();
	//     e.stopPropagation();
	// }
///////////////////////////////////////////////////////////////////////////////////////

	render() {
		const self = this

		return(
			<Card style={{'margin-top':"1%",'margin-left':"1%",'margin-right':"1%"}}>
				{this.state.showDelete ? this.popUpDelete() : null}
				{this.state.showCreateFolder ? this.popUpCreateFolder() : null}
				{this.state.showUpload ? this.popUpUpload() : null}
				{this.state.showImportProject ? this.popUpImportProject() : null}
				{this.state.showPopUpShare ? this.popUpShare() : null}
				{this.state.showMove ? this.popUpMoveFiles() : null}
				{this.state.showErrorCreateFolder ? this.popUpError() : null}
{/*				{this.state.showDragNDrop ? this.popUpDrop() : null}
*/}


{/* Card : display all files */}
{/*///////////////////////////////////////////////*/}
	  			<Row>
	  			<Col style={{"max-width": '50%'}}>
				<Card border='primary' style={{borderRadius: 10}}>

				<Card.Header>
					<Form inline>
						<Button variant="outline-primary">Search files</Button>
						<FormControl id="searchFilesForm" onChange={this.handleSearchFile.bind(this)} type="text" placeholder="file name" className="mr-sm-2" autoComplete="off"/>

						<Overlay target={document.getElementById("searchFilesForm")} show={this.state.searchFiles} placement="bottom">
							{({placement,...props}) => (
								<div {...props}
									style={{
									backgroundColor: '#53A451',
									color: 'white',
									borderRadius: 7,
									padding: '10px 10px',
									...props.style,}}>
									{this.displaySearchedFiles()}
								</div>
							)}
						</Overlay>

						<Button variant="outline-primary" type="submit" onClick={() => this.setState({showCreateFolder: true})}>
							create folder
						</Button>
						<FormControl id="formFolderName" type="text" placeholder="Enter folder name" className="mr-sm-2" />

					</Form>
				</Card.Header>

				<Card.Body>

					<Container>
{/*							{this.state.openFolder ? this.displayFiles(this.state.historyMap[this.state.historyMap.length - 1]) : this.displayFiles(this.state.treeMap)}
*/}					<Row>
					<Col>
					<Alert variant="dark"> 
						<p><strong>Manage files</strong></p>
						<strong style={{"word-break": "break-all", "color":"#4AA0B5"}}> {this.state.currentFolder}</strong>  
					</Alert>
					</Col>
					<Col md="auto">
					<Alert variant="primary">
						<p><strong style={{color: 'black'}}>Manage project</strong></p> &nbsp;
						<OverlayTrigger overlay={<Tooltip> Project files selection</Tooltip>} placement={'top'}>
							{this.state.projectMode ?
							<Button variant='success' type='radio' className="mr-sm-2" onClick={() => this.setState({projectMode: false})}>Select files</Button>
							: <Button variant='primary' type='radio' className="mr-sm-2" onClick={() => this.setState({projectMode: true})}>Select files</Button>}
						</OverlayTrigger>
						<Button className="mr-sm-2" disabled={!this.state.projectMode} onClick={() => this.setState({showImportProject: true})}> Import files</Button>
					</Alert>
					</Col>
					</Row>
					<Alert variant="dark">
					{this.displayFiles(this.getTree())}
					</Alert>
					</Container>
					<Row><Col>
						{this.state.downloadMode ?
							<Button variant='warning' size="sm" type='radio' className="mr-sm-2" onClick={() => this.setState({downloadMode: false})}>Select files</Button>
							: <Button variant='primary' size="sm" type='radio' className="mr-sm-2" onClick={() => this.setState({downloadMode: true})}>Select files</Button>}
						
						{this.state.loadingDownload ? 							
							<Button variant="info" disabled>
							<Spinner variant="dark" animation="border" size="sm" role="status"/>
							<span className="sr-only">Loading...</span>
							</Button> :
							<Button variant="outline-primary" size="sm" placement="left" onClick={() => this.downloadFiles()}>Download</Button>}
					</Col>

					<Col>

{/*					<ButtonGroup>


					<Button size="sm" variant="outline-info">share files</Button>

					<DropdownButton id="salut" size="sm" variant="info" value onSelect={function(evt){console.log("selected")}} title="Users">
						

						<Dropdown.Item eventKey="put user here">user 1</Dropdown.Item>
						<Dropdown.Item eventKey="here too">this should</Dropdown.Item>
						<Dropdown.Item eventKey="here">get from props</Dropdown.Item>
					</DropdownButton>
					</ButtonGroup>
*/}


					</Col>
					<Col md='auto'>
						<OverlayTrigger overlay={<Tooltip>back to previous folder</Tooltip>}
										placement={'right'}>
						<ChevronLeft style={{cursor:'pointer'}} onClick={() => this.backFolder()}/>
						</OverlayTrigger>
					</Col>
					<Col md='auto'>
						<OverlayTrigger overlay={<Tooltip>back to main folder</Tooltip>}
										placement={'right'}>
						<ChevronsLeft style={{cursor:'pointer'}} onClick={() => this.setState({currentFolder: './data/'+this.props.user["email"], histTest: []})}/> 
						</OverlayTrigger>
					</Col></Row>
					<Row><Col>
						<Button variant="outline-primary" size="sm" className="mt-1" onClick={() => this.setState({showMove: true})}> move files to current folder </Button>
					</Col></Row>
				</Card.Body>
				</Card>
				</Col>
				
{/*///////////////////////////////////////////////*/}


{/* Card : manage upload/folders */}
{/*///////////////////////////////////////////////*/}
				<Col style={{"max-width": '50%'}}>
				<Row>
				<Col>
				<Card border='info' className="mb-3" style={{borderRadius: 10}}> 
				<Card.Header> Select and upload files </Card.Header>
				<Card.Body>
					<Card.Title>
						<input id="inputUpload" type="file" name="myZipFile" onChange={this.handleInput.bind(this)}/>
					</Card.Title>
					<Card.Text>
						{this.state.loadingUpload ? 
							<Button variant="info" disabled>
							<Spinner variant="dark" animation="border" size="sm" role="status"/>
							<span className="sr-only">Loading...</span>
							</Button> :
							<Button variant="info" onClick={() => this.setState({showUpload: true})}> Upload </Button>}
						&nbsp; <i>Upload in</i> <strong style={{color: "Navy"}}>{this.state.currentFolder}</strong>
						</Card.Text>
					</Card.Body>
	  			</Card>
	  			</Col>
	  			</Row>
		  	
					







{/*///////////////////////////////////////////////*/}


{/* Card : Project/Searched files */}

{/*///////////////////////////////////////////////*/}
					<Row>
{/*					{this.state.searchFiles == '' ? null :
					<Col>
					<Card bg="success" text="white" border="primary">
					<Card.Header> Searched Files </Card.Header>
					<Card.Body>
					{this.displaySearchedFiles()}
					</Card.Body>
					</Card>
					</Col>}
*/}
					<Col>
					<Card border="success" style={{borderRadius: 10}}>
					<Card.Header>Selected files</Card.Header>
					<Card.Body>
					{this.displayProjectFiles()}</Card.Body>
					</Card>
					</Col>

					</Row>
					<Button onClick = {()=>this.testClick()}> test fct </Button>
					<Button onClick = {()=>this.iterateMap(this.state.treeMap)}> tree map </Button>
				</Col>
				</Row>

					

			</Card>

// {/*///////////////////////////////////////////////*/}
// 				
		

		)
	}
}








const mapStateToProps = (state, ownProps) => {
  return {
    user: state.jwtAuthReducer.user,
    http: state.jwtAuthReducer.http,
  }
}

export default connect(mapStateToProps)(Upload);
