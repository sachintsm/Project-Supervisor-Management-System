import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import { ProgressBar , Row, Col, Spinner } from 'react-bootstrap';
import axios from "axios";
import "../../../css/students/progress/IndividualTotalProgress.scss"

const backendURI = require('../../shared/BackendURI');

class IndividualTotalProgress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            member: this.props.member,
            groupId: this.props.groupId,
            totalProgress: this.props.totalProgress,
            progress: 0,
            parentComponent: this.props.parentComponent,
            taskDetails: this.props.taskDetails,
            loading: true
        }
    }

    componentDidMount() {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        let progress =   0;

        if(this.state.parentComponent==="totalProgress"){
            axios.post(backendURI.url+'/progress/getstudenttotalprogress/'+this.state.member,{groupId:this.state.groupId},{headers:headers}).then(res=>{
                let studentProgress = parseFloat(res.data)
                    studentProgress = studentProgress*100/this.state.totalProgress

                this.setState({
                    progress: Math.round(studentProgress * 1) / 1,
                    loading: false
                })
            })
        }
        if(this.state.parentComponent==="taskprogress"){
            axios.post(backendURI.url+'/progress/getstudenttaskprogress/'+this.state.member,{taskId:this.state.taskDetails._id},{headers:headers}).then(res=>{
                let studentProgress = parseFloat(res.data)
                if(studentProgress==0){

                }
                else{
                    studentProgress = studentProgress*100/this.state.taskDetails.totalProgress
                }
                this.setState({
                    progress: Math.round(studentProgress * 1) / 1,
                    loading: false
                })
            })
        }

        axios.get(backendURI.url + '/users/studentList/' + this.state.member, { headers: headers })
            .then(res => {
                    if (res.data.data) {
                        const _id = res.data.data._id
                        const name = res.data.data.firstName + " " + res.data.data.lastName
                        const index = res.data.data.indexNumber
                        const reg = res.data.data.regNumber


                        this.setState({
                            userId: _id,
                            name: name,
                            index: index,
                        })
                }
            })
    }

    render() {
        return (
            <div className="individual-total-progress">
                {/*{this.state.loading && <div className="spinner-div"><Spinner animation="border" className="spinner"/></div>}*/}
                <div>
                    {this.state.name} ({this.state.index})
                    <Row>
                        <Col lg={9} md={9} sm={12} xs={12} className="progressbar-col"><ProgressBar variant="dark" now={this.state.progress} /></Col>
                        <Col lg={3} md={3} sm={12} xs={12} ><span className="progress-value-span">{this.state.progress} %</span></Col>
                    </Row>
                </div>


            </div>
        );
    }
}

export default IndividualTotalProgress;