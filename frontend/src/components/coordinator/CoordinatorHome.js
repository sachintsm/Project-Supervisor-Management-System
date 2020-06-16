import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/coordinator/CoordinatorHome.css'
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import { Spinner } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert';
import { getFromStorage } from '../../utils/Storage';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backendURI = require('../shared/BackendURI');

class coodinatorProjectBlock {
  constructor(_id, project, startDate, coodinatorCount, supervisorCount, groupCount) {
    this._id = _id;
    this.project = project;
    this.startDate = startDate;
    this.coodinatorCount = coodinatorCount;
    this.supervisorCount = supervisorCount;
    this.groupCount = groupCount;
  }
}
class CoordinatorHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      activeProject: [],
      endProject: [],
      activeProjectBlock: [],
      endProjectBlock: [],

      spinnerDiv1: true,

      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',
    }
  }

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  componentDidMount = async () => {
    localStorage.setItem("user-level", "coordinator")

    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isCoordinator")) {
      this.props.history.push("/");
    }
    else {
      const userId = JSON.parse(localStorage.getItem("auth-id"))
      this.setState({ userId: userId.id });

      await axios.get(backendURI.url + '/projects/getAllActiveProjectData/' + this.state.userId)
        .then(res => {
          this.setState({ activeProject: res.data.data })

        })
      for (let i = 0; i < this.state.activeProject.length; i++) {
        await axios.get(backendURI.url + '/createGroups/groupCount/' + this.state.activeProject[i]._id)
          .then(res => {
            // console.log(res);
            var _id = this.state.activeProject[i]._id;
            var project = this.state.activeProject[i].projectYear + " " + this.state.activeProject[i].projectType + " " + this.state.activeProject[i].academicYear
            var startDate = this.state.activeProject[i].startDate
            var coodinatorCount = (this.state.activeProject[i].coordinatorList).length
            var supervisorCount = (this.state.activeProject[i].supervisorList).length
            var groupCount = res.data.data

            var block = new coodinatorProjectBlock(_id, project, startDate, coodinatorCount, supervisorCount, groupCount)
            
            this.setState({
              activeProjectBlock: [...this.state.activeProjectBlock, block],
            })

            
          })
      }

      await axios.get(backendURI.url + '/projects/getAllEndProjectData/' + this.state.userId)
        .then(res => {
          this.setState({ endProject: res.data.data })

        })
      for (let i = 0; i < this.state.endProject.length; i++) {
        await axios.get(backendURI.url + '/createGroups/groupCount/' + this.state.endProject[i]._id)
          .then(res => {
            // console.log(res);
            var _id = this.state.endProject[i]._id;
            var project = this.state.endProject[i].projectYear + " " + this.state.endProject[i].projectType + " " + this.state.endProject[i].academicYear
            var startDate = this.state.endProject[i].startDate
            var coodinatorCount = (this.state.endProject[i].coordinatorList).length
            var supervisorCount = (this.state.endProject[i].supervisorList).length
            var groupCount = res.data.data

            var block = new coodinatorProjectBlock(_id, project, startDate, coodinatorCount, supervisorCount, groupCount)
            this.setState({
              endProjectBlock: [...this.state.endProjectBlock, block],
            })

          })
      }

      this.setState({
        spinnerDiv1: false
      })
    }
  }

  endProject(id) {
    confirmAlert({
      title: 'Confirm to Delete?',
      message: 'Are you sure to do this ?',
      buttons: [{
        label: 'Yes',
        onClick: () => {
          const obj = getFromStorage('auth-token');
          fetch(backendURI.url + '/projects/endProject/' + id, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': obj.token
            },
          })
            .then(res => res.json())
            .then(json => {
              console.log(json);

              if (json.state === true) {
                this.setState({
                  snackbaropen: true,
                  snackbarmsg: json.msg,
                  snackbarcolor: 'success',
                })
                window.location.reload();
              } else {
                this.setState({
                  snackbaropen: true,
                  snackbarmsg: json.msg,
                  snackbarcolor: 'error',
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.setState({
                snackbaropen: true,
                snackbarmsg: err,
                snackbarcolor: 'error',
              })
            })
        }
      },
      {
        label: 'No',
        onClick: () => {

        }
      }
      ]
    })

  }

  render() {
    const { spinnerDiv1 } = this.state
    let noProject;
    if (this.state.activeProject.length === 0) {
      noProject = <p className="no-projects">No active projects...</p>
    }

    let noEndProjects;
    if (this.state.endProject.length === 0) {
      noEndProjects = <p className="no-projects">No ended projects...</p>
    }
    return (
      <React.Fragment>
        <Navbar panel={"coordinator"} />
        <div className="container">
          <div className="ch-topic-div">
            <p className="ch-topic">On-going Projects</p>
          </div>
          
          {noProject}

          {spinnerDiv1 && (
            <div className="spinner">
              <Spinner style={{ marginBottom: "20px" }} animation="border" variant="info" />
            </div>
          )}
          {this.state.activeProjectBlock.map(data => {
            return (
              <div className="card container ch-card" key={data._id}>
                <Row className="ch-project-name-div">
                  <p className="ch-project-name">{data.project} </p>
                </Row>
                <Row className="container ch-project-date">
                  <Col md={2} xs={6}>
                    <p className="ch-title">Project Start Date</p>
                  </Col>
                  <Col md={4} xs={6}>
                    <p className="ch-body">: {data.startDate}</p>
                  </Col>
                </Row>

                <Row className="container">
                  <Col md={2} xs={6}>
                    <p className="ch-title">Coordinators Count</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-body">: {data.coodinatorCount}</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-title">Supervisors Count</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-body">: {data.supervisorCount}</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-title">Groups Count</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-body">: {data.groupCount}</p>
                  </Col>
                </Row>

                <Row className="container ch-btn-row">
                  <Col md={2}>
                    <Button className="btn ch-btn-btn">Supervisors</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn  ch-btn-btn">Groups</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn  ch-btn-btn">Bi-Weekly</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn ch-btn-btn">SRC Documents</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn  ch-btn-btn">Proposals</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn btn-danger ch-btn-btn" onClick={() => this.endProject(data._id)}>End Project</Button>
                  </Col>
                </Row>
              </div>
            )
          })}
          <div className="ch-topic-div">
            <p className="ch-topic">End Projects</p>
          </div>

          {noEndProjects}

          {spinnerDiv1 && (
            <div className="spinner">
              <Spinner style={{ marginBottom: "20px" }} animation="border" variant="info" />
            </div>
          )}
          {this.state.endProjectBlock.map(data => {
            return (
              <div className="card container ch-card" key={data._id}>
                <Row className="ch-project-name-div">
                  <p className="ch-project-name">{data.project} </p>
                </Row>
                <Row className="container ch-project-date">
                  <Col md={2} xs={6}>
                    <p className="ch-title">Project Start Date</p>
                  </Col>
                  <Col md={4} xs={6}>
                    <p className="ch-body">: {data.startDate}</p>
                  </Col>
                </Row>

                <Row className="container">
                  <Col md={2} xs={6}>
                    <p className="ch-title">Coordinators Count</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-body">: {data.coodinatorCount}</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-title">Supervisors Count</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-body">: {data.supervisorCount}</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-title">Groups Count</p>
                  </Col>
                  <Col md={2} xs={6}>
                    <p className="ch-body">: {data.groupCount}</p>
                  </Col>
                </Row>

                <Row className="container ch-btn-row">
                  <Col md={2}>
                    <Button className="btn ch-btn-btn">Supervisors</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn  ch-btn-btn">Groups</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn  ch-btn-btn">Bi-Weekly</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn ch-btn-btn">SRC Documents</Button>
                  </Col>
                  <Col md={2}>
                    <Button className="btn  ch-btn-btn">Proposals</Button>
                  </Col>

                </Row>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default CoordinatorHome;
