import React, { Component } from "react";
import CoordinatorList from "./CoordinatorList";
import SupervisorList from "./SupervisorList";
import { Row, Col, Spinner, Card } from "react-bootstrap";
import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { getFromStorage } from "../../utils/Storage";
import axios from "axios";
import "../../css/students/ProjectDetailsCard2.scss";
import { withRouter } from "react-router-dom";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import Index from "../shared/Index";
import { FiEdit } from "react-icons/fi";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { confirmAlert } from "react-confirm-alert";
import Snackpop from "../shared/Snackpop";

const backendURI = require("../shared/BackendURI");

const useStylesBootstrap1 = makeStyles((theme) => ({
  arrow: {
    color: "white",
  },
  tooltip: {
    backgroundColor: "white",
    fontSize: "14px",
    color: "#263238",
  },
}));
function BootstrapTooltip1(props) {
  const classes = useStylesBootstrap1();
  return <Tooltip arrow classes={classes} {...props} />;
}

class studentBlock {
  constructor(id, name, index, reg) {
    this.id = id;
    this.name = name;
    this.index = index;
    this.reg = reg;
  }
}
class ProjectDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.project,
      indexNumbers: this.props.indexNumbers,
      groupDetails: [],
      studentList: [],
      loading: true,
      loading2: true,
      invalidInputAlert: false,
      groupName: "",
      groupEmail: "",
      successAlert: false,
    };
    console.log("hello");
    this.getGroup();
    this.openProject = this.openProject.bind(this);
    this.getStudentDetails = this.getStudentDetails.bind(this);
  }

  componentDidMount() {
    this.getGroup();
    this.getStudentDetails();
  }

  // Get teh particular group
  getGroup = () => {
    const userId = getFromStorage("auth-id").id;
    const project = {
      projectId: this.props.project._id,
    };

    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    axios
      .post(backendURI.url + "/createGroups/groupDetails/" + userId, project, {
        headers: headers,
      })
      .then((res) => {
        if (res.data.groupName) {
          this.setState({
            groupName: res.data.groupName,
          });
        }
        if (res.data.groupEmail) {
          this.setState({
            groupEmail: res.data.groupEmail,
          });
        }

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
                });
              });
          }
        );
      });
  };

  //Get the details of the students
  getStudentDetails = async (indexesArray) => {
    this.setState({
      studentList: [],
    });
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    this.state.indexNumbers.map(async (index) => {
      await axios
        .get(backendURI.url + "/users/studentList/" + index, {
          headers: headers,
        })
        .then((res) => {
          if (res.data.data) {
            const _id = res.data.data._id;
            const name = res.data.data.firstName + " " + res.data.data.lastName;
            const index = res.data.data.indexNumber;
            const reg = res.data.data.regNumber;

            let block = new studentBlock(_id, name, index, reg);

            this.setState({
              studentList: [...this.state.studentList, block],
            });
          }
        });
    });
  };
  openProject(item) {
    this.props.history.push("/studenthome/viewproject", {
      projectDetails: item,
    });
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChangeProjectTitle = (e) => {
    this.setState({
      groupName: e.target.value,
    });
  };

  onChangeGroupEmail = (e) => {
    this.setState({
      groupEmail: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.state.groupEmail || !this.state.groupName) {
      this.setState({
        invalidInputAlert: true,
      });
    } else {
      this.toggle();
      confirmAlert({
        title: "Group Details",
        message: "Are you sure you want to change details?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const headers = {
                "auth-token": getFromStorage("auth-token").token,
              };

              let data = {
                groupName: this.state.groupName,
                groupEmail: this.state.groupEmail,
              };

              axios
                .patch(
                  backendURI.url +
                    "/createGroups/groupDetails/" +
                    this.state.groupDetails._id,
                  data,
                  { headers: headers }
                )
                .then((res) => {
                  this.getGroup();
                  this.setState({
                    successAlert: true,
                  });
                });
            },
          },
          {
            label: "No",
            onClick: () => {
              this.setState({
                groupName: this.state.groupDetails.groupName,
                groupEmail: this.state.groupEmail,
              });
            },
          },
        ],
      });
    }
  };

  closeAlert = () => {
    this.setState({
      invalidInputAlert: false,
      successAlert: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Snackpop
          msg={"Invalid Inputs"}
          color={"error"}
          time={3000}
          status={this.state.invalidInputAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={"Success"}
          color={"success"}
          time={3000}
          status={this.state.successAlert}
          closeAlert={this.closeAlert}
        />

        <div className="project-details-card-div2">
          {this.state.loading && (
            <Col style={{ textAlign: "center" }}>
              <Spinner
                animation="border"
                className="spinner2"
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
                <Card.Header className="card-header">
                  {this.state.groupDetails.groupName} ( Group{" "}
                  {this.state.groupDetails.groupId} )
                  <BootstrapTooltip1 title="Edit Details" placement="bottom">
                    <span
                      className="edit-span"
                      onClick={() => {
                        this.openModal();
                      }}
                    >
                      <FiEdit />
                    </span>
                  </BootstrapTooltip1>
                </Card.Header>
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
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Project Year </span>
                        </Col>
                        <Col
                          lg={9}
                          md={8}
                          sm={6}
                          xs={6}
                          className="zero-padding"
                        >
                          <span className="normal-text">
                            {this.state.item.projectYear}
                          </span>
                        </Col>
                      </Row>
                      <Row className="details-row">
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Project Type</span>
                        </Col>
                        <Col
                          lg={9}
                          md={8}
                          sm={6}
                          xs={6}
                          className="zero-padding"
                        >
                          <span className="normal-text">
                            {this.state.item.projectType}
                          </span>
                        </Col>
                      </Row>
                      <Row className="details-row">
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Academic Year</span>
                        </Col>
                        <Col
                          lg={9}
                          md={8}
                          sm={6}
                          xs={6}
                          className="zero-padding"
                        >
                          <span className="normal-text">
                            {this.state.item.academicYear}
                          </span>
                        </Col>
                      </Row>
                      <Row className="details-row">
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Group Email</span>
                        </Col>
                        {this.state.groupDetails.groupEmail && (
                          <Col
                            lg={9}
                            md={8}
                            sm={6}
                            xs={6}
                            className="zero-padding"
                          >
                            <span className="normal-text">
                              {this.state.groupDetails.groupEmail}
                            </span>
                          </Col>
                        )}
                        {!this.state.groupDetails.groupEmail && (
                          <Col
                            lg={9}
                            md={8}
                            sm={6}
                            xs={6}
                            className="zero-padding"
                          >
                            <span className="error-text">
                              Please add your group Email
                            </span>
                          </Col>
                        )}
                      </Row>
                      <Row className="details-row">
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Coordinators</span>
                        </Col>
                        <Col
                          lg={9}
                          md={8}
                          sm={6}
                          xs={6}
                          className="zero-padding"
                        >
                          <span className="normal-text zero-padding">
                            <CoordinatorList idList={this.state.item} />
                          </span>
                        </Col>
                      </Row>
                      <Row className="details-row">
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Supervisors</span>
                        </Col>
                        <Col
                          lg={9}
                          md={8}
                          sm={6}
                          xs={6}
                          className="zero-padding"
                        >
                          <span className="normal-text zero-padding">
                            <SupervisorList
                              idList={this.state.groupDetails.supervisors}
                            />
                          </span>
                        </Col>
                      </Row>

                      <Row className="details-row">
                        <Col lg={3} md={4} sm={6} xs={6} className="">
                          <span className="bold-text">Group Members</span>
                        </Col>
                        <Col lg={9} md={8} sm={6} xs={6}>
                          <span className="normal-text">
                            {this.state.studentList.map((user, index) => {
                              return (
                                <div key={index}>
                                  <Row className="mb-1">
                                    <Col
                                      md="5"
                                      xs="12"
                                      sm="12"
                                      className="table-col"
                                    >
                                      <span className="normal-text zero-margin">
                                        {user.name}
                                      </span>
                                    </Col>
                                    <Col
                                      md="3"
                                      xs="12"
                                      sm="12"
                                      className="table-col"
                                    >
                                      <span className="normal-text zero-margin">
                                        <Index
                                          id={user.id}
                                          index={user.index}
                                        />
                                      </span>
                                    </Col>
                                    <Col
                                      md="4"
                                      xs="12"
                                      sm="12"
                                      className="table-col"
                                    >
                                      <span className="normal-text zero-margin">
                                        {user.reg}
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}

          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Change Group Details</ModalHeader>
            <ModalBody>
              <div className="container">
                <div
                  style={{ width: "100%", margin: "auto", marginTop: "10px" }}
                >
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group title-form-group">
                      <Label for="avatar">Project Title</Label>

                      <Input
                        type="text"
                        className="form-control"
                        name="project-title"
                        onChange={this.onChangeProjectTitle}
                        placeholder="Insert your Project Title"
                        value={this.state.groupName}
                      />
                    </div>

                    <p></p>

                    <div className="form-group title-form-group">
                      <Label for="avatar">Group Email</Label>
                      <Input
                        type="text"
                        className="form-control"
                        name="group-email"
                        onChange={this.onChangeGroupEmail}
                        placeholder="Insert your Group Email"
                        value={this.state.groupEmail}
                      />
                    </div>

                    <div className="form-group">
                      <Button className="btn btn-info my-4" type="submit" block>
                        Edit Now
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ProjectDetailsCard);
