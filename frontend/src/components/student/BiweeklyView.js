import React, { Component } from 'react'
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import axios from 'axios';

import '../../css/students/BiweeklyView.scss'
import {
     Button,
     Col,
     Row,
} from "react-bootstrap";
const backendURI = require("../shared/BackendURI");

export class BiweeklyView extends Component {

     constructor(props) {
          super(props)

          this.state = {
               groupDetails: props.location.state.groupDetails,
               projectId: this.props.match.params.id,
               biweeklyList: [],
          }
          this.getBiweekly = this.getBiweekly.bind(this);
         //console.log(this.props)

     }

     //button for view upcomming submission
     biweeklyView = (data) => {

          this.props.history.push('/studenthome/biweeklysubmissionpanel/' + data._id, { projectId: this.state.projectId, submissionDetails: data, groupDetails: this.state.groupDetails })
     }

     componentDidMount() {
          this.getBiweekly()
     }

     //get submision details from database
     getBiweekly() {
          axios.get(backendURI.url + '/Biweekly/getBiweeklyLink/' + this.state.projectId)
               .then((res => {
                    this.setState({
                         biweeklyList: res.data.data
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
                                   {this.state.biweeklyList.length > 0 && (
                                        <div>
                                             {this.state.biweeklyList.map((type) => {
                                                  return (
                                                       <div className=" card container" style={{ margin: "0px 0px 20px 0px" }} key={type._id}>
                                                            <div className="row">
                                                                 <div className="col-xm-1" style={{ backgroundColor: '#263238', width: 35 }}>
                                                                 </div>
                                                                 <div className="col-sm-11">
                                                                      <h2 className="sup-tittle">Biweekly Report #{type.biweeklyNumber}</h2>
                                                                      <div >

                                                                           <span><AttachmentIcon /></span>
                                                                           <a className="sub-link" href={backendURI.url +"/biweekly/biweeklyAttachment/" + type.filePath}>
                                                                                #{type.biweeklyNumber} Biweekly Template
                                                                           </a>
                                                                      </div>
                                                                      <Row>
                                                                           <Col md={10} xs={10} >
                                                                                <a>
                                                                                     <span><AssignmentIcon /></span>
                                                                                     <span className="sub-content" >{type.proposelTittle} Biweekly Submite (Deadline - {type.deadDate}: {type.deadTime})</span>
                                                                                </a>
                                                                           </Col>
                                                                           
                                                                      </Row>

                                                                      <Row>
                                                                      <Col md={10} xs={0}>
                                                                      </Col>
                                                                      
                                                                      <Col md={2} xs={12}>
                                                                                <div>
                                                                                     <Button className="viw-btn" size="sm" variant="primary" onClick={() => { this.biweeklyView(type) }} >Add Submission</Button>
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

export default BiweeklyView
