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


class SupervisorHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',

      authState: '',
      activeProjects: [],
      groupDataBlock: [],

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
            <p className="sd-topic">{this.state.superName}</p>
          </div>
          <div className="container">

              
          </div>

        </div>
        <Footer />
      </div>
    );
  }
}

export default SupervisorHome;
