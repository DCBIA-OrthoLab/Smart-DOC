import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar, Collapse} from 'react-bootstrap'
import {Edit2} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'


const _ = require('underscore');
const Promise = require('bluebird');


class CreateTask extends Component {
	constructor(props) {
		super(props)

		this.state = {
			files: [],
			createTask: false,

			newParam: {
				pattern: "",
				name: "",
				defaultValue: ""
			},
			parameters: {},

			showPopUpEditCol: false,
			paramToEdit: ""

		}
		this.createTask = this.createTask.bind(this)
	}

	createTask(files) {
		const self = this
		const {parameters} = self.state

		files.forEach(file => {
			parameters[file] = {}
		})

		self.setState({...self.state, files: files, parameters: parameters, createTask: !self.state.createTask})
	}


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

	manageTaskFiles() {
		const self = this
		const {files, newParam, parameters} = self.state


		var headers = [<th></th>]
		var h = Object.values(parameters)[0]
		if (Object.keys(h).length!==0) {
			Object.keys(h).forEach(param => {
				headers.push(
					<th>
						<Edit2 style={{height: 15, cursor: 'pointer'}} onClick={() => this.setState({showPopUpEditCol: true, paramToEdit: param})}/>
						{param}
					</th>
				)
			})
		}

		var items = []
		files.forEach(file => {

			var paramTable = []
			Object.keys(parameters[file]).forEach(key => {
				paramTable.push(
					<td><FormControl size="sm" value={parameters[file][key]} type="text" autoComplete="off" onChange={(e) => {parameters[file][key]=e.target.value; self.setState({...self.state, parameters: parameters})}}/></td>
				)
			})

			items.push(
				<tr>
					<td>
					<Col>
						<i style={{"font-size": "13px"}}>{file.substring(0, file.lastIndexOf('/') + 1)}</i>
					</Col>
					<Col>
						{file.substring(file.lastIndexOf('/') + 1)}
					</Col>
					</td>
					{paramTable}
				</tr>
			)
		})

		return (
			<React.Fragment>
			<Card>
			<Card.Header > 
				Create Task 
			</Card.Header>
			<Card.Body>
				<InputGroup className="mt-2 mb-2">
					<Button size="sm" variant="outline-primary" onClick={() => self.addParam()}> Add parameter</Button>
	 				<Row><Col><FormControl size="sm" placeholder="pattern" type="text" autoComplete="off" onChange={(e) => {newParam.pattern = e.target.value; self.setState({...self.state, newParam})}}/></Col></Row>
					<Row><Col><FormControl size="sm" placeholder="parameter" type="text" autoComplete="off" onChange={(e) => {newParam.name = e.target.value; self.setState({...self.state, newParam})}}/></Col></Row>
	 				<Row><Col><FormControl size="sm" placeholder="default value" type="text" autoComplete="off" onChange={(e) => {newParam.defaultValue = e.target.value; self.setState({...self.state, newParam})}}/></Col></Row>
				</InputGroup>
				</Card.Body>
			</Card>
			<Table responsive striped bordered hover size="sm" variant="dark">
				<thead>
					<tr>
					{headers}
					</tr>
				</thead>

				<tbody>
					{items}
				</tbody>	
			</Table>
			<Button variant="outline-danger" size="sm" className="ml-2 mr-2" onClick={() => self.setState({...self.state, createTask: false, files: []})}> Back to file selection </Button>
			{/*<Button size="sm" onClick={() => console.log(parameters)}> Log parameters </Button>*/}
			</React.Fragment>
		)
	}



	addParam() {
		const self = this
		const {files, newParam, parameters} = self.state
		const {pattern, name, defaultValue} = newParam
		const search = new RegExp(".*" + pattern + ".*")
		
		files.forEach(file => {
			if (search.test(file)) {
				parameters[file][name] = defaultValue 
			} else {
				parameters[file][name] = ""
			}
		})

		self.setState({...self.state, parameters: parameters})
	}


