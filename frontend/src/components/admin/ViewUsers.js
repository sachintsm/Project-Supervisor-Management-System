import axios from 'axios';
import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Navbar from "../shared/Navbar";
import '../../css/admin/ViewUsers.scss';
import Footer from '../shared/Footer';
import { verifyAuth } from "../../utils/Authentication";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Snackpop from "../shared/Snackpop";

const backendURI = require('../shared/BackendURI');

const Staff = React.memo(props => (
    <tr>
        <td className="table-body">{props.staff.firstName} {props.staff.lastName}</td>
        <td className="table-body">{props.staff.email}</td>
        <td className="table-body">{props.staff.nic}</td>
        <td className="table-body">{props.staff.mobile}</td>
        <td className="table-body">
            <Row>
                <Col>
                    <Link to={"/editprofile/" + props.staff._id}><Create className="edit-btn" fontSize="default" /></Link>
                </Col>
                <Col>
                    <DeleteForeverIcon className="del-btn" fontSize="default" onClick={() => props.delete(props.staff._id)} />
                </Col>
            </Row>
        </td>
    </tr>
));

const Students = React.memo(props => (
    <tr>
        <td className="table-body">{props.students.firstName} {props.students.lastName}</td>
        <td className="table-body">{props.students.email}</td>
        <td className="table-body">{props.students.nic}</td>
        <td className="table-body">{props.students.mobile}</td>
        <td className="table-body">{props.students.indexNumber}</td>
        <td className="table-body">{props.students.regNumber}</td>
        <td className="table-body">{props.students.courseType}</td>
        <td className="table-body">
            <Row>
                <Col>
                    <Link to={"/editprofile/" + props.students._id}><Create className="edit-btn" fontSize="default" /></Link>
                </Col>
                <Col>
                    <DeleteForeverIcon className="del-btn" fontSize="default" onClick={() => props.delete(props.students._id)} />
                </Col>
            </Row>
        </td>
    </tr>
));



 class ViewUsers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            authState: '',
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
            search: '',
            userS: [],
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }


    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        if (!authState || !localStorage.getItem("isAdmin"))//check wether the user is logged in,if not re-directed to the login form
            this.props.history.push("/");

        axios.get(backendURI.url + "/users/get")
            .then(response => {
                this.setState({ userS: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    handleSearch = e => {
        this.setState({ search: e.target.value.substr(0, 20) });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    UserList1() {

        let filteredUsers = this.state.userS.filter(
            (currentStaff) => {
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
            if (currentStaff.isStaff === true && currentStaff.isDeleted === false) {
                return <Staff delete={this.deleteUser} staff={currentStaff} key={i} />;
            }
            else return null
        })

    }
    UserList2() {

        let filteredUsers = this.state.userS.filter(
            (currentStaff) => {
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
            if (currentStaff.isAdmin === true && currentStaff.isDeleted === false) {
                return <Staff delete={this.deleteUser} staff={currentStaff} key={i} />;
            }
            else return null

        })

    }

    UserList3() {

        let filteredUsers = this.state.userS.filter(
            (currentStaff) => {
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
            if (currentStaff.isStaff === true && currentStaff.isCoordinator === true && currentStaff.isDeleted === false) {
                return <Staff delete={this.deleteUser} staff={currentStaff} key={i} />;
            }
            else return null
        })

    }

    UserList4() {

        let filteredUsers = this.state.userS.filter(
            (currentStaff) => {
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
            if (currentStaff.isStaff === true && currentStaff.isSupervisor === true && currentStaff.isDeleted === false) {
                return <Staff delete={this.deleteUser} staff={currentStaff} key={i} />;
            }
            else {
                return null;
            }
        })

    }

    UserList5() {

        let filteredUsers = this.state.userS.filter(
            (currentStudents) => {
                return currentStudents.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStudents, i) => {
            if (currentStudents.isStudent === true && currentStudents.isDeleted === false) {
                return <Students delete={this.deleteUser} students={currentStudents} key={i} />;
            }
            else return null

        })

    }

//Delete users data
    deleteUser(data) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        axios.post(backendURI.url + "/users/deleteUser/" + data)
                            .then(res => {
                                if (res.data.state === true) {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'success',
                                    })
                                }
                                else {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'error',
                                    })
                                }
                            });
                        window.location.reload();
                    }
                },
                {
                    label: 'No',
                    onClick: () => {

                    }
                }
            ]
        })
    }



    render() {
        return (
            <React.Fragment >
                <Navbar panel={"admin"} />
                <div className="container-fluid">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    {/* ************************************************************************************************************************************************************************** */}

                    <div className="row">
                        <div className="col-md-12" style={{ minHeight: "1000px" }}>
                            <div className="container-fluid" style={{"padding": "0px 160px"}}>

                                <Tabs defaultActiveKey="staff" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

                                    <Tab eventKey="staff" title="Staff" className="tit">
                                        <div className="row" style={{ marginTop: "20px" }}>

                                            <div className="card">
                                                <div>
                                                    <h3 className="sp_head">List of Staff</h3>
                                                    <form>
                                                        <div className="form-group vu-search-box" >
                                                            <input className="form-control" type="text" value={this.state.search} placeholder="Search Name Here" onChange={this.handleSearch} />
                                                        </div>
                                                    </form>
                                                    <div className="container-fluid">
                                                        <div className=" vu-table">

                                                            <Table hover className="vu-table-hover" >
                                                                <thead>
                                                                    <tr>
                                                                        <th className="table-head">Name</th>
                                                                        <th className="table-head">Email</th>
                                                                        <th className="table-head">Nic</th>
                                                                        <th className="table-head">Mobile</th>
                                                                        <th className="table-head">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.UserList1()}

                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Tab>
                                    
                                    <Tab eventKey="admins" title="Admins">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="card">
                                                <div>
                                                    <h3 className="sp_head">List of Admins</h3>
                                                    <form>
                                                        <div className="form-group  vu-search-box">
                                                            <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search Name Here" onChange={this.handleSearch} />
                                                        </div>
                                                    </form>
                                                    <div className="container-fluid">
                                                        <div className=" vu-table">
                                                            <Table hover  className="vu-table-hover" >
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Nic</th>
                                                                        <th>Mobile</th>
                                                                        <th>Actions</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.UserList2()}

                                                                </tbody>
                                                            </Table>
                                                        </div>
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
                                                        <div className="form-group  vu-search-box">
                                                            <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search Name Here" onChange={this.handleSearch} />
                                                        </div>
                                                    </form>
                                                    <div className="container-fluid">
                                                        <div className=" vu-table">
                                                            <Table hover  className="vu-table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Nic</th>
                                                                        <th>Mobile</th>
                                                                        <th>Actions</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.UserList3()}
                                                                </tbody>
                                                            </Table>
                                                        </div>
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
                                                        <div className="form-group  vu-search-box">
                                                            <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search Name Here" onChange={this.handleSearch} />
                                                        </div>
                                                    </form>
                                                    <div className="container-fluid">
                                                        <div className=" vu-table">
                                                            <Table hover  className="vu-table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Nic</th>
                                                                        <th>Mobile</th>
                                                                        <th>Actions</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.UserList4()}

                                                                </tbody>
                                                            </Table>
                                                        </div>
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
                                                        <div className="form-group  vu-search-box" >
                                                            <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search Name Here" onChange={this.handleSearch} />
                                                        </div>
                                                    </form>
                                                    <div className="container-fluid">
                                                        <div className=" vu-table">
                                                            <Table hover  className="vu-table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Nic</th>
                                                                        <th>Mobile</th>
                                                                        <th>Index Number</th>
                                                                        <th>Registration Number</th>
                                                                        <th>Course Type</th>
                                                                        <th>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.UserList5()}
                                                                </tbody>
                                                            </Table>
                                                        </div>
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
                <Footer />
            </React.Fragment >
        )
    }
}
export default ViewUsers;