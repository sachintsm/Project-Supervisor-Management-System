import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import '../../css/students/ViewMeeting.css';
import { Row, Col } from 'reactstrap';

import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import RequestMeeting from "./RequestMeeting";
import { Card, CardDeck } from 'react-bootstrap';
import axios from 'axios';
import ViewMeetBlock from "./ViewMeetBlock";
const backendURI = require('../shared/BackendURI');

class meetBlock {
  constructor(id, purpose, date, time, supervisor) {
    this.id = id;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
    this.supervisor = supervisor;

  }
}


class ViewMeeting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      project: props.location.state.projectDetails,
      group: props.location.state.groupDetails,
      superNa: [],
      meetB: [],
      viewMeetDiv: false,

    };

  }

  componentDidMount = async () => {
    console.log(this.state.group.groupId);

    await axios.get(backendURI.url + '/requestMeeting/get/' + this.state.group.groupId)
      .then(response => {
        console.log(response.data.data);

        this.setState({ meetings: response.data.data });
        console.log(this.state.meetings.length);

      }).catch(function (error) {
        console.log(error);
      })

    for (let i = 0; i < this.state.meetings.length; i++) {
      await axios.get(backendURI.url + '/users/getUserName/' + this.state.meetings[i].supervisor)
        .then(res => {
          console.log(res.data.data);
          const data = {
            superName: res.data.data[0].firstName + ' ' + res.data.data[0].lastName,
            id: res.data.data[0]._id
          }

          this.setState({
            superNa: [...this.state.superNa, data],
          })
        })
      console.log(this.state.superNa);

      var block = new meetBlock(
        this.state.meetings[i]._id,
        this.state.meetings[i].purpose,
        this.state.meetings[i].date,
        this.state.meetings[i].time,
        this.state.superNa[i].superName,

      )
      this.setState({
        meetB: [...this.state.meetB, block],
      })

    }
    console.log(this.state.meetB);
    this.setState({
      viewMeetDiv: true,
    })



  }

  render() {

    const { viewMeetDiv } = this.state
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <div className="container">
          <div className="form-group">
            <RequestMeeting project={this.state.project} group={this.state.group} />
          </div>
          <div className="row">
            <div className="col-md-12">
              <Col md={12} xs={12} sm={12} >
                <Row>
                  <Col md={12} xs={12} sm={12}>
                  </Col>
                  {viewMeetDiv &&
                    <ViewMeetBlock data={this.state.meetB} />
                  }
                </Row>
              </Col>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default ViewMeeting;
