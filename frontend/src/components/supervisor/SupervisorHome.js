import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/supervisor/SupervisorHome.css'
import Footer from "../shared/Footer";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { getFromStorage } from '../../utils/Storage';
import Snackpop from "../shared/Snackpop";
import { Card, Row, Col } from 'reactstrap';
import { Table, Spinner } from 'react-bootstrap'

const backendURI = require('../shared/BackendURI');

class groupDataBlock {
  constructor(_id, groupId, groupName, projectId, groupMembers, supervisors) {
    this._id = _id;
    this.groupId = groupId;
    this.groupName = groupName;
    this.projectId = projectId;
    this.groupMembers = groupMembers;
    this.supervisors = supervisors;
  }
}


class SupervisorHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',

      authState: '',
      activeProjects: [],
      proId: "",
      groupDataBlock: [],
      activeProject: [],

      superName: '',
      spinnerDiv1: true,

      userId: '',
    }

  }

  componentDidMount = async () => {
    const authState = await verifyAuth();

    this.setState({
      authState: authState,
      groupDataBlock: []
    });
    if (!authState) {  //!check user is logged in or not if not re-directed to the login form
      this.props.history.push("/");
    }

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }
    const userId = getFromStorage('auth-id').id
    this.setState({
      userId: userId,
    })

    await axios.get(backendURI.url + '/projects/getAllActiveProjectDataS/' + this.state.userId)
      .then(res => {

        this.setState({ activeProjects: res.data.data })
        console.log(this.state.activeProjects);

        for (let i = 0; i < this.state.activeProjects.length; i++) {
          const projId = this.state.activeProjects[i]._id
          this.setState({
            proId: projId,
          })
        }


      })

    const data = {
      projectId: this.state.proId,
      supervisorId: this.state.userId
    }

    //? load all the active project names from
    await axios.post(backendURI.url + '/createGroups/active&groups/', data)
      .then(async res => {
        console.log(res);

        this.setState({

          activeProject: res.data.data,
        })

        for (let i = 0; i < this.state.activeProject.length; i++) {
          if (this.state.activeProject[i].supervisors.length !== 0) {
            var array1 = [];
            var array2 = [];
            for (let j = 0; j < this.state.activeProject[i].supervisors.length; j++) {
              await axios.get(backendURI.url + '/users/getUserName/' + this.state.activeProject[i].supervisors[j])
                .then(res => {
                  var supervisorName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName + ', ';
                  array1.push(supervisorName)
                })
            }
            for (let k = 0; k < this.state.activeProject[i].groupMembers.length; k++) {
              var newMember = this.state.activeProject[i].groupMembers[k] + ', '
              array2.push(newMember)
            }
            var block = new groupDataBlock(
              this.state.activeProject[i]._id,
              this.state.activeProject[i].groupId,
              this.state.activeProject[i].groupName,
              this.state.activeProject[i].projectId,
              array2,
              array1
            )
            // console.log(block)
            // this.state.groupDataBlock.push(block)
            this.setState({
              groupDataBlock: [...this.state.groupDataBlock, block],
              spinnerDiv1: false
            })
          }
        }

      })

    await axios.get(backendURI.url + '/projects/getAllEndProjectData/' + this.state.userId)
      .then(res => {
        this.setState({ endProjects: res.data.data })

      })

    await axios.get(backendURI.url + '/users/getUserName/' + this.state.userId)
      .then(res => {
        var superName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName;
        this.setState({
          superName: superName
        })
      })

  }

  render() {

    const { spinnerDiv1 } = this.state;   // ?load projects to dropdown menu this coordinator

    const percentage = 75.250923;
    let progressCircle;
    if (percentage >= 75) {
      progressCircle = <CircularProgressbar value={percentage} text={`${percentage.toFixed(2)}%`} styles={{
        path: {
          stroke: '#388e3c'
        },
        text: {
          fill: '#388e3c'
        }
      }} />
    }
    else if (percentage >= 25) {
      progressCircle = <CircularProgressbar value={percentage} text={`${percentage.toFixed(2)}%`} styles={{
        path: {
          stroke: `#fbc02d`
        },
        text: {
          fill: '#fbc02d'
        }
      }} />
    }
    else {
      progressCircle = <CircularProgressbar value={percentage} text={`${percentage.toFixed(2)}%`} styles={{
        path: {
          stroke: `#e53935`
        },
        text: {
          fill: '#e53935'
        }
      }} />
    }

    return (
      <div className="sd-fullpage">
        <Navbar panel={"supervisor"} />
        <div className="container">
          <Snackpop
            msg={this.state.snackbarmsg}
            color={this.state.snackbarcolor}
            time={3000}
            status={this.state.snackbaropen}
            closeAlert={this.closeAlert}
          />
          <div>
            {/* <p className="sd-topic">{this.state.superName}</p> */}
          </div>
          <div className="container">

            <Row className="card-row-sd">
              {spinnerDiv1 && (
                <div className="spinner">
                  <Spinner style={{ marginBottom: "20px" }} animation="border" variant="info" />
                </div>
              )}
              {this.state.groupDataBlock.map((item) => {
                return (
                  <Col md={4} xs={12} sm={6} key={item._id}>
                    <Card className='sd-proj-card' onClick={() => this.onClickGroup(item._id)}>
                      <div className="container" >
                        <Row className="spc-topic-div">
                          <p className="spc-topic">{item.groupId} - {item.groupName}</p>
                        </Row>

                        <Row style={{ width: '70%', margin: "auto" }}>
                          <Col md={12} sm={12} xs={12} className="spc-progress">

                            {/* <CircularProgressbar value={percentage} text={`${percentage}%`} styles={{
                                                            path: {
                                                                stroke: `rgba(	23, 162, 184, ${percentage / 100})`
                                                            },
                                                            text: {
                                                                fill: '#17a2b8'
                                                            }
                                                        }} /> */}
                            {progressCircle}
                          </Col>
                        </Row>
                        <Row>
                          <p className="spc-head">Group Members</p>
                        </Row>
                        <Row>
                          <p className="spc-list">{item.groupMembers}</p>
                        </Row>
                        <Row>
                          <p className="spc-head">Supervisors</p>
                        </Row>
                        <Row>
                          <p className="spc-list">{item.supervisors}</p>
                        </Row>

                      </div>
                    </Card>
                  </Col>
                )
              })}
            </Row>




          </div>

        </div>
        <Footer />
      </div>
    );
  }
}

export default SupervisorHome;
