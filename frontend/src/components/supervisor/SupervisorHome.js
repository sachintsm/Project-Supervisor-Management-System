import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/supervisor/SupervisorHome.css'
import Footer from "../shared/Footer";

class SupervisorHome extends Component {
  componentDidMount = async () => {
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isSupervisor"))
      this.props.history.push("/");
  };
  render() {
    return (
      <React.Fragment>
        <Navbar panel={"supervisor"} />
        {/* /********************************************************** */}

        <h1>Supervisor Home</h1>

        {/* /********************************************************** */}
        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default SupervisorHome;
