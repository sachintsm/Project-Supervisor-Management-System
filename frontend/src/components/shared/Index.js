import React, { Component } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Row, Col } from 'reactstrap'
import '../../css/shared/index.scss';

const backendURI = require("./BackendURI");

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
            regNumber: '',
            email: '',
            mobile: '',
            image: '',
            index: ''

        });

        axios.get(backendURI.url + '/indexInfo/' + this.props.id)
            .then(res => {
                this.setState({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    regNumber: res.data.regNumber,
                    email: res.data.email,
                    image: res.data.imageName,
                    index: res.data.indexNumber,
                    mobile: res.data.mobile,
                    cat: res.data.regNumber.substring(5, 7).toUpperCase(),
                })
                console.log(res.data);
            })

    };

    render() {
        return (
            <div >
                <a onClick={this.toggle} >
                    <span style={{ cursor: "pointer", color: "rgb(16, 141, 212)" }}>{this.props.index}</span>
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} className="index-data">
                        <span className="text-name">
                            {this.state.firstName} {this.state.lastName}<br />
                        </span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="container index-data">
                            <Row className="data-div">
                                <Col md={4}>
                                    <img src={("http://localhost:4000/users/profileImage/" + this.state.image)} className="image"></img><br />
                                </Col>
                                <Col md={8} >

                                    <span className="text">
                                        <Row>

                                            <Col md={4}>
                                                Course &nbsp;&nbsp;:
                                            </Col>
                                            <Col md={8}>
                                                <span className="text-cont">
                                                    {this.state.cat}
                                                </span>
                                            </Col>
                                        </Row>
                                    </span>
                                    <span className="text">
                                        <Row>

                                            <Col md={4}>
                                                Reg No&nbsp; :
                                            </Col>
                                            <Col md={8}>
                                                <span className="text-cont">
                                                    {this.state.regNumber}
                                                </span>
                                            </Col>
                                        </Row>

                                    </span>

                                    <span className="text">
                                        <Row>
                                            <Col md={4}>
                                                Index &nbsp;&nbsp;&nbsp;&nbsp;:
                                            </Col>
                                            <Col md={8}>
                                                <span className="text-cont">
                                                    {this.state.index}
                                                </span>
                                            </Col>
                                        </Row>
                                    </span>
                                    <span className="text">
                                        <Row>
                                            <Col md={4}>
                                                Email &nbsp;&nbsp;&nbsp;&nbsp;:
                                            </Col>
                                            <Col md={8}>
                                                <span className="text-cont">

                                                    {this.state.email}</span>
                                            </Col>
                                        </Row>
                                    </span>

                                    <span className="text">
                                        <Row>
                                            <Col md={4}>
                                                Mobile &nbsp;:
                                            </Col>
                                            <Col md={8}>
                                                <span className="text-cont">

                                                    {this.state.mobile}</span>
                                            </Col>
                                        </Row>
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}