import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, Breadcrumb, ProgressBar} from 'react-bootstrap'

import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'


const _ = require('underscore');
const Promise = require('bluebird');


class CreateTask extends Component {
	constructor(props) {
		super(props)
	}




	editrow(e){
		// const self = this
		// const {projectFilesList} = self.state

		// const id = e.target.id
		// const row = id.split('_')[1]
		// console.log(self.state.projectFilesList[row])
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


	addParam(){
		// const self = this
		// const {projectFilesList} = self.state

		// Object.keys(projectFilesList).forEach(id => {
		// 	console.log(id)
		// 	projectFilesList[id][document.getElementById('entryname').value] = document.getElementById('defaultvalue').value
		// })
		// document.getElementById('defaultvalue').value = ''
		// document.getElementById('entryname').value = ''
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
		return <DcbiaReactFilebrowser createtask={true}/>
	}

	render() {
		const self = this

		return(
			<Container fluid>
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

export default connect(mapStateToProps)(CreateTask);