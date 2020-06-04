import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar, Collapse} from 'react-bootstrap'
import {Edit2, X, ChevronDown, HelpCircle} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'


const _ = require('underscore');
const Promise = require('bluebird');

// example 
// python script.py var1 --t1 scan.nii 
// python3 predict.py --surf scan.stl --out outputDirectory/output.vtk --numberOfSubdivisions 10

// save pattern

// how do u know in which line u put the new param 
// --> keep track of subfolder per pattern
// have a command per subfolder/pattern 


// file.substring(0, file.lastIndexOf('/')



// update saveEntries everytime commandList is updated (add param/delete flag/rename param)



class CreateTask extends Component {
	constructor(props) {
		super(props)

		this.state = {
			checkedFolder: [],
			files: [],
			folderList: [],
			createTask: true,

			filesOrder: true, // true = all, false = bypatient

			newFlag: {
				pattern : "",
				flag: ""
			},
			newParam: {
				flag: "",
				value: ""
			},

			showPopUpEditCol: false,
			flagToEdit: "",

			selectedScript: "none",
			commandScript : "no command selected",

			// instead of commandlines and table we use list of current commandlines (with pattern)
			commandList: {},
			commandLineList: [],

			saveEntries: [],

			showFiles: false,

			showSavePattern: false,
			savePattern: {
				name: "",
				description: ""
			},

			currentPattern: "",

			scriptsInfos: [],

			showAdvancedOptions: false,

			showInfosScript: false,

			manageScript: true
		}
		this.createTask = this.createTask.bind(this)
	}


	componentDidMount() {
		const self = this

		self.dcbiareactservice = new DcbiaReactService();
		self.dcbiareactservice.setHttp(self.props.http);
		self.getScriptInfos()
	}

	// createTask(files, checkedFolder) {
	// 	const self = this
	// 	var folderList = []

	// 	files.forEach(file => {
	// 		var folder_path = file.substring(0, file.lastIndexOf('/'))
	// 		if (!folderList.includes(folder_path)) {
	// 			folderList.push(folder_path)
	// 		}
	// 	})

	// 	self.setState({...self.state, files: files, checkedFolder: checkedFolder,folderList: folderList , createTask: !self.state.createTask})
	// }

	createTask(files, checkedFolder) {
		const self = this
		const {currentPattern} = self.state
		var folderList = []

		files.forEach(file => {
			var folder_path = file.substring(0, file.lastIndexOf('/'))
			if (!folderList.includes(folder_path)) {
				folderList.push(folder_path)
			}
		})

		self.setState({
			...self.state, 
			commandList: {},
			files: files, 
			checkedFolder: checkedFolder,
			folderList: folderList},
			() => self.useExistingPattern(currentPattern) 
		)
	}


	updateScript(scriptClicked) {
		const self = this
		const {commandList, scriptsInfos} = self.state
		var filesOrder

		switch(scriptClicked) {
			case "condyle":
				filesOrder = true
			break;

			case "teeth":
				filesOrder = false
			break;

			default:
				console.log("shouldn't be there !")
		}

		scriptsInfos.forEach(script => {
			if (script.taskname==scriptClicked) {
				self.setState({
					filesOrder: filesOrder,
					selectedScript: scriptClicked,
					commandScript: script.command,
					currentPattern: script.patterns[0]
				})
			}
		})

		// scriptsInfos.forEach(script => {
		// 	if (script.taskname==scriptClicked) {
		// 		self.setState({
		// 			filesOrder: filesOrder,
		// 			saveEntries: [],
		// 			selectedScript: scriptClicked,
		// 			commandScript: script.command,
		// 			commandList: {}}, 
		// 			() => self.useExistingPattern(script.patterns[0])
		// 		)
		// 	}
		// })	

	}

