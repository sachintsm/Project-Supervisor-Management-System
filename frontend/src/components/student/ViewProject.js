import React, {Component} from 'react';
import ProjectDetailsCard from "./ProjectDetailsCard";
import "../../css/students/ViewProject.scss"
import Footer from '../shared/Footer';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import {getFromStorage} from "../../utils/Storage";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Navbar from "../shared/Navbar";

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
            studentList:[],
            loading: true
        }
    }

    componentDidMount() {
        this.getgroupMembersIndexes();
    }

    getgroupMembersIndexes(){
        const studentId = getFromStorage("auth-id").id
        axios.post(backendURI.url+'/users/getgroupmembers/'+studentId,{projectId: this.state.project._id}).then(res=>{
            this.setState({
                indexNumbers: res.data
            })
        }).then(()=>{
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

        this.state.indexNumbers.map(async (index)=>{

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
                            loading:false
                        })
                    }
                })
        })

    }

    render() {
        return (
            <React.Fragment>

                <Navbar panel={"student"} />
                <div className="container-fluid open-project open-project-background-color">

                        <Row>
                            <Col lg={6} md={5} xs={12} sm={12} className="my-col">
                                <div className="card project-detail-card">
                                    <h4 className="title">Project Details</h4>
                                    <ProjectDetailsCard project={this.state.project}/>
                                </div>
                            </Col>
                            <Col lg={6} md={7} xs={12} sm={12}  className="my-col">
                                <div className="card project-detail-card">
                                    <h4 className="title">Group Members</h4>
                                    {this.state.loading && <Spinner animation="border" className="spinner"/>}
                                    {
                                        this.state.studentList.map((user,index)=>{
                                            return (

                                                <div key={index}>


                                                    <Row className="mb-1">
                                                        <Col md="3" xs="6" sm="3">
                                                            <span className="normal-text zero-margin">{user.index}</span>
                                                        </Col>
                                                        <Col md="3" xs="6" sm="3">
                                                            <span className="normal-text zero-margin">{user.reg}</span>
                                                        </Col>
                                                        <Col md="5" xs="12" sm="3">
                                                            <span className="normal-text zero-margin">{user.name}</span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Col>
                        </Row>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default ViewProject;