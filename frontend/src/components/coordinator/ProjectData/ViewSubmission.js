import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';
import axios from 'axios';
import "../../../css/coordinator/SubmissionView.scss";


import '../../../css/coordinator/SubmissionView.scss';

const backendURI = require("../../shared/BackendURI");

class ViewSubmission extends Component {

     constructor(props) {
          super(props)

          this.state = {

               submissionDetails: [],
               projectId: this.props.location.state.submissionData.projectId,
               submissionId: this.props.location.state.submissionData._id,
               projectName: "",
               groupData: [],

          }

     }

     componentDidMount = async () => {

          this.userType = localStorage.getItem("user-level");

          const dt = {
               projectId: this.state.projectId,
               submissionId: this.state.submissionId
          }

          await axios.post(backendURI.url + '/Submission/getSubmission/', dt)
               .then(res => {
                    this.setState({ submissionDetails: res.data.data })
               })


          await axios.get(backendURI.url + '/projects/getProjectName/' + this.state.projectId)
               .then(res => {
                    this.setState({
                         projectName: res.data.data.projectYear + ' ' + res.data.data.projectType + ' ' + res.data.data.academicYear
                    })
               })

          await axios.get(backendURI.url + '/createGroups/get/' + this.state.projectId)
               .then(res => {
                    this.setState({
                         groupData: res.data.data
                    })
               })
        
     }

     render() {
          return (
               <React.Fragment>
                    <Navbar panel={"coordinator"} />
                    <div className="SubView_style">
                         <div className="container-fluid page_style">
                              <div className="container">
                                   <p className="header_style">{this.state.projectName}</p>
                                   <p className="sub_de">Submission Details</p>
                                   <Table hover>
                                        <thead>
                                             <tr>
                                                  <th className="table-head">Group No</th>
                                                  <th className="table-head">Group Name</th>
                                                  <th className="table-head">Group Members' ids</th>
                                                  <th className="table-head">Submission File</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {this.state.submissionDetails.map((item) => {
                                                  return (
                                                       <tr className="as-table-row" key={item._id}>
                                                            <td className="table-body">{item.groupno}</td>
                                                            <td className="table-body">{item.groupname}</td>
                                                            <td className="table-body">{item.groupmember}</td>
                                                            <td className="table-body"><a className="crd_atchmnt" href={"http://localhost:4000/submission/submissionFile/" + item.files[0]}>
                                                                 File Attachment
                                                </a></td>

                                                       </tr>
                                                  )
                                             })}
                                        </tbody>
                                   </Table>
                              </div>
                         </div>
                    </div>
                    <Footer />
               </React.Fragment>
          )
     }
}

export default ViewSubmission
