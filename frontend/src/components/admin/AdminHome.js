import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";

import "../../css/admin/AdminHome.css";

import ProjectsList from "./ProjectsList";

class AdminHome extends Component {
  componentDidMount = async () => {
    localStorage.setItem("user-level", "admin");
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isAdmin")) {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <React.Fragment>
        <ProjectsList />
      </React.Fragment>
    );
  }
}

export default AdminHome;
