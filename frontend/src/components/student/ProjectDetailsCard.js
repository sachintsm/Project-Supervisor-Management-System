import React, { Component } from "react";
import CoordinatorList from "./CoordinatorList";
import SupervisorList from "./SupervisorList";
import { Row, Col, Spinner, Card } from "react-bootstrap";
import { getFromStorage } from "../../utils/Storage";
import axios from "axios";
import "../../css/students/ProjectDetailsCard.scss";
import { withRouter } from "react-router-dom";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

const backendURI = require("../shared/BackendURI");

class ProjectDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.project,
      groupDetails: [],
      loading: true,
      loading2: true,
    };
    this.getGroup();
    this.getTotalProgress();
    this.openProject = this.openProject.bind(this);
  }

  componentDidMount() {
    this.getGroup();
    this.getTotalProgress();
  }

  getGroup = () => {
    const userId = getFromStorage("auth-id").id;
    const project = {
      projectId: this.state.item._id,
    };

    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    axios
      .post(backendURI.url + "/createGroups/groupDetails/" + userId, project, {
        headers: headers,
      })
      .then((res) => {
        this.setState(
          {
            groupDetails: res.data,
            loading: false,
          },
          () => {
            axios
              .get(
                backendURI.url +
                  "/progress/gettotalprogress/" +
                  this.state.groupDetails._id,
                { headers: headers }
              )
              .then((res) => {
                let totalProgress = parseFloat(res.data);
                this.setState({
                  totalProgress: totalProgress,
                  totalProgressInt: Math.round(totalProgress * 1) / 1,
                  loading2: false,
                });
              });
          }
        );
      });
  };
  //Get the total progress of a project
  getTotalProgress = () => {
    // const headers = {
    //     'auth-token': getFromStorage('auth-token').token,
    // }
  };

  openProject(item) {
    this.props.history.push("/studenthome/viewproject", {
      projectDetails: item,
    });
  }

  render() {
    return (
      <div className="my-project-details-card-div">
        {this.state.loading && (
          <Col style={{ textAlign: "center" }}>
            <Spinner
              animation="border"
              className="spinner"
              style={{ alignContent: "center" }}
            />
          </Col>
        )}
        {!this.state.loading && (
          <div>
            <Card
              className="project-details-card"
              onClick={() => this.openProject(this.state.item)}
            >
              {this.state.groupDetails.groupName && (
                <Card.Header className="card-header">
                  {this.state.groupDetails.groupName}{" "}
                </Card.Header>
              )}
              {!this.state.groupDetails.groupName && (
                <Card.Header className="card-header2">
                  Project Name Not Defined ( Group{" "}
                  {this.state.groupDetails.groupId} )
                </Card.Header>
              )}

              <Card.Body className="card-body">
                <Row>
                  <Col
                    md={3}
                    lg={3}
                    xs={12}
                    sm={12}
                    className="circular-progressbar-col"
                  >
                    {this.state.totalProgressInt <= 33 && (
                      <CircularProgressbar
                        className="my-progress-bar"
                        styles={buildStyles({
                          textColor: "#DC3545",
                          pathColor: "#DC3545",
                        })}
                        value={this.state.totalProgressInt}
                        text={`${this.state.totalProgressInt}%`}
                      />
                    )}
                    {this.state.totalProgressInt <= 66 &&
                      this.state.totalProgressInt > 33 && (
                        <CircularProgressbar
                          className="my-progress-bar"
                          styles={buildStyles({
                            textColor: "#FFC107",
                            pathColor: "#FFC107",
                          })}
                          value={this.state.totalProgressInt}
                          text={`${this.state.totalProgressInt}%`}
                        />
                      )}
                    {this.state.totalProgressInt <= 100 &&
                      this.state.totalProgressInt > 66 && (
                        <CircularProgressbar
                          className="my-progress-bar"
                          styles={buildStyles({
                            textColor: "#28A745",
                            pathColor: "#28A745",
                          })}
                          value={this.state.totalProgressInt}
                          text={`${this.state.totalProgressInt}%`}
                        />
                      )}
                  </Col>
                  <Col md={9} lg={9} xs={12} sm={12} className="details-col">
                    <Row className="details-row">
                      <Col lg={3} md={4} sm={6} xs={6} className="zero-padding">
                        <span className="bold-text">Project Year </span>
                      </Col>
                      <Col lg={9} md={8} sm={6} xs={6} className="zero-padding">
                        <span className="normal-text">
                          {this.state.item.projectYear}
                        </span>
                      </Col>
                    </Row>
                    <Row className="details-row">
                      <Col lg={3} md={4} sm={6} xs={6} className="zero-padding">
                        <span className="bold-text">Project Type</span>
                      </Col>
                      <Col lg={9} md={8} sm={6} xs={6} className="zero-padding">
                        <span className="normal-text">
                          {this.state.item.projectType}
                        </span>
                      </Col>
                    </Row>
                    <Row className="details-row">
                      <Col lg={3} md={4} sm={6} xs={6} className="zero-padding">
                        <span className="bold-text">Academic Year</span>
                      </Col>
                      <Col lg={9} md={8} sm={6} xs={6} className="zero-padding">
                        <span className="normal-text">
                          {this.state.item.academicYear}
                        </span>
                      </Col>
                    </Row>
                    <Row className="details-row">
                      <Col lg={3} md={4} sm={6} xs={6} className="zero-padding">
                        <span className="bold-text">Coordinators</span>
                      </Col>
                      <Col lg={9} md={8} sm={6} xs={6}>
                        <Row className="normal-text">
                          <CoordinatorList idList={this.state.item} />
                        </Row>
                      </Col>
                    </Row>
                    <Row className="details-row">
                      <Col lg={3} md={4} sm={6} xs={6} className="zero-padding">
                        <span className="bold-text">Supervisors</span>
                      </Col>
                      <Col lg={9} md={8} sm={6} xs={6}>
                        <Row className="normal-text">
                          <SupervisorList
                            idList={this.state.groupDetails.supervisors}
                          />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(ProjectDetailsCard);