	popUpEditCol() {
		const self = this
		const {paramToEdit} = self.state
		var paramValue

		return (
			
			<Modal show={this.state.showPopUpEditCol} onHide={() => this.setState({showPopUpEditCol: false, paramToEdit: ""})}>
				<Modal.Header closeButton>
					<Modal.Title>New value for {paramToEdit}</Modal.Title>  
				</Modal.Header>

				<Modal.Body>
				<Form>
					<Form.Control type="text" placeholder="new value" className="mr-sm-2" autoComplete="off" onChange={(e) => paramValue = e.target.value}/>
				</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={() => this.setState({showPopUpEditCol: false})} >
						Cancel
					</Button>
					<Button variant="success" onClick={() => this.editCol(paramValue)}>
						Edit Parameter
					</Button>
				</Modal.Footer>
			</Modal>
		)
	}

	editCol(paramValue){
		const self = this
		const {paramToEdit} = self.state
		var {parameters} = self.state

		console.log(paramValue)
		console.log(paramToEdit)

		Object.keys(parameters).forEach(key => {
			if (parameters[key][paramToEdit]!=="") {
				parameters[key][paramToEdit] = paramValue
			}
		})

		self.setState({...self.state, showPopUpEditCol: false, parameters: parameters, paramToEdit: ""})
	}

	editParamName(header){
		// const self = this
		// const {projectFilesList} = self.state
		// console.log(header)

		// Object.keys(projectFilesList).forEach(key => {
		// 	console.log(projectFilesList[key])

		// 	var data = Object.assign({}, projectFilesList[key])

		// 	// delete projectFilesList[key].name
		// 	// projectFilesList[key].newname = 
		// })
	}	

	editparam(e){
		// const self = this
		// const {projectFilesList} = self.state
		// const id = e.target.id
		// const row = id.split('_')[0]
		// const col = id.split('_')[1]

		// const h = Object.keys(projectFilesList[0])[col]

		// projectFilesList[row][h] = e.target.value
		// self.setState({projectFilesList: projectFilesList})
	}





	searchExp() {
		// const self = this
		// const {projectFilesList} = self.state
		// const search = new RegExp(".*" + document.getElementById('searchPattern').value + ".*")
		// const newParam = document.getElementById('newParam').value
		// const newParamValue = document.getElementById('newParamValue').value
		// console.log(search)
		// console.log(projectFilesList)

		// if (document.getElementById('searchPattern').value) {
			
		// 	var filesAlreadyIn = []
		// 	Object.keys(projectFilesList).forEach(key => {
		// 		filesAlreadyIn.push(projectFilesList[key].name)
		// 	})

		// 	var patients = self.getTree(projectFilesList[0].name)
		// 	patients.forEach(patient => {
		// 		patient.files.forEach(file => {
					
		// 			if (filesAlreadyIn.includes(file.name)) {
		// 				Object.keys(projectFilesList).forEach(key => {
		// 					if (projectFilesList[key].name == file.name) {
		// 						if (search.test(file.name)) {
		// 							projectFilesList[key][newParam] = newParamValue
		// 						} else {
		// 							projectFilesList[key][newParam] = ""
		// 						}
		// 					}
		// 				})
		// 			} else {
						
		// 				var data = Object.assign({}, projectFilesList[0])
		// 				data.name = file.name

		// 				if (search.test(file.name)) {	
		// 					data[newParam] = newParamValue
		// 				} else {
		// 					data[newParam] = ""
		// 				}
		// 				projectFilesList.push(data) 

		// 			}			
		// 		})
		// 	})
		// 	projectFilesList[0][newParam] = ""
		// 	self.setState({projectFilesList: projectFilesList})
		// }
	}





	getFileManager(){
		return <DcbiaReactFilebrowser createtask={true} startCreatetask={this.createTask}/>
	}

	render() {
		const self = this
		const {createTask} = self.state
		return(
			<Container fluid >
				{this.state.showPopUpEditCol ? this.popUpEditCol() : null}

				<Row>
					<Col>
						{createTask ? <div>{self.manageTaskFiles()}</div> : <div>{self.getFileManager()}</div>}
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