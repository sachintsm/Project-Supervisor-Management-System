import React, { Component } from 'react'
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentIcon from '@material-ui/icons/Assignment';

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

     constructor(props) {
          super(props)
     
          this.state = {
                projectId: this.props.match.params.id,
          }
     }
     
     proposelView = () => {
          this.props.history.push('/studenthome/submisionview/submisionpanal/' + this.state.projectId)
      }

    

     render() {
          return (
               <React.Fragment>
               <Navbar panel={"student"} />

               <div className="sub-style">
               <div className="sub-background">
               <div className=" card container" style={{marginBottom:10}}>
               <div  className="row">
               <div  className="col-xm-1" style={{backgroundColor:'#263238' , height:137, width:35}}>
               </div>
               <div className="col-sm-11">
               <h2 className="sup-tittle">Project Proposal </h2>
               <div >
               <a>
               <span><AttachmentIcon/></span>
               <span className="sub-link">Project Proposal Template File</span>
               </a>
               </div>

               <div >
               <a>
               <span><AssignmentIcon/></span>
               <span className="sub-content" >Project Proposal Submission (Deadline - 2020-05-11 : 11.55 PM)</span>
               </a>
               </div>

               <Button style={{marginLeft:910,marginBottom:5}}  onClick={() => {this.proposelView(this.state.project)}}>Add Submission</Button>
               </div>
               </div>
               </div>


               <div className=" card container" style={{marginTop:20}}>

               <div  className="row">
               <div  className="col-xm-1" style={{backgroundColor:'#263238' , height:137,width:35}}>

               </div>

               <div className="col-sm-11">
               <h2 className="sup-tittle">Concept Paper </h2>

               <div >
               <a>
               <span><AttachmentIcon/></span>
               <span className="sub-link">Concept Paper Template</span>
               </a>
               </div>

               <div >
               <a>
               <span><AssignmentIcon/></span>
               <span className="sub-content">Concept Paper Submission (Deadline - 2020-05-06 : 11.55 PM) Assignment</span>
               </a>
               </div>

               <Button style={{marginLeft:910,marginBottom:5}}  onClick={() => {this.proposelView(this.state.project)}}>Add Submission</Button>
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
