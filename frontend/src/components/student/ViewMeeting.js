import React, { Component } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import "../../css/students/ViewMeeting.scss";
import RequestMeeting from "./RequestMeeting";
import axios from "axios";
import ViewMeetBlock from "./ViewMeetBlock";
import ViewUrgentBlock from "./ViewUrgentBlock";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
const backendURI = require("../shared/BackendURI");

class meetBlock {
  constructor(id, purpose, date, time, state, supervisor) {
    this.id = id;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
    this.state = state;
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
      loading: false,
      loading2: false,
    };
  }

  componentDidMount = async () => {
    console.log(this.state.group.groupId);

    await axios
      .get(backendURI.url + "/requestMeeting/get/" + this.state.group._id)
      .then((response) => {
        this.setState({ meetings: response.data.data });
        console.log(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    for (let i = 0; i < this.state.meetings.length; i++) {
      await axios
        .get(
          backendURI.url +
            "/users/getUserName/" +
            this.state.meetings[i].supervisor
        )
        .then((res) => {
          const data = {
            superName:
              res.data.data[0].firstName + " " + res.data.data[0].lastName,
            id: res.data.data[0]._id,
          };

          this.setState({
            superNa: [...this.state.superNa, data],
          });
        });

      var block = new meetBlock(
        this.state.meetings[i]._id,
        this.state.meetings[i].purpose,
        this.state.meetings[i].date,
        this.state.meetings[i].time,
        this.state.meetings[i].state,
        this.state.superNa[i].superName
      );
      this.setState({
        meetB: [...this.state.meetB, block],
        loading2: true,
      });
      console.log(this.state.meetB);
    }
    console.log(this.state.meetB);
    this.setState({
      viewMeetDiv: true,
    });

    await axios
      .get(backendURI.url + "/requestMeeting/geturgent/" + this.state.group._id)
      .then((response) => {
        this.setState({ meetingsU: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    for (let i = 0; i < this.state.meetingsU.length; i++) {
      await axios
        .get(
          backendURI.url +
            "/users/getUserName/" +
            this.state.meetingsU[i].supervisor
        )
        .then((res) => {
          const data = {
            superName:
              res.data.data[0].firstName + " " + res.data.data[0].lastName,
            id: res.data.data[0]._id,
          };

          this.setState({
            superNa: [...this.state.superNa, data],
          });
        });

      var blockU = new meetBlock(
        this.state.meetingsU[i]._id,
        this.state.meetingsU[i].purpose,
        this.state.meetingsU[i].date,
        this.state.meetingsU[i].time,
        this.state.meetingsU[i].state,
        this.state.superNa[i].superName
      );
      this.setState({
        meetU: [...this.state.meetU, blockU],
        loading: true,
      });
    }
    console.log(this.state.meetU);
    this.setState({
      viewMeetDiv: true,
    });
  };

  render() {
    const { viewMeetDiv, loading, loading2 } = this.state;
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <div className="container-fluid">
          <div
            className="container student-view-meeting"
            style={{ minHeight: "600px" }}
          >
            <RequestMeeting
              project={this.state.project}
              group={this.state.group}
            />
            <div className="container">
              <Tabs
                defaultActiveKey="request"
                id="uncontrolled-tab-example"
                style={{ marginTop: "20px" }}
              >
                <Tab
                  eventKey="request"
                  title="Requested Meetings"
                  className="tit"
                >
                  {this.state.meetB.length === 0 && (
                    <div>
                      <p style={{ marginTop: "40px", textAlign: "center" }}>
                        No meetings available..
                      </p>
                    </div>
                  )}
                  {viewMeetDiv && loading2 && (
                    <ViewMeetBlock data={this.state.meetB} />
                  )}
                </Tab>
                <Tab eventKey="urgent" title="Urgent Meetings" className="tit">
                  {this.state.meetU.length === 0 && (
                    <div>
                      <p style={{ marginTop: "40px", textAlign: "center" }}>
                        No meetings available..
                      </p>
                    </div>
                  )}
                  {viewMeetDiv && loading && (
                    <ViewUrgentBlock data={this.state.meetU} />
                  )}
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