	manageTaskFiles() {
		const self = this
		const {createTask, files, newParam, newFlag, commandScript, commandList, selectedScript, checkedFolder, showFiles, saveEntries, filesSearch, scriptsInfos, manageScript, newPatternName, showInfosScript, showAdvancedOptions} = self.state
		
		var selectedFiles = []
		checkedFolder.forEach(elem => {
			selectedFiles.push(
				<i style={{"font-size": "15px"}}> {elem} , </i>
			)
		})

		

		var headers = [<th></th>]
		if (Object.values(commandList).length!==0 && Object.values(commandList)[0].length!==0) {
			var h = Object.values(commandList)[0]
			Object.keys(h).forEach(param => {
				headers.push(
					<th>
						<Edit2 style={{height: 15, cursor: 'pointer'}} onClick={() => this.setState({showPopUpEditCol: true, flagToEdit: param})}/>
						{param}
						<X style={{color: "red", height: 15, cursor: 'pointer'}} onClick={() => this.deleteFlag(param)}/>
					</th>
				)
			})
		}

		var items = []
		Object.keys(commandList).forEach(command => {
			var paramTable = []
			Object.keys(commandList[command]).forEach(key => {
				paramTable.push(
					<td><FormControl size="sm" value={commandList[command][key]} type="text" autoComplete="off" 
									onChange={(e) => {
									commandList[command][key]=e.target.value; 
									self.setState({...self.state, commandList: commandList})}}/>
					</td>
				)
			})
			items.push(
				<tr>
					<td style={{width: "15%"}}>
					<X style={{color: "red", height: 15, cursor: 'pointer'}} onClick={() => this.deleteRow(command)}/>
						{commandScript}
					</td>
					{paramTable}
				</tr>
			)
		})


		// var displaycmd = []
		// self.state.commandLineList.forEach(cmd => {
		// 	displaycmd.push(<li>{cmd}</li>)
		// })


		var patterns = []
		if (selectedScript!=="none") {
			scriptsInfos.forEach(script => {
				if (script.taskname==selectedScript) {
					script.patterns.forEach(pattern => {
						patterns.push(pattern)
					})	
				}
			})	
		} else {
			patterns = null
		}


		return (
			<React.Fragment>

{/*	<Button size="sm" onClick={()=>this.testFctUploadScript()}></Button>
	<Button size="sm" onClick={()=>console.log(self.state.files)}></Button>
	<Button size="sm" onClick={()=>console.log(self.state.checkedFolder)}></Button>
	<Button size="sm" onClick={()=>console.log(self.state.folderList)}></Button>*/}

			<Card>
			<Card.Header > 
				Manage task creation
					<Button style={{float: "right"}} variant="outline-success" size="sm" className="ml-2 mr-2" onClick={() => self.createCommandLine()}> Run ! </Button>
					
					<Form.Check style={{float: "right"}} type="checkbox" label="Advanced options" onChange={() => self.setState({showAdvancedOptions: !self.state.showAdvancedOptions})}/>
{/*					<Button style={{float: "right"}} variant="outline-danger" size="sm" className="ml-2 mr-2" onClick={() => self.setState({...self.state, createTask: false, files: [], commandList: {}, commandLineList: [], saveEntries: [], folderList: [], selectedScript: ""})}> Back to file selection </Button>
*/}			

			</Card.Header>
			<Card.Body>
			<Row>

				<Col sm="7">	
				<Card variant="success">	
				<Card.Header>

					<Nav variant="tabs" defaultActiveKey="useScript">
					<Nav.Item>
							<Nav.Link onClick={() => self.setState({manageScript: true})} eventKey="useScript">Software</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link hidden={!showAdvancedOptions} onClick={() => self.setState({manageScript: false})} eventKey="createPattern">create pattern</Nav.Link>
						</Nav.Item>
					</Nav>

				</Card.Header>

				{manageScript ? 
				<Row>
				<Col>
					<Dropdown className="mt-1 mb-1 ml-2 mr-2">
					  <Dropdown.Toggle variant="info">
					    <i>Select: {selectedScript}</i>
					  </Dropdown.Toggle>

					  <HelpCircle className="mt-2 mb-2 ml-2 mr-2" style={{color: "green", height: 20, cursor: "pointer"}} onClick={() => {if (selectedScript!=="none") {self.setState({showInfosScript: true})}}}/>

					  <Dropdown.Menu>
				  	{scriptsInfos.map(f => 
					    	<Dropdown.Item onClick={(e) => self.updateScript(e.target.innerHTML)}>{f.taskname}</Dropdown.Item>	
				  	)}
					  </Dropdown.Menu>
					</Dropdown>
				</Col>
				<Col>
					<Button style={{float: "right"}} disabled={selectedScript=="none"} variant="outline-info" size="sm" className="ml-2 mr-2" onClick={() =>  self.setState({createTask: false}) }> Start File Selection </Button>
				</Col>
				<Col>
					<Dropdown className="mt-1 mb-1 ml-2 mr-2">
						<Dropdown.Toggle disabled={patterns==null} hidden={!showAdvancedOptions} variant="outline-info">
						choose pattern
						</Dropdown.Toggle>

						{patterns==null ? null : 
							<Dropdown.Menu>
								{patterns.map(p => 
									<Dropdown.Item onClick={(e) => {self.setState({commandList: {}}, () => self.useExistingPattern(p))}}>{p.name}</Dropdown.Item>	
								)}
							</Dropdown.Menu>
						}
					</Dropdown>
				</Col>
				</Row>
				:
				<Row>
				<Col>	
					<InputGroup className="mt-1 mb-1 ml-2 mr-2">
						<Button size="sm" variant="primary" onClick={() => self.addFlagByPatient()}> add file pattern</Button>
						<FormControl size="sm" value={newFlag.pattern} placeholder="pattern" type="text" autoComplete="off" onChange={(e) => {newFlag.pattern = e.target.value; self.setState({...self.state, newFlag})}}/>
		 				<FormControl size="sm" value={newFlag.flag} placeholder="flag" type="text" autoComplete="off" onChange={(e) => {newFlag.flag = e.target.value; self.setState({...self.state, newFlag})}}/>
					</InputGroup>

					<InputGroup className="mt-1 mb-1 ml-2 mr-2">
						<Button size="sm" variant="primary" onClick={() => self.addParamByPatient()}> add flag parameter</Button>
		 				<FormControl size="sm" value={newParam.flag} placeholder="flag" type="text" autoComplete="off" onChange={(e) => {newParam.flag = e.target.value; self.setState({...self.state, newParam})}}/>
						<FormControl size="sm" value={newParam.value} placeholder="value" type="text" autoComplete="off" onChange={(e) => {newParam.value = e.target.value; self.setState({...self.state, newParam})}}/>
					</InputGroup>
				</Col>
				<Col>
					<Button className="mt-1 mb-1 ml-2 mr-2" size="sm" variant="success" onClick={() => self.setState({showSavePattern: true})}> Save pattern </Button>
				</Col>
				</Row>
				}
				</Card>	
				</Col>

				<Col>
					<Alert variant="primary" id="alertFiles"> 
					<Alert.Heading> selected files : {selectedFiles}</Alert.Heading>
						<FormControl size="sm" id="searchFilesForm" onChange={(e)=>{this.searchFiles(e.target.value)}} type="text" placeholder="search file/folder" className="mr-sm-2" autoComplete="off"/>
					</Alert>
					<Overlay target={document.getElementById("alertFiles")} show={showFiles} placement="bottom">
						{({placement,...props}) => (
							<div {...props}
								style={{
								backgroundColor: 'gray',
								color: 'white',
								borderRadius: 5,
								padding: '10px 10px',
								...props.style,}}>
								{filesSearch}
							</div>
						)}
					</Overlay>
				</Col>				

			</Row>
			</Card.Body>
			</Card>

			<Table className="mt-2 mb-2" hidden={!showAdvancedOptions} responsive striped bordered hover size="sm" variant="dark">
				<thead>
					<tr>
					{headers}
					</tr>
				</thead>

				<tbody>
					{items}
				</tbody>	
			</Table>
			


			{/*{displaycmd}*/}
			</React.Fragment>
		)
	}

