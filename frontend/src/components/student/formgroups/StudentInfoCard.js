import React, {Component} from 'react';
import axios from 'axios';
import {getFromStorage} from "../../../utils/Storage";
import { Card, Col} from 'react-bootstrap';
import "../../../css/students/formgroups/StudentInfoCard.scss"
import Icon from '@material-ui/core/Icon';
import { IoIosAddCircleOutline } from 'react-icons/io';

const backendURI = require('../../shared/BackendURI');

class StudentInfoCard extends Component {

    constructor(props) {
        super(props);
        this.state= {
            index: this.props.index,
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
            <Col md={6} lg={6} className="student-card-css">
                <Card className="student-info-card">
                    <Card.Body className="card-body">
                        <span>{this.state.index} </span>
                        <span className="span-item">{this.state.name}  </span>
                        <span className="span-item">{this.state.reg} </span>
                        <span className="icon-span" onClick={()=>this.props.selectStudent(this.state.index)}><IoIosAddCircleOutline/></span>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default StudentInfoCard;