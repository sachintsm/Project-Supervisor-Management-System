import React, { Component } from 'react';
import axios from 'axios';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
    Input,
    Label,
    Button,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { Row, Col } from "reactstrap";
import Snackpop from "../shared/Snackpop";

const backendURI = require("./BackendURI");

export default class Contactus extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            firstName: "",
            lastName: "",
            contactNumber: "",
            email: "",
            message: "",

            firstNameError: '',
            lastNameError: '',
            contactNumberError: '',
            emailError: '',
            messageError: '',
        };
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    validate = () => {
        let isError = false;
        const errors = {
            firstNameError: '',
            lastNameError: '',
            contactNumberError: '',
            emailError: '',
            messageError: ''
        };

        if (this.state.firstName.length < 1) {
            isError = true;
            errors.firstNameError = 'First name required *'
        }
        if (this.state.lastName.length < 1) {
            isError = true;
            errors.lastNameError = 'Last name required *'
        }
        if (this.state.email.indexOf('@') === -1) {
            isError = true;
            errors.emailError = 'Invalied email address!'
        }

        if (this.state.contactNumber.length === 0 || this.state.contactNumber.length > 10) {
            isError = true;
            errors.contactNumberError = 'Invalid Contact Number!'
        }
        if (this.state.message.length < 1) {
            isError = true;
            errors.messageError = 'Message required *'
        }

        this.setState({
            ...this.state,
            ...errors
        })
        return isError;  //! is not error return state 'false'
    }


    onSubmit(e) {
        e.preventDefault()
        const err = this.validate();  //?calling validation function

        if (!err) {
            this.setState({
                firstNameError: '',
                lastNameError: '',
                contactNumberError: '',
                emailError: '',
                messageError: ''
            })
            const date = new Date();


            const obj = {
                date: date,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                contactNumber: this.state.contactNumber,
                email: this.state.email,
                message: this.state.message
            };
            console.log("abcd");
            console.log(obj);
            axios.post(backendURI.url + "/contactUs/add", obj)
                .then((res) => {
                    console.log(res.data.state)
                    if (res.data.state === true) {
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg: res.data.msg,
                            snackbarcolor: 'success',
                        })
                    }
                    else {
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg: res.data.msg,
                            snackbarcolor: 'error',
                        })
                    }
                    console.log(res.data);
                })
                .catch((error) => {
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg: error,
                        snackbarcolor: 'error',
                    })
                    console.log(error);
                });
            this.setState({
                modal: false
            })
        }

    }

    render() {
        return (
            <div>
                <Snackpop
                    msg={this.state.snackbarmsg}
                    color={this.state.snackbarcolor}
                    time={3000}
                    status={this.state.snackbaropen}
                    closeAlert={this.closeAlert}
                />

                <label onClick={this.toggle} style={{cursor: 'pointer'}}>
                    &nbsp;Contact Admin
                </label>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Send your Message</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            
                            <div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                                <form onSubmit={this.onSubmit}>

                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label className="text-label">First Name: </label>
                                                <input type="text" className="form-control" name="firstName" onChange={this.onChange} />
                                                <p className="reg-error">{this.state.firstNameError}</p>

                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label className="text-label">Last Name : </label>
                                                <input type="text" className="form-control" name="lastName" onChange={this.onChange} />
                                                <p className="reg-error">{this.state.lastNameError}</p>

                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="form-group">
                                        <Label for="avatar">Contact Number</Label>
                                        <Input type="number" className="form-control" name="contactNumber" onChange={this.onChange} />
                                        <p className="reg-error">{this.state.contactNumberError}</p>

                                    </div>
                                    <div className="form-group">
                                        <Label for="avatar">Email</Label>
                                        <Input type="text" className="form-control" name="email" onChange={this.onChange} />
                                        <p className="reg-error">{this.state.emailError}</p>

                                    </div>
                                    <div className="form-group">
                                        <Label for="avatar">Message</Label>
                                        <Input type="textarea" className="form-control" name="message" onChange={this.onChange} />
                                        <p className="reg-error">{this.state.messageError}</p>

                                    </div>
                                    <div className="form-group">
                                        <Button className="btn btn-info my-4" type="submit" block>Send</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

