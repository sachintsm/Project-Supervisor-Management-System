import React, { Component } from 'react';
import '../../css/shared/Navbar.css';
import { deleteStorage } from '../../utils/Storage';
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
import { Nav } from 'react-bootstrap';

export default class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isAdmin: localStorage.getItem('isAdmin'),
      isStudent: localStorage.getItem('isStudent'),
      isCoordinator: localStorage.getItem('isCoordinator'),
      isSupervisor: localStorage.getItem('isSupervisor'),
      panel: this.props.panel,
    };
    this.logout = this.logout.bind(this);
  }

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  logout() {
    deleteStorage('auth-token');
    deleteStorage('isAdmin');
    deleteStorage('isStudent');
    deleteStorage('isCoordinator');
    deleteStorage('isSupervisor');
    window.location.reload(false);
  }

  render() {
    return (
      <Router>
        <MDBNavbar
          color='special-color-dark'
          // #263238
          dark
          expand='md'
          className='navbar'
        >
          <MDBNavbarBrand>
            {/* eslint-disable-next-line */}
            <img
              style={{ width: '12%' }}
              src={require('../../assets/logo/Logo_white.png')}
            />
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id='navbarCollapse3' isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav right>
              <MDBNavItem>
                <Nav.Link href="/adminhome/viewusers">Users</Nav.Link>
              </MDBNavItem>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <MDBNavItem>
                <Nav.Link href="/adminhome/registration">Registration</Nav.Link>
              </MDBNavItem>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <MDBNavItem>

                {this.state.panel === "admin" ? (
                  <Nav.Link href="/adminhome">Home</Nav.Link>
                ) : null}
                {this.state.panel === 'student' ? (
                  <Nav.Link href='/studenthome'>Home</Nav.Link>
                ) : null}
                {this.state.panel === 'coordinator' ? (
                  <Nav.Link href='/coordinatorhome'>Home</Nav.Link>
                ) : null}
                {this.state.panel === 'supervisor' ? (
                  <Nav.Link href='/supervisorhome'>Home</Nav.Link>
                ) : null}
              </MDBNavItem>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <MDBNavItem>
                {this.state.isCoordinator || this.state.isSupervisor ? (
                  <MDBDropdown style={{ backgroundColor: '#1C2331' }} dark>
                    <MDBDropdownToggle nav caret>
                      <span className='mr-2'>Profile</span>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem href='/profile'>
                        Settings
                      </MDBDropdownItem>
                      {this.state.isSupervisor && this.state.isCoordinator ? (
                        <MDBDropdownItem divider />
                      ) : null}

                      {this.state.panel === 'supervisor' &&
                        this.state.isCoordinator ? (
                          <MDBDropdownItem href='/coordinatorhome'>
                            Switch to Coordinator
                          </MDBDropdownItem>
                        ) : null}

                      {this.state.panel === 'coordinator' &&
                        this.state.isSupervisor ? (
                          <MDBDropdownItem href='/supervisorhome'>
                            Switch to Supervisor
                          </MDBDropdownItem>
                        ) : null}
                    </MDBDropdownMenu>
                  </MDBDropdown>
                ) : (

                    <Nav.Link href="/profile">Profile</Nav.Link>


                  )}
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
