import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Navbar from "../shared/Navbar";
import "../../css/coordinator/GroupPresentation.scss";
import Footer from "../shared/Footer";
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from "axios";

const backendURI = require("../shared/BackendURI");

class FeedbackBlock {
  constructor(presentationId, feedback, supervisorId, supervisorName, image) {
    this.presentationId = presentationId;
    this.feedback = feedback;
    this.supervisorId = supervisorId;
    this.supervisorName = supervisorName;
    this.image = image;
  }
}

class PresentationFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: this.props.location.state.groupDetails._id,
      projectId: this.props.location.state.projectDetails._id,
      feedbacks: [],
      Preliminary: [],
      Interim: [],
      Finals: [],
      Others: [],
    };
  }

  async componentDidMount() {
    console.log(this.props.location.state);

    const authState = await verifyAuth();
    this.setState({
      authState: authState,
    });

    if (!authState || !localStorage.getItem("isStudent")) {
      //!check wether the user is logged in, if not re-direct to the login form
      this.props.history.push("/");
    }
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    await axios
      .get(
        backendURI.url +
          "/presentationFeedback/getGroupFeedback/" +
          this.state.groupId,
        { headers: headers }
      )
      .then(async (res) => {
        this.setState({ feedbacks: res.data.data });

        for (let i = 0; i < this.state.feedbacks.length; i++) {
          let fullName = "";
          let image = "";
          await axios
            .get(
              backendURI.url +
                "/users/getUser/" +
                this.state.feedbacks[i].userId
            )
            .then((res) => {
              fullName = res.data.data.firstName + " " + res.data.data.lastName;
              image = res.data.data.imageName;
            });

          if (this.state.feedbacks[i].presentationName === "Preliminary") {
            const block = new FeedbackBlock(
              this.state.feedbacks[i]._id,
              this.state.feedbacks[i].feedback,
              this.state.feedbacks[i].userId,
              fullName,
              image
            );
            this.setState({ Preliminary: [...this.state.Preliminary, block] });
          } else if (this.state.feedbacks[i].presentationName === "Interim") {
            const block = new FeedbackBlock(
              this.state.feedbacks[i]._id,
              this.state.feedbacks[i].feedback,
              this.state.feedbacks[i].userId,
              fullName,
              image
            );
            this.setState({ Interim: [...this.state.Interim, block] });
          } else if (this.state.feedbacks[i].presentationName === "Finals") {
            const block = new FeedbackBlock(
              this.state.feedbacks[i]._id,
              this.state.feedbacks[i].feedback,
              this.state.feedbacks[i].userId,
              fullName,
              image
            );
            this.setState({ Finals: [...this.state.Finals, block] });
          } else {
            const block = new FeedbackBlock(
              this.state.feedbacks[i]._id,
              this.state.feedbacks[i].feedback,
              this.state.feedbacks[i].userId,
              fullName,
              image
            );
            this.setState({ Others: [...this.state.Others, block] });
          }
        }
      });
  }

  render() {
    return (
      <div>
        <Navbar panel={"coordinator"} />
        <div
          className="container  group-presentation "
          style={{ minHeight: "600px" }}
        >
          <label className="title-pf">Presentation Feedbacks</label>
          <div className="row">
            {this.state.feedbacks.length === 0 && (
              <img
                style={{ textAlign: "center", margin: "auto" }}
                src={require("../../assets/images/empty_data_set.jpg")}
                alt=" "
              />
            )}
          </div>
          {this.state.Preliminary.length !== 0 && (
            <Card className="submission-card">
              <Card.Header className="gd-card-header">
                Preliminary Presentation Feedbacks
              </Card.Header>
              <Card.Body className="gd-card-body">
                {this.state.Preliminary.map((item) => {
                  return (
                    <div className="container">
                      <Row className="prop-sub-row">
                        <Col md="1" sm="3" xs="3">
                          <img
                            className="mc-image"
                            src={
                              "http://localhost:4000/users/profileImage/" +
                              item.image
                            }
                            alt=" "
                          />
                        </Col>
                        <Col className="p-fb-tbl-row1" md="2" sm="9" xs="9">
                          {item.supervisorName}
                        </Col>
                        <Col className="p-fb-tbl-row2" md="9" sm="12" xs="12">
                          {item.feedback}
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          )}
          {this.state.Interim.length !== 0 && (
            <Card className="submission-card">
              <Card.Header className="gd-card-header">
                Interim Presentation Feedbacks
              </Card.Header>
              <Card.Body className="gd-card-body">
                {this.state.Interim.map((item) => {
                  return (
                    <div className="container">
                      <Row className="prop-sub-row">
                        <Col md="1" sm="3" xs="3">
                          <img
                            className="mc-image"
                            src={
                              "http://localhost:4000/users/profileImage/" +
                              item.image
                            }
                            alt=" "
                          />
                        </Col>
                        <Col className="p-fb-tbl-row1" md="2" sm="9" xs="9">
                          {item.supervisorName}
                        </Col>
                        <Col className="p-fb-tbl-row2" md="9" sm="12" xs="12">
                          {item.feedback}
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          )}
          {this.state.Finals.length !== 0 && (
            <Card className="submission-card">
              <Card.Header className="gd-card-header">
                Final Presentation Feedbacks
              </Card.Header>
              <Card.Body className="gd-card-body">
                {this.state.Finals.map((item) => {
                  return (
                    <div className="container">
                      <Row className="prop-sub-row">
                        <Col md="1" sm="3" xs="3">
                          <img
                            className="mc-image"
                            src={
                              "http://localhost:4000/users/profileImage/" +
                              item.image
                            }
                            alt=" "
                          />
                        </Col>
                        <Col className="p-fb-tbl-row1" md="2" sm="9" xs="9">
                          {item.supervisorName}
                        </Col>
                        <Col className="p-fb-tbl-row2" md="9" sm="12" xs="12">
                          {item.feedback}
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          )}
          {this.state.Others.length !== 0 && (
            <Card className="submission-card">
              <Card.Header className="gd-card-header">
                Other Presentation Feedbacks
              </Card.Header>
              <Card.Body className="gd-card-body">
                {this.state.Others.length === 0 &&
                  this.state.Others.map((item) => {
                    return (
                      <div className="container">
                        <Row className="prop-sub-row">
                          <Col md="1" sm="3" xs="3">
                            <img
                              className="mc-image"
                              src={
                                "http://localhost:4000/users/profileImage/" +
                                item.image
                              }
                              alt=" "
                            />
                          </Col>
                          <Col className="p-fb-tbl-row1" md="2" sm="9" xs="9">
                            {item.supervisorName}
                          </Col>
                          <Col className="p-fb-tbl-row2" md="9" sm="12" xs="12">
                            {item.feedback}
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
              </Card.Body>
            </Card>
          )}
        </div>

        <Footer />
      </div>
    );
  }
}

export default PresentationFeedback;
