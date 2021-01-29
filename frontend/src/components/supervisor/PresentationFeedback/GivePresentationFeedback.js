import React, { Component } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import axios from "axios";
import BackendURI from "../../shared/BackendURI";
import { Container, Card } from "react-bootstrap";
import { Input } from "reactstrap";
import "../../../css/supervisor/GivePresentationFeedback.scss";
import { getFromStorage } from "../../../utils/Storage";
import Snackpop from "../../shared/Snackpop";
import { confirmAlert } from "react-confirm-alert";
import ViewPresentationFeedback from "./ViewPresentationFeedback";

class GivePresentationFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      groups: [],
      groupList: [],
      loading1: true,
      loading2: true,
      invalidAlert: false,
      successAlert: false,
    };
  }

  componentDidMount() {
    this.getProjects();
    this.getGroups();
  }

  getProjects = async () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    await axios
      .get(BackendURI.url + "/projects/", { headers: headers })
      .then((res) => {
        this.setState({
          projects: res.data,
          loading1: false,
        });
      });
  };

  getGroups = async () => {
    await axios.get(BackendURI.url + "/creategroups/get/").then((res) => {
      this.setState({
        groups: res.data.data,
        loading2: false,
      });
    });
  };

  saveFeedback = () => {
    const userId = getFromStorage("auth-id").id;

    let data = {
      projectId: this.state.selectedProject,
      groupId: this.state.selectedGroup,
      presentationName: this.state.selectedPresentation,
      feedback: this.state.feedback,
      userId: userId,
    };

    if (
      data.projectId &&
      data.groupId &&
      data.presentationName &&
      data.feedback
    ) {
      confirmAlert({
        title: "Feedback",
        message: "Are you sure you want to give this Feedback?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const headers = {
                "auth-token": getFromStorage("auth-token").token,
              };

              axios
                .post(BackendURI.url + "/presentationfeedback/add", data, {
                  headers: headers,
                })
                .then((res) => {
                  this.setState(
                    {
                      successAlert: true,
                    },
                    () => {
                      window.location.reload(false);
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
    } else {
      this.setState({
        invalidAlert: true,
      });
    }
  };

  handleDropdownChange = (e) => {
    let groupList = this.state.groups.filter(
      (item) => item.projectId === e.target.value
    );
    this.setState({
      groupList: groupList,
      selectedProject: e.target.value,
    });
  };
  handleDropdownChange2 = (e) => {
    this.setState({
      selectedGroup: e.target.value,
    });
  };
  handleDropdownChange3 = (e) => {
    this.setState({
      selectedPresentation: e.target.value,
    });
  };

  handleFeedbackChange = (e) => {
    this.setState({
      feedback: e.target.value,
    });
  };

  closeAlert = () => {
    this.setState({
      invalidAlert: false,
      successAlert: false,
    });
  };

  render() {
    let projectList =
      this.state.projects.length > 0 &&
      this.state.projects.map((item, i) => {
        return (
          <option key={i} value={item._id}>
            {item.projectYear} - {item.projectType} - {item.academicYear}
          </option>
        );
      }, this);

    let groupList =
      this.state.groupList.length > 0 &&
      this.state.groupList.map((item, i) => {
        return (
          <option key={i} value={item._id}>
            {item.groupName} ( G{item.groupId} )
          </option>
        );
      }, this);

    return (
      <React.Fragment>
        <Snackpop
          msg={"Invalid Inputs"}
          color={"error"}
          time={3000}
          status={this.state.invalidAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={"Feedback Save Success"}
          color={"success"}
          time={3000}
          status={this.state.successAlert}
          closeAlert={this.closeAlert}
        />

        <Navbar panel={"supervisor"} />
        {/*<div className="background-color ">*/}
        {/*    */}
        {/*</div>*/}
        <div className="give-presentation-feedback">
          <Container>
            <Card className="card-1">
              <div className="heading-div">
                <h3 className="heading">Give Presentation Feedbacks</h3>
              </div>
              {!this.state.loading1 && !this.state.loading2 && (
                <div>
                  <div className="form-group pg-dropdown-select">
                    <select
                      className="form-control pg-dropdown-select"
                      id="dropdown"
                      onChange={this.handleDropdownChange}
                    >
                      <option disabled selected value="">
                        Select the project
                      </option>
                      {this.state.projects.length > 0 && projectList}
                    </select>
                  </div>

                  <div className="form-group pg-dropdown-select">
                    <select
                      className="form-control pg-dropdown-select"
                      id="dropdown"
                      onChange={this.handleDropdownChange2}
                    >
                      <option disabled selected value="">
                        Select the Group
                      </option>
                      {this.state.groupList.length > 0 && groupList}
                    </select>
                  </div>

                  <div className="form-group pg-dropdown-select">
                    <select
                      className="form-control pg-dropdown-select"
                      id="dropdown"
                      onChange={this.handleDropdownChange3}
                    >
                      <option disabled selected value="">
                        Select Presentation
                      </option>
                      <option key={"Preliminary"} value={"Preliminary"}>
                        Preliminary
                      </option>
                      <option key={"Interim"} value={"Interim"}>
                        Interim
                      </option>
                      <option key={"Finals"} value={"Finals"}>
                        Finals
                      </option>
                    </select>
                  </div>

                  <div>
                    <Input
                      type="textarea"
                      className="text-area"
                      placeholder="Enter Presentaion Feedback"
                      onChange={this.handleFeedbackChange}
                    ></Input>
                  </div>

                  <div>
                    <button
                      className="btn btn-info pg-bt mt-5 mb-3"
                      style={{ width: "100%" }}
                      onClick={this.saveFeedback}
                    >
                      Save Feedback
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </Container>

          <ViewPresentationFeedback />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default GivePresentationFeedback;
