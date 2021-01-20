import React, { Component } from "react";
import { getFromStorage } from "../../utils/Storage";
import axios from "axios";
import StudentCard from "../shared/StudentCard";
import SupervisorName from "./Notifications/SupervisorName";

const backendURI = require("../shared/BackendURI");

class BiweekData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: this.props.details,
      loading1: true,
      loading2: true,
      userId: getFromStorage("auth-id").id,
      length: this.props.details.files.length - 1,
    };
  }

  componentDidMount() {
    this.getGroupDetails();
    this.getProjectDetails();
  }

  getGroupDetails = () => {
    let groupId = this.state.request.groupId;
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    axios
      .get(backendURI.url + "/createGroups/getGroupData/" + groupId, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          groupDetails: res.data.data,
          loading1: false,
        });
      });
  };

  getProjectDetails = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    axios
      .get(
        backendURI.url + "/projects/getproject/" + this.state.request.projectId,
        { headers: headers }
      )
      .then((res) => {
        this.setState({
          projectDetails: res.data.data,
          loading2: false,
        });
      });
  };

  render() {
    console.log(this.state.groupDetails);
    let status = this.state.request.supervisors.map((item, index) => {
      return (
        <div key={index}>
          {this.state.request.status[index] === "Accepted" && (
            <div className="mb-1">
              <SupervisorName id={item} />{" "}
              <span
                style={{
                  color: "limegreen",
                  border: "1.8px solid limegreen",
                  padding: "0px 4px",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                {this.state.request.status[index]}
              </span>{" "}
            </div>
          )}
          {this.state.request.status[index] === "Declined" && (
            <div className="mb-1">
              <SupervisorName id={item} />{" "}
              <span
                style={{
                  color: "#DC3545",
                  border: "1.8px solid #DC3545",
                  padding: "0px 4px",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                {this.state.request.status[index]}
              </span>{" "}
            </div>
          )}
          {this.state.request.status[index] === "Pending" && (
            <div className="mb-1">
              <SupervisorName id={item} />{" "}
              <span
                style={{
                  color: "grey",
                  border: "1.8px solid grey",
                  padding: "0px 4px",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                {this.state.request.status[index]}
              </span>{" "}
            </div>
          )}
        </div>
      );
    });

    return (
      <div>
        {!this.state.loading1 && !this.state.loading2 && (
          <div>
            <div className="mb-1">
              Project : {this.state.projectDetails.projectYear} -{" "}
              {this.state.projectDetails.projectType} -{" "}
              {this.state.projectDetails.academicYear}
            </div>
            <div className="mb-1">
              Group : {this.state.groupDetails.groupName} ( G
              {this.state.groupDetails.groupId} )
            </div>
            <div className="mb-1">
              Group Members :{" "}
              {this.state.groupDetails.groupMembers.map((index) => {
                return (
                  <span key={index}>
                    <StudentCard index={index} /> ,
                  </span>
                );
              })}
            </div>
            <div className="mb-1">
              Attachment : &nbsp;
              <a
                className="crd_atchmnt"
                href={
                  backendURI.url +
                  "/biweeksubmissions/getsubmission/" +
                  this.state.request.files[this.state.length]
                }
              >
                {this.state.request.originalFileName}
              </a>
            </div>
            <div className="mb-1" style={{ fontWeight: "bold" }}>
              Supervisor Approvals
            </div>
            {status}
          </div>
        )}
      </div>
    );
  }
}

export default BiweekData;
