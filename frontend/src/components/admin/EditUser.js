import React, { Component } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import Navbar from "../shared/Navbar";
import '../../css/admin/EditUser.css';
import Footer from '../shared/Footer'
import { verifyAuth } from "../../utils/Authentication";
import {
    Button,
    Container,
    Col,
    Row,
    FormControl,
    Table,
} from 'react-bootstrap';

const backendURI = require('../shared/BackendURI');

// const userId = localStorage.getItem("auth-id");

class EditUser extends Component {


    constructor(props) {
        super(props);

        this.state = {

            authState: '',
            snackbaropen: false,
            snackbarmsg: '',
            id: '',
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

        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.ResetUserPassword = this.ResetUserPassword.bind(this);




    }
    snackbarClose = (event) => {
        this.setState({ snackbaropen: false })
    }


    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        if (!authState || !localStorage.getItem("isAdmin"))
            this.props.history.push("/");

        axios.get(backendURI.url + "/users/get/" + this.props.match.params.id)
            .then(response => {
                console.log(response.data.data[0].firstName);

                this.setState({
                    id: response.data.data[0]._id,
                    firstName: response.data.data[0].firstName,
                    lastName: response.data.data[0].lastName,
                    email: response.data.data[0].email,
                    nic: response.data.data[0].nic,
                    mobile: response.data.data[0].mobile

                });

            })
            .catch(function (error) {
                console.log(error);
            })
    };


    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value;
        this.setState(store);
    };

    onSubmit(e) {
        e.preventDefault();


        const obj = {
            // _id: this.state._id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            nic: this.state.nic,
            mobile: this.state.mobile,


        };

        axios.post(backendURI.url + '/users/updateUser/' + this.props.match.params.id, obj)
            .then(res => console.log(res.data));

        // this.props.history.push('/users/editprofile/' + this.props.match.params.id);
        window.location.reload();

    }

    ResetUserPassword(data) {

        axios.post(backendURI.url + "/users/updatePasswordA/" + data)
            .then(res => console.log(res.data));

        // this.props.history.push('adminhome/viewusers/');
        window.location.reload();

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

                        <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                            <div className="container">


                                <div className="row" style={{ marginTop: "20px" }}>

                                    <div className="card">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="card">
                                                    <div>
                                                        <h3 className="sp_head">Update User</h3>
                                                        <div>
                                                            <form onSubmit={this.onSubmit} >

                                                                <div className="form-group labl">
                                                                    <label>First name</label>
                                                                    <input type="text"
                                                                        name="firstName"
                                                                        className="form-control"
                                                                        value={this.state.firstName}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group labl">
                                                                    <label>Last name</label>
                                                                    <input type="text"
                                                                        name="lastName"
                                                                        className="form-control"
                                                                        value={this.state.lastName}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group labl">
                                                                    <label>Email</label>
                                                                    <input type="text"
                                                                        name="email"
                                                                        className="form-control"
                                                                        value={this.state.email}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group labl">
                                                                    <label>NIC</label>
                                                                    <input type="text"
                                                                        name="nic"
                                                                        className="form-control"
                                                                        value={this.state.nic}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                                <div className="form-group labl">
                                                                    <label>Contact Number</label>
                                                                    <input type="text"
                                                                        name="mobile"
                                                                        className="form-control"
                                                                        value={this.state.mobile}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>


                                                                <div className="form-group labl">
                                                                    <br />
                                                                    <input type="submit" value="Update User" className="btn btn-primary" />
                                                                </div>


                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card">

                                                    <div>
                                                        <h3 className="sp_head">Reset Password</h3>
                                                        <div>
                                                            <div className="para">
                                                                <p>When you press the "Reset Password" button, It automatically assigns the user's NIC number as user's password.</p>
                                                            </div>
                                                            <div className="form-group labl">
                                                                <br />
                                                                {/* <DeleteForeverIcon className="del-btn" fontSize="large" onClick={() => this.ResetUserPassword(this.state.id)} /> */}
                                                                <input type="submit" value="Reset password" className="btn btn-primary" onClick={() => this.ResetUserPassword(this.state.id)}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </React.Fragment >


        )
    }
}
export default (EditUser);