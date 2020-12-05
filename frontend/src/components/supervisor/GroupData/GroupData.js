import React, { Component } from 'react';
import "../../../css/supervisor/ViewGroupDetails.scss";
import Navbar from '../../shared/Navbar';
import { verifyAuth } from "../../../utils/Authentication";
import { Card, Row, Col } from 'react-bootstrap';
import { getFromStorage } from '../../../utils/Storage';
import Footer from '../../shared/Footer'
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../../shared/Snackpop";
import StudentList from './StudentList';
import SupervisorList from './SupervisorList';
import ProjectTotalProgress from '../../coordinator/GroupData/ProjectTotalProgress';
import { TiGroup } from 'react-icons/ti';
import { FaChartLine } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

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
            loading: false,


            addStudentIndex: '',
            staffList: [],
            staffOptionList: [],
            selectedStaffList: [],


            addStudentIndexError: '',
            addSupervisorIndexError: '',

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

    viewMeetings = (project) => {
        this.props.history.push('/supervisorhome/viewMeetings', { groupDetails: this.state.groupData })
    }

    viewProgress = (project) => {
        this.props.history.push('/supervisorhome/viewProgress', { groupDetails: this.state.groupData })
    }
    viewChat = (project) => {
        this.props.history.push('/studenthome/chat/' + this.state.groupData._id, { groupDetails: this.state.groupData })
    }
    biweeklyView = (project) => {
        this.props.history.push('/supervisorhome/biweeklyview/' + this.state.groupData._id, { groupDetails: this.state.groupData })
    }
    render() {
        return (
            <div className="gd-fullpage" >
                <Navbar panel={"supervisor"} />
                <div className="container-fluid open-project open-project-background-color">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <div className="gd-card">
                        <div className="container gd-reg-head-div">
                            <p className="gd-reg-head">Group - {this.state.groupData.groupId}</p>
                        </div>
                        <div className="container" style={{ marginTop: "0px" }}>
                            {this.state.loading === true &&
                                < ProjectTotalProgress groupDetails={this.state.groupData} id={this.props.match.params.id} />
                            }
                        </div>
                        <div className="container">
                            <Row>
                                <Col md="8" xs="12">
                                    <Card className="total-progress-card">
                                        <Card.Header className="card-header">Group Members</Card.Header>
                                        <Card.Body className="card-body">
                                            <div className="container gd-stu-list">
                                                {this.studentList()}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md="4" xs="12">
                                    <Card className="total-progress-card">
                                        <Card.Header className="card-header">Supervisors</Card.Header>
                                        <Card.Body className="card-body">
                                            <div className="container gd-stu-list">
                                                {this.supervisorList()}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                </Col>
                            </Row>

                            <Row>


                            </Row>
                            <Row className="btn-row1">
                                <Col lg={4} md={4} xs={4} sm={12} className="btn-card-col1">
                                    <Card className="btn-card1" onClick={() => this.viewChat(this.state.project)}>
                                        <IconContext.Provider value={{ className: 'btn-icon1', size: "2em" }}>
                                            <div>
                                                <QuestionAnswerIcon style={{ fontSize: 32 }} />
                                            </div>
                                        </IconContext.Provider>
                                        <span className="btn-title1">Chat Box</span>
                                    </Card>
                                </Col>

                                <Col lg={4} md={4} xs={6} sm={12} className="btn-card-col1" >
                                    <Card className="btn-card1" onClick={() => this.viewMeetings(this.state.project)}>
                                        <IconContext.Provider value={{ className: 'btn-icon1', size: "2em" }}>
                                            <div>
                                                <TiGroup />
                                            </div>
                                        </IconContext.Provider><span className="btn-title1">Meetings</span></Card>
                                </Col>
                                <Col lg={4} md={4} xs={6} sm={12} className="btn-card-col1">
                                    <Card className="btn-card1" onClick={() => { this.viewProgress(this.state.project) }}>
                                        <IconContext.Provider value={{ className: 'btn-icon1', size: "2em" }}>
                                            <div>
                                                <FaChartLine />
                                            </div>
                                        </IconContext.Provider><span className="btn-title1">Progress</span></Card>
                                </Col>
                                
                            </Row>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        );
    }
}

export default GroupData;