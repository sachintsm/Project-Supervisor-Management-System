import React, {Component} from 'react';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import axios from 'axios';
import { Row, Col, FormControl, Card, Container, Button,Spinner } from 'react-bootstrap';
import {getFromStorage} from "../../../utils/Storage";
import "../../../css/students/formgroups/FormGroups.scss"
import StudentInfoCard from "./StudentInfoCard";
import StudentInfoCard2 from "./StudentInfoCard2";
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../../shared/Snackpop";

const backendURI = require('../../shared/BackendURI');

class FormGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: this.props.match.params.projectId,
            projectDetails: null,
            loading: true,
            loading2: true,
            searchText: "",
            groupRequest: null
        }
    }

    componentDidMount() {
        this.getUserIndex()
    }

    getRequestDetails() {
        const userId = getFromStorage("auth-id").id

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        let projectId = {
            id: this.state.projectId
        }
        axios.post(backendURI.url+'/createGroups/grouprequest/'+userId,projectId,{headers: headers}).then(res=>{
            let data = res.data;
            if(data){
                this.setState({
                    groupRequest: res.data,
                    pendingList: res.data.pendingList,
                    acceptedList: res.data.acceptedList,
                    declinedList: res.data.declinedList,
                    allStudentList: res.data.allStudentList
                })
                let list = this.state.studentList;
                if(data){

                }
                list = list.filter(item=>!data.acceptedList.includes(item))
                list = list.filter(item=>!data.pendingList.includes(item))
                list = list.filter(item=>!data.declinedList.includes(item))
                this.setState({
                    studentList:list,
                    loading2: false
                })
            }
            else{
                this.setState({
                    loading2: false
                })
            }


        })
    }
