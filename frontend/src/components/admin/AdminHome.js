import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/admin/AdminHome.css'
import Notice from "../shared/Notice";
import Footer from '../shared/Footer'

class AdminHome extends Component {
  
  componentDidMount = async () => {
    localStorage.setItem("user-level","admin")
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isAdmin")){
      this.props.history.push("/");
    }
  };

  render() {
    console.log(localStorage)
    return (
      <React.Fragment>
        <Navbar panel={"admin"} />
        <p className="head-now">Admin Home</p>
        
        <Footer />
      </React.Fragment>
    );
  }
} 

export default AdminHome;
