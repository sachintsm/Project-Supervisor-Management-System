import React, { Component } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import "../../../css/students/progress/Tasks.scss";
import Footer from "../../shared/Footer";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import { getFromStorage } from "../../../utils/Storage";
import TaskCard from "../../student/progress/TaskCard";
import { withRouter } from "react-router-dom";
import TotalProgressCard from "../../student/progress/TotalProgressCard";
import ProgressUpdates from "../../student/progress/ProgressUpdates";
import { confirmAlert } from "react-confirm-alert";

const backendURI = require("../../shared/BackendURI");
// const muiTheme = createMuiTheme({
//   overrides: {
//     MuiSlider: {
//       thumb: {
//         color: "#000",
//       },
//       track: {
//         color: "#444",
//       },
//       rail: {
//         color: "#888",
//       },
//       mark: {
//         backgroundColor: "#888",
//       },
//     },
//   },
// });
// const marks = [
//   { value: 1, label: "1" },
//   { value: 2, label: "2" },
//   { value: 3, label: "3" },
//   { value: 4, label: "4" },
//   { value: 5, label: "5" },
//   { value: 6, label: "6" },
//   { value: 7, label: "7" },
//   { value: 8, label: "8" },
//   { value: 9, label: "9" },
//   { value: 10, label: "10" },
// ];

// const useStylesBootstrap = makeStyles((theme) => ({
//   arrow: {
//     color: "#555",
//   },
//   tooltip: {
//     backgroundColor: "#555",
//     fontSize: "14px",
//     color: "white",
//   },
// }));
// function BootstrapTooltip(props) {
//   const classes = useStylesBootstrap();

//   return <Tooltip arrow classes={classes} {...props} />;
// }

class ViewProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      groupDetails: props.location.state.groupDetails,
      taskWeight: 0,
      currentTasks: [],
      loading: true,
      progressUpdates: [],
      updateLoading: true,
      taskTitleError: false,
    };
    console.log(this.state.groupDetails.projectId);
  }

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    this.getTasks();
    this.getProgressUpdates();

    await axios
      .get(
        backendURI.url +
          "/projects/getProject/" +
          this.state.groupDetails.projectId
      )
      .then((res) => {
        console.log(res);
        this.setState({
          project: res.data.data,
        });

        console.log(this.state.project);
      });
  };

  getTasks = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    const groupId = this.state.groupDetails._id;
    axios
      .get(backendURI.url + "/progress/gettasks/" + groupId, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          currentTasks: res.data,
          loading: false,
        });
      });
  };

  getProgressUpdates = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    const groupId = this.state.groupDetails._id;
    console.log(groupId);
    axios
      .get(backendURI.url + "/progress/getprojectprogressupdates/" + groupId, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          progressUpdates: res.data,
          updateLoading: false,
        });
      });
  };

  openModal = () => {
    this.setState({ modal: true });
  };
  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  taskWeightHandler = (event, value) => {
    this.setState({
      taskWeight: value,
    });
  };

  onChangeTitle = (e) => {
    this.setState({
      taskTitle: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.taskTitle) {
      this.setState({ modal: false });
      confirmAlert({
        title: "Add New Task",
        message: "Do you want to Add this Task?",
        buttons: [
          {
            label: "No",
            onClick: () => {},
          },
          {
            label: "Yes",
            onClick: async () => {
              this.setState({
                taskTitleError: false,
              });

              const object = {
                taskTitle: this.state.taskTitle,
                taskWeight: this.state.taskWeight,
                groupId: this.state.groupDetails._id,
                groupMembers: this.state.groupDetails.groupMembers,
                totalProgress: 0,
              };
              const headers = {
                "auth-token": getFromStorage("auth-token").token,
              };
              axios
                .post(backendURI.url + "/progress/addtask", object, {
                  headers: headers,
                })
                .then((res) => {});

              window.location.reload(false);
            },
          },
        ],
      });
    } else {
      this.setState({
        taskTitleError: true,
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <div className="container-fluid tasks tasks-background-color">
          <div className="main-card">
            <div className="title-div">
              <h2 className="project-task-title">
                Progress ( {this.state.groupDetails.groupName} )
              </h2>
            </div>
            {this.state.currentTasks.length > 0 && (
              <Row>
                <TotalProgressCard groupDetails={this.state.groupDetails} />
              </Row>
            )}

            {this.state.loading && (
              <div className="spinner-div">
                <Spinner animation="border" className="sp   inner" />
              </div>
            )}

            {this.state.currentTasks.length === 0 && !this.state.loading && (
              <h6 className="no-task-text">* No Tasks to Show</h6>
            )}
            <Row>
              {this.state.currentTasks.map((item) => {
                return (
                  <Col
                    className="task-card-col"
                    key={item._id}
                    lg={3}
                    md={4}
                    xs={12}
                    sm={12}
                  >
                    <TaskCard
                      task={item}
                      groupDetails={this.state.groupDetails}
                      projectDetails={this.state.project}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
          {this.state.progressUpdates.length > 0 && (
            <div className="progress-update-div">
              <Card className="progress-update-card">
                <h3 className="title">Progress Update History</h3>
                {!this.state.updateLoading && (
                  <ProgressUpdates
                    taskTitleShow={true}
                    usernameShow={true}
                    progressUpdates={this.state.progressUpdates}
                  />
                )}
              </Card>
            </div>
          )}
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withRouter(ViewProgress);
