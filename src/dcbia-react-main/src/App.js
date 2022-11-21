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
import ListGroup from 'react-bootstrap/ListGroup';
import { connect } from "react-redux";

import axios from 'axios';
import store from "./redux/store";

import {DcbiaReactProjects, DcbiaReactMorphologicalData, DcbiaReactClinicalData, DcbiaReactFilebrowser, DcbiaReactCreateTask, DcbiaReactService, DcbiaReactSubmitMessage} from 'dcbia-react-lib'
import {ClusterpostJobs, ClusterpostTokens, ClusterpostDashboard} from 'clusterpost-list-react'
import {MedImgSurf} from 'react-med-img';

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
      showCreateUser: false,
      showDataFolder: false,
      showDataSharing: false,
      surfData: [{ surf: "skull_d.vtk", color: [0, 255, 255] }]
    }

    store.dispatch({
      type: 'http-factory',
      http: http
    });

    this.clusterpost = {};

    this.showCreateUserRef = React.createRef()

    const self = this;

    const interceptor = new JWTAuthInterceptor();
    interceptor.setHttp(http);
    interceptor.update();
    
    const jwtauth = new JWTAuthService();
    jwtauth.setHttp(http);
    this.jwtauth = jwtauth;

    self.dcbiareactservice = new DcbiaReactService();
    self.dcbiareactservice.setHttp(http);

    // http({
    //   method: 'GET',
    //   url: '/surf/skull_d.vtk',
    //   responseType: 'text'
    // })
    // .then((res)=>{
    //   self.setState({...self.state, landingVtk: res.data});
    // })

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
    const self = this;
    const {landingVtk, showIntegration, showUtilities, showSegmentation, surfData, showDataFolder, showDataSharing, showCreateUser} = this.state;

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
    return (<ListGroup>
              <ListGroup.Item>
                <Row>
                  <h2>Data Storage for Computation and Integration</h2>
                </Row>
                <Row className="justify-content-md-center">
                  <Col sm={4}>
                    <Card style={{border: 'none'}}>
                      <Card.Body>
                        <Card.Text>
                          The Data Storage for Computation and Integration (DSCI) is an open-source comprehensive platform for data storage, sharing and computation allowing clinicians and dental researchers to support patient-specific decision in Dentistry.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <video width="256" height="256" controls  muted  autoPlay>
                      <source src="videos/dsci.mov" type="video/mp4"/>
                    </video>
                  </Col>
                  <Col sm={4}>
                    <MedImgSurf background={[1, 1, 1]} data={surfData}/>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item variant="dark">
                <Row>
                  <h2>Data Storage </h2>
                </Row>
                <Row className="justify-content-md-center">
                  <Col sm={4}>
                    <Card bg="dark" text="light">
                      <Card.Body>
                        <FolderPlus color="green" size={120}/>
                        <Card.Text>
                          Create folders and archive anonymized data in a safe cloud base environment 
                        </Card.Text>
                        <div className="d-flex justify-content-end">
                          <Button onClick={()=>{self.setState({showDataFolder: !showDataFolder, showDataSharing:false})}} variant="light">
                            <BookOpen hidden={showDataFolder}/>
                            <Book hidden={!showDataFolder}/>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card bg="dark" text="light">
                      <Card.Body>
                        <Share2 color="red" size={120}/>
                        <Card.Text>
                          Share small or large data safely with a single click in a few seconds
                        </Card.Text>
                        <div className="d-flex justify-content-end">
                          <Button onClick={()=>{self.setState({showDataFolder: false, showDataSharing:!showDataSharing})}} variant="light">
                            <BookOpen hidden={showDataSharing}/>
                            <Book hidden={!showDataSharing}/>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Container fluid="true" style={showDataFolder? {display: 'block'}: {display: 'none'}}>
                    <Alert variant="dark">
                      <Alert.Heading>Store precious data safely</Alert.Heading>
                      <p>
                        There are a variety of services offered by DSCI that help with storing and managing data. 
                        The 'FAIR Guiding Principles for scientific data management and stewardship' were published in <Alert.Link href='https://www.nature.com/articles/sdata201618'>Scientific Data</Alert.Link> to provide guidelines to improve <i>Findability</i>, <i>Accessibility</i>, <i>Interoperability</i>, and <i>Reuse</i> of digital assets. 
                      </p>
                      <hr/>
                      <p>
                        The principles emphasize machine-actionability (<i>i.e.</i>, the capacity of computational systems
                        to find, access, interoperate, and reuse data with none or minimal human intervention)
                        because humans increasingly rely on computational support to deal with data as a result of the increase in volume, complexity, and creation speed of data.
                      </p>
                    </Alert>
                  </Container>
                  <Container fluid="true" style={showDataSharing? {display: 'block'}: {display: 'none'}}>
                    <Alert variant="dark">
                      <Alert.Heading>Data sharing</Alert.Heading>
                      <p>
                      The ultimate goal of FAIR is to optimize data reusability and sharing. 
                      To achieve this, metadata and data should be well-described so that they can be replicated 
                      and/or combined in different settings. 
                      </p>
                      <hr/>
                      <p>FAIR sharing principles refer to:</p>
                      <ul>
                        <li>Data (or any digital object)</li>
                        <li>Metadata (information about that digital object)</li> 
                        <li>Infrastructure.</li>
                      </ul>
                      <p>
                        Both metadata and data are registered or indexed in a searchable resource (the infrastructure component).
                      </p>
                      <p>
                        For more information, please refer to <Alert.Link href="https://sharing.nih.gov/data-management-and-sharing-policy/about-data-management-and-sharing-policies/data-management-and-sharing-policy-overview">NIH Data Management and Sharing Policy.</Alert.Link>
                      </p>
                    </Alert>
                  </Container>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <h2>Computation and Integration</h2>
                </Row>
                <Row className="justify-content-md-center">
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
                <Row className="justify-content-md-center">
                  <Container fluid="true" style={showIntegration? {display: 'block'}: {display: 'none'}}>
                    <Row>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/tmjoai.png"/>
                        </Card>
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/tmjoai_train.png"/>
                        </Card>
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/tmjoai_retrain.png"/>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/ulms.png"/>
                        </Card>
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/tmjpi.png"/>
                        </Card>
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/tmjpi_train.png"/>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/mfsda_select.png"/>
                        </Card>
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/mfsda.png"/>
                        </Card>
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/mfsda_create.png"/>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                  <Container fluid="true" style={showUtilities? {display: 'block'}: {display: 'none'}}>
                    <Row>
                      <Col sm={6}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/bone_texture.png"/>
                        </Card>
                      </Col>
                      <Col sm={6}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/histogram_match.png"/>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/merge_csv.png"/>
                        </Card>
                      </Col>
                      <Col sm={6}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/rescale_intensity.png"/>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                  <Container fluid="true" style={showSegmentation? {display: 'block'}: {display: 'none'}}>
                    <Row>
                      <Col sm={8}>
                        <Row>
                          <Col sm={6}>
                            <Card style={{border: 'none'}}>
                              <Card.Img variant="top" src="images/mand_seg.png"/>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card style={{border: 'none'}}>
                              <Card.Img variant="top" src="images/root_canal_seg.png"/>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={6}>
                            <Card style={{border: 'none'}}>
                              <Card.Img variant="top" src="images/amasss.png"/>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card style={{border: 'none'}}>
                              <Card.Img variant="top" src="images/tmjseg.png"/>
                            </Card>
                          </Col>
                        </Row>                            
                      </Col>
                      <Col sm={4}>
                        <Card style={{border: 'none'}}>
                          <Card.Img variant="top" src="images/dental_model_seg.png"/>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item variant="dark">
                <Row>
                  <h2>Why the DSCI?</h2>
                </Row>
                <Row className="justify-content-md-center">
                  <Col sm={8}>
                    <Card bg="dark" text="light">
                      <Card.Body>
                        <Card.Text>
                          The DSCI is a user-friendly open access platform that allows the analysis of multimodal 3D image features and diverse patient biological and clinical data in a very easy, quick and simple way.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  {/*<Col sm={4}>
                    <Card>
                      <Card.Img variant="top" src="images/SlicerAutomatedDentalTools.png"/>
                      <Card.Body>
                        <Button variant="primary" href="https://www.slicer.org/">3DSlicer</Button>
                      </Card.Body>
                    </Card>
                  </Col>*/}
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row className="justify-content-md-center">
                  <Card ref={self.showCreateUserRef}>
                    <Card.Body>
                      <Card.Text>
                        <Button onClick={()=>{self.setState({showCreateUser: !showCreateUser})}} variant="success">
                        Create Account
                        </Button>
                      </Card.Text>
                      {
                        showCreateUser? <JWTAuth isCreateUser={true}></JWTAuth> : ''
                      }
                    </Card.Body>
                  </Card>
                </Row>
              </ListGroup.Item>
            </ListGroup>)
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
    
    const self = this

    if(newProps.user !== this.props.user){
       this.setState({user: newProps.user})
    }
    this.setState({showLogin: true});

    if(newProps.showCreateUser !== this.props.showCreateUser){
      this.showCreateUserRef.current.scrollIntoView({ behavior: 'smooth' })
      this.setState({showCreateUser: !self.state.showCreateUser})
    }
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
          
          <Container style={{height: "100%", minHeight: "90vh"}}>
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
    showCreateUser: state.navbarReducer.showCreateUser,
  }
}

export default connect(mapStateToProps)(App);