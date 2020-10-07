import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import StudentCard from "../../shared/StudentCard";
import SupervisorName from "./SupervisorName";

const backendURI = require('../../shared/BackendURI');

class BiweekRequest extends Component {

    constructor(props) {
        super(props);
        this.state={
            request: this.props.details,
            loading1: true,
            loading2: true,
            userId: getFromStorage('auth-id').id
        }
    }

    componentDidMount() {
        this.getGroupDetails()
        this.getProjectDetails()
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

    render() {

        let status = this.state.request.supervisors.map((item, index) => {

            if(item!==this.state.userId){
                return(
                    <div key={index}>
                        {this.state.request.status[index]==="Accepted" && <div className="mb-1" ><SupervisorName id={item}/> <span style={{color:"limegreen", border: "1.8px solid limegreen",padding:"0px 4px",borderRadius:"8px", fontSize: "13px"}} >{this.state.request.status[index]}</span> </div>}
                        {this.state.request.status[index]==="Declined" && <div className="mb-1"><SupervisorName id={item}/> <span style={{color:"#DC3545", border: "1.8px solid #DC3545",padding:"0px 4px",borderRadius:"8px", fontSize: "13px"}} >{this.state.request.status[index]}</span> </div>}
                        {this.state.request.status[index]==="Pending" && <div className="mb-1"><SupervisorName id={item}/> <span style={{color:"grey", border: "1.8px solid grey",padding:"0px 4px",borderRadius:"8px", fontSize: "13px"}}  >{this.state.request.status[index]}</span> </div>}

                    </div>
                )
            }
            else{
                return(null)
            }
        })


            return (
            <div>
                {!this.state.loading1 && !this.state.loading2 && (
                    <div>
                        <div className="mb-1">Project : {this.state.projectDetails.projectYear} - {this.state.projectDetails.projectType} - {this.state.projectDetails.academicYear}</div>
                        <div className="mb-1">Group : {this.state.groupDetails.groupName} ( G{this.state.groupDetails.groupId} )</div>
                        <div className="mb-1">Group Members : {this.state.groupDetails.groupMembers.map(index=>{
                            return <span  key={index}><StudentCard index={index}/> ,</span>
                        })}</div>
                        <div className="mb-1">Attachment : </div>
                        <div className="mb-1" style={{fontWeight:"bold"}}>Other Supervisor Approvals</div>
                        {status}
                    </div>
                )}
            </div>
        );
    }
}

export default BiweekRequest;