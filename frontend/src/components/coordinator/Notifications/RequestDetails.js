import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import StudentCard from "../../shared/StudentCard";


const backendURI = require('../../shared/BackendURI');

class RequestDetails extends Component {

    constructor(props) {
        super(props);
        this.state={
            request: this.props.item,
            loading: true
        }
    }

   //Get teh details of a project 
    componentDidMount() {
        this.getProjectDetails()
    }

    getProjectDetails = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/projects/getproject/'+this.state.request.projectId,{headers: headers}).then(res=>{
            this.setState({
                projectDetails: res.data.data,
                loading:false
            })
        })
    }

    render() {
        return (
            <div>
                {!this.state.loading && (
                    <div>
                        <div className="mb-1">Project Year: {this.state.projectDetails.projectYear}</div>
                        <div className="mb-1">Project Type: {this.state.projectDetails.projectType}</div>
                        <div className="mb-1">Academic Year: {this.state.projectDetails.academicYear}</div>
                        <div>Student List: {this.state.request.allStudentList.map(index=>{
                            return <span  key={index}><StudentCard index={index}/> ,</span>
                        })}</div>
                    </div>
                )}
            </div>
        );
    }
}

export default RequestDetails;