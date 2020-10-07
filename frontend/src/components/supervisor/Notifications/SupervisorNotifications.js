import React, {Component} from 'react';
import Navbar from "../../shared/Navbar"
import Footer from "../../shared/Footer"
import {getFromStorage} from "../../../utils/Storage";
import { Row, Col, Card,Spinner, Container, Button } from 'react-bootstrap';
import axios from "axios";
import Snackpop from "../../shared/Snackpop";
import RequestInfo from "../../student/formgroups/RequestInfo";
import { confirmAlert } from 'react-confirm-alert';
import BiweekRequest from "./BiweekRequest";

const backendURI = require("../../shared/BackendURI");

class SupervisorNotifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            biWeekRequests: [],
            declinedAlert: false,
            acceptedAlert: false,
            userId: getFromStorage('auth-id').id
        }
    }

    componentDidMount() {
        this.getBiweekRequests()
    }

    getBiweekRequests = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id

        axios.get(backendURI.url+"/biweeksubmissions/getsubmissions/"+userId, {headers: headers}).then(res=>{
            this.setState({
                biWeekRequests: res.data,
                loading: false
            })
        })
    }


    acceptRequest = (item) => {
        confirmAlert({
            title: 'Biweekly Report',
            message: 'Are you sure you want to accept this report?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        const headers = {
                            'auth-token':getFromStorage('auth-token').token,
                        }

                        item.supervisors.map((supervisor,index) => {
                            if(supervisor === this.state.userId ){
                                item.status[index]="Accepted"
                            }
                        })


                        axios.patch(backendURI.url+"/biweeksubmissions/updateRequest/"+item._id,item, {headers: headers}).then(res=>{
                            this.getBiweekRequests()
                            this.setState({
                                acceptedAlert: true
                            })
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


    declineRequest = (item) => {
        confirmAlert({
            title: 'Biweekly Report',
            message: 'Are you sure you want to decline this report?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        const headers = {
                            'auth-token':getFromStorage('auth-token').token,
                        }

                        item.supervisors.map((supervisor,index) => {
                            if(supervisor === this.state.userId ){
                                item.status[index]="Declined"
                            }
                        })


                        axios.patch(backendURI.url+"/biweeksubmissions/updateRequest/"+item._id,item, {headers: headers}).then(res=>{
                            this.getBiweekRequests()
                            this.setState({
                                declinedAlert: true
                            })
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
            acceptedAlert: false,
            declinedAlert: false,
        });
    };

    render() {

        return (
            <React.Fragment>

                <Snackpop
                    msg={'Accepted'}
                    color={'success'}
                    time={3000}
                    status={this.state.acceptedAlert}
                    closeAlert={this.closeAlert}
                />

                <Snackpop
                    msg={'Declined'}
                    color={'success'}
                    time={3000}
                    status={this.state.declinedAlert}
                    closeAlert={this.closeAlert}
                />

                <Navbar panel={"supervisor"} />

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

                                {this.state.biWeekRequests.length===0 && <div style={{textAlign: "center", padding: "20px 0px"}}>No Any Notifications</div>}

                                {/*Group Requests Notifications*/}
                                {this.state.biWeekRequests.map((item,key)=>{
                                    return <Card className="notification-card" key={key}>
                                        <Card.Body className="card-body">
                                            <Row className="details-row">
                                                <Col>
                                                    <h5>New Biweekly Report Request</h5>
                                                    <BiweekRequest details={item}/>

                                                </Col>
                                                <Col lg={3} md={3} className="btn-col-2">
                                                    <Button className="btn btn-info my-btn1" onClick={()=>this.acceptRequest(item)}>Accept Report</Button>
                                                    <Button className="btn btn-danger my-btn1 mt-3" onClick={()=>this.declineRequest(item)} >Decline Report</Button>
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

export default SupervisorNotifications;