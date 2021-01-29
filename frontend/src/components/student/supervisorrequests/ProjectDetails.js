import React, { Component } from "react";
import { getFromStorage } from "../../../utils/Storage";
import axios from "axios";
const backendURI = require("../../shared/BackendURI");

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.projectId,
      projectName: "",
      count: this.props.count,
    };
  }

  componentDidMount() {
    this.getProjectName();
  }

  getProjectName = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    axios
      .get(
        backendURI.url + "/projects/getProjectName/" + this.state.projectId,
        { headers: headers }
      )
      .then((res) => {
        console.log(res.data.data);
        this.setState({
          projectName:
            res.data.data.projectYear +
            " " +
            res.data.data.projectType +
            " " +
            res.data.data.academicYear,
        });
      });
  };

  render() {
    return (
      <tr>
        <td>{this.state.projectName}</td>
        <td>{this.state.count}</td>
      </tr>
    );
  }
}

export default ProjectDetails;
