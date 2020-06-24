import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import { ProgressBar , Row, Col } from 'react-bootstrap';
import axios from "axios";
import "../../../css/students/progress/IndividualTotalProgress.scss"

const backendURI = require('../../shared/BackendURI');

class IndividualTotalProgress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            member: this.props.member,
            groupId: this.props.groupId,
            progress: 0
        }
    }

    componentDidMount() {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        let progress =   0;
        axios.post(backendURI.url+'/progress/getstudenttotalprogress/'+this.state.member,{groupId:this.state.groupId},{headers:headers}).then(res=>{
            // console.log(this.state.member)
            let totalProgress = parseFloat(res.data)
            console.log(totalProgress)
            this.setState({
                progress: Math.round(totalProgress * 10) / 10
            })
        })
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
                {this.state.name} ({this.state.index})
                <Row>
                    <Col lg={9} md={9} sm={12} xs={12} className="progressbar-col"><ProgressBar variant="dark" now={this.state.progress} /></Col>
                    <Col lg={3} md={3} sm={12} xs={12} ><span className="progress-value-span">{this.state.progress} %</span></Col>
                </Row>

            </div>
        );
    }
}

export default IndividualTotalProgress;