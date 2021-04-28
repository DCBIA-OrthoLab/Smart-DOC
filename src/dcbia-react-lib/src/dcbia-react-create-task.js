import React, {Component} from 'react'

import { connect } from "react-redux";
import {Accordion, ListGroup, Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar, Collapse, Tabs, Tab} from 'react-bootstrap'
import {Edit2, X, ChevronDown, ChevronUp, HelpCircle, XCircle} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'

import {ClusterpostService, ClusterpostSoftware} from 'clusterpost-list-react'

const _ = require('underscore');
const Promise = require('bluebird');
const normalize_path = require('normalize-path');
const path = require('path');


class CreateTask extends Component {
	constructor(props) {
		super(props)

		this.state = {
			files: [],
			createTask: true,
			newFlag: {},
			selectedSoftware: {},
			selectedFiles: [],
			runDisabled: true,
			showFiles: false,
			showSavePattern: false,
			softwares: [],
			showInfosScript: false,
			manageScript: true,
			jobName: "",
			objectCMD: null,


			showTemplate: false,

			newSoftware: {
				name: "",
				description: "",
				command: "",
				patterns: []
			},

			activeKey: "softwareTab",

			jobs: []
		}
	}


	componentDidMount() {
		const self = this

		self.dcbiareactservice = new DcbiaReactService();
		self.dcbiareactservice.setHttp(self.props.http);

		self.clusterpostservice = new ClusterpostService();
		self.clusterpostservice.setHttp(self.props.http);

		self.getSoftwares()
	}

	match(f, p){
		const self = this
		try{
			const regex = new RegExp(p.pattern)
			return regex.test(f.name)	
		}catch(e){
			console.error(e)
		}
		
	}

	matchFilesWithPatterns(tree, current_dir){
		const self = this

		const {selectedSoftware} = self.state

		var patterns = selectedSoftware.patterns

		var pattern_matches = {}
		
		_.each(patterns, (p, key)=>{
			pattern_matches[key] = {...p}
			if(p.pattern){
				pattern_matches[key]["matches"] = _.compact(_.map(tree, (f)=>{
					if(f.type == "f"){
						if(self.match(f, p)){
							return {...p, ...f}
						}
					}
				}))
			}
		})

		var max_matches = _.max(_.values(pattern_matches), (match)=>{
			if(match.pattern && match.matches){
				return match.matches.length	
			}
		})

		if(max_matches && max_matches.matches && max_matches.matches.length > 0){
			max_matches = max_matches.matches.length
			_.each(patterns, (p, key)=>{
				if(p.value){
					var value_match = p.value
					if(p.appendMatchDir && current_dir){
						value_match = path.join(current_dir, value_match)
						pattern_matches[key]["matches"] = _.map(_.range(max_matches), ()=>{return {...p, type: 'v', path: value_match}})
					}else{
						pattern_matches[key]["matches"] = _.map(_.range(max_matches), ()=>{return {...p, type: 'v'}})
					}	
				}	
			})
		}

		var sub_matches = _.map(tree, (t)=>{
			if(t.type == "d"){
				return _.flatten(self.matchFilesWithPatterns(t.files, t.path))
			}
		})

		sub_matches = _.compact(sub_matches)

		return _.flatten([pattern_matches, sub_matches])
	}