	searchFiles(search) {
		const self = this
		const {files} = self.state
		var filesSearch = []
		var showFiles

		if (search!=="") {
			files.forEach(file => {
				if (file.includes(search)) {
					filesSearch.push(<li>{file}</li>)
				}
			})
			if (filesSearch.length==0) {filesSearch.push(<text>no items found</text>)}
			showFiles = true
		} else {
			showFiles = false
		}


		self.setState({filesSearch: filesSearch, showFiles: showFiles})
	}


	addFlagForAll(newFlag = this.state.newFlag) {
		const self = this
		const {files} = self.state
		const {pattern, flag} = newFlag
		var {commandList, saveEntries} = self.state
		const search = new RegExp(".*"+pattern+".*")

		if (pattern!==""&&flag!=="") {
			var matchFiles = []
			files.forEach(file => {
				if (search.test(file)) {
					matchFiles.push(file)
				}
			})

			matchFiles.forEach(file => {
				if (!Object.keys(commandList).includes(file)) {
					commandList[file] = {}
					commandList[file][flag] = file
				} else {
					commandList[file][flag] = file
				}
			})

			saveEntries.push(newFlag)
			self.setState({...self.state, commandList: commandList, newFlag: {pattern: "", flag: ""}, saveEntries: saveEntries})
		}
	}

