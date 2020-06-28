import React, { Component } from 'react';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col } from "reactstrap";
import '../../css/shared/Profile.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Profilepic from './Profilepic';
import Resetpw from './Resetpw';
import Academic from './Academic';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from './Snackpop';



const backendURI = require("./BackendURI");

export default class Profile extends Component {

    async componentDidMount() {
        const authState = await verifyAuth();
        const userData = getFromStorage('auth-id')
        this.setState({ authState: authState });

        if (!authState) {
            this.props.history.push("/");
        }

        else {
            axios.get(backendURI.url + '/users/get/' + userData.id)
                .then(response => {
                    console.log(response);
                    console.log(response.data);
                    console.log(response.data.data[0].email);
                    console.log(response.data.data[0].isStudent);


                    var dateString = response.data.data[0].birthday;
                    dateString = new Date(dateString).toUTCString();
                    dateString = dateString.split(' ').slice(0, 4).join(' ');
                    console.log(dateString);

                    this.setState({
                        users: response.data.data,
                        firstName: response.data.data[0].firstName,
                        lastName: response.data.data[0].lastName,
                        email: response.data.data[0].email,
                        nic: response.data.data[0].nic,
                        mobile: response.data.data[0].mobile,
                        birthday: dateString,
                        stu: response.data.data[0].isStudent,
                        admin: response.data.data[0].isAdmin,
                        sup: response.data.data[0].isSupervisor,
                        cor: response.data.data[0].isCoordinator,
                        indexNum: response.data.data[0].indexNumber,
                        regNum: response.data.data[0].regNumber
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        }

    }
    constructor(props) {
        super(props);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeNic = this.onChangeNic.bind(this);
        this.onChangeMobile = this.onChangeMobile.bind(this);
        this.onChangeBirthday = this.onChangeBirthday.bind(this);
        this.onChangeIndex = this.onChangeIndex.bind(this);
        this.onChangeReg = this.onChangeReg.bind(this)
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            nic: '',
            mobile: '',
            birthday: '',
            indexNum: '',
            regNum: '',
            stu: false,
            admin: false,
            sup: false,
            cor: false,
            emailError: '',
            mobileError: '',
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    onChangeFirstName(e) {
        this.setState({
            firstName: e.target.value
        });

    }

    onChangeLastName(e) {
        this.setState({
            lastName: e.target.value
        });

    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    onChangeNic(e) {
        this.setState({
            nic: e.target.value
        });
    }
    onChangeMobile(e) {
        this.setState({
            mobile: e.target.value
        });
    }
    onChangeBirthday(e) {
        this.setState({
            birthday: e.target.value
        });

    }
    onChangeIndex(e) {
        this.setState({
            indexNum: e.target.value
        });

    }
    onChangeReg(e) {
        this.setState({
            regNum: e.target.value
        });

    }
    validate = () => {
        let emailError = "";
        let mobileError = "";
        if (!this.state.email.includes('@')) {
            emailError = 'invalid email';
        }
        if (this.state.mobile.length !== 10) {
            mobileError = 'invalid mobile number';
        }

        if (emailError || mobileError) {
            this.setState({ emailError, mobileError });
            return false;
        }
        return true;
    }
    onSubmit(e) {
        e.preventDefault();
        const userData = getFromStorage('auth-id');
        console.log(userData.id);
        const isValid = this.validate();
        if (isValid) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            const obj = {
                                email: this.state.email,
                                mobile: this.state.mobile
                            };
                            console.log(obj);
                            this.setState({
                                emailError: '',
                                mobileError: ''
                            });
                            axios.post(backendURI.url + '/users/update/' + userData.id, obj).then(res => {
                                console.log(res.data);
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
                                        snackbarmsg: 'Unable to update',
                                        snackbarcolor: 'error',
                                    })
                                }
                            }
                            );
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {
                            window.location.reload(false);
                        }
                    }
                ]
            })

            // this.props.history.push('/profile');
        }
    }
    render() {
        return (
            <div style={{ backgroundColor: "#f5f5f5" }} >
                {this.state.admin === true ?
                    (<Navbar panel={"admin"} />) : (this.state.stu === true ?
                        (<Navbar panel={"student"} />) : (this.state.sup === true ?
                            (<Navbar panel={"supervisor"} />) : (this.state.cor === true ?
                                (<Navbar panel={"coordinator"} />) : null)))}
                <div className="card container">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                    <Row>
                        <Col xs="4" style={{ marginTop: "0px" }}><Profilepic /></Col>
                        <Col xs="8" className="main-div">
                            <p className="reg-head">Manage Your Account</p>
                            <Tabs className="tab" defaultActiveKey="edit" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                                <Tab eventKey="edit" title="Edit Details">
                                    <div className="card1">
                                        <div className="card-body px-lg-5">
                                            <div style={{ marginTop: 10 }}>
                                                <form onSubmit={this.onSubmit}>
                                                    <div className="form-row ">
                                                        <div className="col">
                                                            <div className="form-group">
                                                                <label>First Name:</label>
                                                                <input type="text" className="form-control"
                                                                    value={this.state.firstName || ""}
                                                                    onChange={this.onChangeFirstName}
                                                                    readOnly />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group">
                                                                <label>Last Name:</label>
                                                                <input type="text" className="form-control"
                                                                    value={this.state.lastName || ""}
                                                                    onChange={this.onChangeLastName}
                                                                    readOnly />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Email:</label>
                                                        <input type="text" className="form-control"
                                                            value={this.state.email || ""}
                                                            onChange={this.onChangeEmail}
                                                            required />
                                                        <div style={{ fontSize: 12, color: "red" }}>{this.state.emailError}</div>
                                                    </div>
                                                    <div className="form-row ">
                                                        <div className="col">
                                                            <div className="form-group">
                                                                <label> NIC Number:</label>
                                                                <input type="text" className="form-control"
                                                                    value={this.state.nic || ""}
                                                                    onChange={this.onChangeNic}
                                                                    readOnly />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="form-group">
                                                                <label> Mobile Number:</label>
                                                                <input type="text" className="form-control"
                                                                    value={this.state.mobile || ""}
                                                                    onChange={this.onChangeMobile}
                                                                    required />
                                                                <div style={{ fontSize: 12, color: "red" }}>{this.state.mobileError}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Birthday:</label>
                                                        <input type="text" className="form-control"
                                                            value={this.state.birthday || ""}
                                                            onChange={this.onChangeBirthday}
                                                            readOnly />
                                                    </div>
                                                    {this.state.stu === true ? (
                                                        <div className="form-row ">
                                                            <div className="col">
                                                                <div className="form-group">
                                                                    <label> Index Number:</label>
                                                                    <input type="text" className="form-control"
                                                                        value={this.state.indexNum || ""}
                                                                        onChange={this.onChangeIndex}
                                                                        readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="form-group">
                                                                    <label> Registration Number:</label>
                                                                    <input type="text" className="form-control"
                                                                        value={this.state.regNum || ""}
                                                                        onChange={this.onChangeReg}
                                                                        readOnly />
                                                                </div>
                                                            </div>
                                                        </div>) : null
                                                    }
                                                    <div className="from-group justify-content-center">
                                                        <input type="submit" value="Save" className="btn btn-info my-4" style={{width: "100%"}} />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="pw" title="Change Password">
                                    <Resetpw />
                                </Tab>
                                {this.state.sup === true ? (
                                    <Tab eventKey="aca" title="Academic">
                                        <Academic />
                                    </Tab>
                                ) : null}
                            </Tabs>
                        </Col>
                    </Row>
                </div>
                <Footer />
            </div>
        )
    }
}