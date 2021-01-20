import React, { Component } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col, Card, Spinner, Container, Button } from "react-bootstrap";
import axios from "axios";
import Snackpop from "../../shared/Snackpop";
import { confirmAlert } from "react-confirm-alert";
import BiweekRequest from "./BiweekRequest";
import "../../../css/supervisor/Notifications.scss";

const backendURI = require("../../shared/BackendURI");

class reqMeetBlock {
  constructor(
    id,
    projectName,
    groupName,
    groupNumber,
    purpose,
    date,
    time,
    groupId
  ) {
    this.id = id;
    this.projectName = projectName;
    this.groupName = groupName;
    this.groupNumber = groupNumber;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
    this.groupId = groupId;
  }
}

class SupervisorNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      biWeekRequests: [],
      declinedAlert: false,
      acceptedAlert: false,
      userId: getFromStorage("auth-id").id,
      requestMeetings: [],
      reqMeetBlock: [],
      loading2: false,
      groupData: [],
    };
  }

  componentDidMount() {
    this.getBiweekRequests();
    this.getMeetingRequests();
  }

  getBiweekRequests = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    const userId = getFromStorage("auth-id").id;

    axios
      .get(backendURI.url + "/biweeksubmissions/getsubmissions/" + userId, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          biWeekRequests: res.data,
          loading: false,
        });
      });
  };

  getMeetingRequests = async () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    const userId = getFromStorage("auth-id").id;

    await axios
      .get(backendURI.url + "/requestMeeting/getPending/" + userId, {
        headers: headers,
      })
      .then(async (res) => {
        // console.log(res.data.data);
        this.setState({
          requestMeetings: res.data.data,
        });

        for (let i = 0; i < this.state.requestMeetings.length; i++) {
          //get Group name and Id
          await axios
            .get(
              backendURI.url +
                "/createGroups/getGroupData/" +
                this.state.requestMeetings[i].groupId,
              { headers: headers }
            )
            .then(async (res) => {
              var projectId = res.data.data.projectId;
              var groupName = res.data.data.groupName;

              //get project name
              await axios
                .get(backendURI.url + "/projects/getProjectName/" + projectId, {
                  headers: headers,
                })
                .then((res) => {
                  var pName =
                    res.data.data.academicYear +
                    " " +
                    res.data.data.projectType +
                    " " +
                    res.data.data.projectYear;
                  var block = new reqMeetBlock(
                    this.state.requestMeetings[i]._id,
                    pName,
                    groupName,
                    this.state.requestMeetings[i].groupNumber,
                    this.state.requestMeetings[i].purpose,
                    this.state.requestMeetings[i].date,
                    this.state.requestMeetings[i].time,
                    this.state.requestMeetings[i].groupId
                  );

                  this.setState({
                    reqMeetBlock: [...this.state.reqMeetBlock, block],
                  });
                });
            });
        }
        this.setState({
          loading2: true,
        });
      });
  };

  async viewRequest(data) {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    await axios
      .get(backendURI.url + "/createGroups/getGroupData/" + data, {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data.data);
        this.setState({
          groupData: res.data.data,
        });
      });
    this.props.history.push("/supervisorhome/viewMeetings", {
      groupDetails: this.state.groupData,
    });
  }

  acceptRequest = (item) => {
    this.props.history.push(
      "/supervisorhome/notifications/individualmarks/" + item._id,
      { biWeekDetails: item }
    );
  };

  declineRequest = (item) => {
    confirmAlert({
      title: "Biweekly Report",
      message: "Are you sure you want to decline this report?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const headers = {
              "auth-token": getFromStorage("auth-token").token,
            };

            item.supervisors.map((supervisor, index) => {
              if (supervisor === this.state.userId) {
                item.status[index] = "Declined";
              }
              return null;
            });

            axios
              .patch(
                backendURI.url + "/biweeksubmissions/updateRequest/" + item._id,
                item,
                { headers: headers }
              )
              .then((res) => {
                this.getBiweekRequests();
                this.setState({
                  declinedAlert: true,
                });
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  addComment = (item) => {
    this.props.history.push(
      "/supervisorhome/notifications/biweekcomments/" + item._id,
      { biWeekDetails: item }
    );
  };

  closeAlert = () => {
    this.setState({
      acceptedAlert: false,
      declinedAlert: false,
    });
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Snackpop
          msg={"Accepted"}
          color={"success"}
          time={3000}
          status={this.state.acceptedAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={"Declined"}
          color={"success"}
          time={3000}
          status={this.state.declinedAlert}
          closeAlert={this.closeAlert}
        />

        <Navbar panel={"supervisor"} />

        <div className="container-fluid group-notifications">
          <div className="title-div">
            <h3 className="title">Notifications </h3>
          </div>
          <Container className="notification">
            {this.state.loading && (
              <div style={{ textAlign: "center", paddingTop: "30px" }}>
                <Spinner
                  animation="border"
                  className="spinner"
                  style={{ alignContent: "center" }}
                />
              </div>
            )}
            {!this.state.loading && (
              <div className="card card-div">
                {this.state.biWeekRequests.length === 0 &&
                  this.state.reqMeetBlock.length === 0 && (
                    <div style={{ textAlign: "center", padding: "20px 0px" }}>
                      No Any Notifications
                    </div>
                  )}

                {this.state.loading2 &&
                  this.state.reqMeetBlock.map((item, key) => {
                    return (
                      <Card
                        className="notification-card container"
                        key={item.id}
                      >
                        <Card.Body className="card-body">
                          <Row className="details-row">
                            <Col>
                              <Row>
                                <h5>{item.projectName} Meeting Request</h5>
                              </Row>
                              <Row className="details-meeting">
                                <p>
                                  Group : {item.groupName} (G{item.groupNumber})
                                </p>
                              </Row>
                              <Row className="details-meeting">
                                <p>Purpose : {item.purpose}</p>
                              </Row>
                              <Row className="details-meeting">
                                <p>Date : {item.date.substring(0, 10)}</p>
                              </Row>
                            </Col>
                            <Col lg={3} md={3} className="btn-col-2">
                              <Button
                                className="btn btn-info my-btn1"
                                onClick={() => this.viewRequest(item.groupId)}
                              >
                                View Request
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    );
                  })}

                {/*Group Requests Notifications*/}
                {this.state.biWeekRequests.map((item, key) => {
                  return (
                    <Card className="notification-card" key={key}>
                      <Card.Body className="card-body">
                        <Row className="details-row">
                          <Col>
                            <BiweekRequest details={item} />
                          </Col>
                          <Col lg={3} md={3} className="btn-col-2">
                            <Button
                              variant="outline-info"
                              className="my-btn1"
                              onClick={() => {
                                this.addComment(item);
                              }}
                            >
                              Comments
                            </Button>
                            <Button
                              className="btn btn-info my-btn1 mt-3"
                              onClick={() => this.acceptRequest(item)}
                            >
                              Accept Report
                            </Button>
                            <Button
                              className="btn btn-danger my-btn1 mt-3"
                              onClick={() => this.declineRequest(item)}
                            >
                              Decline Report
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            )}
          </Container>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default SupervisorNotifications;
