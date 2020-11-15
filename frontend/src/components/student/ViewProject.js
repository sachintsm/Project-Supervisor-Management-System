import React, { Component } from 'react';
import ProjectDetailsCard2 from "./ProjectDetailsCard2";
import "../../css/students/ViewProject.scss"
import Footer from '../shared/Footer';
import axios from 'axios';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { getFromStorage } from "../../utils/Storage";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Navbar from "../shared/Navbar";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { IoIosPersonAdd } from 'react-icons/io';
import { TiGroup } from 'react-icons/ti';
import { FaChartLine } from 'react-icons/fa';
import { FiUploadCloud } from 'react-icons/all';
import { BsFileEarmarkText } from 'react-icons/bs';
import { BsChatSquareDots } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';


const backendURI = require('../shared/BackendURI');


class ViewProject extends Component {
    v
    constructor(props) {
        super(props);
        this.state = {
            project: props.location.state.projectDetails,
            studentList: [],
            loading: true,
            loading2: true,
            groupDetails: []
        }
        this.getGroupId()
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.getgroupMembersIndexes();
    }

    getgroupMembersIndexes() {
        const studentId = getFromStorage("auth-id").id
        axios.post(backendURI.url + '/users/getgroupmembers/' + studentId, { projectId: this.state.project._id }).then(res => {
            this.setState({
                indexNumbers: res.data,
                loading2: false
            })
        }).then(() => {
            // this.getStudentDetails()
        })
    }




    getGroupId = () => {
        const userId = getFromStorage("auth-id").id;
        const project = {
            projectId: this.state.project._id
        }

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        axios.post(backendURI.url + '/createGroups/groupDetails/' + userId, project, { headers: headers }).then(
            res => {
                this.setState({
                    groupDetails: res.data,
                    loading: false
                })
            }
        )
    }

    requestSup(item) {
        this.props.history.push('/studenthome/viewproject/requestsupervisor', { projectDetails: item, groupDetails: this.state.groupDetails });
    }

    viewProgress = (project) => {
        this.props.history.push('/studenthome/viewproject/progresstasks', { projectDetails: this.state.project, groupDetails: this.state.groupDetails })
    }

    viewChat = (project) => {
        this.props.history.push('/studenthome/chat/' + this.state.groupDetails._id, { projectDetails: project, groupDetails: this.state.groupDetails })
    }
    submisionView = (project) => {
        this.props.history.push('/studenthome/submisionview/' + this.state.project._id, { projectDetails: project, groupDetails: this.state.groupDetails })
    }
    biweeklyView = (project) => {
        this.props.history.push('/studenthome/biweeklyview/' + project._id, { projectDetails: project, groupDetails: this.state.groupDetails })
    }

    viewMeetings = (project) => {
        this.props.history.push('/student/viewMeeting', { projectDetails: project, groupDetails: this.state.groupDetails })
    }
    presentationFeedbackView = (project) => {
        this.props.history.push('/studenthome/viewFeedback', { projectDetails: project, groupDetails: this.state.groupDetails })
    }
    render() {
        return (
            <React.Fragment>

                <Navbar panel={"student"} />
                <div className="container-fluid open-project open-project-background-color">
                    {!this.state.loading2 && <ProjectDetailsCard2 project={this.state.project} indexNumbers={this.state.indexNumbers} groupDetails={this.state.groupDetails} />}

                    <Row className="btn-row">
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col" onClick={() => this.requestSup(this.state.project)}>
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <IoIosPersonAdd />
                                    </div>
                                </IconContext.Provider><span className="btn-title" onClick={() => this.requestSup(this.state.project)}>Request Supervisors</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col" onClick={() => this.viewChat(this.state.project)}>
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <BsChatSquareDots />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Chat Box</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col" onClick={() => this.viewMeetings(this.state.project)}>
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <TiGroup />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Meetings</span></Card>
                        </Col>
                        {/*<Col lg={3} md={3} xs={1} sm={1} className="btn-card-col"></Col>*/}
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col">
                            <Card className="btn-card" onClick={() => { this.submisionView(this.state.project) }} >
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <FiUploadCloud />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Submissions</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col">
                            <Card className="btn-card" onClick={() => { this.viewProgress(this.state.project) }}>
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <FaChartLine />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Progress</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col">
                            <Card className="btn-card" onClick={() => { this.biweeklyView(this.state.project) }} >
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <BsFileEarmarkText />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Biweekly Reports</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col">

                        </Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col">
                            <Card className="btn-card" onClick={() => { this.presentationFeedbackView(this.state.project) }} >
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <BsFileEarmarkText />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Presentaion Feedbacks</span></Card>
                        </Col>
                        {/*<Col lg={3} md={3} xs={1} sm={1} className="btn-card-col"></Col>*/}

                    </Row>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(ViewProject);