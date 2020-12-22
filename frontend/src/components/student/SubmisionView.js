import React, { Component } from 'react'
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axios from 'axios';

import '../../css/students/SubmisionViewStu.scss'
import {
     Button,
     Col,
     Row,
} from "react-bootstrap";
const backendURI = require("../shared/BackendURI");

export class SubmisionView extends Component {

     constructor(props) {
          super(props)

          this.state = {
               groupDetails: props.location.state.groupDetails,
               projectId: this.props.match.params.id,
               submissionList: [],
          }


          this.getSubmission = this.getSubmission.bind(this);

     }

     //button to view upcomming submissions
     proposelView = (data) => {
          this.props.history.push('/studenthome/submisionview/submisionpanal/' + data._id, { projectId: this.state.projectId, submissionDetails: data, groupDetails: this.state.groupDetails })
     }

     componentDidMount() {
        this.getSubmission()
     }

     //get submision details from the database
     getSubmission() {
          axios.get(backendURI.url + '/proposel/getSubmisionLink/' + this.state.projectId)
               .then((res => {
                    this.setState({
                         submissionList: res.data.data
                    })
               })).catch(err => {
                    console.log(err)
               })

     }

     render() {
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
                                                                           <a className="sub-link" href={backendURI.url+"/proposel/proposelAttachment/" + type.filePath}>
                                                                                {type.proposelTittle} Template
                                                                           </a>
                                                                      </div>
                                                                      <Row>
                                                                           <Col md={10} xs={12} >
                                                                                <a>
                                                                                     <span><AssignmentIcon /></span>
                                                                                     <span className="sub-content" >{type.proposelTittle} Submission (Deadline - {type.deadDate}: {type.deadTime})</span>
                                                                                </a>
                                                                           </Col>
                                                                           
                                                                      </Row>

                                                                      <Row>
                                                                      <Col md={10} xs={0}>
                                                                      </Col>
                                                                      
                                                                      <Col md={2} xs={12}>
                                                                                <div>
                                                                                     <Button className="viw-btn" size="sm" variant="primary"onClick={() => { this.proposelView(type) }} >Add Submission</Button>
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

export default SubmisionView;
