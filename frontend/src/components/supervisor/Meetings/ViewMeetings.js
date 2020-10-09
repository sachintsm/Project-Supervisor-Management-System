import React, { Component } from "react";

import { verifyAuth } from "../../../utils/Authentication";

import Navbar from "../../shared/Navbar";

import Footer from "../../shared/Footer";

import "react-circular-progressbar/dist/styles.css";

import axios from "axios";

import { getFromStorage } from "../../../utils/Storage";

import Snackpop from "../../shared/Snackpop";

import Tab from "react-bootstrap/Tab";

import Tabs from "react-bootstrap/Tabs";

import { Table } from "react-bootstrap";

import ConfirmMeetings from "./ConfirmMeetings";

import "../../../css/supervisor/Meeting.scss";

import UrgentMeeting from "./UrgentMeetings";

import { confirmAlert } from "react-confirm-alert";

const backendURI = require("../../shared/BackendURI");

const Meet = React.memo((props) => (
  <tr>
    <td className="table-body">{props.meet.groupNumber}</td>

    <td className="table-body">{props.meet.purpose}</td>

    <td className="table-body" style={{ width: "10%" }}>
      <ConfirmMeetings data={props.meet._id} />
    </td>
  </tr>
));

const MeetConfirmed = React.memo((props) => (
  <tr>
    <td className="table-body">{props.meetconfirmed.groupNumber}</td>
    <td className="table-body">{props.meetconfirmed.purpose}</td>
    <td className="table-body">{props.meetconfirmed.date.substring(0, 10)}</td>
    <td className="table-body">{props.meetconfirmed.time}</td>
  </tr>
));

class ViewMeetings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snackbaropen: false,

      snackbarmsg: "",

      snackbarcolor: "",

      groupId: this.props.location.state.groupDetails._id,

      groupNumber: this.props.location.state.groupDetails.groupId,

      purpose: "",

      time: "",

      supervisor: "",

      super: "",

      supervisorN: [],

      superOptionList: [],

      selectValue: "",

      meetings: [],

      urgentMeetings: [],
    };

    this.cancelMeeting = this.cancelMeeting.bind(this);
  }

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  componentDidMount = async () => {
    const authState = await verifyAuth();

    this.setState({
      authState: authState,

      groupDataBlock: [],

      finalBlock: [],
    });

    if (!authState) {
      //!check user is logged in or not if not re-directed to the login form

      this.props.history.push("/");
    }

    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    const userId = getFromStorage("auth-id").id;

    this.setState({
      userId: userId,
    });

    console.log(this.state.userId);

    await axios
      .get(
        backendURI.url + "/requestMeeting/getsupervisor/" + this.state.userId
      )

      .then((response) => {
        this.setState({ meetings: response.data.data });
      })

      .catch(function (error) {
        console.log(error);
      });

    //! get urgent meetings

    const data = {
      groupId: this.state.groupId,

      userId: this.state.userId,
    };

    await axios
      .post(backendURI.url + "/requestMeeting/geturgent/", data)

      .then((res) => {
        console.log(res.data);

        this.setState({
          urgentMeetings: res.data.data,
        });
      });
  };

  MeetList() {
    return this.state.meetings.map((currentMeet, i) => {
      if (currentMeet.state === "pending") {
        return <Meet confirm={this.confirm} meet={currentMeet} key={i} />;
      } else return null;
    });
  }

  MeetList2() {
    return this.state.meetings.map((currentMeetConfirmed, i) => {
      if (currentMeetConfirmed.state === "confirmed") {
        return (
          <MeetConfirmed
            confirm={this.confirm}
            meetconfirmed={currentMeetConfirmed}
            key={i}
          />
        );
      } else return null;
    });
  }

  cancelMeeting(data) {
    confirmAlert({
      title: "Confirm to cancel",

      message: "Are you sure to do this.",

      buttons: [
        {
          label: "Yes",

          onClick: () => {
            axios
              .post(backendURI.url + "/requestMeeting/cancelMeeting/" + data)

              .then((res) => {
                console.log(res);

                if (res.data.state === true) {
                  this.setState({
                    snackbaropen: true,

                    snackbarmsg: res.data.msg,

                    snackbarcolor: "success",
                  });
                } else {
                  this.setState({
                    snackbaropen: true,

                    snackbarmsg: res.data.msg,

                    snackbarcolor: "error",
                  });
                }
              });

            window.location.reload();
          },
        },

        {
          label: "No",

          onClick: () => { },
        },
      ],
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar panel={"supervisor"} />

        <div className="container-fluid">
          <Snackpop
            msg={this.state.snackbarmsg}
            color={this.state.snackbarcolor}
            time={3000}
            status={this.state.snackbaropen}
            closeAlert={this.closeAlert}
          />

          {/* ************************************************************************************************************************************************************************** */}

          <div className="row">
            {/* <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>

 

                            <Sidebar />

 

                        </div> */}

            <div className="col-md-12" style={{ minHeight: "600px" }}>
              <div className="container">
                <Tabs
                  defaultActiveKey="request"
                  id="uncontrolled-tab-example"
                  style={{ marginTop: "20px" }}
                >
                  <Tab
                    eventKey="request"
                    title="Meeting Requests"
                    className="tit"
                  >
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="card">
                        <div>
                          <h3 className="sp_head">Meeting Requests</h3>

                          <div className="container">
                            <div className=" vu-table">
                              <Table hover className="vu-table-hover">
                                <thead>
                                  <tr>
                                    <th className="table-head">Group</th>

                                    <th className="table-head">Purpose</th>

                                    <th
                                      className="table-head"
                                      style={{ textAlign: "center" }}
                                    >
                                      Actions
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>{this.MeetList()}</tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>

                  <Tab eventKey="confirm" title="Confirmed Meetings">
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="card">
                        <div>
                          <h3 className="sp_head">Confirmed Meetings</h3>

                          <div className="container">
                            <div className=" vu-table">
                              <Table hover className="vu-table-hover">
                                <thead>
                                  <tr>
                                    <th>Group</th>

                                    <th>Purpose</th>

                                    <th>Date</th>

                                    <th>Time</th>
                                  </tr>
                                </thead>

                                <tbody>{this.MeetList2()}</tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>

                  <Tab eventKey="urgent" title="Urgent Meetings">
                    <div className="row" style={{ marginTop: "20px" }}>
                      <div className="ug-meeeting-div">
                        <UrgentMeeting
                          groupId={this.state.groupId}
                          groupNumber={this.state.groupNumber}
                        />
                      </div>

                      <div className="card">
                        <div>
                          <h3 className="sp_head">Urgent Meetings</h3>

                          <div className="container">
                            <div className=" vu-table">
                              <Table hover className="vu-table-hover">
                                <thead>
                                  <tr>
                                    <th>Group</th>

                                    <th>Purpose</th>

                                    <th>Date</th>

                                    <th>Time</th>

                                    <th>Action</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {this.state.urgentMeetings.map((data) => {
                                    return (
                                      <tr key={data._id}>
                                        <td>{data.groupNumber}</td>

                                        <td>{data.purpose}</td>

                                        <td>{data.date.substring(0, 10)}</td>

                                        <td>{data.time}</td>

                                        <td>
                                          <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                              this.cancelMeeting(data._id)
                                            }
                                          >
                                            Cancel Meeting
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </React.Fragment>
    );
  }
}

export default ViewMeetings;
