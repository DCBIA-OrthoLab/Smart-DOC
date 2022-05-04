import React, {Component} from 'react'

import { connect } from "react-redux";
import {Accordion, ListGroup, Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Modal, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, NavDropdown, Breadcrumb, ProgressBar, Collapse, Tabs, Tab} from 'react-bootstrap'
import {Edit2, X, ChevronDown, ChevronUp, HelpCircle, XCircle, File} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'

import {ClusterpostService, ClusterpostSoftware} from 'clusterpost-list-react'

const _ = require('underscore');
const Promise = require('bluebird');
const normalize_path = require('normalize-path');
const path = require('path');

import { withRouter } from 'react-router-dom';

import qs from 'query-string';

class EditCSV extends Component {
	constructor(props) {
		super(props)

		this.state = {
			file: {},
			csv: props.csv
		}

		if(this.state.csv && this.state.csv.path){
			this.props.history.push({
	      search: qs.stringify({csv: this.state.csv.path})
	    });
		}

		
	}


	componentDidMount() {
		const self = this

		self.dcbiareactservice = new DcbiaReactService();
		self.dcbiareactservice.setHttp(self.props.http);

		self.clusterpostservice = new ClusterpostService();
		self.clusterpostservice.setHttp(self.props.http);

	}

	render() {
		const self = this
		const {createTask} = self.state
		return(
			<Container fluid="true">
				"EDIT"				
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

export default withRouter(connect(mapStateToProps)(EditCSV));