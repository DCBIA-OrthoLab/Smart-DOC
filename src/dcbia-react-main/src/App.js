import React, { Component } from 'react';
import { Route, HashRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './nav-bar'
import Activity from './Activity'

import {JWTAuth, JWTAuthInterceptor, JWTAuthProfile, JWTAuthService, JWTAuthUsers} from 'react-hapi-jwt-auth';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { connect } from "react-redux";

import axios from 'axios';
import store from "./redux/store";

import {DcbiaReactProjects, DcbiaReactMorphologicalData, DcbiaReactClinicalData, DcbiaReactFilebrowser, DcbiaReactCreateTask, DcbiaReactService, DcbiaReactSubmitMessage} from 'dcbia-react-lib'
import {ClusterpostJobs, ClusterpostTokens, ClusterpostDashboard} from 'clusterpost-list-react'
import {MedImgSurf} from 'react-med-img-viewer';


class App extends Component {
  
  constructor(props){
    super(props);

    let http = axios;
    if(process.env.NODE_ENV === 'development'){
      http = axios.create({
        baseURL: 'http://localhost:8180'
      });
    }
    
    this.state = {
      user: {},
      showLogin: true,
      test: false
    }

    store.dispatch({
      type: 'http-factory',
      http: http
    });

    this.clusterpost = {};

    const self = this;

    const interceptor = new JWTAuthInterceptor();
    interceptor.setHttp(http);
    interceptor.update();
    
    const jwtauth = new JWTAuthService();
    jwtauth.setHttp(http);
    this.jwtauth = jwtauth;

    self.dcbiareactservice = new DcbiaReactService();
    self.dcbiareactservice.setHttp(http);

    http({
      method: 'GET',
      url: '/surf/condyle.vtk',
      responseType: 'text'
    })
    .then((res)=>{
      self.setState({...self.state, landingVtk: res.data});
    })

    jwtauth.getUser()
    .then((user)=>{store.dispatch({
        type: 'user-factory', 
        user: user
      })
      ;
      self.setState({user: user, showLogin: false})
    })
    .catch((e)=>{
      console.error(e)
    })
    .then(()=>{
      return self.dcbiareactservice.getUsers()
      .then((dsciUsers)=>{
        self.setState({...self.state, dsciUsers: dsciUsers.data});
      })
      .catch((e)=>{
        console.error(e);
      })
    })
    .then(()=>{
      return jwtauth.getUsers()
      .then((users)=>{
        self.setState({...self.state, users: users.data});
      })
      .catch((e)=>{
        console.error(e)
      })
    })
      
  }

  showLanding(){
    return (
      this.showAbout());
  }

  showAbout(){
    const {landingVtk} = this.state;
    return (
      <Carousel style={{height: "50%"}} variant="primary">
      <Carousel.Item>
          <Container fluid="true" style={{height: "40%"}}>
            <Row>
              <Col sm={6}>
                <Card>
                  <Card.Body>
                    <Card.Text>
                      An open-source, free comprehensive platform for data sharing and computation
                      allowing dental researchers scientists to support patient-specific decision making and assessment of the disease progression.
                    </Card.Text>
                  </Card.Body>
                  <Card.Img variant="top" src="images/teeth.png"/>
                </Card>
              </Col>
              <Col sm={6}>
                <MedImgSurf data={[{data: landingVtk, color: [0,255,255]}]}/>
              </Col>
            </Row>
          </Container>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="images/Slide1.jpg"
            alt="First slide"
          />
          <Carousel.Caption style={{color: "goldenrod"}}>
            <h3>Root Canal Segmentation (RCSeg)</h3>
            <p>Also available in a docker container. Further documentation <a href="https://github.com/DCBIA-OrthoLab/CBCT_seg" target="_blank">here</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="images/Slide2.jpg"
            alt="Second slide"
          />

          <Carousel.Caption style={{color: "goldenrod"}}>
            <h3>Dental Model Segmentation (DentalModelSeg)</h3>
            <p>Also available in a docker container. Further documentation <a href="https://github.com/DCBIA-OrthoLab/fly-by-cnn" target="_blank">here</a></p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="images/Slide3.jpg"
            alt="Third slide"
          />

          <Carousel.Caption style={{color: "goldenrod"}}>
            <h3>Universal labeling and merging</h3>
            <p>Also available in a docker container. Further documentation <a href="https://github.com/DCBIA-OrthoLab/fly-by-cnn" target="_blank">here</a></p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>)
  }

  sendMessage(){
    const self = this
    const {subject, message} = self.state

    console.log(subject, message)
  }
 
  showHome(){
    const self = this
    const {user, subject, message} = this.state;
    if(user && user.scope && user.scope.indexOf('clusterpost') != -1){
      return (
        <Container fluid="true">
            <ClusterpostDashboard/>
        </Container>);
    }else{
      return (
        <Container fluid="true">
          <DcbiaReactSubmitMessage/>
        </Container>
      )
    }
  }

  showComputing(){
    return (
      <Container fluid="true">
          <ClusterpostJobs/>
      </Container>);
  }

  showFilebrowser(){
    return (
      <Container fluid="true">
        <DcbiaReactFilebrowser users={this.state.dsciUsers} />
      </Container>
    )
  }

  showCreatetask(){
    return (
      <Container fluid="true">
        <DcbiaReactCreateTask users={this.state.dsciUsers}/>
      </Container>
    )
  }

  adminUsers(){
    return (<div class="container">
        <div class="row justify-content-center">
          <JWTAuthUsers></JWTAuthUsers>
        </div>
      </div>);
  }

  adminServers(){
    return (<div class="container">
      <div class="row justify-content-center">
        <ClusterpostTokens></ClusterpostTokens>
      </div>
    </div>);
  }  

  componentWillReceiveProps(newProps){
     if(newProps.user !== this.props.user){
         this.setState({user: newProps.user})
     }
     this.setState({showLogin: true});
  }

  handleHide(){
    this.setState({...this.state, showLogin: false});
    this.setState({});
  }

  login(){
    const {showLogin} = this.state;

    return (<Modal size="lg" show={showLogin} onHide={this.handleHide.bind(this)}>
              <div class="alert alert-info">
                <Modal.Header closeButton>
                  <Modal.Title>Please login</Modal.Title>
                </Modal.Header>
              </div>
              <Modal.Body><JWTAuth></JWTAuth></Modal.Body>
            </Modal>);
  }

  profile(){
    return (<div class="container">
        <div class="row justify-content-center">
          <div class="card col-8">
            <div class="card-body">
              <JWTAuthProfile></JWTAuthProfile>
            </div>
          </div>
        </div>
      </div>);
  }

    render() {
      return (
        <HashRouter>
          <header className="App-header">
            <NavBar jwtauth={this.jwtauth}/>
          </header>
          
          <Container fluid="true" style={{height: "100%", minHeight: "90vh"}}>
            <Route path="/login" component={this.login.bind(this)}/>
            <Route path="/logout" component={this.showLanding.bind(this)}/>
            <Route path="/user" component={this.profile.bind(this)}/>
            <Route path="/filebrowser" component={this.showFilebrowser.bind(this)}/>
            <Route path="/createtask" component={this.showCreatetask.bind(this)}/>
            <Route path="/computing" component={this.showComputing.bind(this)}/>
            <Route path="/admin/users" component={this.adminUsers.bind(this)}/>
            <Route path="/admin/servers" component={this.adminServers.bind(this)}/>
            <Route path="/about" component={this.showHome.bind(this)}/>
            <Route path="/home" component={this.showHome.bind(this)}/>
            <Route exact path="/" component={this.showLanding.bind(this)}/>
          </Container> 
        </HashRouter>
      )
    }
  }

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.jwtAuthReducer.user,
    showLogin: state.navbarReducer.showLogin,
  }
}

export default connect(mapStateToProps)(App);