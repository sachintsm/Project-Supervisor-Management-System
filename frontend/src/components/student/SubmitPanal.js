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
               groupId: this.props.location.state.groupDetails._id,
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
               states:false,
               submissionDetails:[],
          }

          this.onSubmit = this.onSubmit.bind(this)
         

     }

     componentDidMount() {

          const dt = {
               projectId: this.state.projectId,
               submissionId: this.state.submissionId,
               groupId: this.state.groupId
          }
          axios.post(backendURI.url + '/submission/get', dt)
          .then((res => {

               this.setState({
                    submissionDetails : res.data.data

               })
              
               if(res.data.data.length>0){
                    this.setState({
                         states : true
                    })
               }

             })).catch(err => {
                console.log(err)
           })
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

          //console.log(userId);
          for (let i = 0; i < files.length; i++) {
               
               const formData = new FormData();

               formData.append("userId", userId)
               formData.append("submissionId", this.state.submissionId)
               formData.append("projectId", this.state.projectId)
               formData.append("groupId", this.state.groupId)
               formData.append("submissionFile", files[i])
               formData.append("groupno", this.state.groupNo)
               formData.append("groupname", this.state.groupName)
               formData.append("groupmember", this.state.groupMembers)

               await axios.post(backendURI.url + '/submission/add', formData)
                    .then(res => {
                       
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
                   // console.log(res.data.data)
               }).catch((err) => {
                    console.log(err)
               })
     }

     status() {
          if(this.state.states===true){
               return(
                    <p style={{color:"Green"}}>: Submited</p>
               )
          }else{
               return(
                    <p style={{color:"Red"}}>: No Attempt</p>
               )
          }

     }

     
     filsename(){
          return(
                  <div >
                  {this.state.submissionDetails.map((type) => {
   
                      return(
                           <div key={type._id}>
                           <p>: {type.originalFileName}</p>
                           </div>
                      )
                  })}
                  </div>
                  )
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
                                   <Row>
                                   <Col md="2">
                                   <p>Due Date</p>
                                   </Col>
                                   <Col md="10">
                                   <p> : {this.state.deadDate} : {this.state.deadTime}</p>
                                   </Col>
                              </Row>

                              <Row>
                                   <Col md="2">
                                   <p>Description </p>
                                   </Col>

                                   <Col md="10">
                                   <p> : {this.state.proposelDiscription}</p>
                                   </Col>
                              </Row>

                              <Row>
                                   <Col md="2">
                                   <p>Status</p>
                                   </Col>

                                   <Col md="10">
                                   <p>{this.status()}</p>
                                   </Col>
                              </Row>

                              <Row>
                                   <Col md="2">
                                   <p>File Submission</p>
                                   </Col>

                                   <Col>
                                   <p>{this.filsename()}</p>
                                   </Col>
                              </Row>  
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
