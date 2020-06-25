import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar, Collapse} from 'react-bootstrap'
import {Edit2, X, ChevronDown, ChevronUp, HelpCircle, XCircle} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'

import {ClusterpostService} from 'clusterpost-list-react'

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
			selectedDirs: [],
			files: [],
			subjectList: [],
			createTask: true,


			suffix: "",

			organizedBySubject: false, // true = all, false = bypatient

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

			runDisabled: false,

			showFiles: false,

			showSavePattern: false,


			currentPattern: "",

			scriptsInfos: [],

			showAdvancedOptions: false,

			showInfosScript: false,

			manageScript: true,

			jobName: "",

			selectedCMD: {},

			objectCMD: null,

			newExecutable: {},

			showTemplate: false,

			newSoftware: {
				scriptname: "",
				description: "",
				command: "",
				patterns: []
			}
		}
		this.createTask = this.createTask.bind(this)
	}


	componentDidMount() {
		const self = this

		self.dcbiareactservice = new DcbiaReactService();
		self.dcbiareactservice.setHttp(self.props.http);

		self.clusterpostservice = new ClusterpostService();
		self.clusterpostservice.setHttp(self.props.http);

		self.getScriptInfos()
	}



	createTask(files, selectedDirs) {
		const self = this
		const {currentPattern} = self.state
		var subjectList = []

		files.forEach(file => {
			var folder_path = file.substring(0, file.lastIndexOf('/'))
			if (!subjectList.includes(folder_path)) {
				subjectList.push(folder_path)
			}
		})

		self.setState({
			...self.state, 
			commandList: {},
			files: files, 
			selectedDirs: selectedDirs,
			subjectList: subjectList},
			() => self.getMatchDir()
			// ,
			// () => self.useExistingPattern(currentPattern) 

		)
		self.cardTask.scrollIntoView({behavior: "smooth"})
		self.setState({runDisabled: false})

	}


	updateScript(scriptClicked) {
		const self = this
		const {commandList, scriptsInfos} = self.state
		var organizedBySubject

		switch(scriptClicked) {
			case "condyle":
				organizedBySubject = false
			break;

			case "teeth":
				organizedBySubject = true
			break;

			default:
				console.log("nothing")
				organizedBySubject = false
		}

		scriptsInfos.forEach(script => {
			if (script.scriptname==scriptClicked) {
				self.setState({
					organizedBySubject: organizedBySubject,
					selectedScript: scriptClicked,
					commandScript: script.command,
					currentPattern: script.patterns,

					selectedCMD: script
				})
			}
		})
	}







	getTableTemplate() {
		const self = this
		const {selectedCMD} = self.state

		var trows = _.map(selectedCMD.patterns, (pattern)=>{
			return (
				<td> 
					{pattern.value ? pattern.value : pattern.pattern}
				</td>
			)
		})

		return (
				<tr class="bg-light">
					<td>{selectedCMD.command}</td>
					{trows}
				</tr>
		)
	}
	getTableHeader(){
		const self = this;
		const {selectedCMD} = self.state;

		var trows = _.map(selectedCMD.patterns, (pattern)=>{
			return (
				<th> 
{/*					<Edit2 style={{height: 15, cursor: 'pointer'}} onClick={() => this.setState({showPopUpEditCol: true, flagToEdit: pattern.flag})}/>
*/}
					{pattern.flag ? pattern.flag : pattern.position}
{/*					<X style={{color: "red", height: 15, cursor: 'pointer'}} onClick={() => this.deleteFlag(pattern.flag)}/>
*/}				
				</th>
			)
		})


		return (
			<thead className="thead-dark">
				<th>
					<ChevronDown style={{color: "red", height: "20", cursor: "pointer"}} onClick={() => self.setState({showTemplate: !self.state.showTemplate})}/>
					<Button variant="success" className="mr-1 ml-1"size="sm" onClick={() => {self.tablebody.className.indexOf("collapse show") > -1 ? self.tablebody.className="collapse" : self.tablebody.className="collapse show"}}>
					<ChevronDown style={{color: "white"}}/>
					</Button>
					{"Command"}
				</th>
				{trows}
			</thead>
		)
	}


	getMatchFiles(pattern) {
		const self = this
		const {selectedCMD, files} = self.state
		var {suffix} = self.state
		const search = new RegExp(".*"+pattern.pattern+".*")

		if (pattern.pattern) {

			var matchesFiles = _.filter(files, (file) => {
				return search.test(file)
			})

			if (pattern.flag == "--out") {
				matchesFiles = _.map(matchesFiles, file => {
					var pathSplit = file.split('/')
					var filename = pathSplit[pathSplit.length - 1] 
					var ind = filename.indexOf('.')
					filename = filename.slice(0, ind) + suffix + filename.slice(ind);
 					pathSplit[pathSplit.length - 1] = filename
					var fullname = pathSplit.join('/')
					return fullname
				})
			}

			return matchesFiles
		} else {
			return [pattern.value]
		}
	}
	getMatchDir(){
		const self = this;
		const {selectedCMD} = self.state;

		var matches = _.map(selectedCMD.patterns, (pattern) => {
			return self.getMatchFiles(pattern)
		})

		var matches = _.object(_.pluck(selectedCMD.patterns, 'position'), matches);
		
		var CMD_List = [];

		var maxLen = Math.max(...Object.values(matches).map(el => el.length))
		for (var i=0; i<maxLen; i++){
			CMD_List.push({})
		}

		Object.keys(matches).forEach(key => {
			if (matches[key].length==1) {
				_.map(CMD_List, el => {
					el[key] = matches[key][0]
				})
			} else {
				var j = 0
				_.map(CMD_List, el => {
					el[key] = matches[key][j]
					j += 1
				})
			}
		})
		self.setState({objectCMD: CMD_List})
	}



	getTableBody(){
		const self = this;
		const {selectedCMD, objectCMD} = self.state;
		
		var trows = _.map(objectCMD, (match, index)=>{

			var tcols = _.map(selectedCMD.patterns, (pattern)=>{

				return (<td>
					<FormControl type="text" value={match[pattern.position]} className="mr-sm-2" autoComplete="off" onChange={(e) => {objectCMD[index][pattern.position] = e.target.value, self.setState({...self.state, objectCMD: objectCMD})}}/>
						</td>)
			})
			return (
				<tr>	
					<td>
					<X style={{color: "red", height: 15, cursor: 'pointer'}} onClick={() => this.deleteRow(index)}/>
						{selectedCMD.command}
					</td>
					{tcols}
				</tr>
			)
		})

		return (
			<tbody className="collapse" ref={(e) => {this.tablebody = e}}>
				{trows}
			</tbody>
		)
	}


	deleteRow(index) {
		const self = this
		var {objectCMD} = self.state

		objectCMD.splice(index, 1)

		self.setState({objectCMD: objectCMD})
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



// dcbia-filebrowser/view -> shared.token & tasks.token
// handlers/routes updated with better syntax

// change script to software in all code








	// addFlagForAll(newFlag = this.state.newFlag) {
	// 	const self = this
	// 	const {files} = self.state
	// 	const {pattern, flag} = newFlag
	// 	var {commandList, saveEntries} = self.state
	// 	const search = new RegExp(".*"+pattern+".*")

	// 	if (pattern!==""&&flag!=="") {
	// 		var matchFiles = []
	// 		files.forEach(file => {
	// 			if (search.test(file)) {
	// 				matchFiles.push(file)
	// 			}
	// 		})

	// 		matchFiles.forEach(file => {
	// 			if (!Object.keys(commandList).includes(file)) {
	// 				commandList[file] = {}
	// 				commandList[file][flag] = file
	// 			} else {
	// 				commandList[file][flag] = file
	// 			}
	// 		})

	// 		saveEntries.push(newFlag)
	// 		self.setState({...self.state, commandList: commandList, newFlag: {pattern: "", flag: ""}, saveEntries: saveEntries})
	// 	}
	// }
	// addFlagBySubject(newFlag = this.state.newFlag) {
	// 	const self = this
	// 	const {files} = self.state
	// 	const {pattern, flag} = newFlag
	// 	var {commandList, saveEntries} = self.state
	// 	const search = new RegExp(".*"+pattern+".*")

	// 	if (pattern!==""&&flag!=="") {
	// 		var matchFiles = []
	// 		files.forEach(file => {
	// 			if (search.test(file)) {
	// 				matchFiles.push(file)
	// 			}
	// 		})

	// 		matchFiles.forEach(file => {
	// 			var path = file.substring(0, file.lastIndexOf('/'))
	// 			if (!Object.keys(commandList).includes(path)) {
	// 				commandList[path] = {}
	// 				commandList[path][flag] = file
	// 			} else {
	// 				commandList[path][flag] = file
	// 			}
	// 		})

	// 		saveEntries.push(newFlag)
	// 		self.setState({...self.state, commandList: commandList, newFlag: {pattern: "", flag: ""}, saveEntries: saveEntries})
	// 	}
	// }
	// addParamForAll(newParam = this.state.newParam) {
	// 	const self = this
	// 	const {flag, value} = newParam
	// 	if (flag!==""&&value!=="") {
	// 		var {commandList, saveEntries, files} = self.state

	// 		if (Object.keys(commandList).length==0) {
	// 			files.forEach(file => {
	// 				commandList[file] = {}
	// 				commandList[file][flag] = value
	// 			})
	// 		} else {
	// 			Object.keys(commandList).forEach(command => {
	// 				commandList[command][flag] = value
	// 			})
	// 		}

	// 		saveEntries.push(newParam)
	// 		self.setState({...self.state, commandList: commandList, newParam: {flag: "", value: ""}, saveEntries: saveEntries})
	// 	}
	// }
	// addParamBySubject(newParam = this.state.newParam) {
	// 	const self = this
	// 	const {flag, value} = newParam
	// 	if (flag!==""&&value!=="") {
	// 		var {commandList, saveEntries, subjectList} = self.state

	// 		if (Object.keys(commandList).length==0) {
	// 			subjectList.forEach(folder => {
	// 				commandList[folder] = {}
	// 				commandList[folder][flag] = value
	// 			})
	// 		} else {
	// 			Object.keys(commandList).forEach(command => {
	// 				commandList[command][flag] = value
	// 			})
	// 		}


	// 		saveEntries.push(newParam)
	// 		self.setState({...self.state, commandList: commandList, newParam: {flag: "", value: ""}, saveEntries: saveEntries})
	// 	}
	// }


	popUpInfosScript() {
		const self = this
		const {showInfosScript, scriptsInfos, selectedScript, selectedCMD} = self.state

		var scriptInfo = []
		var info

		if (selectedScript=="none") {
			scriptInfo.push(
				<div>Select a script and click here to get infos on it and how to use it</div>
			)
		} else {
			scriptInfo.push(
				<text> 
					<strong>Script description</strong> : {selectedCMD.description}
				</text>
			)
		}

		return (	
			<Modal show={showInfosScript} onHide={() => this.setState({showInfosScript: false})}>
				<Modal.Header closeButton>
					<Modal.Title>
						{selectedScript!=="none" ? <div>informations on : <i>{selectedScript}</i> script</div> : null}
					</Modal.Title>  
				</Modal.Header>
				<Modal.Body>
					{scriptInfo}

				</Modal.Body>
				<Modal.Footer>
						{selectedScript !== "none" ? 
						<Button variant="danger" onClick={() => {self.dcbiareactservice.deleteSoftware(selectedScript); self.setState({showInfosScript: false, selectedScript: "none"})}}>
							<XCircle/> Delete software
						</Button>	
						: null}
				</Modal.Footer>
			</Modal>
		)
	}


	useExistingPattern(pattern) {
		const self = this
		const {scriptsInfos, selectedScript, organizedBySubject} = self.state


		var scriptPattern = pattern.infos

		Object.keys(scriptPattern).forEach(key => {
			if (Object.keys(scriptPattern[key]).includes("pattern")) {
				var newFlag = {pattern: scriptPattern[key].pattern, flag: scriptPattern[key].flag}
				if (organizedBySubject){self.addFlagBySubject(newFlag)} 
				else {self.addFlagForAll(newFlag)}
			} else {
				var newParam = {flag: scriptPattern[key].flag, value: scriptPattern[key].value}
				if (organizedBySubject) {self.addParamBySubject(newParam)}
				else {self.addParamForAll(newParam)}
			}

		})

	}

	popUpSavepattern() {
		const self = this
		var {newSoftware} = self.state

		return (
			
			<Modal show={this.state.showSavePattern} onHide={() => this.setState({showSavePattern: false})}>
				<Modal.Header closeButton>
					<Modal.Title>Choose name and description</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<FormControl type="text" placeholder="name" className="mr-sm-2" autoComplete="off" onChange={(e) => {newSoftware.scriptname = e.target.value; self.setState({...self.state, newSoftware: newSoftware})}}/>
					<FormControl type="text" placeholder="description" className="mr-sm-2" autoComplete="off" onChange={(e) => {newSoftware.description = e.target.value; self.setState({...self.state, newSoftware: newSoftware})}}/>
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
		const {newSoftware} = self.state


		if (newSoftware.description=="" 
			|| newSoftware.scriptname=="" 
			|| newSoftware.command==""
			|| newSoftware.patterns.length==0) {
			return false
		} else {
			self.dcbiareactservice.uploadscript(newSoftware)

			newSoftware.type = "tasksInfos"

			self.setState({newSoftware: {scriptname: "", patterns: [], command: "", description: ""}, showSavePattern: false})
		}
	}

	createCommandLine() {
		const self = this
		const {selectedCMD, objectCMD, outputDirectory, jobName} = self.state
		const {user} = self.props
		const {email} = user
 	
		var job_nbr = 0
		Promise.map(objectCMD, (cli) => {

			job_nbr += 1
			var cmd = selectedCMD.command
			Object.keys(cli).forEach(el => {

				var flagName = _.filter(selectedCMD.patterns, pattern => { 
					return pattern.position == parseInt(el)
				})

				if (flagName[0].pattern) {var param = email+'/'+cli[el]}
				else {var param = cli[el]}

				{flagName[0].flag ? 
					cmd = cmd + " " + flagName[0].flag + " " + param
					: cmd = cmd + " " + param}
			})

			return self.clusterpostservice.parseCLIFromString(cmd)	
			.then((job) => {

				job.name = jobName+"_"+job_nbr
				job.parameters = _.compact(job.parameters)
				job.userEmail = email
				job.inputs = _.map(selectedCMD.patterns, (pattern)=>{

					if(cli[pattern.position] && pattern.pattern && pattern.flag!=="--out"){

						return {
							name: email + '/' + cli[pattern.position],
							local: {
								useDefault: true
							}
						}
					} else {
						return null 
					}
				})
				job.inputs = _.compact(job.inputs)

				job.outputs.push({
					type: 'directory',
					name: email + '/', 
					local: {
						useDefault: true
					}
				})

				return self.clusterpostservice.createAndSubmitJob(job)
				.catch((e)=>{
					console.error(e)
				})
			})	
		}, {concurrency: 1})
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

	// deleteRow(cmd) {
	// 	const self = this
	// 	var {commandList} = self.state

	// 	Object.keys(commandList).forEach(command => {
	// 		if (command == cmd) {
	// 			delete commandList[command]
	// 		}
	// 	})

	// 	self.setState({commandList: commandList})

	// }

	// deleteFlag(flag) {
	// 	const self = this
	// 	var {commandList, saveEntries} = self.state

	// 	Object.keys(commandList).forEach(command => {
	// 		delete commandList[command][param]
	// 	})

	// 	saveEntries.forEach(item => {
	// 		if (item.flag==param) {
	// 			var ind = saveEntries.indexOf(item)
	// 			saveEntries.splice(ind, 1);
	// 		}			
	// 	})
	// 	self.setState({commandList: commandList, saveEntries: saveEntries})

	// }

	// editCol(flagName){
	// 	const self = this
	// 	const {flagToEdit} = self.state
	// 	var {commandList} = self.state

	// 	if (flagName!==undefined && flagName!==flagToEdit) {
	// 		Object.keys(commandList).forEach(command => {
	// 			Object.defineProperty(commandList[command], 
	// 							flagName,
	// 							Object.getOwnPropertyDescriptor(commandList[command], flagToEdit))
	// 			delete commandList[command][flagToEdit]
	// 		})
	// 	}

	// 	self.setState({...self.state, showPopUpEditCol: false, commandList: commandList, flagToEdit: ""})
	// }



	manageTasks() {
		const self = this
		const {createTask, files, newParam, newFlag, runDisabled, commandScript, commandList, selectedScript, selectedDirs, showFiles, saveEntries, filesSearch, scriptsInfos, manageScript, newPatternName, showInfosScript, showAdvancedOptions, outputDirectory} = self.state
		
		var selectedFiles = []
		selectedDirs.forEach(elem => {
			selectedFiles.push(
				<i style={{"font-size": "15px"}}> {elem} , </i>
			)
		})

		return (
			<React.Fragment>

			<Card className="mt-2 mb-2" ref={(e) => {this.cardTask = e}}>
			<Card.Header > 
				Manage task creation
					<Button style={{float: "right"}} disabled={runDisabled} variant="success" size="sm" className="ml-2 mr-2" ref={(element) => {this.buttonRun = element}} onClick={() => self.createCommandLine()}> Run ! </Button>
					
					{/*<Form.Check style={{float: "right"}} type="checkbox" label="Advanced options" onChange={() => self.setState({showAdvancedOptions: !self.state.showAdvancedOptions})}/>*/}
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
							<Nav.Link onClick={() => self.setState({manageScript: false})} eventKey="createPattern">Create new software</Nav.Link>
						</Nav.Item>
					</Nav>
				</Card.Header>

				{manageScript ? 

				<div>
					{self.chooseSoftware()}
				</div>				

				:
				<div>
					{self.createNewExecutable()}
				</div>				
				}
				</Card>	
				</Col>

				<Col>
					<Alert variant="primary" id="alertFiles"> 
					<Alert.Heading> selected files : {selectedFiles}</Alert.Heading>
						<FormControl size="sm" id="alertFiles" onChange={(e)=>{this.searchFiles(e.target.value)}} type="text" placeholder="search file/folder" className="mr-sm-2" autoComplete="off"/>
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
			</React.Fragment>
			)
	}



	chooseSoftware() {
		const self = this
		const {selectedDirs, selectedScript, scriptsInfos} = self.state


		return (
			<ButtonGroup>
				<Dropdown className="mt-1 mb-1 ml-2 mr-2">
				  <Dropdown.Toggle variant="info">
				    <i>Select: {selectedScript}</i>
				  </Dropdown.Toggle>
				  <Dropdown.Menu>
			  	{scriptsInfos.map(f => 
				    	<Dropdown.Item onClick={(e) => self.updateScript(e.target.innerHTML)}>{f.scriptname}</Dropdown.Item>	
			  			
			  	)}
				  </Dropdown.Menu>
				</Dropdown>

				<HelpCircle style={{color: "green", height: 20, cursor: "pointer", top: 0, bottom: 0, margin: "auto"}} onClick={() => self.setState({showInfosScript: true})}/>

				<FormControl placeholder="suffix output file" className="mt-1 mb-1 ml-1 mr-1" style={{width: "30%"}} value={self.suffix} onChange={(e) => self.setState({suffix: e.target.value})}/>
				<FormControl placeholder="job name" className="mt-1 mb-1 ml-1 mr-1" style={{width: "30%"}} value={self.jobName} onChange={(e) => self.setState({jobName: e.target.value})}/> 
				
				<Button style={{float: "right"}} size="sm" className="mt-1 mb-1 ml-1 mr-1" disabled={selectedScript=="none"} variant="outline-info" onClick={() => self.setState({createTask: false})}> 
					Start File Selection 
				</Button>

			</ButtonGroup>
		)

	}

	createNewExecutable() {
		const self = this
		const {newParam, newFlag, newSoftware} = self.state
		
		return (

			<Container>

				{/*<Button variant="outline-danger" size="sm" onClick={() => self.setState({selectedCMD: {}, objectCMD: null, selectedScript: "none", createTask: true})}> Clear cmd </Button>*/}

				
				<InputGroup className="mt-1 mb-1 ml-2 mr-2">
					<Button size="sm" variant="primary" onClick={() => self.addFilePattern()}> add file pattern</Button>
					
					<FormControl size="sm" value={newFlag.flag} placeholder="flag" type="text" autoComplete="off" onChange={(e) => {newFlag.flag = e.target.value; self.setState({...self.state, newFlag})}}/>
					<FormControl size="sm" value={newFlag.pattern} placeholder="pattern" type="text" autoComplete="off" onChange={(e) => {newFlag.pattern = e.target.value; self.setState({...self.state, newFlag})}}/>
				</InputGroup>

				<InputGroup className="mt-1 mb-1 ml-2 mr-2">
					<Button size="sm" variant="primary" onClick={() => self.addParam()}> add flag parameter</Button>
					
					<FormControl size="sm" value={newParam.flag} placeholder="flag" type="text" autoComplete="off" onChange={(e) => {newParam.flag = e.target.value; self.setState({...self.state, newParam})}}/>
					<FormControl size="sm" value={newParam.value} placeholder="value" type="text" autoComplete="off" onChange={(e) => {newParam.value = e.target.value; self.setState({...self.state, newParam})}}/>
				</InputGroup>

				<InputGroup>
					<FormControl size="sm" value={newSoftware.command} placeholder="executable" type="text" autoComplete="off" onChange={(e) => {newSoftware.command = e.target.value; self.setState({...self.state, newSoftware})}}/>
					<Button className="mt-1 mb-1 ml-2 mr-2" size="sm" variant="success" onClick={() => self.setState({showSavePattern: true})}> Save pattern </Button>
				</InputGroup>

			</Container>
		)
	}

	addFilePattern() {
		const self = this
		const {newFlag} = self.state
		const {flag, pattern} = newFlag
		var {newSoftware} = self.state

		if (flag!=="" && pattern!=="") {
			var len = newSoftware.patterns.length

			newSoftware.patterns.push({flag: flag, pattern: pattern, position: len+1})
			self.setState({...self.state, newSoftware: newSoftware, newFlag: {flag: "", pattern: ""}})
		}
	}

	addParam() {
		const self = this
		const {newParam} = self.state
		const {flag, value} = newParam
		var {newSoftware} = self.state

		if (flag!=="" && value!=="") {
			var len = newSoftware.patterns.length

			newSoftware.patterns.push({flag: flag, value: value, position: len+1})
			self.setState({...self.state, newSoftware: newSoftware, newParam: {flag: "", value: ""}})
		}
	}	


	getTableCommand() {
		const self = this
		const {showAdvancedOptions, selectedScript, showTemplate} = self.state

		return(
			<Table className="mt-3 mb-3" hidden={selectedScript=="none"} expanded={false} responsive bordered hover size="sm">
				{showTemplate ? self.getTableTemplate() : null}
				
				{self.getTableHeader()}

				{self.getTableBody()}
			</Table>
			
		)
	}

	getFileManager(){
		return <DcbiaReactFilebrowser createtask={true} startCreatetask={this.createTask} />
	}

	render() {
		const self = this
		const {createTask} = self.state
		return(
			<Container fluid>
				{this.state.showPopUpEditCol ? this.popUpEditCol() : null}
				{this.state.showSavePattern ? this.popUpSavepattern() : null}
				{this.state.showInfosScript ? this.popUpInfosScript() : null}

				<Row>
					<Col>
						{self.manageTasks()}
						{self.getTableCommand()}
		
						{createTask ? null : <div ref={(element) => {this.cardFileManager = element}}>{self.getFileManager()}</div>}
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

export default connect(mapStateToProps)(CreateTask);