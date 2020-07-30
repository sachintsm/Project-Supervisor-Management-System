import React, {Component} from 'react';
import CoordinatorList from "./CoordinatorList";
import SupervisorList from "./SupervisorList";
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import {getFromStorage} from "../../utils/Storage";
import axios from 'axios';
import "../../css/students/ProjectDetailsCard2.scss"
import { withRouter } from "react-router-dom";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import Index from "../shared/Index";
const backendURI = require('../shared/BackendURI');
class studentBlock {
    constructor(id, name, index, reg) {
        this.id = id;
        this.name = name;
        this.index = index;
        this.reg = reg;
    }
}
class ProjectDetailsCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            item: this.props.project,
            indexNumbers: this.props.indexNumbers,
            groupDetails: [],
            studentList: [],
            loading: true,
            loading2:true
        }
        console.log("hello")
        this.getGroup()
        this.openProject = this.openProject.bind(this)
        this.getStudentDetails = this.getStudentDetails.bind(this)
    }

    componentDidMount() {
        this.getGroup()
        this.getStudentDetails()
    }


    getGroup  = () => {
        const userId = getFromStorage("auth-id").id;
        const project ={
            projectId: this.props.project._id
        }

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.post(backendURI.url+'/createGroups/groupDetails/'+userId,project,{headers:headers}).then(
            res=>{
                this.setState({
                    groupDetails: res.data,
                    loading: false
                },()=>{
                    axios.get(backendURI.url+'/progress/gettotalprogress/'+this.state.groupDetails._id,{headers:headers}).then(res=>{
                        let totalProgress = parseFloat(res.data)
                        this.setState({
                            totalProgress:  totalProgress,
                            totalProgressInt: Math.round(totalProgress * 1) / 1,
                        })

                    })
                })
            }
        )
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
                        })
                    }
                })
        })       

    }
    openProject(item){
        this.props.history.push('/studenthome/viewproject',{projectDetails:item})
    }



    render() {
        return (
            <div className="project-details-card-div2">
                {this.state.loading &&
                <Col style={{textAlign:'center'}}>
                    <Spinner animation="border" className="spinner2" style={{alignContent:'center'}}/>
                </Col>}
                {!this.state.loading &&
                <div>
                    <Card className="project-details-card"   onClick={()=>this.openProject(this.state.item)}>
                        {this.state.groupDetails.groupName && <Card.Header className="card-header">{this.state.groupDetails.groupName}</Card.Header>}
                        {!this.state.groupDetails.groupName && <Card.Header className="card-header2">Project Name Not Defined</Card.Header>}
                        <Card.Body className="card-body">
                            <Row>
                                <Col md={3} lg={3} xs={12} sm={12} className="circular-progressbar-col">

                                    {this.state.totalProgressInt<=33 && <CircularProgressbar className="my-progress-bar" styles={buildStyles({textColor: '#DC3545',pathColor: '#DC3545',})}   value={this.state.totalProgressInt} text={`${this.state.totalProgressInt}%`} />}
                                    {this.state.totalProgressInt<=66 && this.state.totalProgressInt>33  && <CircularProgressbar className="my-progress-bar"  styles={buildStyles({textColor: '#FFC107',pathColor: '#FFC107',})}   value={this.state.totalProgressInt} text={`${this.state.totalProgressInt}%`} />}
                                    {this.state.totalProgressInt<=100 && this.state.totalProgressInt>66  && <CircularProgressbar className="my-progress-bar"  styles={buildStyles({textColor: '#28A745',pathColor: '#28A745',})}   value={this.state.totalProgressInt} text={`${this.state.totalProgressInt}%`} />}
                                </Col>
                                <Col md={9} lg={9} xs={12} sm={12} className="details-col">
                                    <Row className="details-row">
                                        <Col lg={3} md={4} sm={6} xs={6} className=""><span className="bold-text">Project Year </span></Col>
                                        <Col lg={9} md={8} sm={6} xs={6} className="zero-padding"><span className="normal-text">{this.state.item.projectYear}</span></Col>
                                    </Row>
                                    <Row  className="details-row">
                                        <Col lg={3} md={4} sm={6} xs={6} className=""><span className="bold-text">Project Type</span></Col>
                                        <Col lg={9} md={8} sm={6} xs={6} className="zero-padding"><span className="normal-text">{this.state.item.projectType}</span></Col>
                                    </Row>
                                    <Row  className="details-row">
                                        <Col lg={3} md={4} sm={6} xs={6} className=""><span className="bold-text">Academic Year</span></Col>
                                        <Col lg={9} md={8} sm={6} xs={6} className="zero-padding"><span className="normal-text">{this.state.item.academicYear}</span></Col>
                                    </Row>
                                    <Row  className="details-row">
                                        <Col lg={3} md={4} sm={6} xs={6} className=""><span className="bold-text">Coordinators</span></Col>
                                        <Col lg={9} md={8} sm={6} xs={6} className="zero-padding"><span className="normal-text zero-padding"><CoordinatorList idList={this.state.item}/></span></Col>
                                    </Row>
                                    <Row  className="details-row">
                                        <Col lg={3} md={4} sm={6} xs={6} className=""><span className="bold-text">Supervisors</span></Col>
                                        <Col lg={9} md={8} sm={6} xs={6} className="zero-padding"><span className="normal-text zero-padding"><SupervisorList idList={this.state.groupDetails.supervisors}/></span></Col>
                                    </Row>

                                    <Row  className="details-row">
                                        <Col lg={3} md={4} sm={6} xs={6} className=""><span className="bold-text">Group Members</span></Col>
                                        <Col lg={9} md={8} sm={6} xs={6}><span className="normal-text">
                                                {/*{this.state.loading && <Spinner animation="border" className="spinner" />}*/}
                                                {   this.state.studentList.map((user, index) => {
                                                    return (
                                                        <div key={index} >
                                                            <Row className="mb-1">
                                                                <Col md="5" xs="12" sm="12" className="table-col">
                                                                    <span className="normal-text zero-margin">{user.name}</span>
                                                                </Col>
                                                                <Col md="3" xs="12" sm="12" className="table-col">   
                                                                    <span className="normal-text zero-margin"><Index id={user.id} index={user.index}/></span>
                                                                </Col>
                                                                <Col md="4" xs="12" sm="12" className="table-col">
                                                                    <span className="normal-text zero-margin">{user.reg}</span>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                })
                                                }
                                        </span></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
                }
            </div>
        );
    }
}

export default withRouter(ProjectDetailsCard);