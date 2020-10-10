import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/coordinator/CreateGroups.scss";
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

        if (this.state.csvData.length === 0) {  //! check csv file is empty or not
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please select the CSV file..!',
                snackbarcolor: 'error',
            })
        }
        else if (this.state.projectId.length === 0) {  // ! check user select project or not
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please select the project..!',
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
                                var j = 1;
                                this.state.grpMembers = []
                                while (this.state.csvData[i][j] != null) {
                                    this.state.grpMembers.push(this.state.csvData[i][j])
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

    //? select project drop down change
    handleDropdownChange = (e) => {
        const val = e.target.value
        this.setState({
            projectId: val
        })
    }

    validate = () => {
        let isError = false;
        const errors = {
            selectProjectError: '',
            // groupIdError: '',
        };
        if (this.state.projectId.length === 0) {
            console.log('Error: key is missing..!')
            isError = true;
            errors.selectProjectError = 'Please select a project *'
        }
        // if (this.state.groupId.length === 0) {
        //     isError = true;
        //     errors.groupIdError = 'Please specify group ID *'
        // }
        this.setState({
            ...this.state,
            ...errors
        })
        return isError;  //! is not error return state 'false'
    }

    onSubmit(e) {
        e.preventDefault();
        const err = this.validate();  //?calling validation function

        if (!err) {
            this.setState({
                selectProjectError: '',
                // groupIdError: '',
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
                                // groupId: this.state.groupId,
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
                            fetch(backendURI.url + "/createGroups/add", requestOptions)
                                .then(response => response.json())
                                .then(json => {
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
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
        // console.log(this.state.grpMembers, "$$$$");
        this.setState({ grpMembers: this.state.grpMembers })
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        //? loading csv file data into csvData array ...
        const handleForce = data => {
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
                <Navbar panel={"coordinator"} />
                <div className="container-fluid create-groups">

                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <Row>
                        <Col md="4">
                            <img
                                alt='background'
                                src={require('../../assets/backgrounds/group discussion.png')}
                                className='image'
                            />
                        </Col>
                        <Col md="8" className="main-div">
                            <div>
                                <div >
                                    <p className="reg-head">Group Registration</p>
                                    <Tabs className="tab" defaultActiveKey="bulk" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                                        <Tab eventKey="bulk" title="Bulk Registration">
                                            <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>
                                                <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <select className="form-control" id="dropdown" onChange={this.handleDropdownChange}>
                                                                <option>Select the project</option>
                                                                {activeProjectsList}
                                                            </select>
                                                        </div>
                                                    </Col>
                                                </Row>


                                                <div xs="12" className="form-group">
                                                    <label className="text-label">CSV File Format : </label>
                                                </div>
                                                <div xs="12" style={{ textAlign: 'center' }}>

                                                    <img
                                                        alt='background'
                                                        src={require('../../assets/images/Group Registration - CSV- Format.png')}
                                                        className='image3'
                                                    />
                                                </div>

                                                <div className="form-group reg-csv-topic">
                                                    <label className="text-label">Choose CSV File : </label>
                                                </div>


                                                <div xs="12" className="container cg-file-input">
                                                    <Row>

                                                        <CSVReader
                                                            // className="cg-file-input"
                                                            cssClass="react-csv-input"
                                                            onFileLoaded={handleForce}
                                                            inputStyle={{ color: 'grey' }}
                                                        />
                                                    </Row>
                                                </div>

                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-info full-width-btn"
                                                        onClick={this.fileUpload}
                                                        style={{ width: '100%' }}

                                                    >Register Now </button>
                                                </div>
                                            </div>
                                        </Tab>
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
                                                {/* <Row>
                                                    <Col>
                                                        <div className="form-group">
                                                            <input className="form-control" type="text" name="groupId" placeholder="Enter group id ..."
                                                                onChange={this.onChangeGroupId} />

                                                            <p className="reg-error">{this.state.groupIdError}</p>
                                                        </div>
                                                    </Col>
                                                </Row> */}

                                                <label className="text-label">Group Member Index: </label>
                                                {
                                                    this.state.grpMembers.map((member, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <Row style={{ marginTop: "10px" }}>
                                                                    <Col md="11" xs="10">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="email"
                                                                            value={member}
                                                                            onChange={(e) => this.handleChange(e, index)}
                                                                        ></input>
                                                                    </Col>
                                                                    <Col md="1" xs="2" style={{ marginTop: "3px" }}>

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
                                                        className="btn btn-info full-width-btn"
                                                        onClick={(e) => this.onSubmit(e)}
                                                        style={{ width: '100%' }}
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
