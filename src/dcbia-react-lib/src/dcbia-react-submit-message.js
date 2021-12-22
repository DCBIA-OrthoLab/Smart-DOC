
import React, {Component} from 'react'

import { connect } from "react-redux";
import {Col, Row, Card, InputGroup, FormControl, Button} from 'react-bootstrap'
import {UserMinus} from 'react-feather'

import DcbiaReactService from './dcbia-react-service'


const _ = require('underscore');
const Promise = require('bluebird');


class SubmitMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      subject: "DSCI Access",
      message: "",
      messageSent: false
    }
  }


  componentDidMount() {
    const self = this

    self.dcbiareactservice = new DcbiaReactService();
    self.dcbiareactservice.setHttp(self.props.http);

  }

  sendMessage(){
    const self = this
    const {user} = self.props
    const {subject, message} = self.state
    var doc = {
      user: user.email,
      message
    }

    self.dcbiareactservice.sendUserEmail(doc)
    .then(()=>{
      self.setState({messageSent: true})
    })
  }

  render() {
    const self = this
    const {user} = self.props
    const {subject, message, messageSent} = self.state
    if (user == undefined){
      return <Col></Col>
    }
    var alertMessage = ''
    if(messageSent){
      alertMessage = (<Row>
          <Col>
            <Alert variant="info" >
              Your message has been sent. We will contact you shortly. 
            </Alert>
          </Col>
        </Row>);
    }
    return(
      <Col>
        <Row>
            <Card>
              <Card.Body>
                <Card.Text>
                  Hello {user.name}, currently you do not have full privileges <UserMinus/> to run our methods through DSCI. Please <a href="mailto:jprieto@med.unc.edu?subject=DSCI">contact us</a> to gain full access. <br> 
                  You may also fill out this form and tell us a short description about your project.  
                </Card.Text>
              </Card.Body>
            </Card>
        </Row>
        <Row>
          <Card>
            <Card.Body>
              <InputGroup>
                <InputGroup.Text>Subject</InputGroup.Text>
                <FormControl value={subject} onChange={(e)=>{
                  self.setState({subject: e.target.value})
                }}/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>Message</InputGroup.Text>
                <FormControl as="textarea" rows={3} value={message} onChange={(e)=>{
                    self.setState({message: e.target.value})
                  }}/>
              </InputGroup>
              <Button variant="primary" type="submit" onClick={()=>{
                self.sendMessage()
              }}>
                Submit
              </Button>
            </Card.Body>
          </Card>
        </Row>
        {alertMessage}
      </Col>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.jwtAuthReducer.user,
    http: state.jwtAuthReducer.http,
  }
}

export default connect(mapStateToProps)(SubmitMessage);