import React, { Component } from 'react';
import '../../css/shared/Navbar.scss';
import { Redirect } from 'react-router';

import { deleteStorage } from '../../utils/Storage';
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import { Nav , Badge} from 'react-bootstrap';
import { IconContext } from 'react-icons';
import Icon from '@material-ui/core/Icon';
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";


const backendURI = require("./BackendURI");

const useStylesBootstrap1 = makeStyles((theme) => ({
  arrow: {
    color: "#263238",
  },
  tooltip: {
    backgroundColor: "#263238",
    fontSize: "14px",
    color: '#CCC'
  },
}));
function BootstrapTooltip1(props) {
  const classes = useStylesBootstrap1();
  return <Tooltip arrow classes={classes} {...props} />;
}

export default class navbarGuest extends Component {
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

          <MDBNavbar color='special-color-dark' dark expand='md' className='navbar'   >
            <MDBNavbarBrand>
              <Nav.Link className="navlink-icon" href='#'><img href='#' style={{ width: '12rem' }} src={require('../../assets/logo/Project Logo white.png')} /></Nav.Link>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse} />
            <MDBCollapse id='navbarCollapse3' isOpen={this.state.isOpen} navbar>
            </MDBCollapse>
          </MDBNavbar>
        </div>
      </Router >
    );
  }
}
