import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import ViewProjects from "./ViewProjects";


class StudentHome extends Component {
  componentDidMount = async () => {
    localStorage.setItem("user-level","student")

    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isStudent"))
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
