import React, { Component } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Row, Col } from 'reactstrap'
import '../../css/shared/index.scss';

const backendURI = require('../shared/BackendURI');

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { MessageList: {} };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            image: '',
            jobDescription: '',
            educationalQualifications: '',


        });
        console.log(this.props.id);
        axios.get(backendURI.url + '/indexInfo/' + this.props.id)
            .then(res => {
                console.log(res);
                this.setState({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    image: res.data.imageName,
                    mobile: res.data.mobile,
                    jobDescription: res.data.jobDescription,
                    educationalQualifications: res.data.educationalQualifications,
                })
                console.log(res.data);
            })

    };

    render() {
        return (
            <div >
                <a onClick={this.toggle} >
                    <span style={{ cursor: "pointer", color: "rgb(16, 141, 212)" }}>{this.props.name}</span>
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="index-data">
                        <span className="text-name">
                            {this.state.firstName} {this.state.lastName}<br />
                        </span>
                    </ModalHeader>
                    <ModalBody >
                        <div className="container supervisor-data">

                            <img src={("http://localhost:4000/users/profileImage/" + this.state.image)} className="sup-image"></img><br />


                            <p className="name">{this.state.firstName} {this.state.lastName}</p>

                            <div>
                                <p className="details">{this.state.mobile}</p>
                                <p className="details">{this.state.email}</p>
                            </div>
                            <div style={{marginTop: "20px"}}>
                                <p className="details">{this.state.jobDescription}</p>
                                <p className="details" style={{marginTop: "20px"}}>{this.state.educationalQualifications}</p>
                            </div>


                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}