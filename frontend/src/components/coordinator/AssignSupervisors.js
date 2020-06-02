import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";

import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/coordinator/AssignSupervisors.css";
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
import { Table, Spinner } from 'react-bootstrap'
import MultiSelect from 'react-multi-select-component';

const backendURI = require('../shared/BackendURI');

class AssignSupervisors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            activeProjects: [],
            staffOptionList: [],
            selectedStaffList: [],

            projectId: '',
        };
        this.setSelected = this.setSelected.bind(this);
        this.addSupervisors = this.addSupervisors.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    setSelected(obj) {
        console.log(obj)
        this.setState({
            selectedStaffList: obj,
        });
    }
    async componentDidMount() {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const coId = JSON.parse(localStorage.getItem("auth-id"))
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        //? load all the active project names from
        axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
            .then((res => {
                this.setState({
                    activeProjects: res.data.data
                })
            }))

        //? load staff members
        await axios.get(backendURI.url + '/users/stafflist', { headers: headers })
            .then((result) => {
                if (result.data.length > 0) {
                    this.setState({
                        staffList: result.data.map((user) => user),
                    });
                }
            })
            .then((a) => {
                this.state.staffList.map((user) => {
                    const option = {
                        label: user.firstName + ' ' + user.lastName,
                        value: user._id,
                    };
                    this.setState({
                        staffOptionList: [...this.state.staffOptionList, option],
                    });
                    return null;
                });
            })
            .catch((err) => {
                console.log(err);
            });
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
            groupIdError: '',
        };
        if (this.state.projectId.length === 0) {
            console.log('Error: key is missing..!')
            isError = true;
            errors.selectProjectError = 'Please select a project *'
        }
        if (this.state.groupId.length === 0) {
            isError = true;
            errors.groupIdError = 'Please specify group ID *'
        }
        this.setState({
            ...this.state,
            ...errors
        })
        return isError;  //! is not error return state 'false'
    }

    //? assing supervisors to the projects
    addSupervisors() {
        console.log(this.state.projectId)
        if (this.state.projectId === null) {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please select the project..!',
                snackbarcolor: 'error'
            })
        }
        else {
            confirmAlert({
                title: 'Confirm to Submit?',
                message: 'Are you sure to do this ?',
                buttons: [{
                    label: 'Yes',
                    onClick: async () => {
                        const obj = getFromStorage('auth-token');
                        for (let i = 0; i < this.state.selectedStaffList.length; i++) {
                            const data = {
                                projectId: this.state.projectId,
                                supervisors: this.state.selectedStaffList[i].value
                            }

                            //? add supervisors array at project document
                            await axios.post(backendURI.url + '/projectSupervisors/add', data)
                                .then(res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error',
                                        })
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'success',
                                        })
                                    }
                                })
                            //? set isSupervisor -> true
                            await axios.get(backendURI.url + '/users/updateSupervisor/' + this.state.selectedStaffList[i].value)
                                .then(res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error',
                                        })
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'success',
                                        })
                                    }
                                })
                        }
                        window.location.reload()
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


    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        const { activeProjects, dataDiv, spinnerDiv } = this.state;   // ?load projects to dropdown menu this coordinator

        let activeProjectsList = activeProjects.length > 0
            && activeProjects.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
                )
            }, this)
        return (
            <div>
                <Navbar panel={"coordinator"} />
                <div className="container">

                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                    <div className="card">
                        <div className="container">

                            <p className="as-reg-head">Assign Supervisors</p>


                            <Row >
                                <Col md="5" xs="12">
                                    <div className="form-group as-dropdown-select">
                                        <select className="form-control as-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                            <option>Select the project</option>
                                            {activeProjectsList}
                                        </select>
                                    </div>
                                </Col>
                                <Col md="5" xs="12">
                                    <div className="form-group as-dropdown-select">
                                        <MultiSelect
                                            options={this.state.staffOptionList}
                                            value={this.state.selectedStaffList}
                                            onChange={this.setSelected}
                                            labelledBy={'Select'}
                                            hasSelectAll={false}
                                        />
                                    </div>
                                </Col>
                                <Col md="2" xs="12">
                                    <button className="btn btn-info as-btn" onClick={this.addSupervisors}>Add Now</button>
                                </Col>
                            </Row>
                        </div>
                        {spinnerDiv && (
                            <div className="spinner">
                                <Spinner style={{ marginBottom: "10px", marginTop: "-20px" }} animation="border" variant="info" />
                            </div>
                        )}
                        {dataDiv && (
                            <div className="container">
                                <p className="as-details-head">Project Groups</p>

                                {/* <table className="table table-striped" style={{ marginTop: 20 }} > */}
                                <Table hover className="as-table" >

                                    <thead>
                                        <tr>
                                            <th className="table-head">Group</th>
                                            <th className="table-head">Members' Ids</th>
                                            <th className="table-head">Supervisors</th>
                                            <th className="table-head" style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.groupDataBlock.map((item) => {
                                            return (
                                                <tr className="as-table-row" key={item.groupId} onClick={() => this.groupDataHandler(item._id)}>
                                                    <td className="table-body">{item.groupId}</td>
                                                    <td className="table-body">{item.groupMembers}</td>
                                                    <td className="table-body">{item.supervisors}</td>
                                                    <td style={{ textAlign: 'center' }}><DeleteForeverIcon className="del-btn" fontSize="default" onClick={() => this.deleteGroup(item._id)} /></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                    <div className="card">
                        <div className="container">
                            <p className="as-reg-head">Project Group Details</p>

                            <Row >
                                <Col md="10" xs="12">
                                    <div className="form-group as-dropdown-select">
                                        <select className="form-control as-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                            <option>Select the project</option>
                                            {activeProjectsList}
                                        </select>
                                    </div>
                                </Col>
                                <Col md="2" xs="12">
                                    <button className="btn btn-info as-btn" onClick={this.searchGroups}>Search</button>
                                </Col>
                            </Row>
                        </div>
                        {spinnerDiv && (
                            <div className="spinner">
                                <Spinner style={{ marginBottom: "10px", marginTop: "-20px" }} animation="border" variant="info" />
                            </div>
                        )}
                        {dataDiv && (
                            <div className="container">
                                <p className="as-details-head">Project Groups</p>

                                {/* <table className="table table-striped" style={{ marginTop: 20 }} > */}
                                <Table hover className="as-table" >

                                    <thead>
                                        <tr>
                                            <th className="table-head">Group</th>
                                            <th className="table-head">Members' Ids</th>
                                            <th className="table-head">Supervisors</th>
                                            <th className="table-head" style={{ textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.groupDataBlock.map((item) => {
                                            return (
                                                <tr className="as-table-row" key={item.groupId} onClick={() => this.groupDataHandler(item._id)}>
                                                    <td className="table-body">{item.groupId}</td>
                                                    <td className="table-body">{item.groupMembers}</td>
                                                    <td className="table-body">{item.supervisors}</td>
                                                    <td style={{ textAlign: 'center' }}><DeleteForeverIcon className="del-btn" fontSize="default" onClick={() => this.deleteGroup(item._id)} /></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div >
        );
    }
}

export default AssignSupervisors;