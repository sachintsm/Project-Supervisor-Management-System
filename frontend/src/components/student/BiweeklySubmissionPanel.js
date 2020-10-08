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
               groupId:this.props.location.state.groupDetails._id,
               groupNo:this.props.location.state.groupDetails.groupId,
               groupName:this.props.location.state.groupDetails.groupName,
               groupMembers : this.props.location.state.groupDetails.groupMembers,
               projectId: this.props.location.state.projectId,
               biweeklyNumber: this.props.location.state.submissionDetails.biweeklyNumber,
               deadDate: this.props.location.state.submissionDetails.deadDate,
               deadTime: this.props.location.state.submissionDetails.deadTime,
               biweeklyDiscription: this.props.location.state.submissionDetails.biweeklyDiscription,
               submissionId: this.props.match.params.id,
               fileSize : this.props.location.state.submissionDetails.submssionFileSize,
               fileLimit : this.props.location.state.submissionDetails.setFileLimit,
               name: '',
               files: '',
               status:[],
               supervisors:[],
               open: false,
          }

          this.onSubmit = this.onSubmit.bind(this)
     }

     componentDidMount() {

          
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
          const date = new Date();
          const dateString = date.toLocaleDateString()
          const timeString =date.toLocaleTimeString()

          for (let i = 0; i < files.length; i++) {
               //console.log("sachin");
               const formData = new FormData();


               formData.append("date",dateString)
               formData.append("time",timeString)
               formData.append("userId", userId)
               formData.append("submissionId", this.state.submissionId)
               formData.append("projectId", this.state.projectId)
               formData.append("groupId",this.state.groupId)
               formData.append("submissionsFile", files[i])
               formData.append("groupno", this.state.groupNo)
               formData.append("groupname", this.state.groupName)
               formData.append("groupmember", this.state.groupMembers)


               await axios.post(backendURI.url + '/biweeksubmissions/add', formData)
                    .then(res => {
                         console.log(res)
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
               supervisors: this.state.groupDetails.supervisors,
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

                                   <p className="sub_tittle">Biweekly #{this.state.biweeklyNumber} Submission <small> ( DeadLine - {this.state.deadDate} : {this.state.deadTime} ) </small></p>

                                   <hr></hr>

                                   <p className="sub_status">Submission Status</p>

                                   <div className='card sub_crd'>
                                        <p>Due Date    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;<small>{this.state.deadDate} : {this.state.deadTime}</small></p>
                                        <p>Status      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  : {this.state.biweeklyDiscription}</p> 
                                        <p>File Submission :</p> 
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
                                        maxSize={this.state.fileSize}
                                        onClose={this.handleClose.bind(this)}
                                        filesLimit={parseInt(this.state.fileLimit, 10)}
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
