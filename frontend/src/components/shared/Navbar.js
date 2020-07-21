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
import { FiSettings } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import Icon from '@material-ui/core/Icon';


const backendURI = require("./BackendURI");
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
      logout: false,
      count: 0,
      reqId: [],
      userLevel: localStorage.getItem("user-level")
    };
    this.logout = this.logout.bind(this);
    this.readRequest = this.readRequest.bind(this);
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
    deleteStorage('user-level');
    this.setState({
      logout: true,
    });
    // this.context.router.push('/');
    // window.location.reload(false);

    // let history = useHistory();
    // history.push('/');
  }
  readRequest() {
    const userData = getFromStorage('auth-id')
    var ob = [];
    console.log('hasi');
    axios.get(backendURI.url + '/users/countNotifyReq/' + userData.id)
      .then(response => {
        console.log(response.data.data2);
        ob = response.data.data2

        for (var i = 0; i < ob.length; i++) {
          var Id = ob[i]._id;
          console.log(Id);
          axios.post(backendURI.url + '/users/readRequest/' + Id, Id)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  async componentDidMount() {

    if(this.state.userLevel=="student"){
      this.getGroupFormNotificationCount()
    }

    const userData = getFromStorage('auth-id')
    const headers = {
      'auth-token':getFromStorage('auth-token').token,
    }
    // const userType = getFromStorage('user-level')
    // alert(this.state.panel);
    // this.setState({ userType: userType })
    axios.get(backendURI.url + '/users/countNotifyReq/' + userData.id,{headers: headers})
      .then(response => {

        this.setState({
          count: response.data.data,
          //reqId: response.data.data2
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  getGroupFormNotificationCount = () => {
    const headers = {
      'auth-token':getFromStorage('auth-token').token,
    }
    const userId = getFromStorage("auth-id").id
    axios.get(backendURI.url+'/createGroups/groupformnotification/'+userId,{headers: headers}).then(res=>{
      this.setState({
        groupNotificationCount: res.data.length
      })
    })

  }
  render() {
    // console.log(this.state.userLevel)
    if (this.state.logout) {
      return <Redirect to='/' push={true} />;
    }
    return (
      <Router>
        {/*#263238 => NAVBAR color*/}
        <div className="navbar-css">

          <MDBNavbar color='special-color-dark' dark expand='md' className='navbar'   >
            <MDBNavbarBrand>
              {this.state.userLevel === "admin" &&
              <Nav.Link className="navlink-icon" href='/adminhome'><img href='/adminhome' style={{ width: '12rem' }} src={require('../../assets/logo/Project Logo white.png')} /></Nav.Link>
              }
              {this.state.userLevel === "student" &&
              <Nav.Link className="navlink-icon"  href='/studenthome'><img href='/adminhome' style={{ width: '12rem' }} src={require('../../assets/logo/Project Logo white.png')} /></Nav.Link>
              }
              {this.state.userLevel === "supervisor" &&
              <Nav.Link className="navlink-icon"  href='/supervisorhome'><img href='/adminhome' style={{ width: '12rem' }} src={require('../../assets/logo/Project Logo white.png')} /></Nav.Link>
              }
              {this.state.userLevel === "coordinator"  &&
              <Nav.Link className="navlink-icon"  href='/coordinatorhome'><img href='/adminhome' style={{ width: '12rem' }} src={require('../../assets/logo/Project Logo white.png')} /></Nav.Link>
              }
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse} />
            <MDBCollapse id='navbarCollapse3' isOpen={this.state.isOpen} navbar>
              <MDBNavbarNav className='navbar-nav' right>
                {/*<MDBNavItem className="mr-4 userType"> {this.state.userLevel} *</MDBNavItem>*/}
                <MDBNavItem className="mr-4">
                  {this.state.userLevel === "admin" &&
                  <Nav.Link href='/adminhome'>Home</Nav.Link>
                  }
                  {this.state.userLevel === "student" &&
                  <Nav.Link href='/studenthome'>Home</Nav.Link>
                  }
                  {this.state.userLevel === "supervisor" &&
                  <Nav.Link href='/supervisorhome'>Home</Nav.Link>
                  }
                  {this.state.userLevel === "coordinator"  &&
                  <Nav.Link href='/coordinatorhome'>Home</Nav.Link>
                  }
                </MDBNavItem>

                {/* =============================== Coordinator Panel================================ */}
                {this.state.panel === 'coordinator' && (
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        <span className='mr-2'>Notice</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href='/shared/noticeView'>View Notices</MDBDropdownItem>
                        <MDBDropdownItem href='/shared/notice'>Create Notice</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                )}
                &nbsp;&nbsp;&nbsp;&nbsp;

                {this.state.panel === 'coordinator' && (
                    <MDBDropdown className="mr-4">
                      <MDBDropdownToggle nav caret>
                        <span className='mr-2'>Projects</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href='/coordinatorhome/createGroups'>Create Groups</MDBDropdownItem>
                        <MDBDropdownItem href='/coordinatorhome/projectGroups'>Project Groups Data</MDBDropdownItem>
                        <MDBDropdownItem href='/coordinatorhome/assignSupervisors'>Assign Supervisors</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                )}

                {/* =============================== Admin Panel================================ */}
                {this.state.panel === 'admin' && (

                    <MDBDropdown className="mr-4">
                      <MDBDropdownToggle nav caret>
                        <span className='mr-2'>Users</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href='/adminhome/viewusers'>Manage Users</MDBDropdownItem>
                        <MDBDropdownItem href='/adminhome/registration'>User Registrations</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                )}



                {this.state.panel === 'admin' && (

                    <MDBDropdown className="mr-4">
                      <MDBDropdownToggle nav caret>
                        <span className='mr-2'>Projects</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href='/adminhome/projecttypes'>Project Categories</MDBDropdownItem>
                        <MDBDropdownItem href='/adminhome/createproject'>Projects</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                )}
                {this.state.panel === 'admin' && (

                    <MDBDropdown className='mr-4'>
                      <MDBDropdownToggle nav caret>
                        <span className='mr-2'>Notices</span>
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem href='/shared/noticeView'>View Notices</MDBDropdownItem>
                        <MDBDropdownItem href='/shared/notice'>Create Notice</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                )}



                {this.state.panel === 'admin' && (
                    <MDBNavItem className="mr-4">
                      <Nav.Link className="padding-zero" href='/adminhome/viewmailbox'><span className="icon"><Icon style={{ fontSize:30 }} >drafts</Icon></span></Nav.Link>

                    </MDBNavItem>
                )}


                {/* // <MDBNavItem className="mr-4">
                //   <Nav.Link  className="padding-zero"   href='/shared/notice'>
                //     Notices
                //   </Nav.Link>
                // </MDBNavItem>
               */}

                {/* ============================ Supervisor Panel ============================================= */}
                {this.state.panel === 'supervisor' && (
                    <MDBNavItem className="mr-4">
                      <Nav.Link className="padding-zero" href='/shared/noticeView'>
                        Notices
                      </Nav.Link>
                    </MDBNavItem>

                )}
                {/* ============================ Supervisor Panel ============================================= */}
                {this.state.panel === 'supervisor' && (

                    <MDBNavItem className="mr-4" >
                      <Nav.Link className="padding-zero" href='/supervisorhome/viewRequest' onClick={this.readRequest}>
                        RequestView
                      {/* {(this.state.count !== 0) ? (
                            <span className="badge">{this.state.count}</span>) : null
                        }*/}
                        <span className="icon">{this.state.count>0 && <Badge style={{verticalAlign: "top"}} variant="danger">{this.state.count}</Badge>}</span>
                      </Nav.Link>
                    </MDBNavItem>

                )}
                {/*==============================================================================================*/}

                {/* =============================  Student Panel  ============================================ */}

                {this.state.panel === 'student' && (

                    <MDBNavItem className="mr-4">
                      <Nav.Link className="nav-link padding-zero" href='/shared/noticeView'>Notices </Nav.Link>


                    </MDBNavItem>
                )}

                {/* ========================================================================= */}

                {/* =============================  Student Panel  ============================================ */}

                {/* {this.state.panel === 'student' && (

                <MDBNavItem className="mr-4">
                  <Nav.Link className="padding-zero" href='/student/viewMeeting'>Meetings</Nav.Link>

                </MDBNavItem>
              )} */}

                {/* ========================================================================= */}

                <MDBNavItem className="mr-3">
                  <Nav.Link className="padding-zeroo" href='/studenthome/notifications'><span className="icon"><Icon style={{ fontSize:30 }} >notifications </Icon>{this.state.groupNotificationCount>0 && <Badge style={{verticalAlign: "top"}} variant="danger">{this.state.groupNotificationCount}</Badge>}</span></Nav.Link>
                </MDBNavItem>
                <MDBNavItem>
                  {this.state.isCoordinator ||
                  this.state.isSupervisor ||
                  this.state.isAdmin ? (
                      <MDBDropdown style={{ backgroundColor: 'red' }} dark className="mr-3">
                        <MDBDropdownToggle nav >
                          <span className="icon"><Icon style={{ fontSize:30 }} >person</Icon></span>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-menu">
                          <MDBDropdownItem href='/profile' className="dropdown-item">
                            <IconContext.Provider
                                value={{
                                  color: '#263238',
                                  className: 'global-class-name',
                                  style: {
                                    verticalAlign: 'middle',
                                  },
                                }}
                            >
                              <div>
                                {/*<Icon style={{ fontSize:20 }}>settings</Icon>*/}
                                {/*&nbsp; &nbsp; &nbsp;*/}
                                <span>Settings</span>
                              </div>
                            </IconContext.Provider>
                          </MDBDropdownItem>
                          {((this.state.isSupervisor && this.state.isCoordinator) ||
                              (this.state.isSupervisor && this.state.isAdmin) ||
                              (this.state.isAdmin && this.state.isCoordinator)) && (
                              <MDBDropdownItem divider className="my-divider"/>
                          )}

                          {this.state.panel === 'supervisor' &&
                          this.state.isAdmin && (
                              <MDBDropdownItem href='/adminhome'  className="dropdown-item">
                                Switch to Admin
                              </MDBDropdownItem>
                          )}
                          {this.state.panel === 'supervisor' &&
                          this.state.isCoordinator && (
                              <MDBDropdownItem href='/coordinatorhome'>
                                Switch to Coordinator
                              </MDBDropdownItem>
                          )}

                          {this.state.panel === 'coordinator' &&
                          this.state.isAdmin && (
                              <MDBDropdownItem href='/adminHome'>
                                Switch to Admin
                              </MDBDropdownItem>
                          )}
                          {this.state.panel === 'coordinator' &&
                          this.state.isSupervisor && (
                              <MDBDropdownItem href='/supervisorhome'>
                                Switch to Supervisor
                              </MDBDropdownItem>
                          )}

                          {this.state.panel === 'admin' &&
                          this.state.isCoordinator && (
                              <MDBDropdownItem href='/coordinatorhome'>
                                Switch to Coordinator
                              </MDBDropdownItem>
                          )}
                          {this.state.panel === 'admin' &&
                          this.state.isSupervisor && (
                              <MDBDropdownItem href='/supervisorhome'>
                                Switch to Supervisor
                              </MDBDropdownItem>
                          )}
                        </MDBDropdownMenu>
                      </MDBDropdown>
                  ) : (
                      <Nav.Link  className="padding-zero mr-3" href='/profile'><span className="icon"><Icon style={{ fontSize:30 }} >person</Icon></span></Nav.Link>
                  )}
                </MDBNavItem>
                <MDBNavItem>
                  <Nav.Link className="padding-zeroo" onClick={this.logout}><span className="icon"><Icon style={{ fontSize:30 }} >logout</Icon></span></Nav.Link>
                </MDBNavItem>

              </MDBNavbarNav>
            </MDBCollapse>
          </MDBNavbar>
        </div>
      </Router >
    );
  }
}
