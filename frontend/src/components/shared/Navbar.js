import React, { Component } from "react";
import "../../css/shared/navbar.css";
import { deleteStorage } from "../../utils/Storage";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavbarToggler,
  MDBCollapse,
} from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";
import { Nav } from "react-bootstrap";

export default class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isAdmin: localStorage.getItem("isAdmin"),
      isStudent: localStorage.getItem("isStudent"),
      isCoordinator: localStorage.getItem("isCoordinator"),
      isSupervisor: localStorage.getItem("isSupervisor"),
      panel: this.props.panel,
    };
    this.logout = this.logout.bind(this);
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  logout() {
    deleteStorage("auth-token");
    window.location.reload(false);
  }

  render() {
    return (
      <Router>
        <MDBNavbar dark expand="md" className="navbar">
          <MDBNavbarBrand>
            {/* eslint-disable-next-line */}
            <img
              style={{ width: "12%" }}
              src={require("../../assets/logo/Logo_white.png")}
            />
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav right>
              <MDBNavItem>
                {this.state.panel === "admin" ? (
                  <Nav.Link href="/adminhome">Home</Nav.Link>
                ) : null}
                {this.state.panel === "student" ? (
                  <Nav.Link href="/studenthome">Home</Nav.Link>
                ) : null}
                {this.state.panel === "coordinator" ? (
                  <Nav.Link href="/coordinatorhome">Home</Nav.Link>
                ) : null}
                {this.state.panel === "supervisor" ? (
                  <Nav.Link href="/supervisorhome">Home</Nav.Link>
                ) : null}
              </MDBNavItem>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <MDBNavItem>
                <Nav.Link href="/profile">Profile</Nav.Link>
              </MDBNavItem>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <MDBNavItem>
                <Nav.Link onClick={this.logout}>Logout</Nav.Link>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </Router>
    );
  }
}
