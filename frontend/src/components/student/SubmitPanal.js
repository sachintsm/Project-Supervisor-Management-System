import React, { Component } from 'react'

import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import axios from 'axios';
import {getFromStorage} from "../../utils/Storage";
import {DropzoneArea} from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import {DropzoneDialog} from 'material-ui-dropzone';
import '../../css/students/submissions.scss'


import {
    // Button,
     Container,
     Col,
     Row,
     FormGroup,
     FormControl,
 
 
   } from "react-bootstrap";

   const backendURI = require("../shared/BackendURI");

class SubmitPanal extends Component {

   

     constructor(props) {
          super(props)
     
          this.state = {
               projectId : this.props.location.state.projectId,
               SubmissionId : this.props.match.params.id,
               name:'',
               files: [],
               files: []

                
          }

          this.onSubmit = this.onSubmit.bind(this)

         
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
          console.log("aaaaaaaaaaaaaaaaaa");
          const userId = getFromStorage("auth-id").id;
          const headers = {
               'auth-token':getFromStorage('auth-token').token,
           }

          //  const formData = new FormData();

          //  formData.append('userId',userId);
          //  formData.append('projectId', this.state.projectId);
          //  formData.append('submissionId' , this.state.SubmissionId);
          //  formData.append('name',this.state.name);
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
               <div className="container">
               <div className="sub_style">

               <div className='card'>
               <p>Submite your Submission</p>
               <Button  onClick={this.handleOpen.bind(this)}>
               Add File
             </Button>
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
               </React.Fragment>
          )
     }
}

export default SubmitPanal
