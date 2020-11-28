import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import {Button, Spinner, Table,} from "react-bootstrap";
import "../../../css/students/supervisorrequests/SupervisorDetails.scss"
import {Input, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import ProjectDetails from "./ProjectDetails";
import Snackpop from "../../shared/Snackpop";
import { confirmAlert } from 'react-confirm-alert';

const backendURI = require('../../shared/BackendURI');

class SupervisorDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index : this.props.index,
            projectDetails : this.props.projectDetails,
            groupDetails : this.props.groupDetails,
            loading: true,
            loading2: true,
            pageLoading : true,
            modal: false,
            modal2 : false,
            emptyInputAlert : false,
            successRequest: false,
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
            projectId: this.state.projectDetails._id,
            groupId: this.state.groupDetails._id
        }
        axios.post(backendURI.url + '/supervisorrequests/checklimit/', {data:data} , { headers: headers }).then(res => {
            let warnBtnMessage = ""
            if(!res.data.isAvailable){
                warnBtnMessage = "Limit Reached"
            }
            else if(res.data.alreadyRequested){
                warnBtnMessage = "Requested"
            }
            this.setState({
                limitAvailability: res.data.isAvailable,
                alreadyRequested: res.data.alreadyRequested,
                warnBtnMessage : warnBtnMessage,
                pageLoading : false
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
            successRequest: false
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
            this.toggle2()

            confirmAlert({
                title: 'Send Request',
                message: 'Are you sure you want to request this supervisor?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            const date = new Date()
                            const dateString = date.toLocaleDateString()
                            const timeString = date.toLocaleTimeString()
                            const data = {
                                groupId : this.state.groupDetails._id,
                                projectId : this.state.projectDetails._id,
                                supervisorId : this.state.supervisorDetails._id,
                                description: this.state.description,
                                state : "pending",
                                timestamp: new Date(),
                                date: dateString,
                                time: timeString
                            }
                
                            const headers = {
                                'auth-token': getFromStorage('auth-token').token,
                            }
                            axios.post(backendURI.url + "/supervisorrequests/addnewrequest", data, {headers: headers}).then(result=> {
                                this.checkLimit()
                                this.setState({
                                    successRequest: true
                                })
                            }).catch(err => {
                                console.log(err)
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

    }

    render() {
        return (
            <React.Fragment>

                {this.state.pageLoading && (
                    <tr>

                        <div style={{ textAlign: 'center' }}>
                            <Spinner animation="border" className="spinner" style={{ alignContent: 'center' }} />
                        </div>
                    </tr>
                )}
                {!this.state.pageLoading && (
                        <tr className="supervisor-details">
                        <td>
                            <Snackpop
                                msg={'Please enter a Description'}
                                color={'error'}
                                time={3000}
                                status={this.state.emptyInputAlert}
                                closeAlert={this.closeAlert}
                            />

                            <Snackpop
                                msg={'Requesting Success'}
                                color={'success'}
                                time={3000}
                                status={this.state.successRequest}
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
                            {!this.state.loading && this.state.limitAvailability && !this.state.alreadyRequested && 
                                <Button variant='info' style={{ width: '70%' }} onClick={this.openModal2} > Send Request </Button>}
                            {!this.state.loading && (!this.state.limitAvailability || this.state.alreadyRequested) &&
                                <Button className="disabled-button" disabled variant="outline-danger" style={{ width: '70%' }} > {this.state.warnBtnMessage} </Button>}
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
                )}

            </React.Fragment>
        );
    }
}

export default SupervisorDetails;