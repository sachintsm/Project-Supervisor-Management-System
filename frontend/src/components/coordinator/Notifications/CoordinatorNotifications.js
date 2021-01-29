import React, { Component } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col, Card, Spinner, Container, Button } from "react-bootstrap";
import axios from "axios";
import Snackpop from "../../shared/Snackpop";
import RequestDetails from "./RequestDetails";
import { confirmAlert } from "react-confirm-alert";

const backendURI = require("../../shared/BackendURI");

class CoordinatorNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupRequests: [],
      loading: true,
      declinedAlert: false,
      acceptedAlert: false,
    };
  }

  componentDidMount() {
    this.getGroupRequestNotification();
  }

  getGroupRequestNotification = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    const userId = getFromStorage("auth-id").id;

    axios
      .get(
        backendURI.url + "/createGroups/coordinatorgrouprequests/" + userId,
        { headers: headers }
      )
      .then((res) => {
        this.setState({
          groupRequests: res.data,
          loading: false,
        });
      });
  };

  //Accept a request
  acceptRequest = (item) => {
    confirmAlert({
      title: "Group Request",
      message: "Are you sure you want to accept this request?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const headers = {
              "auth-token": getFromStorage("auth-token").token,
            };
            const data = {
              projectId: item.projectId,
              groupMembers: item.allStudentList,
            };

            axios
              .post(backendURI.url + "/createGroups/add/", data, {
                headers: headers,
              })
              .then((res) => {
                const requestId = item._id;

                axios
                  .delete(
                    backendURI.url + "/createGroups/grouprequests/" + requestId,
                    { headers: headers }
                  )
                  .then((res) => {
                    this.setState(
                      {
                        acceptedAlert: true,
                      },
                      () => {
                        this.getGroupRequestNotification();
                      }
                    );
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

  //Decline a request
  declineRequest = (item) => {
    confirmAlert({
      title: "Group Request",
      message: "Are you sure you want to decline this request?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const requestId = item._id;
            const headers = {
              "auth-token": getFromStorage("auth-token").token,
            };

            axios
              .delete(
                backendURI.url + "/createGroups/grouprequests/" + requestId,
                { headers: headers }
              )
              .then((res) => {
                this.setState(
                  {
                    declinedAlert: true,
                  },
                  () => {
                    this.getGroupRequestNotification();
                  }
                );
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

  closeAlert = () => {
    this.setState({
      acceptedAlert: false,
      declinedAlert: false,
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

        <Navbar panel={"coordinator"} />

        <div className="container-fluid group-notifications">
          <div className="title-div">
            <h3 className="title">Notifications </h3>
          </div>
          <Container>
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
                {this.state.groupRequests.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0px" }}>
                    No Any Notifications
                  </div>
                )}

                {/*Group Request Notifications*/}
                {this.state.groupRequests.map((item, key) => {
                  return (
                    <Card className="notification-card" key={key}>
                      <Card.Body className="card-body">
                        <Row className="details-row">
                          <Col>
                            <h5>New Group Request</h5>
                            <RequestDetails item={item} />
                          </Col>
                          <Col lg={3} md={3} className="btn-col">
                            <Button
                              className="btn btn-info my-btn1"
                              onClick={() => this.acceptRequest(item)}
                            >
                              Accept
                            </Button>
                            <Button
                              className="btn btn-danger my-btn1 mt-2"
                              onClick={() => this.declineRequest(item)}
                            >
                              Decline
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

export default CoordinatorNotifications;
