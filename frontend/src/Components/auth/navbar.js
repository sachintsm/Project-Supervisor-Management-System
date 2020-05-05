import React, { Component } from 'react'
import '../../css/auth/navbar.css'
import { deleteStorage } from '../../utils/storage';
import {MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse} from "mdbreact";
import { BrowserRouter as Router } from 'react-router-dom';
import { Nav } from 'react-bootstrap';


export default class navbar extends Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    logout() {
        deleteStorage('auth-token');
        window.location.reload(false);
    }

    render() {
        return (
            <Router >
                <MDBNavbar dark expand="md" className="navbar">
                    <MDBNavbarBrand>
                        {/* eslint-disable-next-line */}
                        <img style={{ width: "12%" }} src={require('../../Assets/logo/Logo_white.png')} />
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse} />
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                {/* <div onClick={this.home}>Home</div> */}
                                <Nav.Link href="/">Home</Nav.Link>
                            </MDBNavItem>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <MDBNavItem>
                                <Nav.Link href="/profile">Profile</Nav.Link>

                            </MDBNavItem>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            <MDBNavItem>
                                <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
            </Router>
        )
    }
}
