import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import { MDBInput } from "mdbreact";
import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Button, Col, Row } from 'react-bootstrap';
import Navbar from "../shared/Navbar";
import '../../css/admin/ViewUsers.css';
import { verifyAuth } from "../../utils/Authentication";





export default class ViewUsers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            snackbaropen: false,
            snackbarmsg: '',
        }

        // this.onLocalChange = this.onLocalChange.bind(this)

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }


    componentDidMount = async () => {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        if (!authState || !localStorage.getItem("isAdmin"))
          this.props.history.push("/");
      };

    render() {
        return (
            <React.Fragment >
                <Navbar panel={"admin"} />
                <div className="container-fluid">
                    <Snackbar
                        open={this.state.snackbaropen}
                        autoHideDuration={2000}
                        onClose={this.snackbarClose}
                        message={<span id="message-id">{this.state.snackbarmsg}</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="secondary"
                                onClick={this.snackbarClose}
                            > x </IconButton>
                        ]}
                    />
                    {/* ************************************************************************************************************************************************************************** */}

                    <div className="row">
                        {/* <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div> */}
                        <div className="col-md-12" style={{ backgroundColor: "#f5f5f5", minHeight: "1000px" }}>
                            <div className="container">

                                <Tabs defaultActiveKey="staff" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

                                    <Tab eventKey="staff" title="Staff" className="tit">
                                    <div className="row" style={{ marginTop: "20px" }}>

                                        <div className="card">
                                            <div>
                                                <h3 className="sp_head">List of Staff</h3>
                                                <form>
                                                    <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                        <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search ID here" onChange={this.handleSearch} />
                                                    </div>
                                                </form>
                                                <div className="sp_table">
                                                    <table className="table table-striped" style={{ marginTop: 20 }} >
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Birthday</th>
                                                                <th>Nic</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {this.UserList()} */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </Tab>
                                    <Tab eventKey="co-ordinators" title="Co-ordinators">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="card">
                                            <div>
                                                <h3 className="sp_head">List of Co-ordinators</h3>
                                                <form>
                                                    <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                        <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search ID here" onChange={this.handleSearch} />
                                                    </div>
                                                </form>
                                                <div className="sp_table">
                                                    <table className="table table-striped" style={{ marginTop: 20 }} >
                                                        <thead>
                                                        <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Birthday</th>
                                                                <th>Nic</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {this.UserList()} */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>


                                        </div>
                                    </Tab>

                                    <Tab eventKey="supervisors" title="Supervisors">
                                    <div className="row" style={{ marginTop: "20px" }}>
                                        
                                        <div className="card">
                                            <div>
                                                <h3 className="sp_head">List of Supervisors</h3>
                                                <form>
                                                    <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                        <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search ID here" onChange={this.handleSearch} />
                                                    </div>
                                                </form>
                                                <div className="sp_table">
                                                    <table className="table table-striped" style={{ marginTop: 20 }} >
                                                        <thead>
                                                        <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Birthday</th>
                                                                <th>Nic</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {this.UserList()} */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                    </Tab>
                                  
                                    <Tab eventKey="students" title="Students">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                        <div className="card">
                                            <div>
                                                <h3 className="sp_head">List of Students</h3>
                                                <form>
                                                    <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                        <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search ID here" onChange={this.handleSearch} />
                                                    </div>
                                                </form>
                                                <div className="sp_table">
                                                    <table className="table table-striped" style={{ marginTop: 20 }} >
                                                        <thead>
                                                        <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Birthday</th>
                                                                <th>Nic</th>
                                                                <th>Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* {this.UserList()} */}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        </div>
                                    </Tab>
                                    
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}