	addFlagByPatient(newFlag = this.state.newFlag) {
		const self = this
		const {files} = self.state
		const {pattern, flag} = newFlag
		var {commandList, saveEntries} = self.state
		const search = new RegExp(".*"+pattern+".*")

		if (pattern!==""&&flag!=="") {
			var matchFiles = []
			files.forEach(file => {
				if (search.test(file)) {
					matchFiles.push(file)
				}
			})

			matchFiles.forEach(file => {
				var path = file.substring(0, file.lastIndexOf('/'))
				if (!Object.keys(commandList).includes(path)) {
					commandList[path] = {}
					commandList[path][flag] = file
				} else {
					commandList[path][flag] = file
				}
			})

			saveEntries.push(newFlag)
			self.setState({...self.state, commandList: commandList, newFlag: {pattern: "", flag: ""}, saveEntries: saveEntries})
		}
	}

	addParamForAll(newParam = this.state.newParam) {
		const self = this
		const {flag, value} = newParam
		if (flag!==""&&value!=="") {
			var {commandList, saveEntries, folderList, files} = self.state

			if (Object.keys(commandList).length==0) {
				files.forEach(file => {
					commandList[file] = {}
					commandList[file][flag] = value
				})
			} else {
				Object.keys(commandList).forEach(command => {
					commandList[command][flag] = value
				})
			}


			saveEntries.push(newParam)
			self.setState({...self.state, commandList: commandList, newParam: {flag: "", value: ""}, saveEntries: saveEntries})
		}
	}
	addParamByPatient(newParam = this.state.newParam) {
		const self = this
		const {flag, value} = newParam
		if (flag!==""&&value!=="") {
			var {commandList, saveEntries, folderList} = self.state

			if (Object.keys(commandList).length==0) {
				folderList.forEach(folder => {
					commandList[folder] = {}
					commandList[folder][flag] = value
				})
			} else {
				Object.keys(commandList).forEach(command => {
					commandList[command][flag] = value
				})
			}


			saveEntries.push(newParam)
			self.setState({...self.state, commandList: commandList, newParam: {flag: "", value: ""}, saveEntries: saveEntries})
		}
	}


