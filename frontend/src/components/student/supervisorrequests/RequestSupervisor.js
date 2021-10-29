import React, {Component} from 'react';
import { Table, Modal, Button, ButtonToolbar, Tabs, Tab } from 'react-bootstrap';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import "../../../css/students/supervisorrequests/RequestSupervisor.scss"
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import SupervisorDetails from "./SupervisorDetails";
import RequestHistory from "./RequestHistory";
const backendURI = require('../../shared/BackendURI');

class RequestSupervisor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectDetails: props.location.state.projectDetails,
            groupDetails: props.location.state.groupDetails,
            loading: true,
            loading2: true
        }

        this.getAvailableSupervisorList()
        this.getPreviousRequests()

    }

    getAvailableSupervisorList = () => {

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        axios.post(backendURI.url + '/supervisorrequests/getavailablesupervisorlist/' + this.state.groupDetails._id,   {data: this.state.projectDetails.supervisorList},{ headers: headers }).then(res => {
            this.setState({
                availableSupervisorList : res.data,
                loading: false
            })
        })
    }

    getPreviousRequests = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url + '/supervisorrequests/getpreviousrequests/' + this.state.groupDetails._id,{ headers: headers }).then(res => {
            console.log(res.data)
            this.setState({
                previousRequests : res.data,
                loading2: false
            })
        })
    }

    render() {
        console.log(this.state.previousRequests)
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                    <div className="request-supervisor">
                        <Tabs defaultActiveKey="request" id="uncontrolled-tab-example">
                            <Tab eventKey="request" title="Request Now" className="request-tab">
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>Supervisor Name</th>
                                            <th>Supervisor Email</th>
                                            <th>Current Projects</th>
                                            <th>Request Now</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.loading && this.state.availableSupervisorList.length>0 && this.state.availableSupervisorList.map((index,key)=> {
                                            return <SupervisorDetails key={key} index={index} projectDetails={this.state.projectDetails} groupDetails={this.state.groupDetails}/>
                                        })}
                                    </tbody>
                                </Table>
                                {!this.state.loading && this.state.availableSupervisorList.length===0 && <p>No any Supervisors</p>}
                            </Tab>
                            <Tab eventKey="status" title="Requests History" className="request-tab">
                                <Table >
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Supervisor Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.loading2 && this.state.previousRequests.length>0 && this.state.previousRequests.map((item,key)=> {
                                            return <RequestHistory key={key} requestDetails={item}/>
                                        })}
                                    </tbody>
                                </Table>
                                {!this.state.loading2 && this.state.previousRequests.length===0 && <p>No any Supervisors</p>}
                            </Tab>
                        </Tabs>
                    </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default RequestSupervisor;