import React, { Component } from 'react';

import {Button, Card, Badge, FormControl, InputGroup} from 'react-bootstrap'
import { connect } from "react-redux";

import {FilePlus} from 'react-feather'

import DcbiaReactService from './dcbia-react-service'

class Projects extends Component {
	constructor(props) {
		super(props);

		this.dcbiareactservice = new DcbiaReactService();
		this.dcbiareactservice.setHttp(this.props.http);		

		console.log(props.user)

		this.state = {
			showAddProject: false,
			project: {
				name: "",
				type: "project",
				description: "",
				collections: [],
				owner: this.props.user ? this.props.user.email:  ''
			},
		}
		console.log(this.state.project)
	}

	getAddProject() {
		const self = this;
		if (this.state.showAddProject) {
			return(
				<container>
					<Card className="mb-4">
							<InputGroup className="mb-3 mt-3 mr-3 ml-3">
								<InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
								<FormControl placeholder="Project name" 
											 value={self.state.project.name} 
											 onChange={(e) => {
											 	var project = self.state.project;
											 	project.name = e.target.value;
											 	self.setState({...self.state, project})
											 }} />     
							</InputGroup>

							<InputGroup className="mb-3 mt-3 mr-3 ml-3">
								<InputGroup.Text id="basic-addon2">Description</InputGroup.Text>
								<FormControl placeholder="Write description of the project" 
											 value={self.state.project.description} 
											 onChange={(e) => {
											 	var project = self.state.project;
											 	project.description = e.target.value;
											 	self.setState({...self.state, project})
											 }} />
							</InputGroup>

						</Card>
						<Card> 
							<Card.Title> Add existing collections to the project </Card.Title>
						</Card>
						<Button variant="outline-success" className="mb-5" 
								disabled={self.state.project.name === "" || self.state.project.description === ""} 
								onClick={this.createProject.bind(this)}>Create new project</Button>
				</container>)
		}else{ 
			return false }
	}

	createProject() {
		const self = this;
		console.log(self.state.project)

		if (self.state.project.name === null || self.state.project.description === null) {
			return false
		}
		return self.dcbiareactservice.createProject(self.state.project)
		.then(response => { 
			console.log(response)
		})
		.catch(error => {
		    console.log(error.response)
		});		
		return true;
		}


	render() {
		let addProjectComponent;
		const self = this;

		return (
<div class="container">
        <div class="row justify-content-center">
          <div class="card col-8">
            <div class="card-body">				
            <Card className="mb-2 w-50">
					<Button variant="outline-primary" size="lg" 
						onClick={() => this.setState({
							showAddProject: !this.state.showAddProject})}>
						<t> <FilePlus/> New Project </t></Button>
				</Card>

				{self.getAddProject()}
			
				<Card className="w-50 text-center">
					<h2><Badge pill variant="secondary>"> All Projects </Badge></h2>
					<h4><Badge pill variant="secondary>"> Number of items : </Badge></h4>
				</Card>
            </div>
          </div>
        </div>
      </div>
       )
	}
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.jwtAuthReducer.user,
    http: state.jwtAuthReducer.http
  }
}

export default connect(mapStateToProps)(Projects);