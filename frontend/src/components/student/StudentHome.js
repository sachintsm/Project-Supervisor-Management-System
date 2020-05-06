import React, { Component } from "react";
import { verifyAuth } from "../../utils/authentication";
import Navbar from "../shared/Navbar";

class StudentHome extends Component {
  componentDidMount = async () => {
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isStudent"))
      this.props.history.push("/");
  };
  render() {
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <h1>Student Home</h1>
      </React.Fragment>
    );
  }
}

export default StudentHome;
