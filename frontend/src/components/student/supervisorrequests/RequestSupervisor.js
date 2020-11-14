import React, {Component} from 'react';
import { Table, Modal, Button, ButtonToolbar, Tabs, Tab } from 'react-bootstrap';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import "../../../css/students/supervisorrequests/RequestSupervisor.scss"
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import SupervisorDetails from "./SupervisorDetails";
const backendURI = require('../../shared/BackendURI');

class RequestSupervisor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectDetails: props.location.state.projectDetails,
        }
    }

    render() {

        // let supervisorDetails = () => {
        //     let supervisorList = this.state.projectDetails.supervisorList
        //     supervisorList.length>0 && supervisorList.map(id=>{
        //         this.getSupervisorDetails(id)
        //         console.log(this.state.supervisorDetails)
        //     })
        // }

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
                                    {this.state.projectDetails.supervisorList.length>0 && this.state.projectDetails.supervisorList.map((index,key)=> {
                                        return <SupervisorDetails key={key} index={index} projectDetails={this.state.projectDetails}/>
                                    })}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab eventKey="status" title="Requests History">
                            </Tab>
                        </Tabs>
                    </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default RequestSupervisor;