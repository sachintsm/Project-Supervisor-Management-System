// import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
// import { MDBInput } from "mdbreact";
import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import { Button, Col, Row } from 'react-bootstrap';
import Navbar from "../shared/Navbar";
import '../../css/admin/ViewUsers.css';
import { verifyAuth } from "../../utils/Authentication";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
// import SearchField from "react-search-field";


const backendURI = require('../shared/BackendURI');


const Staff = React.memo(props => (
    <tr>
        <td>{props.staff.firstName} {props.staff.lastName}</td>
        <td>{props.staff.email}</td>
        {/* <td>{props.staff.birthday}</td> */}
        <td>{props.staff.nic}</td>
        <td>{props.staff.mobile}</td>
        <td>
            <Create className="edit-btn" fontSize="large" onClick={() => props.delete(props.staff._id)} />
        </td>
        <td>
            <DeleteForeverIcon className="del-btn" fontSize="large" onClick={() => props.delete(props.staff._id)} />
        </td>
    </tr>
));



export default class ViewUsers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            snackbaropen: false,
            snackbarmsg: '',
            firstName: '',
            lastName: '',
            email: '',
            birthday: '',
            nic: '',
            mobile: '',
            isStudent: '',
            isAdmin: '',
            isStaff: '',
            isSupervisor: '',
            isCoordinator: '',
            isDeleted: '',
            search:'',
            userS: [],
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        // this.deleteDebtor = this.deleteDebtor.bind(this);

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }


    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        if (!authState || !localStorage.getItem("isAdmin"))
            this.props.history.push("/");

        axios.get(backendURI.url + "/users/get")
            .then(response => {
                console.log(response.data.data);

                this.setState({ userS: response.data.data });
                //   console.log(userStaff);

            })
            .catch(function (error) {
                console.log(error);
            })
    };

    handleSearch = e => {
        this.setState({ search: e.target.value.substr(0,20) });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    UserList() {

        let filteredUsers = this.state.userS.filter(
           (currentStaff)=>{
               return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
           } 
        );

            return filteredUsers.map((currentStaff, i) => {
                if (currentStaff.isStaff === true && currentStaff.isDeleted === false) {
                    return <Staff delete={this.deleteDebtor} staff={currentStaff} key={i} />;
                }
            })
       
    }

    deleteDebtor(data) {
        axios.delete('http://localhost:4000/debtors/deleteDebtor/' + data)
            .then(res => {
                console.log(res);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.message
                })
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: err
                })
            })
    }


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
                        <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                            <div className="container">

                                <Tabs defaultActiveKey="staff" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

                                    <Tab eventKey="staff" title="Staff" className="tit">
                                        <div className="row" style={{ marginTop: "20px" }}>

                                            <div className="card">
                                                <div>
                                                    <h3 className="sp_head">List of Staff</h3>
                                                    <form>
                                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                            <input className="form-control" type="text"  value={this.state.search} placeholder="Search Name Here" onChange={this.handleSearch} />
                                                        </div>
                                                    </form>
                                                    <div className="sp_table">
                                                        <table className="table table-striped" style={{ marginTop: 20 }} >
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Email</th>
                                                                    {/* <th>Birthday</th> */}
                                                                    <th>Nic</th>
                                                                    <th>Mobile</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.UserList()}
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
