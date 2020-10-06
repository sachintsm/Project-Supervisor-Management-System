import React, { Component } from "react";
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import '../../css/students/ViewMeeting.scss';
import RequestMeeting from "./RequestMeeting";
import axios from 'axios';
import ViewMeetBlock from "./ViewMeetBlock";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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
      meetingsU: [],
      project: props.location.state.projectDetails,
      group: props.location.state.groupDetails,
      superNa: [],
      meetB: [],
      meetU: [],
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


    await axios.get(backendURI.url + '/requestMeeting/geturgent/' + this.state.group.groupId)
      .then(response => {
        console.log(response.data.data);

        this.setState({ meetingsU: response.data.data });
        console.log(this.state.meetingsU.length);

      }).catch(function (error) {
        console.log(error);
      })

    for (let i = 0; i < this.state.meetingsU.length; i++) {
      await axios.get(backendURI.url + '/users/getUserName/' + this.state.meetingsU[i].supervisor)
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

      var blockU = new meetBlock(
        this.state.meetingsU[i]._id,
        this.state.meetingsU[i].purpose,
        this.state.meetingsU[i].date,
        this.state.meetingsU[i].time,
        this.state.superNa[i].superName,

      )
      this.setState({
        meetU: [...this.state.meetU, blockU],
      })

    }
    console.log(this.state.meetU);
    this.setState({
      viewMeetDiv: true,
    })
  }

  render() {

    const { viewMeetDiv } = this.state
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <div className="container-fluid">

          <div className="container student-view-meeting">
            <RequestMeeting project={this.state.project} group={this.state.group} />
            <div className="container">
              <Tabs defaultActiveKey="request" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
                <Tab eventKey="request" title="Confirmed Meetings" className="tit">
                  {/* <div className="row" style={{ marginTop: "20px" }}> */}

                  {viewMeetDiv &&

                    <ViewMeetBlock data={this.state.meetB} />
                  }
                  {/* </div> */}
                </Tab>
                <Tab eventKey="urgent" title="Urgent Meetings" className="tit">
                  {/* <div className="row" style={{ marginTop: "20px" }}> */}

                  {viewMeetDiv &&

                    <ViewMeetBlock data={this.state.meetU} />
                  }
                  {/* </div> */}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default ViewMeeting;

