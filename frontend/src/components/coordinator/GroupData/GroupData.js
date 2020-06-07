import React, { Component } from 'react';
import '../../../css/coordinator/GroupData.css';
import Navbar from '../../shared/Navbar';
import { verifyAuth } from "../../../utils/Authentication";
import { Row, Col } from "reactstrap";
import { getFromStorage } from '../../../utils/Storage';
import Footer from '../../shared/Footer'
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../../shared/Snackpop";
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import MultiSelect from 'react-multi-select-component';
import StudentList from './StudentList';
import SupervisorList from './SupervisorList';

const backendURI = require('../../shared/BackendURI');
class GroupData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            groupId: this.props.match.params.id,

            groupData: [],
            groupMembers: [],
            groupSupervisors: [],

            addStudentIndex: '',
            staffList: [],
            staffOptionList: [],
            selectedStaffList: [],


            addStudentIndexError: '',
            addSupervisorIndexError: '',

            projectId : '',
        }

        this.onChangeAddStudentIndex = this.onChangeAddStudentIndex.bind(this)
        this.onSubmitAddStudent = this.onSubmitAddStudent.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.onSubmitAddSupervisor = this.onSubmitAddSupervisor.bind(this)
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
    componentDidMount = async () => {
        const authState = await verifyAuth();
        
        
        this.setState({
            projectId : this.props.location.projectId
        })
        console.log(this.props.location.state.projectId)

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        await axios.get(backendURI.url + '/createGroups/getGroupData/' + this.props.match.params.id, { headers: headers })
            .then(res => {
                // console.log(res)
                this.setState({
                    groupData: res.data.data,
                    groupMembers: res.data.data.groupMembers,
                    groupSupervisors: res.data.data.supervisors
                })
            })

        await axios.get(backendURI.url + '/users/supervisorsList', { headers: headers })
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

    studentList() {
        let groupId = this.state.groupId
        if (this.state.groupMembers !== null) {
            return this.state.groupMembers.map(function (object, i) {
                return <StudentList obj={object} key={i} id={groupId} />
            })
        }
    }
    supervisorList() {
        let groupId = this.state.groupId

        if (this.state.groupSupervisors !== null) {
            return this.state.groupSupervisors.map(function (object, i) {
                return <SupervisorList obj={object} key={i} id={groupId} />
            })
        }
    }

    onChangeAddStudentIndex(e) {
        this.setState({ addStudentIndex: e.target.value })
    }

    async onSubmitAddStudent(e) {
        e.preventDefault();

        const err = this.validate();  //?calling validation function

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const index = this.state.addStudentIndex;

        if (!err) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            await axios.get(backendURI.url + '/users/student/' + index, { headers: headers })
                                .then(res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error',
                                        })
                                    }
                                    else {
                                        const data = {
                                            _id: this.props.match.params.id,
                                            index: index
                                        }
                                        axios.post(backendURI.url + '/createGroups/addStudentIndex', data)
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
                                                    window.location.reload()
                                                }
                                            })
                                    }
                                })

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

    async onSubmitAddSupervisor(e) {
        e.preventDefault();
        const err = this.validate();  //?calling validation function

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        for (let i = 0; i < this.state.selectedStaffList.length; i++) {
                            const data = {
                                _id: this.props.match.params.id,
                                index: this.state.selectedStaffList[i].value
                            }
                            await axios.post(backendURI.url + '/createGroups/addSupervisorIndex', data)
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
                                        window.location.reload()
                                    }
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


    validate = () => {
        let isError = false;
        const errors = {
            addStudentIndexError: '',
        };

        if (this.state.addStudentIndex.length < 1) {
            isError = true;
            errors.addStudentIndexError = 'Index number required *'
        }
        this.setState({
            ...this.state,
            ...errors
        })
        return isError;  //! is not error return state 'false'
    }


    render() {
        return (
            <div className="gd-fullpage">
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
                            <p className="gd-reg-head">Group - {this.state.groupData.groupId}</p>
                        </div>
                        <div className="container">
                            <Row>
                                <Col md="8" xs="12">
                                    <Row>
                                        <div className="container">
                                            <p className="gd-topic">Group Members</p>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="container gd-stu-list">
                                            {this.studentList()}
                                        </div>
                                    </Row>
                                </Col>
                                <Col md="4" xs="12">
                                    <Row>
                                        <div className="container">
                                            <p className="gd-topic">Supervisors</p>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="container gd-stu-list">
                                            {this.supervisorList()}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6" xs="12">
                                    <Row>
                                        <div className="container">
                                            <p className="gd-topic-2">Add Group Member</p>
                                        </div>
                                    </Row>
                                    <Row className="gd-add-div">
                                        <Col md="8" xs="12">
                                            <div className="form-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="addStudentIndex"
                                                    placeholder="Index Number"
                                                    onChange={this.onChangeAddStudentIndex}
                                                ></input>
                                                <p className="reg-error">{this.state.addStudentIndexError}</p>

                                            </div>
                                        </Col>
                                        <Col md="4" xs="12">
                                            <button
                                                className="btn btn-info"
                                                onClick={this.onSubmitAddStudent}
                                                style={{ width: "100%" }}
                                            >Add Now </button>
                                        </Col>
                                    </Row>


                                </Col>
                                <Col md="6" xs="12">
                                    <Row>
                                        <div className="container">
                                            <p className="gd-topic-2">Add Supervisor</p>
                                        </div>
                                    </Row>
                                    <Row className="gd-add-div">
                                        <Col md="8" xs="12">
                                            <div className="form-group">
                                                <MultiSelect
                                                    options={this.state.staffOptionList}
                                                    value={this.state.selectedStaffList}
                                                    onChange={this.setSelected}
                                                    labelledBy={'Select'}
                                                    hasSelectAll={false}
                                                />
                                            </div>
                                        </Col>
                                        <Col md="4" xs="12">
                                            <button
                                                className="btn btn-info"
                                                onClick={this.onSubmitAddSupervisor}
                                                style={{ width: "100%" }}
                                            >Add Now </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default GroupData;