import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import ViewProjects from "./ViewProjects";


class StudentHome extends Component {
  componentDidMount = async () => {
    localStorage.setItem("user-level","student")

    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isStudent"))//check wether the user is logged in, if not re-direct to the login form
      this.props.history.push("/");
  };
  render() {
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <ViewProjects/>
        
      </React.Fragment>
    );
  }
}

export default StudentHome;
