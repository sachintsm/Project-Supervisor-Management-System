import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/supervisor/SupervisorHome.scss'
import Footer from "../shared/Footer";
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { getFromStorage } from '../../utils/Storage';
import Snackpop from "../shared/Snackpop";
import { Row, Col } from 'reactstrap';
import { Spinner } from 'react-bootstrap'
import GroupList from "./GroupList";
const backendURI = require('../shared/BackendURI');

class groupDataBlock {
  constructor(_id, groupId, groupName, projectId, groupMembers, supervisors, progress) {
    this._id = _id;
    this.groupId = groupId;
    this.groupName = groupName;
    this.projectId = projectId;
    this.groupMembers = groupMembers;
    this.supervisors = supervisors;
    this.progress = progress;

  }
}
class finalBlock {
  constructor(projId, projName, groupDataBlock) {
    this.projId = projId;
    this.projName = projName;
    this.groupDataBlock = groupDataBlock;
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

      finalBlock: [],
    }

  }

  componentDidMount = async () => {
    const authState = await verifyAuth();

    this.setState({
      authState: authState,
      groupDataBlock: [],
      finalBlock: []
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

    //! get active project the this supervosor In
    await axios.get(backendURI.url + '/projects/getAllActiveProjectDataS/' + this.state.userId)
      .then(async res => {

        this.setState({ activeProjects: res.data.data })
        for (let i = 0; i < this.state.activeProjects.length; i++) {

          //! project name
          var projId = this.state.activeProjects[i]._id
          var projName = this.state.activeProjects[i].projectYear + " " + this.state.activeProjects[i].projectType + " " + this.state.activeProjects[i].academicYear

          const data = {
            projectId: projId,
            supervisorId: this.state.userId
          }

          //? load all the active project names from
          await axios.post(backendURI.url + '/createGroups/active&groups/', data)
            .then(async res => {
              // console.log(res.data.data);
              this.setState({
                activeProject: res.data.data,
              })

              for (let i = 0; i < this.state.activeProject.length; i++) {
                if (this.state.activeProject[i].supervisors.length !== 0) {
                  var array1 = []; //supervisor data
                  var array2 = []; //student data

                  for (let k = 0; k < this.state.activeProject[i].groupMembers.length; k++) {
                    var newMember = this.state.activeProject[i].groupMembers[k] + ', '
                    array2.push(newMember)
                  }

                  for (let j = 0; j < this.state.activeProject[i].supervisors.length; j++) {
                    await axios.get(backendURI.url + '/users/getUser/' + this.state.activeProject[i].supervisors[j])
                      .then(res => {
                        // console.log(res);
                        var newSupervisor = res.data.data.firstName + ' ' + res.data.data.lastName + ", "
                        array1.push(newSupervisor);
                      })
                  }

                  var progress = 0;
                  await axios.get(backendURI.url + '/progress/gettotalprogress/' + this.state.activeProject[i]._id)
                    .then(res => {
                      if (res.data !== 'NaN') {
                        progress = res.data
                      }
                    })
                  var block = new groupDataBlock(
                    this.state.activeProject[i]._id,
                    this.state.activeProject[i].groupId,
                    this.state.activeProject[i].groupName,
                    this.state.activeProject[i].projectId,
                    array2,
                    array1,
                    progress
                  )

                  this.setState({
                    groupDataBlock: [...this.state.groupDataBlock, block],
                    spinnerDiv1: false
                  })
                }
              }
            })

          var block2 = new finalBlock(projId, projName, this.state.groupDataBlock)
          this.setState({
            finalBlock: [...this.state.finalBlock, block2],
            groupDataBlock: []
          })

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
    return (
      <div className="sh-fullpage">
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

            <Row className="card-row-sh">
              {spinnerDiv1 && (
                <div className="spinner">
                  <Spinner style={{ marginBottom: "20px" }} animation="border" variant="info" />
                </div>
              )}
              {this.state.finalBlock.map((item) => {
                return (
                  <Col md={12} xs={12} sm={12} key={item.projId}>
                    <Row>
                      <Col md={12} xs={12} sm={12}>
                        <p className="sh-project-name-hs">{item.projName}</p>
                      </Col>
                    </Row>

                    <GroupList data={item.groupDataBlock} />
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