	popUpInfosScript() {
		const self = this
		const {showInfosScript, scriptsInfos, selectedScript} = self.state

		var scriptInfo = []
		var info
		scriptsInfos.forEach(script => {
			if (script.taskname==selectedScript) {
				scriptInfo.push(<text><strong>script description : </strong>{script.description}</text>)
				info = script.patterns
			}
		})
		info.forEach(pattern => {
			scriptInfo.push(
				<ul>
					<li>{pattern.name}</li>
					<li>{pattern.description}</li>
					{"\n"}
				</ul>
			)
		})


		return (
			
			<Modal show={showInfosScript} onHide={() => this.setState({showInfosScript: false})}>
				<Modal.Header closeButton>
					<Modal.Title>infos on <i>{selectedScript}</i> software</Modal.Title>  
				</Modal.Header>
				<Modal.Body>
					{scriptInfo}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showInfosScript: false})} >
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}
	// addParam() {
	// 	const self = this
	// 	const {files, newParam} = self.state
	// 	var {parameters} = self.state
	// 	const {pattern, name, defaultValue} = newParam
	// 	const search = new RegExp(".*" + pattern + ".*")
		
	// 	files.forEach(file => {
	// 		if (search.test(file)) {
	// 			parameters[file][name] = defaultValue 
	// 		} else {
	// 			parameters[file][name] = ""
	// 		}
	// 	})

	// 	self.setState({...self.state, parameters: parameters})
	// }

	useExistingPattern(pattern) {
		const self = this
		const {scriptsInfos, selectedScript, filesOrder} = self.state

		console.log("Creating a task for : ", selectedScript)
		
		var scriptPattern = pattern.infos

		Object.keys(scriptPattern).forEach(key => {
			if (Object.keys(scriptPattern[key]).includes("pattern")) {
				var newFlag = {pattern: scriptPattern[key].pattern, flag: scriptPattern[key].flag}
				if (filesOrder){self.addFlagForAll(newFlag)} 
				else {self.addFlagByPatient(newFlag)}
			} else {
				var newParam = {flag: scriptPattern[key].flag, value: scriptPattern[key].value}
				if (filesOrder) {self.addParamForAll(newParam)}
				else {self.addParamByPatient(newParam)}
			}

		})

	}

	popUpSavepattern() {
		const self = this
		var {savePattern} = self.state

		return (
			
			<Modal show={this.state.showSavePattern} onHide={() => this.setState({showSavePattern: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Choose name and description</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<FormControl type="text" placeholder="name" className="mr-sm-2" autoComplete="off" onChange={(e) => {savePattern.name = e.target.value; self.setState({...self.state, savePattern: savePattern})}}/>
					<FormControl type="text" placeholder="description" className="mr-sm-2" autoComplete="off" onChange={(e) => {savePattern.description = e.target.value; self.setState({...self.state, savePattern: savePattern})}}/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showSavePattern: false})} >
						Cancel
					</Button>
					<Button  variant="success" onClick={() => this.uploadScriptInfos()}>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	getScriptInfos() {
		const self = this
		var scriptsInfos = []

		self.dcbiareactservice.getscript()
		.then(res => {
			res.data.forEach(script => {
				scriptsInfos.push(script)
			})
			self.setState({scriptsInfos: scriptsInfos})
		})
	}

	uploadScriptInfos() {
		const self = this
		const {saveEntries, selectedScript, savePattern} = self.state
		const {name, description} = savePattern

		var taskname = selectedScript
		var desc = "description of general code"
		var pattern = {}
		pattern.name = name
		pattern.description = description
		pattern.infos = saveEntries

		var infos = {}
		infos["taskname"] = taskname
		infos["desc"] = desc
		infos["pattern"] = pattern

		self.dcbiareactservice.uploadscript(infos)
		self.setState({savePattern: {}, showSavePattern: false})
	}

	createCommandLine() {
		const self = this
		const {commandList, commandScript} = self.state
		
		var commandLineList = []

		Object.keys(commandList).forEach(command => {
			var cmd = commandScript
			Object.keys(commandList[command]).forEach(flag => {
				cmd = cmd + " " + flag + " " + commandList[command][flag]
			})

			commandLineList.push(cmd)
		})
		self.setState({commandLineList: commandLineList})
		console.log(commandLineList)
	}


	popUpEditCol() {
		const self = this
		const {flagToEdit} = self.state
		var flagName

		return (
			
			<Modal show={this.state.showPopUpEditCol} onHide={() => this.setState({showPopUpEditCol: false, paramToEdit: ""})}>
				<Modal.Header closeButton>
					<Modal.Title>Edit name & value for {flagToEdit}</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<Form.Control type="text" placeholder="parameter name" className="mr-sm-2" autoComplete="off" onChange={(e) => flagName = e.target.value}/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showPopUpEditCol: false})} >
						Cancel
					</Button>
					<Button  variant="success" onClick={() => this.editCol(flagName)}>
						Edit Parameter
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	deleteRow(cmd) {
		const self = this
		var {commandList} = self.state

		Object.keys(commandList).forEach(command => {
			if (command == cmd) {
				delete commandList[command]
			}
		})

		self.setState({commandList: commandList})

	}

	deleteFlag(param) {
		const self = this
		var {commandList, saveEntries} = self.state

		Object.keys(commandList).forEach(command => {
			delete commandList[command][param]
		})

		saveEntries.forEach(item => {
			if (item.flag==param) {
				var ind = saveEntries.indexOf(item)
				saveEntries.splice(ind, 1);
			}			
		})
		self.setState({commandList: commandList, saveEntries: saveEntries})

	}

	editCol(flagName){
		const self = this
		const {flagToEdit} = self.state
		var {commandList} = self.state

		if (flagName!==undefined && flagName!==flagToEdit) {
			Object.keys(commandList).forEach(command => {
				Object.defineProperty(commandList[command], 
								flagName,
								Object.getOwnPropertyDescriptor(commandList[command], flagToEdit))
				delete commandList[command][flagToEdit]
			})
		}

		self.setState({...self.state, showPopUpEditCol: false, commandList: commandList, flagToEdit: ""})
	}




	getFileManager(){
		return <DcbiaReactFilebrowser createtask={true} startCreatetask={this.createTask} />
	}

	render() {
		const self = this
		const {createTask} = self.state
		return(
			<Container fluid >
				{this.state.showPopUpEditCol ? this.popUpEditCol() : null}
				{this.state.showSavePattern ? this.popUpSavepattern() : null}
				{this.state.showInfosScript ? this.popUpInfosScript() : null}

				<Row>
					<Col>
						<div>{self.manageTaskFiles()}</div>
						{createTask ? null : <div>{self.getFileManager()}</div>}
{/*						{createTask ? <div>{self.manageTaskFiles()}</div> : <div>{self.getFileManager()}</div>}
*/}					</Col>
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

export default connect(mapStateToProps)(CreateTask);


	// displaySelectedFiles() {		

	// 	var headers = []
	// 	Object.keys(projectFilesList[0]).forEach(header => {
	// 		headers.push(
	// 			<th>
	// 				<Edit2 id={header} style={{height: 15, cursor: 'pointer'}} onClick={() => this.editParamName(header)}/>
	// 				{header}
	// 			</th>
	// 		)
	// 	})

	// 	var projectList = []
	// 	var line = []
	// 	var i = 0
	// 	var j = 0
	// 	Object.values(projectFilesList).forEach(fileline => { 
	// 		line = []
	// 		j = 0
	// 		Object.values(fileline).forEach(param => {
	// 			line.push(
	// 				<td> 
	// 				<Col>
	// 					{Object.keys(projectFilesList[0])[j]=='name' ? <Row>{param}</Row> :
	// 					<Row><input id={i+"_"+j} type="text" placeholder={param} onChange={(e) => this.editparam(e)}/></Row>}
	// 				</Col>
	// 				</td>
	// 			)
	// 			j = j + 1
	// 		})
	// 		projectList.push(
	// 		<tr id={"row"+i} onClick={(e) => this.editrow(e)}>
	// 			{line}
	// 		</tr>
	// 		)
	// 		i = i + 1
	// 	})
	// 	return (
	// 		<div>test</div>
	// 	)
	// }







	// searchExp() {
	// 	// const self = this
	// 	// const {projectFilesList} = self.state
	// 	// const search = new RegExp(".*" + document.getElementById('searchPattern').value + ".*")
	// 	// const newParam = document.getElementById('newParam').value
	// 	// const newParamValue = document.getElementById('newParamValue').value
	// 	// console.log(search)
	// 	// console.log(projectFilesList)

	// 	// if (document.getElementById('searchPattern').value) {
			
	// 	// 	var filesAlreadyIn = []
	// 	// 	Object.keys(projectFilesList).forEach(key => {
	// 	// 		filesAlreadyIn.push(projectFilesList[key].name)
	// 	// 	})

	// 	// 	var patients = self.getTree(projectFilesList[0].name)
	// 	// 	patients.forEach(patient => {
	// 	// 		patient.files.forEach(file => {
					
	// 	// 			if (filesAlreadyIn.includes(file.name)) {
	// 	// 				Object.keys(projectFilesList).forEach(key => {
	// 	// 					if (projectFilesList[key].name == file.name) {
	// 	// 						if (search.test(file.name)) {
	// 	// 							projectFilesList[key][newParam] = newParamValue
	// 	// 						} else {
	// 	// 							projectFilesList[key][newParam] = ""
	// 	// 						}
	// 	// 					}
	// 	// 				})
	// 	// 			} else {
						
	// 	// 				var data = Object.assign({}, projectFilesList[0])
	// 	// 				data.name = file.name

	// 	// 				if (search.test(file.name)) {	
	// 	// 					data[newParam] = newParamValue
	// 	// 				} else {
	// 	// 					data[newParam] = ""
	// 	// 				}
	// 	// 				projectFilesList.push(data) 

	// 	// 			}			
	// 	// 		})
	// 	// 	})
	// 	// 	projectFilesList[0][newParam] = ""
	// 	// 	self.setState({projectFilesList: projectFilesList})
	// 	// }
	// }