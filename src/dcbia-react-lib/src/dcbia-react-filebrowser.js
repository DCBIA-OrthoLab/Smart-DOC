import React, { Component } from 'react';

import {Table, Alert, Container, Button} from 'react-bootstrap'
import {ArrowDownRight} from 'react-feather'
import { connect } from "react-redux";

import DcbiaReactService from './dcbia-react-service'

class fileBrowser extends Component {
	constructor(props) {
		super(props)
	
		this.state = {
			data: ""
		}

		this.dcbiareactservice = new DcbiaReactService();
		this.dcbiareactservice.setHttp(this.props.http);		

	this.displayData = this.displayData.bind(this)
	
	}

	displayData(data) {
		const self = this;
		// console.log("oui")
		// self.dcbiareactservice.getMorphologicalData(id)
		// .then(function(res){
		// 	self.setState({
		// 		...self.state,
		// 		data: res.data
		// 	})
		// })

		// console.log(self.state.data)

		return true;
	}

	render() {
		const pStyle = {
		  fontStyle: 'italic',
		  fontSize: '11px'
		}

		let objet = this.props.data.morphologicalDataCollection;

		return(
			<Container>
				{console.log(this.props.data.morphologicalDataCollection[1])}
				<Alert variant="primary>"> All Existing Morphological data </Alert>
				<Table stripe borderless hover >
				  <thead>
				    <tr>
				      <th>Collection Name</th>
				      <th>Owner</th>
				      <th>Type</th>
				      <th>Number of items</th>
				    </tr>
				  </thead>
				  <tbody>
					{objet.map(collection => 
						<tr>
							<th>{collection.name}</th>
							<th>{collection.owner}</th>
							<th>{collection.type}</th>
							<th>{collection.items.length}</th>
						</tr>
					)}
				  </tbody>
				</Table>
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

export default connect(mapStateToProps)(fileBrowser);