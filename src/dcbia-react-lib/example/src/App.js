import React, { Component } from 'react'

import {JWTAuth, JWTAuthInterceptor, JWTAuthProfile, JWTAuthService} from 'react-hapi-jwt-auth';


import  {DcbiaReactProjects} from 'dcbia-react-lib'
// import  {DcbiareactService} from 'dcbia-react-lib'
import  {DcbiaReactMorphologicalData} from 'dcbia-react-lib'
// import  {DcbiaReactClinicalData} from 'dcbia-react-lib'


import axios from 'axios';
import store from "./redux/store";


export default class App extends Component {
 
constructor(props){
    super(props);

  }
 


  render () {
    return (
      <div>      
      Projects
        <DcbiaReactMorphologicalData/>
      </div>
    )
  }
}
