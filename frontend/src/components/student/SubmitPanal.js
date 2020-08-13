import React, { Component } from 'react'

import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import axios from 'axios';
import {getFromStorage} from "../../utils/Storage";
import {DropzoneArea} from 'material-ui-dropzone';
//import Button from '@material-ui/core/Button';
import {DropzoneDialog} from 'material-ui-dropzone';
import '../../css/students/submissions.scss'



import {
     Button,
     Container,
     Col,
     Row,
     FormGroup,
     FormControl,
 
 
   } from "react-bootstrap";

   const backendURI = require("../shared/BackendURI");
   var dateFormat = require('dateformat');
   var now = new Date();

class SubmitPanal extends Component {

     constructor(props) {
          super(props)
     
          this.state = {
               projectId : this.props.location.state.projectId,
               proposelTittle : this.props.location.state.submissionDetails.proposelTittle,
               deadDate : this.props.location.state.submissionDetails.deadDate,
               deadTime : this.props.location.state.submissionDetails.deadTime,
               proposelDiscription: this.props.location.state.submissionDetails.proposelDiscription, 
               SubmissionId : this.props.match.params.id,

               name:'',
               files: '',
               open:false,
          }

          this.onSubmit = this.onSubmit.bind(this)
          console.log(this.props.location.state)

         
     }

     componentDidMount(){

          // var date = new Date();
          //const dateString = date.toLocaleDateString()
          const dateString = dateFormat(now, "yyyy-mm-dd");
          const setDate =Math.ceil((dateString - this.state.deadDate)/(1000 * 60 * 60 * 24))

          console.log(this.state.deadDate)
          console.log(setDate)

          // const date1 = new Date('7-13-2010');
          // const date2 = new Date('12-15-2010');
          //const diffTime = Math.abs(date2 - date1);
          //const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          // console.log(diffTime + " milliseconds");
          // console.log(diffDays + " days");

     }
     handleClose() {
          this.setState({
              open: false
          });
      }
   
      handleSave(files) {
          //Saving files to state for further use and closing Modal.
          this.setState({
              files: files,
              open: false
          });
      }
   
      handleOpen() {
          this.setState({
              open: true,
          });
      }

     onChangename = (e) =>{
          this.setState({
               name:e.target.value,
          })
     }

     onSubmit(e){
          e.preventDefault();
          //console.log("aaaaaaaaaaaaaaaaaa");
          const userId = getFromStorage("auth-id").id;
          const headers = {
               'auth-token':getFromStorage('auth-token').token,
           }
          const obj = {
               userId : userId,
               projectId : this.state.projectId,
               submissionId : this.state.SubmissionId,
               name : this.state.name,
          }

           axios.post(backendURI.url+'/submission/addSubmission',obj, {headers:headers})
           .then((res)=>{
                console.log(res.data.data)
           }).catch((err)=>{
                console.log(err)
           })


     }
     
     render() {
          return (
               <React.Fragment>
               <Navbar panel={"student"} />
              
               <div className="sub_style">
               <div  className="container-fluid sub_background" style={{backgroundColor:'#f5f5f5'}}>
               <div className="container">

               <p className="sub_tittle">{this.state.proposelTittle} Submission <small> ( DeadLine - {this.state.deadDate} : {this.state.deadTime} ) </small></p>

               <hr></hr>

               <p className="sub_status">Submission Status</p>

               <div className='card sub_crd'>
               <h6>Due Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <tab></tab> Wednesday, 6 May 2020, 11:55 PM</h6>
               <h6>Time remaining &nbsp;&nbsp;&nbsp;&nbsp; fsf </h6>
              <div>
               <Button size='sm' className="sub_btn1"  onClick={this.handleOpen.bind(this)}>
               Add Submission
               </Button>
               </div>
             </div>
             <DropzoneDialog
                 open={this.state.open}
                 onSave={this.handleSave.bind(this)}
                 acceptedFiles={['image/jpeg', 'image/png', 'image/bmp','image/JPG','.pdf']}
                 showPreviews={true}
                 maxFileSize={10000000}
                 onClose={this.handleClose.bind(this)}
             />
               </div>
             </div>
             </div>
             <Footer />
               </React.Fragment>
          )
     }
}

export default SubmitPanal
