import React, {Component} from 'react'

import { connect } from "react-redux";
import {Container, Button, Table, Card, Col, Row, DropdownButton, Dropdown, Form, Alert, OverlayTrigger, Overlay, Tooltip, Popover, Badge, ButtonToolbar, ButtonGroup, InputGroup, FormControl, Spinner, Navbar, Nav, NavDropdown, Breadcrumb, ProgressBar, Modal} from 'react-bootstrap'
import {Save, GitMerge} from 'react-feather'
import DcbiaReactFilebrowser from './dcbia-react-filebrowser'
import DcbiaReactService from './dcbia-react-service'

import {ClusterpostService, ClusterpostSoftware} from 'clusterpost-list-react'

const _ = require('underscore');
const Promise = require('bluebird');
const normalize_path = require('normalize-path');
const path = require('path');
const csvtojson = require("csvtojson");

import { withRouter } from 'react-router-dom';

import qs from 'query-string';

class EditCSV extends Component {
  constructor(props) {
    super(props)

    this.state = {
      file: {},
      csv_obj: props.csv_obj,
      csv_json: {},
      needsSaveOutline: "outline-primary"
    }

    if(this.state.csv_obj && this.state.csv_obj.path){
      this.props.history.push({
        search: qs.stringify({file_path: this.state.csv_obj.path})
      });
    }
    
  }


  componentDidMount() {
    const self = this
    const {csv_obj} = this.state

    self.dcbiareactservice = new DcbiaReactService();
    self.dcbiareactservice.setHttp(self.props.http);

    self.clusterpostservice = new ClusterpostService();
    self.clusterpostservice.setHttp(self.props.http);

    self.dcbiareactservice.downloadFiles(csv_obj.path, 'text')
    .then((res)=>{
      csvtojson()
      .fromString(res.data)
      .then((csv_json)=>{
        self.setState({csv_json})
      })
    })
  }

  saveCSV(){
    const self = this
    const {csv_json, csv_obj} = self.state

    if(csv_json.length > 0){

      var header = _.keys(csv_json[0])
      var csv = header.join(",") + "\n";

      csv += _.map(csv_json, (r)=>{
        return _.map(header, (h)=>{
          return r[h]
        }).join(",")
      }).join("\n") 

      return self.dcbiareactservice.uploadFile(csv_obj.path, csv)
      .then((res)=>{

        self.setState({needsSaveOutline: 'outline-info'})
        
      })
    }
    
  }

  getToolBar(){
    const self = this
    const {needsSaveOutline} = self.state
    return (
      <Navbar bg="light">
          <Nav className="mr-auto">
              <Button variant={needsSaveOutline} onClick={() => self.saveCSV()}>
                <Save/>
              </Button>
              <Button onClick=
                {
                  ()=>{
                    self.setState({showPopupFileSelect: true})
                  }
                }
              >
                <GitMerge/>
              </Button>
          </Nav>
      </Navbar>
    )
  }

  getTable(){
    const self = this
    var {csv_json} = self.state

    if(csv_json.length > 0){
      var table_head = _.keys(csv_json[0])

      return (
        <Col style={{overflow: 'scroll'}}>
          <Table striped bordered hover style={{width: 'max-content'}}>
            <thead>
              <tr>
                {_.map(table_head, (h)=>{
                  return (<th><Form.Control type="text" value={h} onChange={(e)=>{
                    var new_h = e.target.value

                    var csv_json_new_head = JSON.stringify(csv_json).replace("\"" + h + "\":", "\"" + new_h + "\":")
                    self.setState({csv_json: JSON.parse(csv_json_new_head), needsSaveOutline: 'outline-warning'})
                  }}/></th>)
                })}
              </tr>
            </thead>
            <tbody>
              {
                _.map(csv_json, (r, idx)=>{
                  return (
                    <tr>{
                      _.map(table_head, (h)=>{
                        return (<td><Form.Control type="text" name="name" value={r[h]} onChange={(e)=>{
                          csv_json[idx][h] = e.target.value
                          self.setState({csv_json, needsSaveOutline: 'outline-warning'})
                        }}/></td>)
                      })
                    }
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Col>
      )
    }else{
      return <Table></Table>
    }
    
  }

  mergeJSON(csv_json, csv_json_to_merge){
    return csv_json_to_merge
  }

  mergeFiles(filesMap){

    const self = this
    var {csv_json} = self.state
    var k = _.keys(filesMap)

    if(k.length > 0){
      csv_obj = filesMap[k[0]]

      self.dcbiareactservice.downloadFiles(csv_obj.path, 'text')
      .then((res)=>{
        csvtojson()
        .fromString(res.data)
        .then((csv_json_to_merge)=>{
          csv_json = self.mergeJSON(csv_json, csv_json_to_merge)
          self.setState({csv_json})
        })
      })
    }
    
    
  }

  popUpFileSelect() {
    const self = this
    var {showPopupFileSelect, patterns_idx, selectedSoftware} = self.state
    const {user} = self.props
    var initial_value = ""
    if(selectedSoftware && selectedSoftware.patterns && selectedSoftware.patterns.length > patterns_idx){
      initial_value = selectedSoftware.patterns[patterns_idx].value
    }
    return (
      
      <Modal show={self.state.showPopupFileSelect} onHide={() => this.setState({showPopupFileSelect: false})}>
        <Modal.Header closeButton>
          <Modal.Title>Select file</Modal.Title>  
        </Modal.Header>

        <Modal.Body>
          <DcbiaReactFilebrowser createtask={true} startCreatetask={(filesMap)=>{
            self.mergeFiles(filesMap)
            self.setState({showPopupFileSelect: false})
            
          }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => this.setState({showPopupFileSelect: false})} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const self = this
    return(
      <Container fluid="true">
        {self.getToolBar()}
        {self.getTable()}
        {self.popUpFileSelect()}
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