import React, { Component } from 'react'

import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import axios from 'axios';
import { getFromStorage } from "../../utils/Storage";
import { DropzoneArea } from 'material-ui-dropzone';
import { DropzoneDialog } from 'material-ui-dropzone';
import '../../css/students/SubmissionPanel.scss'



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
               groupDetails: this.props.location.state.groupDetails,
               groupNo:this.props.location.state.groupDetails.groupId,
               groupName:this.props.location.state.groupDetails.groupName,
               groupMembers : this.props.location.state.groupDetails.groupMembers,
               projectId: this.props.location.state.projectId,
               proposelTittle: this.props.location.state.submissionDetails.proposelTittle,
               deadDate: this.props.location.state.submissionDetails.deadDate,
               deadTime: this.props.location.state.submissionDetails.deadTime,
               proposelDiscription: this.props.location.state.submissionDetails.proposelDiscription,
               submissionId: this.props.match.params.id,
               fileSize : this.props.location.state.submissionDetails.submssionFileSize,
               fileLimit : this.props.location.state.submissionDetails.setFileLimit,
               name: '',
               files: '',
               open: false,
          }

          this.onSubmit = this.onSubmit.bind(this)
          // console.log(this.props)
         //console.log("Ashan",this.state.groupMembers);


     }

     componentDidMount() {

          // var date = new Date();
          //const dateString = date.toLocaleDateString()
          const dateString = dateFormat(now, "yyyy-mm-dd");
          //const setDate =Math.ceil((dateString - this.state.deadDate)/(1000 * 60 * 60 * 24))

          // let timeDiff = Math.abs(dateString - this.state.deadDate);
          // let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          // console.log(this.state.deadDate)
          // console.log(diffDays)

          // const date1 = new Date('7/13/2010');
          // const date2 = new Date('12/15/2015');
          // const diffTime = Math.abs(date2 - date1);
          // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // console.log(diffTime + " milliseconds");
          // console.log(diffDays + " days");
         // console.log(this.props)
     }
     handleClose() {
          this.setState({
               open: false
          });
     }

     async handleSave(files) {
          //Saving files to state for further use and closing Modal.
          this.setState({
               files: files,
               open: false
          });
          const userId = getFromStorage("auth-id").id;

          console.log(userId);
          for (let i = 0; i < files.length; i++) {
               console.log("sachin");
               const formData = new FormData();

               formData.append("userId", userId)
               formData.append("submissionId", this.state.submissionId)
               formData.append("projectId", this.state.projectId)
               formData.append("submissionFile", files[i])
               formData.append("groupno", this.state.groupNo)
               formData.append("groupname", this.state.groupName)
               formData.append("groupmember", this.state.groupMembers)

               await axios.post(backendURI.url + '/submission/add', formData)
                    .then(res => {
                         console.log(res);
                    })

          }

     }

     handleOpen() {
          this.setState({
               open: true,
          });
     }

     onChangename = (e) => {
          this.setState({
               name: e.target.value,
          })
     }

     onSubmit(e) {
          e.preventDefault();
          const userId = getFromStorage("auth-id").id;
          const headers = {
               'auth-token': getFromStorage('auth-token').token,
          }
          const obj = {
               userId: userId,
               projectId: this.state.projectId,
               submissionId: this.state.submissionId,
               name: this.state.name,
          }

          axios.post(backendURI.url + '/submission/addSubmission', obj, { headers: headers })
               .then((res) => {
                    console.log(res.data.data)
               }).catch((err) => {
                    console.log(err)
               })
     }

     render() {
          return (
               <React.Fragment>
                    <Navbar panel={"student"} />

                    <div className="sub_style">
                         <div className="container-fluid sub_background" style={{ backgroundColor: '#f5f5f5' }}>
                              <div className="container">

                                   <p className="sub_tittle">{this.state.proposelTittle} Submission <small> ( DeadLine - {this.state.deadDate} : {this.state.deadTime} ) </small></p>

                                   <hr></hr>

                                   <p className="sub_status">Submission Status</p>

                                   <div className='card sub_crd'>
                                        <h6>Due Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;<small>{this.state.deadDate} : {this.state.deadTime}</small></h6>
                                        <h6>Time remaining &nbsp;&nbsp;&nbsp;&nbsp;</h6>  
                                   </div>
                              </div>
                         </div>
                    

                    <div className="container-fluid sub_backgrounds" style={{ backgroundColor: '#f5f5f5' }}>
                    <div className="container">
                    <div>
                    <Button size='sm' className="sub_btn1" onClick={this.handleOpen.bind(this)}>Add Submission</Button>
                    </div>
                         <DropzoneDialog
                              open={this.state.open}
                              onSave={this.handleSave.bind(this)}
                              acceptedFiles={['image/jpeg', 'image/png', 'image/bmp', 'image/JPG', '.pdf', '.zip', '.rar','.txt']}
                              showPreviews={true}
                              maxFileSize={this.state.fileSize}
                              onClose={this.handleClose.bind(this)}
                              filesLimit={this.state.fileLimit}
                              fullWidth={true}
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
