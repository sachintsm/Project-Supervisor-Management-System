import React, { Component } from 'react'
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axios from 'axios';

import '../../css/students/SubmisionView.scss'
import {
     Button,
     Container,
     Col,
     Row,
     FormGroup,
     FormControl,


} from "react-bootstrap";
const backendURI = require("../shared/BackendURI");

export class SubmisionView extends Component {

     constructor(props) {
          super(props)

          this.state = {
               projectId: this.props.match.params.id,
               submissionList: [],
          }

          this.getSubmission = this.getSubmission.bind(this);

          //console.log('Ashan',this.state.submissionList);

     }

     //button for view upcomming submission
     proposelView = (data) => {
          this.props.history.push('/studenthome/submisionview/submisionpanal/' + data._id, { projectId: this.state.projectId, submissionDetails: data })
     }

     componentDidMount() {

          this.getSubmission()

     }

     //get submision details from database
     getSubmission() {
          axios.get(backendURI.url + '/proposel/getSubmisionLink/' + this.state.projectId)
               .then((res => {
                    //jconsole.log("ssssssssssssss", res.data.data)
                    this.setState({
                         submissionList: res.data.data
                    })
               })).catch(err => {
                    console.log(err)
               })
     }

     render() {
          //console.log("sss",this.state.submissionList);
          return (
               <React.Fragment>
                    <Navbar panel={"student"} />

                    <div className=" sub-style ">
                         <div className=" container-fluid  sub-background ">
                              <div className="container">
                                   {this.state.submissionList.length > 0 && (
                                        <div>
                                             {this.state.submissionList.map((type) => {
                                                  return (
                                                       <div className=" card container" style={{ margin: "0px 0px 20px 0px" }} key={type._id}>
                                                            <div className="row">
                                                                 <div className="col-xm-1" style={{ backgroundColor: '#263238', width: 35 }}>
                                                                 </div>
                                                                 <div className="col-sm-11">
                                                                      <h2 className="sup-tittle">{type.proposelTittle}</h2>
                                                                      <div >

                                                                           <span><AttachmentIcon /></span>
                                                                           <a className="sub-link" href={"http://localhost:4000/proposel/proposelAttachment/" + type.filePath}>
                                                                                {type.proposelTittle} Template
               </a>
                                                                      </div>
                                                                      <Row>
                                                                           <Col md={10} xs={10} >
                                                                                <a>
                                                                                     <span><AssignmentIcon /></span>
                                                                                     <span className="sub-content" >{type.proposelTittle} Submission (Deadline - {type.deadDate}: {type.deadTime})</span>
                                                                                </a>
                                                                           </Col>
                                                                           <Col md={2} xs={2}>
                                                                                <div style={{ position: 'relative' }}>

                                                                                     <Button className="btn btn-info" style={{ marginBottom: 10, width: "100%", textAlign: "right", marginLeft: "60px"}} onClick={() => { this.proposelView(type) }}>Add Submission</Button>
                                                                                </div>
                                                                           </Col>
                                                                      </Row>
                                                                 </div>
                                                            </div>

                                                       </div>
                                                  )
                                             })}

                                        </div>
                                   )}
                              </div>
                         </div>

                    </div>


                    <Footer />
               </React.Fragment>
          )
     }
}

export default SubmisionView
