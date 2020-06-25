import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar, Collapse} from 'react-bootstrap'
import {Edit2, X, ChevronDown, ChevronUp, HelpCircle, XCircle} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'

import {ClusterpostService} from 'clusterpost-list-react'

const _ = require('underscore');
const Promise = require('bluebird');



class CreateTask extends Component {
	constructor(props) {
		super(props)

		this.state = {
			files: [],
			createTask: true,
			newFlag: {
				pattern : "",
				flag: "",
				suffix: ""
			},
			newParam: {
				flag: "",
				value: ""
			},
			selectedScript: "none",
			runDisabled: true,
			showFiles: false,
			showSavePattern: false,
			scriptsInfos: [],
			showInfosScript: false,
			manageScript: true,
			jobName: "",
			selectedCMD: {},
			objectCMD: null,


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



	createTask(files) {
		const self = this

		self.setState({
			...self.state, 
			files: files},
			() => self.getMatchDir()

		)
		self.cardTask.scrollIntoView({behavior: "smooth"})
		self.setState({runDisabled: false})

	}


	updateScript(scriptClicked) {
		const self = this
		const {scriptsInfos} = self.state

		scriptsInfos.forEach(script => {
			if (script.scriptname==scriptClicked) {
				self.setState({
					selectedScript: scriptClicked,
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
					{pattern.flag ? pattern.flag : pattern.position}
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
		const {files} = self.state
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
					filename = filename.slice(0, ind) + pattern.suffix + filename.slice(ind);
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





	popUpInfosScript() {
		const self = this
		const {showInfosScript, selectedScript, selectedCMD} = self.state

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
			
			newSoftware.type = "tasksInfos"
			self.dcbiareactservice.uploadscript(newSoftware)
			
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

				if (jobName =="") {
					job.name = "job_"+job_nbr
				} else {
					job.name = jobName+"_"+job_nbr
				}
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
				// console.log(job)
				return self.clusterpostservice.createAndSubmitJob(job)
				.catch((e)=>{
					console.error(e)
				})
			})	
		}, {concurrency: 1})
	}



	manageTasks() {
		const self = this
		const {createTask, files, runDisabled, showFiles, filesSearch, manageScript, newPatternName, showInfosScript, outputDirectory} = self.state
		
		var selectedFiles = []
		files.forEach(elem => {
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
					<Alert.Heading> search in selected files </Alert.Heading>
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
		const {selectedScript, scriptsInfos} = self.state


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
				
				<InputGroup className="mt-1 mb-1 ml-2 mr-2">
					<Button size="sm" variant="primary" onClick={() => self.addFilePattern()}> add file pattern</Button>
					
					<FormControl size="sm" value={newFlag.flag} placeholder="flag" type="text" autoComplete="off" onChange={(e) => {newFlag.flag = e.target.value; self.setState({...self.state, newFlag})}}/>
					<FormControl size="sm" value={newFlag.pattern} placeholder="pattern" type="text" autoComplete="off" onChange={(e) => {newFlag.pattern = e.target.value; self.setState({...self.state, newFlag})}}/>
					<FormControl size="sm" hidden={newFlag.flag!=="--out"} value={newFlag.suffix} placeholder="suffix" type="text" autoComplete="off" onChange={(e) => {newFlag.suffix = e.target.value; self.setState({...self.state, newFlag})}}/>
				</InputGroup>

				<InputGroup className="mt-1 mb-1 ml-2 mr-2">
					<Button size="sm" variant="primary" onClick={() => self.addParam()}> add flag parameter</Button>
					
					<FormControl size="sm" value={newParam.flag} placeholder="flag" type="text" autoComplete="off" onChange={(e) => {newParam.flag = e.target.value; self.setState({...self.state, newParam})}}/>
					<FormControl size="sm" value={newParam.value} placeholder="value" type="text" autoComplete="off" onChange={(e) => {newParam.value = e.target.value; self.setState({...self.state, newParam})}}/>
				</InputGroup>

				<InputGroup>
					<FormControl size="sm" value={newSoftware.command} placeholder="executable" type="text" autoComplete="off" onChange={(e) => {newSoftware.command = e.target.value; self.setState({...self.state, newSoftware})}}/>
					<Button className="mt-1 mb-1 ml-2 mr-2" disabled={newSoftware.command==""} size="sm" variant="success" onClick={() => self.setState({showSavePattern: true})}> Save pattern </Button>
				</InputGroup>

			</Container>
		)
	}

	addFilePattern() {
		const self = this
		const {newFlag} = self.state
		const {flag, pattern, suffix} = newFlag
		var {newSoftware} = self.state


		if (pattern!=="" && flag!=="") {
			var len = newSoftware.patterns.length
			if (flag=="--out"&&suffix!=="") {
				newSoftware.patterns.push({flag: flag, pattern: pattern, suffix: suffix, position: len+1})
			} else if (flag!=="--out"){
				newSoftware.patterns.push({flag: flag, pattern: pattern, position: len+1})				
			} else {return}
			self.setState({...self.state, newSoftware: newSoftware, newFlag: {flag: "", pattern: "", suffix: ""}})
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
		const {selectedScript, showTemplate} = self.state

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