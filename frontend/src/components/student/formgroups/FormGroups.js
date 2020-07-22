import React, {Component} from 'react';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import axios from 'axios';
import { Row, Col, FormControl, Card, Container } from 'react-bootstrap';
import {getFromStorage} from "../../../utils/Storage";
import "../../../css/students/formgroups/FormGroups.scss"
import StudentInfoCard from "./StudentInfoCard";
import StudentInfoCard2 from "./StudentInfoCard2";

const backendURI = require('../../shared/BackendURI');

class FormGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: this.props.match.params.projectId,
            projectDetails: null,
            loading: true,
            searchText: ""
        }
    }

    componentDidMount() {
        this.getProjectDetails()
    }

    getProjectDetails = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/projects/getProject/'+this.state.projectId,{headers: headers}).then(res=>{
            this.setState({
                projectDetails: res.data.data,
                studentList: res.data.data.studentList,
                filteredList: res.data.data.studentList,
                addedList: [],
                loading: false
            })
        })
    }

    selectStudent = (index) => {
        this.setState({
            addedList: [...this.state.addedList, index], // add new index
            studentList: this.state.studentList.filter(item=>item!=index) // remove new index
        },()=>{

            let list = this.state.studentList
            this.setState({
                filteredList:list.filter(index=>index.match(this.state.searchText))
            })
        })
    }

    removeStudent = (index) => {
        let newAddedList = this.state.addedList.filter(item=>item!=index)
        this.setState({
            addedList: newAddedList,
            studentList: [...this.state.studentList,index]
        },()=>{
            let list = this.state.studentList
            this.setState({
                filteredList:list.filter(index=>index.match(this.state.searchText))
            })
        })
    }

    filterStudents =(e) => {
        let searchText = e.target.value
        this.setState({ searchText: e.target.value })
        let list = this.state.studentList
        this.setState({
            filteredList:list.filter(index=>index.match(searchText))
        })
    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid form-groups-css">
                    <Container>
                        <div className="project-detail-card-div">
                            <Card className="project-detail-card">
                                {!this.state.loading && (
                                    <Card.Body className="card-body">
                                        <div className="title">
                                            <h4>Project Details</h4>
                                        </div>
                                        <div>Project Year: {this.state.projectDetails.projectYear}</div>
                                        <div>Project Type: {this.state.projectDetails.projectType}</div>
                                        <div>Academic Year: {this.state.projectDetails.academicYear}</div>
                                    </Card.Body>
                                )}
                            </Card>
                        </div>

                        <div className="group-form-card-div">
                            <Card className="group-form-card">
                                <div className="main-title"><h3>Group Formation</h3></div>
                                <h6 className="mb-2">Added Student List</h6>
                                {!this.state.loading &&  this.state.addedList.length>0 && (
                                    <div className="added-list-div">
                                        <Row >
                                            {this.state.addedList.map( item=>{
                                                return <StudentInfoCard2 index={item} key={item}  selectStudent={this.removeStudent}/>
                                            })}
                                        </Row>
                                    </div>
                                )}

                                {!this.state.loading &&  this.state.addedList.length===0 && (
                                    <div className="error-div">Not students have been added</div>
                                )}
                                <div className="border-span"></div>
                                <h6 >Add New Students</h6>
                                <div className="form-control-div">
                                    <Row>
                                        <Col lg={1} md={1} sm={0} xs={0}></Col>
                                        <Col>
                                            <FormControl
                                                type='text'
                                                className="placeholder-text"
                                                placeholder='Search Students by Index'
                                                value={this.state.newIndex}
                                                onChange={(e)=>this.filterStudents(e)}
                                            ></FormControl></Col>
                                        <Col lg={1} md={1} sm={0} xs={0}></Col>
                                    </Row>

                                </div>
                                <Row>
                                {!this.state.loading && this.state.filteredList.length>0 && this.state.filteredList.map( item=>{
                                    return <StudentInfoCard index={item} key={item}  selectStudent={this.selectStudent}/>
                                })}
                                </Row>
                            </Card>
                        </div>
                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default FormGroups;