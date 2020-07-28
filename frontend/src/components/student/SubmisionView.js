import React, { Component } from 'react'
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';

import '../../css/students/Submision.scss'
import {
     Button,
     Container,
     Col,
     Row,
     FormGroup,
     FormControl,
 
 
   } from "react-bootstrap";

export class SubmisionView extends Component {
     render() {
          return (
               <React.Fragment>
               <Navbar panel={"student"} />

               <div className="sub-style">

               <div className="sub-background">

               <div className=" card container">

               <div  className="row">
               <div  className="col-sm-1" style={{backgroundColor:'#263238' , height:100}}>

               </div>

               <div className="col-sm-11">
               <h2 className="sup-tittle">Project Proposal </h2>

               <div >
               <a>
               <span>@</span>
               <span className="sub-link">Project Proposal Template File</span>
               </a>
               </div>

               <div >
               <a>
               <span>@</span>
               <span className="sub-link">Project Proposal Submission (Deadline - 2020-05-11 : 11.55 PM)</span>
               </a>
               </div>
               </div>
               </div>
               </div>
               <div className=" card container">

               <div  className="row">
               <div  className="col-sm-1" style={{backgroundColor:'#263238' , height:100}}>

               </div>

               <div className="col-sm-11">
               <h2 className="sup-tittle">Concept Paper </h2>

               <div >
               <a>
               <span>@</span>
               <span className="sub-link">Concept Paper Template</span>
               </a>
               </div>

               <div >
               <a>
               <span>@</span>
               <span className="sub-link">Concept Paper Submission (Deadline - 2020-05-06 : 11.55 PM) Assignment</span>
               </a>
               </div>
               </div>
               </div>
               </div>
               </div>
               </div>
               

               <Footer/>
             </React.Fragment>
          )
     }
}

export default SubmisionView