	startCreatetask(filesMap) {
		const self = this
		const {selectedSoftware, jobName} = self.state
		const {user} = self.props
		const {email} = user

		var matches = self.matchFilesWithPatterns(_.values(filesMap))

		var jobs = Promise.map(matches, (match)=>{

			var zip_matches = _.zip(..._.pluck(match, 'matches'))

			return Promise.map(zip_matches, (zm, index)=>{
				var cmd = [selectedSoftware.command, ..._.compact(_.flatten(_.map(zm, (m)=>{
					if(m){
						var prefix = m.prefix? m.prefix: ""
						var suffix = m.suffix? m.suffix: ""

						if(m.path){
							var dirname = path.dirname(m.path)
							var filename = path.basename(m.path)
							var ext = path.extname(filename)
							return [m.flag, path.join(email, dirname, prefix + filename.replace(ext, "") + suffix + ext)]
						}else if(m.value){
							return [m.flag, prefix + m.value + suffix]
						}
					}
				})))]

				return self.clusterpostservice.parseCLI(cmd)
				.then((job)=>{

					job.data = {
						software_id: selectedSoftware._id
					}

					job.inputs = _.map(zm, (m)=>{
						if(m && m.type == 'f'){
							return {
								name: email + '/' + m.path,
								local_storage: true
							}
						}
					})

					job.inputs = _.compact(job.inputs)

					//find the smallest common directory
					var target_path = _.reduce(zm, (mem, m)=>{
						if(m && m.type == 'f'){
							var dirname = path.dirname(m.path)
							if(dirname.length < mem || mem == ''){
								return dirname
							}
						}
						return mem
					}, '')

					target_path = email + '/' + target_path

					job.outputs.push({
						type: 'directory',
						name: './',
						local_storage: {
							target_path
						}
					})

					job.userEmail = email
					job.name = _.uniqueId(jobName)

					return job
				})
			})
		})
		.then((jobs)=>{
			jobs = _.flatten(jobs)
			self.setState({jobs, runDisabled: false})
		})

	}

