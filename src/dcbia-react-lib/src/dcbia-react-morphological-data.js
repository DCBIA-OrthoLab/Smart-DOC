import React, { Component } from 'react';

import {Button, Card, Form, FormControl, Container} from 'react-bootstrap'
import { connect } from "react-redux";
import _ from 'underscore';

import {FilePlus} from 'react-feather'

import DcbiaReactService from './dcbia-react-service'

class MorphologicalData extends Component {
	constructor(props) {
		super(props)

		this.dcbiareactservice = new DcbiaReactService();
		this.dcbiareactservice.setHttp(this.props.http);		

		// this.data = self.dcbiareactservice.getMorphologicalDataCollections().data;
		// console.log(this.data)

		this.state = {
			showAddData: false,
			morphologicalDataCollection: [],
			newCollection: {
				type: 'morphologicalDataCollection',
				name: "defaultName",
				scope: "wat",
				owner: this.props.user ? this.props.user.email:  ''
			}
		}
	}

	componentDidMount() {
		this.dcbiareactservice = new DcbiaReactService()
		this.dcbiareactservice.setHttp(this.props.http)

		const self = this;

		self.dcbiareactservice.getMorphologicalDataCollections()
		.then(function(res){
			self.setState({
				...self.state,
				morphologicalDataCollection: res.data
			})
			// console.log(self.state.morphologicalData)
		})
	}

	getAddData() {
		const self = this;

		if (self.state.showAddData) {
			return(
				<container>
					<Card className="mb-4 w-50">
						<Form inline>
							<FormControl type="text" placeholder="Collection name" className="mr-sm-2" />
							<Button variant="outline-success" onClick={this.CreateCollection.bind(this)}>Create</Button>
						</Form>
						Create a new morphological data collection
					</Card>
				</container>) 
		}else{ 
			return false }
	}
	
	CreateCollection() {
		const self = this;

		// self.dcbiareactservice.createMorphologicalDataCollection(self.state.collectionName)
		// .then(response => { 
		// 	console.log(response)
		// })
		// .catch(error => {
		//     console.log(error.response)
		// });	
	}

	render() {
		const self = this;
		let objet = this.state.morphologicalDataCollection;

		return (
			<Container>

				<Card className="mb-2 w-50">
					<Button variant="outline-primary" size="lg" 
						onClick={() => this.setState({showAddData: !this.state.showAddData})}>
						<t> <FilePlus/> New Morphological Data Collection</t></Button>
				</Card>
					{this.getAddData()}
				<Card>
{/*					<Filebrowser data={self.state}/>
*/}				</Card>
            </Container>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.jwtAuthReducer.user,
    http: state.jwtAuthReducer.http
  }
}

export default connect(mapStateToProps)(MorphologicalData);