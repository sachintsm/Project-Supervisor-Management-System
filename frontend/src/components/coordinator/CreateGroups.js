import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";

import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/coordinator/CreateGroups.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from '../../utils/Storage';
import CSVReader from "react-csv-reader";
import Footer from '../shared/Footer'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Snackpop from "../shared/Snackpop";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';

const backendURI = require('../shared/BackendURI');

export default class CreateGroups extends Component {
    constructor(props) {
        super(props);

        this.fileUpload = this.fileUpload.bind(this);
        this.addMember = this.addMember.bind(this)

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            activeProjects: [],

            csvData: [],

            projectId: '',
            grpMembers: [],

            selectProjectError: '',

        };
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    async componentDidMount() {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const coId = JSON.parse(localStorage.getItem("auth-id"))

        //? load all the active project names from
        axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
            .then((res => {
                this.setState({
                    activeProjects: res.data.data
                })
            }))
    }

    //? Bulk user registration function reading csv file
    fileUpload = (e) => {
        e.preventDefault();
        const err = this.validate();  //?calling validation function

        if (!err) {
            this.setState({
                selectProjectError: '',
            })

            if (this.state.csvData.length === 0) {
                this.setState({
                    snackbaropen: true,
                    snackbarmsg: 'Please select the CSV file..!',
                    snackbarcolor: 'error',
                })
            }
            else {
                confirmAlert({
                    title: 'Confirm to submit',
                    message: 'Are you sure to do this.',
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: async () => {
                                const obj = getFromStorage('auth-token');

                                var myHeaders = new Headers();
                                myHeaders.append("auth-token", obj.token);

                                for (var i = 0; i < this.state.csvData.length - 1; i++) {
                                    var j = 0;
                                    this.state.grpMembers = []
                                    while (this.state.csvData[i][j] != null) {
                                        this.state.grpMembers.push(this.state.csvData[i][j])
                                        console.log(this.state.csvData[i][j]);
                                        j++;
                                    }
                                    var data = {
                                        projectId: this.state.projectId,
                                        groupMembers: this.state.grpMembers
                                    }

                                    await fetch(backendURI.url + "/createGroups/add", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'auth-token': obj.token
                                        },
                                        body: JSON.stringify(data),
                                    })
                                        .then(res => res.json())
                                        .then(json => {
                                            this.setState({
                                                snackbaropen: true,
                                                snackbarmsg: json.msg,
                                                snackbarcolor: 'success',
                                            })
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            this.setState({
                                                snackbaropen: true,
                                                snackbarmsg: err,
                                                snackbarcolor: 'error',
                                            })
                                        })
                                }
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
        }
    }

    //? user type drop down change
    handleDropdownChange = (e) => {
        const val = e.target.value
        console.log(val)
        this.setState({
            projectId: val
        })
    }

    validate = () => {
        let isError = false;
        const errors = {
            selectProjectError: ''
        };
        if (this.state.projectId.length === 0) {
            isError = true;
            errors.selectProjectError = 'Please select a project *'
        }
        this.setState({
            ...this.state,
            ...errors
        })
        return isError;  //! is not error return state 'false'
    }


    onSubmit(e) {
        e.preventDefault();
        const err = this.validate();  //?calling validation function
        console.log(this.state.grpMembers, "$$$$")

        if (!err) {
            this.setState({
                selectProjectError: '',
            })
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            const obj = getFromStorage('auth-token');

                            const data = {
                                projectId: this.state.projectId,
                                groupMembers: this.state.grpMembers
                            }

                            var myHeaders = new Headers();
                            myHeaders.append("auth-token", obj.token);
                            myHeaders.append("Content-Type", "application/json");

                            var raw = JSON.stringify(data);

                            var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: raw,
                                redirect: 'follow'
                            };
                            fetch("http://localhost:4000/createGroups/add", requestOptions)
                                .then(response => response.json())
                                .then(json => {
                                    console.log(json.state)
                                    if (json.state === true) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'success',
                                        })
                                        window.location.reload();
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: json.msg,
                                            snackbarcolor: 'error',
                                        })
                                    }
                                })
                                .catch(err => {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: err,
                                        snackbarcolor: 'error',
                                    })
                                });

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
    }

    addMember() {
        this.setState({ grpMembers: [...this.state.grpMembers, ""] })
    }

    handleChange = (e, index) => {
        this.state.grpMembers[index] = e.target.value;
        this.setState({
            grpMembers: this.state.grpMembers
        })
    }
    handleDelete = (index) => {
        this.state.grpMembers.splice(index, 1);
        console.log(this.state.grpMembers, "$$$$");
        this.setState({ grpMembers: this.state.grpMembers })

    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////


    render() {

        //? loading csv file data into csvData array ...
        const handleForce = data => {
            console.log(data);
            this.setState({
                csvData: data
            })
        };

        const { activeProjects } = this.state;   // ?load projects to dropdown menu this coordinator

        let activeProjectsList = activeProjects.length > 0
            && activeProjects.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
                )
            }, this)
        return (
            <div>
                <Navbar panel={"admin"} />
                <div className="container-fluid">

                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <Row>
                        <Col xs="4">
                            <img
                                alt='background'
                                src={require('../../assets/backgrounds/group discussion.png')}
                                className='image'
                            />
                        </Col>
                        <Col xs="8" className="main-div">


                            <div className="container">

                                <div >
                                    <p className="reg-head">Group Registration</p>
                                    <Tabs className="tab" defaultActiveKey="single" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                                        <Tab eventKey="single" title="Registration">
                                            <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <select className="form-control" id="dropdown" onChange={this.handleDropdownChange}>
                                                                <option>Select the project</option>
                                                                {activeProjectsList}
                                                            </select>
                                                            <p className="reg-error">{this.state.selectProjectError}</p>
                                                        </div>
                                                    </Col>

                                                </Row>

                                                <label className="text-label">Group Member Index: </label>
                                                {
                                                    this.state.grpMembers.map((member, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <Row style={{ marginTop: "10px" }}>
                                                                    <Col xs="11">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="email"
                                                                            value={member}
                                                                            onChange={(e) => this.handleChange(e, index)}
                                                                        ></input>
                                                                    </Col>
                                                                    <Col xs={1} style={{ marginTop: "3px" }}>

                                                                        <DeleteForeverIcon className="del-btn" fontSize="large" onClick={() => this.handleDelete(index)} />

                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className="form-group">
                                                    <button className="btn btn-secondary my-4 add-member" onClick={(e) => this.addMember(e)}>Add New Group Member </button>
                                                </div>

                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-info my-4  "
                                                        onClick={(e) => this.onSubmit(e)}
                                                    >Register Now </button>
                                                </div>
                                            </div>
                                        </Tab>


                                        <Tab eventKey="bulk" title="Bulk Registration">
                                            <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <select className="form-control" id="dropdown" onChange={this.handleDropdownChange}>
                                                                <option>Select the project</option>
                                                                {activeProjectsList}
                                                            </select>
                                                            <p className="reg-error">{this.state.selectProjectError}</p>
                                                        </div>
                                                    </Col>
                                                </Row>


                                                <div className="form-group">
                                                    <label className="text-label">CSV File Format : </label>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>

                                                    <img
                                                        alt='background'
                                                        src={require('../../assets/images/Group Registration - CSV- Format.png')}
                                                        className='image2'
                                                    />
                                                </div>




                                                <div className="form-group reg-csv-topic">
                                                    <label className="text-label">Choose CSV File : </label>
                                                </div>


                                                <div className="container">
                                                    <CSVReader
                                                        cssClass="react-csv-input"
                                                        onFileLoaded={handleForce}
                                                        inputStyle={{ color: 'grey' }}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-info my-4  "
                                                        onClick={this.fileUpload}
                                                    >Register Now </button>
                                                </div>

                                            </div>

                                        </Tab>
                                    </Tabs>

                                </div>
                            </div>

                        </Col>
                    </Row>
                </div>
                <Footer />

            </div >
        );
    }
}
