import React, {Component} from 'react';
import axios from 'axios';
import {getFromStorage} from "../../../utils/Storage";
import { Card, Col} from 'react-bootstrap';
import "../../../css/students/formgroups/StudentInfoCard2.scss"
import Icon from '@material-ui/core/Icon';
import { RiDeleteBin2Line } from 'react-icons/ri';

const backendURI = require('../../shared/BackendURI');

class StudentInfoCard extends Component {

    constructor(props) {
        super(props);
        this.state= {
            index: this.props.index,
            type: this.props.type
        }
    }

    componentDidMount() {
        this.getStudentName()
    }

    getStudentName = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/users/studentList/'+this.state.index,{headers: headers}).then(res=>{
            let data = res.data.data
            let name = data.firstName+" "+data.lastName
            this.setState({
                name: name,
                reg: data.regNumber.toUpperCase()
            })
        })
    }

    render() {
        return (
            <Col md={3} lg={3} className="student-card-2-css">
                {this.state.type==="accepted" && (
                    <Card className="student-info-card-accepted">
                        <Card.Body className="card-body">
                            <span>{this.state.index} </span>
                            <span className="span-text">(Accepted) </span>
                            <span className="icon-span" onClick={()=>this.props.selectStudent(this.state.index)}><RiDeleteBin2Line/></span>
                        </Card.Body>
                    </Card>
                )}
                {this.state.type==="declined" && (
                    <Card className="student-info-card-declined">
                        <Card.Body className="card-body">
                            <span>{this.state.index} </span>
                            <span className="span-text">(Declined) </span>
                            <span className="icon-span" onClick={()=>this.props.selectStudent(this.state.index)}><RiDeleteBin2Line/></span>
                        </Card.Body>
                    </Card>
                )}
                {this.state.type==="pending" && (
                    <Card className="student-info-card-pending">
                        <Card.Body className="card-body">
                            <span>{this.state.index} </span>
                            <span className="span-text">(Pending) </span>
                            <span className="icon-span" onClick={()=>this.props.selectStudent(this.state.index)}><RiDeleteBin2Line/></span>
                        </Card.Body>
                    </Card>
                )}
                {this.state.type==="normal" && (
                    <Card className="student-info-card">
                        <Card.Body className="card-body">
                            <span>{this.state.index} </span>
                            <span className="icon-span" onClick={()=>this.props.selectStudent(this.state.index)}><RiDeleteBin2Line/></span>
                        </Card.Body>
                    </Card>
                )}
            </Col>
        );
    }
}

export default StudentInfoCard;