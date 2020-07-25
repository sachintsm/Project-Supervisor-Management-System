import React, {Component} from 'react';
import axios from 'axios';
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col, Card,Spinner, Container, Button } from 'react-bootstrap';
import "../../../css/students/formgroups/GroupNotification.scss"
import Navbar from "../../shared/Navbar";
import ProjectDetailsCard from "../ProjectDetailsCard";
import Footer from "../../shared/Footer";
import RequestInfo from "./RequestInfo";
const backendURI = require('../../shared/BackendURI');

class GroupNotification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            groupRequests: [],
            loading: true
        }

    }

    componentDidMount() {
        this.getGroupFormNotifications();
        this.getGroupRequestNotifications();
        this.getUserIndex()
    }

    getUserIndex = () => {
        const userId = getFromStorage("auth-id").id
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/users/get/'+userId,{headers: headers}).then(res=>{
            let indexNumber = res.data.data[0].indexNumber
            this.setState({
                userIndex: indexNumber
            })
        })
    }

    getGroupFormNotifications = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id

        axios.get(backendURI.url+'/createGroups/groupformnotification/'+userId,{headers: headers}).then(res=>{

            res.data.map(item => {
                let project = {
                    projectId: item._id
                }
                axios.post(backendURI.url+'/createGroups/allgrouprequest/'+userId,{project},{headers: headers}).then(res2=>{
                    if(res2.data){

                    }
                    else{
                        this.setState({
                            projects: [...this.state.projects,item]
                        })
                    }
                })
            })
            this.setState({
                loading:false
            })
        })

    }

    getGroupRequestNotifications = () => {

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id

        axios.get(backendURI.url + '/createGroups/groupacceptingrequest/' + userId, {headers: headers}).then(res => {
            this.setState({
                groupRequests: res.data
            })
        })

    }

    acceptRequest = (item) => {
        const userIndex = this.state.userIndex
        item.pendingList = item.pendingList.filter(index=>index!==userIndex)
        item.acceptedList.push(userIndex)
        this.updateRequest(item, true)
    }

    declineRequest = (item) => {
        const userIndex = this.state.userIndex
        item.pendingList = item.pendingList.filter(index=>index!==userIndex)
        item.declinedList.push(userIndex)
        this.updateRequest(item, false)
    }

    updateRequest = (item, state) => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.patch(backendURI.url+'/createGroups/grouprequest/'+item._id,item,{headers: headers}).then(res=>{
            if(state){
                this.setState({
                    acceptedAlert: true,
                });
            }
            else{
                this.setState({
                    declinedAlert: false
                })
            }
        })

    }


    formGroups = (id) =>{
        this.props.history.push('/studenthome/formgroups/'+id)
    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid group-notifications">
                    <div className="title-div">
                        <h3 className="title">Notifications </h3>
                    </div>
                    <Container>
                        {this.state.loading &&
                        <div style={{textAlign:'center', paddingTop: "30px"}}>
                            <Spinner animation="border" className="spinner" style={{alignContent:'center'}}/>
                        </div>}
                        {!this.state.loading && (

                            <div className="card card-div">

                                {this.state.projects.length===0 && this.state.groupRequests.length===0 && <div style={{textAlign: "center", padding: "20px 0px"}}>No Any Notifications</div>}

                                {/*Group Requests Notifications*/}
                                {this.state.groupRequests.map((item,key)=>{
                                    return <Card className="notification-card" key={key}>
                                        <Card.Body className="card-body">
                                            <Row className="details-row">
                                                <Col>
                                                    <h5>You have New Group Request</h5>
                                                    <RequestInfo details={item}/>
                                                </Col>
                                                <Col lg={3} md={3} className="btn-col">
                                                    <Button className="btn btn-info my-btn1" onClick={()=>this.acceptRequest(item)}>Accept</Button>
                                                    <Button className="btn btn-danger my-btn1 mt-2" onClick={()=>this.declineRequest(item)} >Decline</Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                })}

                                {/*Group Form Notifications*/}
                                {this.state.projects.map((item,key)=>{
                                    return <Card className="notification-card" key={key}>
                                        <Card.Body className="card-body">
                                            <Row className="details-row">
                                                <Col>
                                                    <h5>You Can Form Groups by Yourselves Now</h5>
                                                    <div>Project Year: {item.projectYear}</div>
                                                    <div>Project Type: {item.projectType}</div>
                                                    <div>Academic Year: {item.academicYear}</div>
                                                </Col>
                                                <Col lg={3} md={3} className="btn-col">
                                                    <Button className="btn btn-info my-btn1" onClick={()=>this.formGroups(item._id)}>Form Groups</Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                })}
                            </div>
                        )}
                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default GroupNotification;