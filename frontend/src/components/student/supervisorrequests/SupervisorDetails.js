import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import {Button, Tab, Table,} from "react-bootstrap";
import "../../../css/students/supervisorrequests/SupervisorDetails.scss"
import {Input, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import ProjectDetails from "./ProjectDetails";
import Snackpop from "../../shared/Snackpop";
const backendURI = require('../../shared/BackendURI');

class SupervisorDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index : this.props.index,
            projectDetails : this.props.projectDetails,
            loading: true,
            loading2: true,
            modal: false,
            modal2 : false,
            emptyInputAlert : false,
            description: ""
        }
    }

    componentDidMount() {
        this.getSupervisorDetails()
        this.checkLimit()
        this.getCurrentProjects()
    }

    getSupervisorDetails = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url + '/users/getSupervisorEmail/' + this.state.index, { headers: headers }).then(res => {
            this.setState({
                supervisorDetails: res.data.data[0],
                loading:false
            })
        })
    }

    getCurrentProjects = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url + '/supervisorrequests/getcurrentprojectlist/' + this.state.index,{ headers: headers }).then(res => {
            this.setState({
                projectIdList : res.data.projectIdList,
                projectCount : res.data.projectCount,
                loading2: false
            })
        })
    }

    checkLimit = () => {

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        const data = {
            userId: this.state.index,
            projectId: this.state.projectDetails._id
        }
        axios.post(backendURI.url + '/supervisorrequests/checklimit/', {data:data} , { headers: headers }).then(res => {
            this.setState({
                limitAvailability: res.data.isAvailable
            })
        })
    }

    openModal = () => {
        this.setState({
            modal: true
        })
    }
    openModal2 = () => {
        this.setState({
            modal2: true
        })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };

    toggle2 = () => {
        this.setState({
            modal2: !this.state.modal2,
        });
    };

    closeAlert = () => {
        this.setState({
            emptyInputAlert: false,
        });
    };

    handleDescriptionChange = (e) => {
        const description = e.target.value
        console.log(description)
        this.setState({
            description: description
        })
    }

    sendRequest = () => {
        if(this.state.description===""){
            this.setState({emptyInputAlert: true})
        }
        else{

        }

    }

    render() {
        return (

            <tr className="supervisor-details">
                <td>
                    <Snackpop
                        msg={'Please enter a Description'}
                        color={'error'}
                        time={3000}
                        status={this.state.emptyInputAlert}
                        closeAlert={this.closeAlert}
                    />

                    {!this.state.loading && <span>{this.state.supervisorDetails.firstName} {this.state.supervisorDetails.lastName}</span>}
                </td>
                <td>
                    {!this.state.loading && <span>{this.state.supervisorDetails.email}</span>}
                </td>
                <td>
                    {!this.state.loading &&
                        <Button variant='info'  onClick={this.openModal} style={{ width: '70%' }} > View Projects </Button>}
                </td>
                <td>
                    {!this.state.loading && this.state.limitAvailability &&
                        <Button variant='info' style={{ width: '70%' }} onClick={this.openModal2} > Send Request </Button>}
                    {!this.state.loading && !this.state.limitAvailability &&
                        <Button className="disabled-button" disabled variant="outline-danger" style={{ width: '70%' }} > Limit Reached </Button>}
                </td>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Current Projects</ModalHeader>
                    <ModalBody>

                        <Table >
                            <thead>
                            <tr>
                                <th>Project</th>
                                <th>Count</th>
                            </tr>
                            </thead>
                            <tbody>
                                {!this.state.loading2 && this.state.projectIdList && this.state.projectIdList.length>0 && this.state.projectIdList.map((projectId,key)=>{
                                    return <ProjectDetails key={key} projectId={projectId} count={this.state.projectCount[key]}/>
                                })}
                            </tbody>
                        </Table>
                        {!this.state.loading2 && this.state.projectIdList.length===0 && <span style={{"paddingLeft": "15px"}}>No any projects</span>}
                    </ModalBody>
                </Modal>



                <Modal isOpen={this.state.modal2} toggle={this.toggle2}>
                    <ModalHeader toggle={this.toggle2}>Send Request</ModalHeader>
                    <ModalBody>
                        <label>Project Description</label>
                        <Input type="textarea" className="text-area" placeholder="Enter description of your Project" onChange={this.handleDescriptionChange}></Input>
                        <div className="send-request-btn">
                            <Button variant='info' style={{ width: '100%', marginTop: "20px" }} onClick={this.sendRequest} > Send Request </Button>
                        </div>
                    </ModalBody>
                </Modal>

            </tr>
        );
    }
}

export default SupervisorDetails;