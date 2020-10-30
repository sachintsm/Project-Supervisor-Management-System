import React, { Component } from 'react';
import '../../../css/coordinator/GroupData.scss';
import Navbar from '../../shared/Navbar';
import { verifyAuth } from "../../../utils/Authentication";
import { getFromStorage } from '../../../utils/Storage';
import Footer from '../../shared/Footer'
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../../shared/Snackpop";
import MultiSelect from 'react-multi-select-component';
import StudentList from './StudentList';
import SupervisorList from './SupervisorList';
import ProjectTotalProgress from './ProjectTotalProgress';
import { Row, Col, Card } from 'react-bootstrap';
import DescriptionIcon from '@material-ui/icons/Description';
import SubjectIcon from '@material-ui/icons/Subject';
import AssignmentIcon from '@material-ui/icons/Assignment';
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
            projectSupervisorList: [],

            addStudentIndexError: '',
            addSupervisorIndexError: '',

            groupDetails: [],
            loading: false,
            projectId: this.props.location.state.projectId,
        }

        this.onChangeAddStudentIndex = this.onChangeAddStudentIndex.bind(this)
        this.onSubmitAddStudent = this.onSubmitAddStudent.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.onSubmitAddSupervisor = this.onSubmitAddSupervisor.bind(this)
        this.openBiweekly = this.openBiweekly.bind(this)
        this.openProposal = this.openProposal.bind(this)
        this.openSrs = this.openSrs.bind(this)
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    setSelected(obj) {
        this.setState({
            selectedStaffList: obj,
        });
    }
    componentDidMount = async () => {
        const authState = await verifyAuth();
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
                this.setState({
                    groupData: res.data.data,
                    groupMembers: res.data.data.groupMembers,
                    groupSupervisors: res.data.data.supervisors,
                    loading: true
                })
            })
        await axios.get(backendURI.url + '/projects/getSupervisors/' + this.props.location.state.projectId, { headers: headers })
            .then(res => {
                this.setState({
                    projectSupervisorList: res.data.data.supervisorList
                })
            })

        for (var i = 0; i < this.state.projectSupervisorList.length; i++) {

            await axios.get(backendURI.url + '/users/supervisorList/' + this.state.projectSupervisorList[i], { headers: headers })
                .then((res) => {
                    const option = {
                        label: res.data.data.firstName + ' ' + res.data.data.lastName,
                        value: res.data.data._id,
                    };
                    this.setState({
                        staffOptionList: [...this.state.staffOptionList, option],
                    });
                })

                .catch((err) => {
                    console.log(err);
                });
        }
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
        // const err = this.validate();  //?calling validation function

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
                            await axios.post(backendURI.url + '/createGroups/addSupervisorIndex', data, { headers: headers })
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

    openBiweekly() {
        this.props.history.push('/coordinatorhome/gdata/biweekly/'+ this.state.groupId)
    }
    openProposal(){
        this.props.history.push('/coordinatorhome/gdata/proposal/'+ this.state.groupId)
    }
    openSrs(){
        this.props.history.push('/coordinatorhome/gdata/srs/'+ this.state.groupId)
    }
    render() {
        return (
            <div className="gd-fullpage" >
                <Navbar panel={"coordinator"} />
                <div className="container">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <div className="gd-card">
                        <div className="container">
                            <p className="gd-reg-head">Group - {this.state.groupData.groupId} ( {this.state.groupData.groupName} )</p>
                            <p className="gd-reg-email">{this.state.groupData.groupEmail}</p>
                        </div>
                        <div className="container" style={{ marginTop: "0px" }}>
                            {this.state.loading === true &&
                                < ProjectTotalProgress groupDetails={this.state.groupData} id={this.props.match.params.id} projectId={this.state.projectId}/>
                            }
                        </div>
                        <div className="container">
                            <Row style={{ marginTop: "-40px" }}>
                                <Col md="7" xs="12">
                                    <Card className="task-card-gd">
                                        <Card.Header className="gd-card-header">Group Members</Card.Header>
                                        <Card.Body className="gd-card-body">
                                            <Row>
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
                                                        className="btn btn-info gd-add-btn"
                                                        onClick={this.onSubmitAddStudent}
                                                        style={{ width: "100%" }}
                                                    >Add Now </button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="container gd-stu-list">
                                                    {this.studentList()}
                                                </div>
                                            </Row>

                                        </Card.Body>
                                    </Card>

                                </Col>
                                <Col md="5" xs="12">
                                    <Card className="task-card-gd">
                                        <Card.Header className="gd-card-header">Supervisors</Card.Header>
                                        <Card.Body className="gd-card-body">
                                            <Row >
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
                                                        className="btn btn-info gd-add-btn"
                                                        onClick={this.onSubmitAddSupervisor}
                                                        style={{ width: "100%" }}
                                                    >Add Now </button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="container gd-stu-list">
                                                    {this.supervisorList()}
                                                </div>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                </Col>
                            </Row>
                            <div className="container">

                                <Row style={{ marginTop: "-70px" }}>
                                    <Card className="task-card-gd">
                                        <Card.Header className="gd-card-header">Submissions</Card.Header>
                                        <Card.Body className="gd-card-body">
                                            <Row style={{ marginBottom: "-50px" }}>
                                                <Col xs={12} mg={4} md={4}>
                                                    <Card body inverse className="cd-sub-card-unit" style={{ marginTop: "-0px" }} onClick={()=>this.openSrs()}>
                                                        <Row>
                                                            <Col xs={2} mg={2} md={2}>
                                                                <DescriptionIcon fontSize="large" />
                                                            </Col>
                                                            <Col xs={8} mg={8} md={8}>
                                                                <label className="text-sub-gd">SRS Document</label>
                                                            </Col>
                                                        </Row>
                                                    </Card>

                                                </Col>
                                                <Col xs={12} mg={4} md={4}>
                                                    <Card body inverse className="cd-sub-card-unit" style={{ marginTop: "0px" }}  onClick={()=>this.openProposal()}>

                                                        <Row>
                                                            <Col xs={2} mg={2} md={2}>

                                                                <AssignmentIcon fontSize="large" />
                                                            </Col>
                                                            <Col xs={8} mg={8} md={8}>
                                                                <label className="text-sub-gd">Project Proposal</label>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                                <Col xs={12} mg={4} md={4}>
                                                    <Card body inverse className="cd-sub-card-unit" style={{ marginTop: "0px" }}  onClick={()=>this.openBiweekly()}>

                                                        <Row>
                                                            <Col xs={2} mg={2} md={2}>

                                                                <SubjectIcon fontSize="large" />
                                                            </Col>
                                                            <Col xs={8} mg={8} md={8}>
                                                                <label className="text-sub-gd">Bi-Weekly Reports</label>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            </Row>

                                        </Card.Body>
                                    </Card>
                                </Row>

                            </div>

                        </div>

                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default GroupData;