//Get the index number of the students
    getUserIndex = () => {
        const userId = getFromStorage("auth-id").id
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/users/get/'+userId,{headers: headers}).then(res=>{
            let indexNumber = res.data.data[0].indexNumber
            this.setState({
                userIndex: indexNumber
            },()=> {
                this.getProjectDetails()
            })
        })
    }

    //Get the project details from
    getProjectDetails = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/projects/getProject/'+this.state.projectId,{headers: headers}).then(res=>{
            let studentList = res.data.data.studentList.filter(item=>item!==this.state.userIndex)

            this.setState({
                projectDetails: res.data.data,
                allStudentList: res.data.data.studentList,  // including the user
                studentList: studentList, // excluding the user
                addedList: [],
                loading: false
            })

            this.getRequestDetails()
        })
    }

    selectStudent = (index) => {

        if(this.state.groupRequest){ //edit menu
            this.setState({
                pendingList: [...this.state.pendingList,index],
                allStudentList: [...this.state.allStudentList,index],
                studentList: this.state.studentList.filter(item=>item!==index) // remove new index
            })
        }
        else{
            this.setState({
                addedList: [...this.state.addedList, index],     // add new index
                studentList: this.state.studentList.filter(item=>item!==index) // remove new index
            })
        }

    }

    removeStudent = (index) => {

        confirmAlert({
            title: 'Remove Student',
            message: 'Do you want to remove this student?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        if(this.state.groupRequest){ //edit menu
                            if(this.state.acceptedList.includes(index)){
                                this.setState({
                                    acceptedList: this.state.acceptedList.filter(item=>item!==index),
                                    studentList: [...this.state.studentList,index]
                                })
                            }
                            if(this.state.declinedList.includes(index)){
                                this.setState({
                                    declinedList: this.state.declinedList.filter(item=>item!==index),
                                    studentList: [...this.state.studentList,index]
                                })
                            }
                            if(this.state.pendingList.includes(index)){
                                this.setState({
                                    pendingList: this.state.pendingList.filter(item=>item!==index),
                                    studentList: [...this.state.studentList,index]
                                })
                            }
                            if(this.state.allStudentList.includes(index)){
                                this.setState({
                                    allStudentList: this.state.allStudentList.filter(item=>item!==index)
                                })
                            }
                        }
                        else{
                            let newAddedList = this.state.addedList.filter(item=>item!==index)
                            this.setState({
                                addedList: newAddedList,
                                studentList: [...this.state.studentList,index]
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



    sendRequest = () => {

        confirmAlert({
            title: 'Group Requests',
            message: 'Do you want to request these students?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const request = {
                            projectId: this.state.projectDetails._id,
                            leaderId: getFromStorage("auth-id").id,
                            allStudentList: this.state.addedList,
                            pendingList: this.state.addedList,
                            acceptedList: [],
                            declinedList: [],
                            leaderIndex: this.state.userIndex
                        }

                        const headers = {
                            'auth-token':getFromStorage('auth-token').token,
                        }
                        axios.post(backendURI.url+'/createGroups/grouprequest/',request,{headers: headers}).then(res=>{

                            this.setState({
                                successAlert: true,
                            },()=>{

                                this.getRequestDetails()
                            });
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

    editRequest = () => {
        confirmAlert({
            title: 'Group Request',
            message: 'Do you want to Edit this Request?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        const request = {
                            allStudentList: this.state.allStudentList,
                            pendingList: this.state.pendingList,
                            acceptedList: this.state.acceptedList,
                            declinedList: this.state.declinedList,
                        }
                        const headers = {
                            'auth-token':getFromStorage('auth-token').token,
                        }
                        axios.patch(backendURI.url+'/createGroups/grouprequest/'+this.state.groupRequest._id,request,{headers: headers}).then(res=>{
                            this.setState({
                                successAlert: true,
                            },()=>{

                                this.getRequestDetails()
                            });
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

    closeAlert = () => {
        this.setState({
            successAlert: false,
        });
    };

    render() {
        return (
            <React.Fragment>

                <Snackpop
                    msg={'Requesting Success'}
                    color={'success'}
                    time={3000}
                    status={this.state.successAlert}
                    closeAlert={this.closeAlert}
                />

                <Navbar panel={"student"} />
                <div className="container-fluid form-groups-css">
                    <Container>
                        <div className="project-detail-card-div">
                            {!this.state.loading && (
                                <Card className="project-detail-card">
                                    <Card.Body className="card-body">
                                        <div className="title">
                                            <h3>Project Details</h3>
                                        </div>
                                        <h5>Project Year: {this.state.projectDetails.projectYear}</h5>
                                        <h5>Project Type: {this.state.projectDetails.projectType}</h5>
                                        <h5>Academic Year: {this.state.projectDetails.academicYear}</h5>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>

                        {this.state.loading2 &&
                        <div style={{textAlign:'center', paddingTop: "30px"}}>
                            <Spinner animation="border" className="spinner" style={{alignContent:'center'}}/>
                        </div>}

                        {/*Adding New Request  */}
                        {!this.state.loading2 && this.state.groupRequest===null && (
                            <div className="group-form-card-div">
                                <Card className="group-form-card">
                                    <div className="main-title"><h3>Group Formation</h3></div>
                                    <h6 className="mb-2">Requesting Student List</h6>
                                    {!this.state.loading &&  this.state.addedList.length>0 && (
                                        <div className="added-list-div">
                                            <Row >
                                                {this.state.addedList.map( item=>{
                                                    return <StudentInfoCard2 index={item} key={item} type={"normal"}  selectStudent={this.removeStudent}/>
                                                })}
                                            </Row>
                                            <div className="btn-div">
                                                <Button className="btn btn-info my-btn1" onClick={()=>this.sendRequest()}>Send Request</Button>
                                            </div>
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
                                                    onChange={(e)=>this.setState({searchText: e.target.value})}
                                                ></FormControl></Col>
                                            <Col lg={1} md={1} sm={0} xs={0}></Col>
                                        </Row>

                                    </div>
                                    <Row>
                                        {!this.state.loading && this.state.studentList.filter(index=>index.match(this.state.searchText)).length>0 &&
                                        this.state.studentList.filter(index=>index.match(this.state.searchText)).map( item=>{
                                            return <StudentInfoCard index={item} key={item}  selectStudent={this.selectStudent}/>
                                        })}
                                    </Row>
                                </Card>
                            </div>
                        )}

                        {/*Editing New Request*/}
                        {!this.state.loading2 && this.state.groupRequest && (
                            <div className="group-form-card-div">
                                <Card className="group-form-card">
                                    <div className="main-title"><h3>Group Formation</h3></div>
                                    <h6 className="mb-2">Requesting Student List</h6>
                                    {!this.state.loading &&  this.state.allStudentList.length>0 && (
                                        <div className="added-list-div">
                                            <Row >
                                                {this.state.acceptedList.map( item=>{
                                                    return <StudentInfoCard2 index={item} key={item} type={"accepted"} selectStudent={this.removeStudent}/>
                                                })}
                                                {this.state.declinedList.map( item=>{
                                                    return <StudentInfoCard2 index={item} key={item} type={"declined"}   selectStudent={this.removeStudent}/>
                                                })}
                                                {this.state.pendingList.map( item=>{
                                                    return <StudentInfoCard2 index={item} key={item} type={"pending"}   selectStudent={this.removeStudent}/>
                                                })}
                                            </Row>
                                            {!this.state.loading &&  this.state.allStudentList.length===1 && (
                                                <div className="error-div">Not students have been added</div>
                                            )}
                                            <div className="btn-div">
                                                <Button className="btn btn-info my-btn1" onClick={()=>this.editRequest()}>Edit Request</Button>
                                            </div>
                                        </div>
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
                                                    onChange={(e)=>this.setState({searchText: e.target.value})}
                                                ></FormControl></Col>
                                            <Col lg={1} md={1} sm={0} xs={0}></Col>
                                        </Row>

                                    </div>
                                    <Row>
                                        {!this.state.loading && this.state.studentList.filter(index=>(index.match(this.state.searchText))).length>0 &&
                                            this.state.studentList.filter(index=>(index.match(this.state.searchText))).map( item=>{
                                            return <StudentInfoCard index={item} key={item}  selectStudent={this.selectStudent}/>
                                        })}
                                    </Row>
                                </Card>
                            </div>
                        )}

                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default FormGroups;