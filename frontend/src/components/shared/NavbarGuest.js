import React, { Component } from "react";
import "../../css/shared/Navbar.scss";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
} from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";
import { Nav } from "react-bootstrap";

class navbarGuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <Router>
        <div className="navbar-css">
          <MDBNavbar
            color="special-color-dark"
            dark
            expand="md"
            className="navbar"
          >
            <MDBNavbarBrand>
              <Nav.Link className="navlink-icon" href="">
                <img
                  href="#"
                  style={{ width: "12rem" }}
                  alt=""
                  src={require("../../assets/logo/Project Logo white.png")}
                />
              </Nav.Link>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse} />
            <MDBCollapse
              id="navbarCollapse3"
              isOpen={this.state.isOpen}
              navbar
            ></MDBCollapse>
          </MDBNavbar>
        </div>
      </Router>
    );
  }
}
export default navbarGuest;
