import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import SupervisorName from "./SupervisorName";
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const backendURI = require('../../shared/BackendURI');

class BiweekData extends Component {

    constructor(props) {
        super(props);
        this.state={
            request: this.props.details,
            loading1: true,
            loading2: true,
            loading3: true,
            userId: getFromStorage('auth-id').id,
            length: this.props.details.files.length - 1,
            modal: false
        }
    }

    componentDidMount() {
        this.getGroupDetails()
        this.getProjectDetails()
        this.getIndividualMarks()
    }


    getGroupDetails = () => {
        let groupId = this.state.request.groupId
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/createGroups/getGroupData/'+groupId,{headers: headers}).then(res=>{
            this.setState({
                groupDetails: res.data.data,
                loading1:false
            })
        })
    }

    getProjectDetails = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/projects/getproject/'+this.state.request.projectId,{headers: headers}).then(res=>{
            this.setState({
                projectDetails: res.data.data,
                loading2:false
            })
        })
    }

    getIndividualMarks = () => {
        console.log("getting individual marks...")
        console.log(this.state.request._id)
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/biweeksubmissions/individualmarks/'+this.state.request._id,{headers: headers}).then(res=>{
            if(res.data){
                this.setState({
                    individualMarks: res.data,
                    existing: true,
                    loading3: false
                })
            }
            else{
                this.setState({
                    exists: false,
                    loading3: false
                })
            }
        })
    }

    openModal = () => {
        this.setState({
            modal: true
        })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };

    render() {
        let status = this.state.request.supervisors.map((item, index) => {

            return(
                <div key={index}>
                    {this.state.request.status[index]==="Accepted" && <div className="mb-1" ><SupervisorName id={item}/> <span style={{color:"limegreen", border: "1.8px solid limegreen",padding:"0px 4px",borderRadius:"8px", fontSize: "13px"}} >{this.state.request.status[index]}</span> </div>}
                    {this.state.request.status[index]==="Declined" && <div className="mb-1"><SupervisorName id={item}/> <span style={{color:"#DC3545", border: "1.8px solid #DC3545",padding:"0px 4px",borderRadius:"8px", fontSize: "13px"}} >{this.state.request.status[index]}</span> </div>}
                    {this.state.request.status[index]==="Pending" && <div className="mb-1"><SupervisorName id={item}/> <span style={{color:"grey", border: "1.8px solid grey",padding:"0px 4px",borderRadius:"8px", fontSize: "13px"}}  >{this.state.request.status[index]}</span> </div>}

                </div>
            )
        })

        return (
            <React.Fragment>
                {!this.state.loading1 && !this.state.loading2 && (

                    <tr>
                        <td>G{this.state.groupDetails.groupId}</td>
                        <td>{this.state.groupDetails.groupName}</td>
                        <td>{this.state.request.deadDate}</td>
                        <td>{this.state.request.deadTime}</td>
                        <td>{status}</td>
                        <td>
                            <a className="crd_atchmnt" href={backendURI.url +"/biweeksubmissions/getsubmission/" + this.state.request.files[this.state.length]}>
                                {this.state.request.originalFileName}
                            </a>
                        </td>
                        <td>
                            {!this.state.loading3 && this.state.existing && this.state.individualMarks.studentList.length>0 && this.state.individualMarks.studentList.map((item,key)=> {
                                return (
                                    <div key={key} style={{"fontSize":"11px"}}>
                                        <span>{item} - </span>
                                        <span>{this.state.individualMarks.individualMarks[key]} Marks</span>
                                    </div>
                                )
                            })}
                            {!this.state.loading3 && !this.state.existing && (<p>Marks are not submitted yet</p>)}
                            {/* <Button onClick={()=>this.openModal()}>View Marks</Button> */}
                        </td>
                    </tr>
                )}

                {/* <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Individual marks</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                                {!this.state.loading3 && this.state.existing && this.state.individualMarks.studentList.length>0 && this.state.individualMarks.studentList.map((item,key)=> {
                                    return (
                                        <div key={key}>
                                            <span>{item} - </span>
                                            <span>{this.state.individualMarks.individualMarks[key]}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </ModalBody>
                </Modal> */}
            </React.Fragment>

        );
    }
}

export default BiweekData;