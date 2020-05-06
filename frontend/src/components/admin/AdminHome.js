import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";

class AdminHome extends Component {
  componentDidMount = async () => {
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState) this.props.history.push("/");
  };
  render() {
    return (
      <React.Fragment>
        <Navbar panel={"admin"} />
        <h1>Admin Home</h1>
      </React.Fragment>
    );
  }
}

export default AdminHome;
