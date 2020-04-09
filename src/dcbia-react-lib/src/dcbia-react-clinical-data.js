import React, { Component } from 'react';

import {Button, Card, Badge, Form, FormControl} from 'react-bootstrap'

import {FilePlus} from 'react-feather'

class ClinicalData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			showAddData: false
			}
	}

	render() {
		let addDataComponent;

		if (this.state.showAddData) {
			addDataComponent = (
				<container>
					<Card className="mb-4 w-50">
						<Form inline>
							<FormControl type="text" placeholder="Collection name" className="mr-sm-2" />
							<Button variant="outline-success">Create</Button>
						</Form>
						Create a new clinical data collection
					</Card>
				</container>
			)
		} else { addDataComponent = null }



		return (
			<div class="container">
        <div class="row justify-content-center">
          <div class="card col-10">
            <div class="card-body">

				<Card className="mb-2 w-50">
					<Button variant="outline-primary" size="lg" 
						onClick={() => this.setState({
							showAddData: !this.state.showAddData})}>
						<t> <FilePlus/> New Clinical Data Collection</t></Button>
				</Card>

				{addDataComponent}
			
				<Card className="w-50 text-center">
					<h2><Badge pill variant="secondary>"> All clinical data </Badge></h2>
					<h4><Badge pill variant="secondary>"> Number of items : </Badge></h4>
				</Card>
            </div>
          </div>
        </div>
      </div>
		)
	}



}

export default ClinicalData




