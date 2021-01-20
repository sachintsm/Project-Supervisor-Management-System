import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import "../../css/admin/AdminHome.css";
import Footer from "../shared/Footer";

import MailBox from "./Mailbox.js";

class ViewMailBox extends Component {
  componentDidMount = async () => {
    localStorage.setItem("user-level", "admin");
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isAdmin")) {
      this.props.history.push("/");
    }
  };

  render() {
    console.log(localStorage);
    return (
      <React.Fragment>
        <div style={{ backgroundColor: "#F5F5F5" }}>
          <Navbar panel={"admin"} />
          <MailBox />
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default ViewMailBox;
