import React, { Component } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import {Home, User, Circle, Folder, LogOut, LogIn, BarChart, FilePlus} from 'react-feather';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

class NavBar extends Component{
  constructor(props) {
    super(props);

    this.state = {
      showLogin: false
    }
  }


  getTaks(){
    const {user, history} = this.props;
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <t onClick={()=>{history.push('/tasks')}}><Circle color="#ffffff"/> Tasks</t>
    }
  }
 
  getClinicalData(){
    const {user, history} = this.props;
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <t onClick={()=>{history.push('/dcbia/morphologicalData')}}><BarChart color="#ffffff"/> Morphological Data</t>
    }
  }

  getMorphologicalData(){
    const {user, history} = this.props;
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <t onClick={()=>{history.push('/dcbia/ClinicalData')}}><BarChart color="#ffffff"/> Clinical Data</t>
    }
  }
  
  getProjects(){
    const {user, history} = this.props;
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <t onClick={()=>{history.push('/dcbia/projects')}}><Folder color="#ffffff"/> Projects</t>  
    }
  }

  getHome(){
    const {user, history} = this.props;
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <t onClick={()=>{history.push('/home')}}><Home color="#ffffff"/> Home</t>
    }
  }  

  getUpload(){
    const {user, history} = this.props;
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <t onClick={()=>{history.push('/dcbia/data')}}><FilePlus color="#ffffff"/> Data</t>
    }
  }  

  onUserLogin(){
    this.props.userLogin(!this.state.showLogin);
    this.setState({...this.state, showLogin: !this.state.showLogin});    
    this.props.history.push('/login');
  }

  getUserDropDown(){
    const {user, history} = this.props;
    
    if(user && user.scope && user.scope.indexOf('default') !== -1){
      return <NavDropdown title={<t><User/>Account</t>} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={()=>{history.push('/user')}}><User/> Profile</NavDropdown.Item>
          <NavDropdown.Divider/>
          <NavDropdown.Item onClick={()=>{history.push('/logout')}}><LogOut/> Logout</NavDropdown.Item>
        </NavDropdown>
    }else{
      return <NavDropdown title={<t><User/>Account</t>} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={this.onUserLogin.bind(this)}><LogIn/> Login</NavDropdown.Item>
        </NavDropdown>
    }
  }
  

  render() {
    const self = this;

    return (
      <Navbar collapseOnSelect bg="primary" expand="lg">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav fill variant="pills" defaultActiveKey="/home">
           
            <Nav.Item className="mr-2 ml-2">
              {self.getHome()} </Nav.Item>
            <Nav.Item className="mr-2 ml-2">
              {self.getUpload()} </Nav.Item>
            <Nav.Item className="mr-2 ml-2"> 
              {self.getClinicalData()} </Nav.Item>
            <Nav.Item className="mr-2 ml-2"> 
              {self.getMorphologicalData()} </Nav.Item>
            <Nav.Item className="mr-2 ml-2"> 
              {self.getProjects()} </Nav.Item>
            <Nav.Item className="mr-2 ml-2"> 
              {self.getTaks()} </Nav.Item> 
          </Nav>

          <Nav className="ml-auto">
            <Nav.Item className="mr-2 ml-2 "> 
              {self.getUserDropDown()} </Nav.Item>
          </Nav>


        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    http: state.jwtAuthReducer.http, 
    user: state.jwtAuthReducer.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (showLogin) => {
      dispatch({
        type: 'user-login',
        showLogin: showLogin
      });
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));