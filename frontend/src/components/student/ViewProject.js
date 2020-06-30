import React, { Component } from 'react';
import ProjectDetailsCard from "./ProjectDetailsCard";
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
import { FiUploadCloud } from 'react-icons/fi';
import { IconContext } from 'react-icons';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';


const backendURI = require('../shared/BackendURI');
class studentBlock {
    constructor(id, name, index, reg) {
        this.id = id;
        this.name = name;
        this.index = index;
        this.reg = reg;
    }
}

class ViewProject extends Component {
    constructor(props) {
        super(props);
        this.getStudentDetails = this.getStudentDetails.bind(this)
        this.getgroupMembersIndexes = this.getgroupMembersIndexes.bind(this)
        this.state = {
            project: props.location.state.projectDetails,
            studentList: [],
            loading: true,
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
                indexNumbers: res.data
            })
        }).then(() => {
            this.getStudentDetails()
        })
    }

    getStudentDetails = async (indexesArray) => {

        this.setState({
            studentList: []
        })
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        this.state.indexNumbers.map(async (index) => {

            await axios.get(backendURI.url + '/users/studentList/' + index, { headers: headers })
                .then(res => {
                    if (res.data.data) {
                        const _id = res.data.data._id
                        const name = res.data.data.firstName + " " + res.data.data.lastName
                        const index = res.data.data.indexNumber
                        const reg = res.data.data.regNumber

                        let block = new studentBlock(_id, name, index, reg)

                        this.setState({
                            studentList: [...this.state.studentList, block],
                            loading: false
                        })
                    }
                })
        })

    }
    requestSup(item){
        this.props.history.push('/studenthome/requestsupervisor',{projectDetails:item});
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

    viewProgress = (project) => {
        this.props.history.push('/studenthome/viewproject/progresstasks', { projectDetails: project, groupDetails: this.state.groupDetails })
    }

    viewChat = (project) => {
        this.props.history.push('/studenthome/chat/' + this.state.groupDetails._id, { projectDetails: project, groupDetails: this.state.groupDetails })
    }

    viewMeetings = (project) => {        
        this.props.history.push('/student/viewMeeting', { projectDetails: project, groupDetails: this.state.groupDetails })
    }
    render() {
        const percentage = 67;

        return (
            <React.Fragment>

                <Navbar panel={"student"} />
                <div className="container-fluid open-project open-project-background-color">
                    <div className="title-div">
                        <h1 className="project-task-title">{this.state.groupDetails.groupName} </h1>
                    </div>
                    <Row className="details-row">

                        <Col lg={7} md={7} xs={12} sm={7} className="my-col">
                            <div className="card project-detail-card1">
                                <Row>
                                    <Col lg={7} md={12} xs={12} sm={12}>
                                        <div>
                                            <h4 className="title">Project Details {this.state.project.projectState && <span className="dot"></span>}</h4>
                                            <ProjectDetailsCard project={this.state.project} />

                                        </div>
                                    </Col>
                                    <Col lg={5} md={12} xs={12} sm={12} className="project-progress" >

                                        {percentage<=33 && <CircularProgressbar styles={buildStyles({textColor: '#DC3545',pathColor: '#DC3545',})}   value={percentage} text={`${percentage}%`} />}
                                        {percentage<=66 && percentage>33  && <CircularProgressbar styles={buildStyles({textColor: '#FFC107',pathColor: '#FFC107',})}   value={percentage} text={`${percentage}%`} />}
                                        {percentage<=100 && percentage>66  && <CircularProgressbar styles={buildStyles({textColor: '#28A745',pathColor: '#28A745',})}   value={percentage} text={`${percentage}%`} />}
                                        {/*<CircularProgressbar styles={buildStyles({ textColor: '#263238', pathColor: `#263238`, })} value={percentage} text={`${percentage}%`} />*/}
                                    </Col>
                                </Row>
                            </div>

                        </Col>
                        <Col lg={5} md={5} xs={12} sm={5} className="my-col">
                            <div className="card project-detail-card2">
                                <h4 className="title">Group Members{this.state.project.projectState && <span className="dot"></span>}</h4>
                                <div className="group-detail-table">
                                    {this.state.loading && <Spinner animation="border" className="spinner" />}
                                    {
                                        this.state.studentList.map((user, index) => {
                                            return (

                                                <div key={index} >


                                                    <Row className="mb-1">
                                                        <Col md="3" xs="6" sm="3" className="table-col">
                                                            <span className="normal-text zero-margin">{user.index}</span>
                                                        </Col>
                                                        <Col md="3" xs="6" sm="3" className="table-col">
                                                            <span className="normal-text zero-margin">{user.reg}</span>
                                                        </Col>
                                                        <Col md="5" xs="12" sm="3" className="table-col">
                                                            <span className="normal-text zero-margin">{user.name}</span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="btn-row">
                        <Col lg={3} md={3} xs={6} sm={6} className="btn-card-col" onClick={() => this.viewChat(this.state.project)}>
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <QuestionAnswerIcon style={{ fontSize: 32 }} />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Chat Box</span></Card>
                        </Col>
                        <Col lg={3} md={3} xs={6} sm={6} className="btn-card-col" onClick={()=>this.requestSup(this.state.project)}>
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <IoIosPersonAdd />
                                    </div>
                                </IconContext.Provider><span className="btn-title" onClick={()=>this.requestSup(this.state.project)}>Request Supervisors</span></Card>
                        </Col>
                        <Col lg={3} md={3} xs={6} sm={6} className="btn-card-col" onClick={() => this.viewMeetings(this.state.project)}>
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <TiGroup />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Meetings</span></Card>
                        </Col>
                        <Col lg={3} md={3} xs={6} sm={6} className="btn-card-col">
                            <Card className="btn-card" onClick={() => { this.viewProgress(this.state.project) }}>
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <FaChartLine />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Progress</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={3} sm={3} className="btn-card-col"></Col>
                        <Col lg={4} md={4} xs={6} sm={6} className="btn-card-col">
                            <Card className="btn-card">
                                <IconContext.Provider value={{ className: 'btn-icon', size: "2em" }}>
                                    <div>
                                        <FiUploadCloud />
                                    </div>
                                </IconContext.Provider><span className="btn-title">Submissions</span></Card>
                        </Col>
                        <Col lg={4} md={4} xs={3} sm={3} className="btn-card-col"></Col>

                    </Row>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(ViewProject);