	submitJobs(){
		const self = this;
		const {jobs} = self.state;
		return Promise.map(jobs, (job)=>{
			if(job.inputs.length > 0){
				return self.clusterpostservice.createAndSubmitJob(job)	
			}
			return false
		}, {concurrency: 1})
		.catch((e)=>{
			console.error(e)
		})
		
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
		const {showInfosScript, selectedSoftware} = self.state

		return (	
			<Modal show={showInfosScript} onHide={() => this.setState({showInfosScript: false})}>
				<Modal.Header closeButton>
					<Modal.Title>
						{selectedSoftware.name}
					</Modal.Title>  
				</Modal.Header>
				<Modal.Body>
					{selectedSoftware.description}
				</Modal.Body>
				<Modal.Footer>
						<Button variant="danger" onClick={() => {self.clusterpostservice.deleteSoftware(selectedSoftware).then(()=>{self.getSoftwares()}); self.setState({showInfosScript: false, selectedSoftware: "none"})}}>
							<XCircle/> Delete software
						</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	getSoftwares() {
		const self = this

		self.clusterpostservice.getSoftware()
		.then(res => {
			self.setState({softwares: res.data})
		})
	}

	getJobListItem(job){

		var variant = job.inputs.length > 0? 'success': 'danger'
		return (<ListGroup.Item id={_.uniqueId("ListGroupTasks")} variant={variant}>{
			<OverlayTrigger
				trigger="click"
				key='right'
				placement='right'
				overlay={
					<Popover>
						<Popover.Title as="h3">Inputs</Popover.Title>
						<Popover.Content>
							<Row>
								<Col>
									<Card>
										<Card.Title>
											Inputs
										</Card.Title>
										<Card.Body>
											<ListGroup>
												{
													_.map(job.inputs, (input)=>{
														return (<ListGroup.Item>
															{
																JSON.stringify(input, null, 2).replace(/\\n/g, <br/>)
															}
														</ListGroup.Item>)
													})
												}
											</ListGroup>
										</Card.Body>
									</Card>
								</Col>
								<Col>
									<Card>
										<Card.Title>
											Outputs
										</Card.Title>
										<Card.Body>
											<ListGroup>
												{
													_.map(job.outputs, (output)=>{
														return (<ListGroup.Item>
															{
																JSON.stringify(output).replace(/\\n/g, <br/>)
															}
														</ListGroup.Item>)
													})
												}
											</ListGroup>
										</Card.Body>
									</Card>
								</Col>
							</Row>
						</Popover.Content>
					</Popover>
					}
					>
				<Button variant="outline-info">{job.executable + " " + job.parameters.join(" ")}</Button>
			</OverlayTrigger>
		}</ListGroup.Item>)
	}

	getJobsList() {
		const self = this
		const {jobs} = self.state

		return (
			<Accordion>
				<Card>
					<Card.Header>
						<Accordion.Toggle as={Button} eventKey="0">
							Preview tasks
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="0">
						<ListGroup>
							{
								_.map(jobs, (job)=>{
									return self.getJobListItem(job)
								})
							}
						</ListGroup>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		)
	}

	editSoftware(){
		const self = this
		var {selectedSoftware} = self.state
		self.setState({...self.state, editSoftware: true, activeKey: "createSoftwareTab", newSoftware: selectedSoftware})
	}

	manageTasks() {
		const self = this
		const {createTask, files, runDisabled, showFiles, filesSearch, manageScript, newPatternName, showInfosScript, outputDirectory} = self.state
		const {activeKey} = self.state
		
		var selectedFiles = []
		files.forEach(elem => {
			selectedFiles.push(
				<i style={{"font-size": "15px"}}> {elem} , </i>
			)
		})

		return (
			<Alert style={{borderColor: "#1b273e", borderWidth: 3, borderRadius: 10}}>
				<Tab.Container id="left-tabs-example" defaultActiveKey="softwareTab" activeKey={activeKey}>
					<Row>
						<Col>
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link eventKey="softwareTab" onClick={()=>{self.setState({...self.state, activeKey: "softwareTab"})}}>Software</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="createSoftwareTab" onClick={()=>{self.setState({...self.state, activeKey: "createSoftwareTab"})}}>Create/Edit software</Nav.Link>
								</Nav.Item>
							</Nav>
						</Col>
					</Row>
					<Row>
						<Col>
							<Alert variant="secondary">
								<Tab.Content>
									<Tab.Pane eventKey="softwareTab">
										{self.chooseSoftware()}
									</Tab.Pane>
									<Tab.Pane eventKey="createSoftwareTab">
										{self.createNewExecutable()}
									</Tab.Pane>
								</Tab.Content>
							</Alert>
						</Col>
					</Row>
				</Tab.Container>
			</Alert>
		)
	}



	chooseSoftware() {
		const self = this
		const {selectedSoftware, softwares, runDisabled} = self.state

		return (
			<ButtonGroup>
				<Dropdown className="mt-1 mb-1 ml-2 mr-2">
				  <Dropdown.Toggle variant="info">
				    <i>Select: {selectedSoftware.name}</i>
				  </Dropdown.Toggle>
				  <Dropdown.Menu>
			  		{
			  			_.map(softwares, (software) =>{
			  					return (<Dropdown.Item onClick={(e) => {
			  						self.setState({
			  							selectedSoftware: software
			  						})
			  					}}>{software.name}</Dropdown.Item>)
			  				}
			  			)
			  		}
				  </Dropdown.Menu>
				</Dropdown>

				<HelpCircle style={{color: "green", height: 20, cursor: "pointer", top: 0, bottom: 0, margin: "auto"}} onClick={() => self.setState({showInfosScript: true})}/>
				<Edit2 style={{color: "green", height: 20, cursor: "pointer", top: 0, bottom: 0, margin: "auto"}} onClick={() => self.editSoftware()}/>

				<FormControl placeholder="job name" className="mt-1 mb-1 ml-1 mr-1" style={{width: "30%"}} value={self.jobName} onChange={(e) => self.setState({jobName: e.target.value})}/> 

				<Button size="sm" disabled={runDisabled} variant="success" onClick={() => self.submitJobs()}> Run! </Button>

			</ButtonGroup>
		)

	}

	createNewExecutable() {
		const self = this
		var {newSoftware} = self.state
		
		return (
			<ClusterpostSoftware newSoftware={newSoftware}/>
		)
	}

	getFileManager(){
		const self = this;
		return <DcbiaReactFilebrowser createtask={true} startCreatetask={(filesMap)=>{self.startCreatetask(filesMap)}} />
	}

	render() {
		const self = this
		const {createTask} = self.state
		return(
			<Container fluid="true">
				
				{this.state.showInfosScript ? this.popUpInfosScript() : null}
				{self.manageTasks()}
				{self.getJobsList()}
				{self.getFileManager()}
					
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