import React, {Component} from 'react';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import axios from 'axios';
import { Row, Col, Card,Spinner, Container, Button } from 'react-bootstrap';
import {getFromStorage} from "../../../utils/Storage";
import "../../../css/students/formgroups/FormGroups.scss"

const backendURI = require('../../shared/BackendURI');

class FormGroups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: this.props.match.params.projectId,
            projectDetails: null,
            loading: true
        }
    }

    componentDidMount() {
        this.getProjectDetails()
    }

    getProjectDetails = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/projects/getProject/'+this.state.projectId,{headers: headers}).then(res=>{
            this.setState({
                projectDetails: res.data.data,
                loading: false
            })
        })
    }

    render() {
        console.log(this.state.projectDetails)
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid form-groups-css">
                    <Container>
                        <div className="project-detail-card-body">
                            <Card className="project-detail-card">
                                {!this.state.loading && (
                                    <Card.Body className="card-body">
                                        <div className="title">
                                            <h3>Project Details</h3>
                                        </div>
                                        <div>Project Year: {this.state.projectDetails.projectYear}</div>
                                        <div>Project Type: {this.state.projectDetails.projectType}</div>
                                        <div>Academic Year: {this.state.projectDetails.academicYear}</div>
                                    </Card.Body>
                                )}
                            </Card>
                        </div>
                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default FormGroups;