import React, { Component } from 'react';
import { Route, HashRouter} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './nav-bar'
import Activity from './Activity'

import {JWTAuth, JWTAuthInterceptor, JWTAuthProfile, JWTAuthService, JWTAuthUsers} from 'react-hapi-jwt-auth';

import Container from 'react-bootstrap/Container';
import Accordion from'react-bootstrap/Accordion';
import Alert from'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";

import axios from 'axios';
import store from "./redux/store";

import {DcbiaReactProjects, DcbiaReactMorphologicalData, DcbiaReactClinicalData, DcbiaReactFilebrowser, DcbiaReactCreateTask, DcbiaReactService, DcbiaReactSubmitMessage} from 'dcbia-react-lib'
import {ClusterpostJobs, ClusterpostTokens, ClusterpostDashboard} from 'clusterpost-list-react'
import {MedImgSurf} from 'react-med-img-viewer';

import { Chrono } from "react-chrono";

import {FolderPlus, Share2, BookOpen, Book, User} from 'react-feather'

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
      test: false,
      showIntegration: false,
      showUtilities: false,
      showSegmentation: false,
      showTimeLineLogin: false
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
      url: '/surf/skull.vtk',
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

  createUser(){
    const self = this;
    const {newUser} = self.state

    console.log(newUser)

  }

  showLanding(){
    return (
      this.showAbout());
  }

  showAbout(){
    const self = this;
    const {landingVtk, showIntegration, showUtilities, showSegmentation, showTimeLineLogin} = this.state;
    var newUser = this.state.newUser

    // return (
    //   <Carousel style={{height: "50%"}} variant="primary">
    //   <Carousel.Item>
    //       <Container fluid="true" style={{height: "40%"}}>
    //         <Row>
    //           <Col sm={6}>
    //             <Card>
    //               <Card.Body>
    //                 <Card.Text>
    //                   An open-source, free comprehensive platform for data sharing and computation
    //                   allowing dental researchers scientists to support patient-specific decision making and assessment of the disease progression.
    //                 </Card.Text>
    //               </Card.Body>
    //               <Card.Img variant="top" src="images/teeth.png"/>
    //             </Card>
    //           </Col>
    //           <Col sm={6}>
    //             <MedImgSurf data={[{data: landingVtk, color: [0,255,255]}]}/>
    //           </Col>
    //         </Row>
    //       </Container>
    //     </Carousel.Item>
    //     <Carousel.Item>
    //       <img
    //         src="images/Slide1.jpg"
    //         alt="First slide"
    //       />
    //       <Carousel.Caption style={{color: "goldenrod"}}>
    //         <h3>Root Canal Segmentation (RCSeg)</h3>
    //         <p>Also available in a docker container. Further documentation <a href="https://github.com/DCBIA-OrthoLab/CBCT_seg" target="_blank">here</a></p>
    //       </Carousel.Caption>
    //     </Carousel.Item>
    //     <Carousel.Item>
    //       <img
    //         src="images/Slide2.jpg"
    //         alt="Second slide"
    //       />

    //       <Carousel.Caption style={{color: "goldenrod"}}>
    //         <h3>Dental Model Segmentation (DentalModelSeg)</h3>
    //         <p>Also available in a docker container. Further documentation <a href="https://github.com/DCBIA-OrthoLab/fly-by-cnn" target="_blank">here</a></p>
    //       </Carousel.Caption>
    //     </Carousel.Item>
    //     <Carousel.Item>
    //       <img
    //         src="images/Slide3.jpg"
    //         alt="Third slide"
    //       />

    //       <Carousel.Caption style={{color: "goldenrod"}}>
    //         <h3>Universal labeling and merging</h3>
    //         <p>Also available in a docker container. Further documentation <a href="https://github.com/DCBIA-OrthoLab/fly-by-cnn" target="_blank">here</a></p>
    //       </Carousel.Caption>
    //     </Carousel.Item>
    //   </Carousel>)
    return (<Chrono mode="VERTICAL">
              <Container>
                <Row>
                  <h2>Data Storage for Computation and Integration</h2>
                </Row>
                <Row>
                  <Col sm={4}>
                    <Card>
                      <Card.Body>
                        <Card.Text>
                          The Data Storage for Computation and Integration (DSCI) is an open-source comprehensive platform for data storage, sharing and computation allowing clinicians and dental researchers to support patient-specific decision in Dentistry.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <MedImgSurf data={[{data: landingVtk, color: [0,255,255]}]}/>
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row>
                  <h2>Data Storage </h2>
                </Row>
                <Row>
                  <Col sm={4}>
                    <Card>
                      <Card.Body>
                        <FolderPlus color="green" size={120}/>
                        <Card.Text>
                          Create folders and archive anonymized data in a safe cloud base environment 
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card>
                      <Card.Body>
                        <Share2 color="red" size={120}/>
                        <Card.Text>
                          Create folders and archive anonymized data in a safe cloud base environment 
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row>
                  <h2>Computation and Integration</h2>
                </Row>
                <Row>
                  <Col sm={3}>
                    <Alert variant="warning">
                      <Alert.Heading>Integration</Alert.Heading>
                      <p>
                        9 tasks
                      </p>
                      <hr/>
                      <div className="d-flex justify-content-end">
                        <Button onClick={()=>{self.setState({showIntegration: !showIntegration, showUtilities: false, showSegmentation: false})}} variant="warning">
                          <BookOpen hidden={showIntegration}/>
                          <Book hidden={!showIntegration}/>
                        </Button>
                      </div>
                    </Alert>
                  </Col>
                  <Col sm={3}>
                    <Alert variant="dark">
                      <Alert.Heading>Utilities</Alert.Heading>
                      <p>
                        4 tasks
                      </p>
                      <hr/>
                      <div className="d-flex justify-content-end">
                        <Button onClick={()=>{self.setState({showUtilities: !showUtilities, showIntegration: false, showSegmentation: false})}} variant="dark">
                          <BookOpen hidden={showUtilities}/>
                          <Book hidden={!showUtilities}/>
                        </Button>
                      </div>
                    </Alert>
                  </Col>
                  <Col sm={3}>
                    <Alert variant="warning">
                      <Alert.Heading>Segmentation</Alert.Heading>
                      <p>
                        5 tasks
                      </p>
                      <hr/>
                      <div className="d-flex justify-content-end">
                        <Button onClick={()=>{self.setState({showSegmentation: !showSegmentation, showIntegration:false, showUtilities: false})}} variant="warning">
                          <BookOpen hidden={showSegmentation}/>
                          <Book hidden={!showSegmentation}/>
                        </Button>
                      </div>
                    </Alert>
                  </Col>
                  <Col sm={3}>
                    <p>
                      Create several tasks that will help patient-specific decisions required in different specialties in Dentistry
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Card style={showIntegration? {display: 'block'}: {display: 'none'}}>
                      <Container fluid="true">
                        <Row>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/tmjoai.png"/>
                            </Card>
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/tmjoai_train.png"/>
                            </Card>
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/tmjoai_retrain.png"/>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/ulms.png"/>
                            </Card>
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/tmjpi.png"/>
                            </Card>
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/tmjpi_train.png"/>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/mfsda_select.png"/>
                            </Card>
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/mfsda.png"/>
                            </Card>
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/mfsda_create.png"/>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                  </Card>
                  <Card style={showUtilities? {display: 'block'}: {display: 'none'}}>
                      <Container fluid="true">
                        <Row>
                          <Col sm={6}>
                            <Card>
                              <Card.Img variant="top" src="images/bone_texture.png"/>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card>
                              <Card.Img variant="top" src="images/histogram_match.png"/>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={6}>
                            <Card>
                              <Card.Img variant="top" src="images/merge_csv.png"/>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card>
                              <Card.Img variant="top" src="images/rescale_intensity.png"/>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                  </Card>
                  <Card style={showSegmentation? {display: 'block'}: {display: 'none'}}>
                      <Container fluid="true">
                        <Row>
                          <Col sm={8}>
                            <Row>
                              <Col sm={6}>
                                <Card>
                                  <Card.Img variant="top" src="images/mand_seg.png"/>
                                </Card>
                              </Col>
                              <Col sm={6}>
                                <Card>
                                  <Card.Img variant="top" src="images/root_canal_seg.png"/>
                                </Card>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6}>
                                <Card>
                                  <Card.Img variant="top" src="images/amasss.png"/>
                                </Card>
                              </Col>
                              <Col sm={6}>
                                <Card>
                                  <Card.Img variant="top" src="images/tmjseg.png"/>
                                </Card>
                              </Col>
                            </Row>                            
                          </Col>
                          <Col sm={4}>
                            <Card>
                              <Card.Img variant="top" src="images/dental_model_seg.png"/>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                  </Card>
                </Row>
              </Container>
              <Container>
                <Row>
                  <h2>Why the DSCI?</h2>
                </Row>
                <Row>
                  <Col sm={4}>
                    <p>
                      The DSCI is a user-friendly open access platform that allows the analysis of multimodal 3D image features and diverse patient biological and clinical data in a very easy, quick and simple way.
                    </p>
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row>
                  <Card>
                    <Card.Body>
                      <Card.Text>
                        <Button onClick={()=>{self.setState({showTimeLineLogin: !showTimeLineLogin})}} variant="success">
                        Create Account
                        </Button>
                      </Card.Text>
                      {
                        showTimeLineLogin? <JWTAuth></JWTAuth> : ''
                      }
                    </Card.Body>
                  </Card>
                </Row>
              </Container>
            </Chrono>)
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