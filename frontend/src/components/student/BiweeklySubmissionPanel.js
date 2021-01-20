import React, { Component } from "react";

import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import axios from "axios";
import { getFromStorage } from "../../utils/Storage";
import { DropzoneDialog } from "material-ui-dropzone";
import "../../css/students/SubmissionPanel.scss";
import { confirmAlert } from "react-confirm-alert";
import Snackpop from "../shared/Snackpop";
import { RiDeleteBin2Line } from "react-icons/ri";

import { Button, Col, Row } from "react-bootstrap";
import ViewComments from "../supervisor/Notifications/ViewComments";

const backendURI = require("../shared/BackendURI");

class SubmitPanal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupDetails: this.props.location.state.groupDetails,
      groupId: this.props.location.state.groupDetails._id,
      groupNo: this.props.location.state.groupDetails.groupId,
      groupName: this.props.location.state.groupDetails.groupName,
      groupMembers: this.props.location.state.groupDetails.groupMembers,
      projectId: this.props.location.state.projectId,
      biweeklyNumber: this.props.location.state.submissionDetails
        .biweeklyNumber,
      deadDate: this.props.location.state.submissionDetails.deadDate,
      deadTime: this.props.location.state.submissionDetails.deadTime,
      biweeklyDiscription: this.props.location.state.submissionDetails
        .biweeklyDiscription,
      submissionId: this.props.match.params.id,
      fileSize: this.props.location.state.submissionDetails.submssionFileSize,
      fileLimit: this.props.location.state.submissionDetails.setFileLimit,
      name: "",
      files: "",
      states: false,
      supervisors: [],
      open: false,
      biweeklyDetails: [],
      loading3: false,
      comments: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getBiweeklySubmissionDetails();
  }

  getBiweeklySubmissionDetails() {
    const dt = {
      projectId: this.state.projectId,
      submissionId: this.state.submissionId,
      groupId: this.state.groupId,
    };
    axios
      .post(backendURI.url + "/biweeksubmissions/getBiweekly", dt)
      .then((res) => {
        this.setState(
          {
            biweeklyDetails: res.data.data,
          },
          () => {}
        );
        if (res.data.data.length > 0) {
          this.setState({
            states: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getComments = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    if (this.state.biweeklyDetails[0]) {
      axios
        .get(
          backendURI.url +
            "/biweekcomments/getcomments/" +
            this.state.biweeklyDetails[0]._id,
          { headers: headers }
        )
        .then((res) => {
          // console.log(res.data)
          this.setState({
            comments: res.data,
            loading3: false,
          });
        });
    }
  };

  callBackFunction = () => {
    this.setState(
      {
        loading3: true,
        deleteAlert: true,
      },
      () => {
        this.getComments();
      }
    );
  };

  handleClose() {
    this.setState({
      open: false,
    });
  }

  async handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({
      files: files,
      open: false,
    });
    const userId = getFromStorage("auth-id").id;
    const date = new Date();
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();

      formData.append("date", dateString);
      formData.append("time", timeString);
      formData.append("userId", userId);
      formData.append("biweeklyId", this.state.biweeklyId);
      formData.append("projectId", this.state.projectId);
      formData.append("groupId", this.state.groupId);
      formData.append("submissionsFile", files[i]);
      formData.append("groupno", this.state.groupNo);
      formData.append("groupname", this.state.groupName);
      formData.append("submissionId", this.state.submissionId);
      formData.append("biweeklyNumber", this.state.biweeklyNumber);
      formData.append("deadDate", this.state.deadDate);
      formData.append("deadTime", this.state.deadTime);
      formData.append("groupmember", this.state.groupMembers);

      await axios
        .post(backendURI.url + "/biweeksubmissions/add", formData)
        .then((res) => {
          this.getBiweeklySubmissionDetails();
        });
    }
  }

  handleOpen() {
    if (this.state.states === true) {
      this.setState({
        checkSuccesAlert: true,
      });
    } else {
      this.setState({
        open: true,
      });
    }
  }

  onChangename = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  onSubmit(e) {
    e.preventDefault();
    const userId = getFromStorage("auth-id").id;
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    const obj = {
      userId: userId,
      projectId: this.state.projectId,
      submissionId: this.state.submissionId,
      name: this.state.name,
      supervisors: this.state.groupDetails.supervisors,
    };
    axios
      .post(backendURI.url + "/submission/addSubmission", obj, {
        headers: headers,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }

  status() {
    if (this.state.states === true) {
      return <p style={{ color: "Green" }}> Submited</p>;
    } else {
      return <p style={{ color: "Red" }}> No Attempt</p>;
    }
  }

  filsename() {
    if (this.state.states === true) {
      return (
        <div>
          {this.state.biweeklyDetails.map((type) => {
            return (
              <div key={type._id}>
                <p>
                  <a
                    className="sub-link"
                    href={
                      backendURI.url +
                      "/biweeksubmissions/biweeklyAttachment/" +
                      type.filePath
                    }
                  >
                    {type.originalFileName}
                  </a>
                  &nbsp;&nbsp;
                  <RiDeleteBin2Line />
                </p>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          <p>-</p>
        </div>
      );
    }
  }

  lastmodify() {
    if (this.state.states === true) {
      return (
        <div>
          {this.state.biweeklyDetails.map((type) => {
            return (
              <div key={type._id}>
                <span className="date-time">
                  {type.date} &nbsp; {type.time}
                </span>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div>
          <p>-</p>
        </div>
      );
    }
  }

  //Delete a file
  deleteFile() {
    confirmAlert({
      title: "Delete File",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const headers = {
              "auth-token": getFromStorage("auth-token").token,
            };
            axios
              .delete(
                backendURI.url +
                  "/biweeksubmissions/deletebiweekly/" +
                  this.state.biweeklyDetails[0]._id,
                { headers: headers }
              )
              .then((res) => {
                this.setState({
                  deleteSuccesAlert: true,
                });
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  closeAlert = () => {
    this.setState({
      succesAlert: false,
      deleteSuccesAlert: false,
      checkSuccesAlert: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Snackpop
          msg={"Successfully Added"}
          color={"success"}
          time={2000}
          status={this.state.succesAlert}
          closeAlert={this.closeAlert}
        />
        <Snackpop
          msg={"Deleted Successfully.."}
          color={"success"}
          time={2000}
          status={this.state.deleteSuccesAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={"You Allready Submited.."}
          color={"warning"}
          time={2000}
          status={this.state.checkSuccesAlert}
          closeAlert={this.closeAlert}
        />

        <Navbar panel={"student"} />
        <div></div>
        <div className="sub_style">
          <div
            className="container-fluid sub_background"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            <div className="container">
              <p className="sub_tittle">
                Biweekly #{this.state.biweeklyNumber} Submission{" "}
                <small>
                  {" "}
                  ( DeadLine - {this.state.deadDate} : {this.state.deadTime} ){" "}
                </small>
              </p>
              <hr></hr>
              <p className="sub_status">Submission Status</p>
              <div className="card sub_crd">
                <Row>
                  <Col md="2">
                    <p>Due Date</p>
                  </Col>
                  <Col md="10">
                    <p>
                      {" "}
                      {this.state.deadDate} : {this.state.deadTime}
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col md="2">
                    <p>Description </p>
                  </Col>

                  <Col md="10">
                    <p> {this.state.biweeklyDiscription}</p>
                  </Col>
                </Row>

                <Row>
                  <Col md="2">
                    <p>Status</p>
                  </Col>

                  <Col md="10">
                    <p>{this.status()}</p>
                  </Col>
                </Row>

                <Row>
                  <Col md="2">
                    <p>Last modified</p>
                  </Col>
                  <Col md="10">
                    <p>{this.lastmodify()}</p>
                  </Col>
                </Row>

                <Row>
                  <Col md="2">
                    <p>File Submissions </p>
                  </Col>

                  <Col>
                    <spam
                      className="icon-span"
                      variant="link"
                      onClick={() => {
                        this.deleteFile();
                      }}
                    >
                      {this.filsename()}
                    </spam>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div
            className="container-fluid sub_backgrounds padding-bottom"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            <div className="container">
              <div>
                <Button
                  size="sm"
                  className="sub_btn1"
                  onClick={this.handleOpen.bind(this)}
                >
                  Add Submission
                </Button>
              </div>
              <DropzoneDialog
                open={this.state.open}
                onSave={this.handleSave.bind(this)}
                acceptedFiles={[
                  "image/jpeg",
                  "image/png",
                  "image/bmp",
                  "image/JPG",
                  ".pdf",
                  ".zip",
                  ".rar",
                  ".txt",
                ]}
                showPreviews={true}
                maxSize={this.state.fileSize}
                onClose={this.handleClose.bind(this)}
                filesLimit={parseInt(this.state.fileLimit, 10)}
                fullWidth={true}
              />

              {!this.state.loading3 && this.state.comments.length > 0 && (
                <p className="sub_status">Comments</p>
              )}
              {!this.state.loading3 &&
                this.state.comments.length > 0 &&
                this.state.comments.map((comment, key) => {
                  return (
                    <ViewComments
                      comment={comment}
                      key={key}
                      callBack={this.callBackFunction}
                    />
                  );
                })}
            </div>
          </div>
        </div>

        <Footer />
      </React.Fragment>
    );
  }
}

export default SubmitPanal;
