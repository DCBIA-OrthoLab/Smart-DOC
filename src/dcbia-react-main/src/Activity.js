import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';

class Activity extends Component {

	render() {

		return (
			<Card>
				<h2> Welcome User </h2> <h4>history </h4>
				<Tabs defaultActiveKey="month" id="tab-history">
				  <Tab eventKey="week" title="Last week">
				  	<Card></Card>
				  </Tab>
				  <Tab eventKey="month" title="Last month">
				  	<Card></Card>
				  </Tab>
				  <Tab eventKey="year" title="Last year">
				  	<Card></Card>
				  </Tab>
				</Tabs> 
			</Card>
		)
	}
}

export default Activity