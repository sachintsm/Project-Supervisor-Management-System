import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/admin/Registration.scss";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "./Navbar";
import { getFromStorage } from '../../utils/Storage';
import Footer from './Footer';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Snackpop from "./Snackpop";
import { Link } from 'react-router-dom'
import axios from 'axios'
import NavbarGuest from './NavbarGuest';

const backendURI = require('./BackendURI');

export default class CustomRegistration extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);

    this.state = {
      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',
      form: {
        firstName: '',
        lastName: '',
        userType: '',
        email: '',
        nic: '',
        mobileNumber: '',
        educationalQualifications: '',
        jobDescription: '',

      },

      //!decalaring error state variables
      firstNameError: '',
      lastNameError: '',
      userTypeError: '',
      emailError: '',
      nicError: '',
      mobileNumberError: '',
      educationalQualificationsError: '',
      jobDescriptionError: '',

    };
  }

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  onChange = (e) => {
    e.persist = () => { };
    let store = this.state;
    store.form[e.target.name] = e.target.value;
    this.setState(store);
  };

  //? image file onchange 
  handleImageChange = (e) => {
    const Val = e.target.files[0]
    this.setState({
      imgName: Val.name
    })
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        file: Val
      }
    }))
  }

  //? validation function
  validate = () => {
    let isError = false;
    const errors = {
      firstNameError: '',
      lastNameError: '',
      userTypeError: '',
      emailError: '',
      nicError: '',
      mobileNumberError: '',
      educationalQualificationsError: '',
      jobDescriptionError: '',

    };

    if (this.state.form.firstName.length < 1) {
      isError = true;
      errors.firstNameError = 'First name required *'
    }
    if (this.state.form.lastName.length < 1) {
      isError = true;
      errors.lastNameError = 'Last name required *'
    }
    if (this.state.form.email.indexOf('@') === -1) {
      isError = true;
      errors.emailError = 'Invalied email address!'
    }

    if (this.state.form.nic.length === 0 || this.state.form.nic.length > 12) {
      isError = true;
      errors.nicError = 'Invalid NIC number!'
    }
    if (this.state.form.mobileNumber.length !== 10) {
      isError = true;
      errors.mobileNumberError = 'Invalied mobile number!'
    }
    if (this.state.form.educationalQualifications.length < 1) {
      isError = true;
      errors.educationalQualificationsError = 'Educational qualifications required *'
    }
    if (this.state.form.jobDescription.length < 1) {
      isError = true;
      errors.jobDescriptionError = 'Job description is required *'
    }


    this.setState({
      ...this.state,
      ...errors
    })
    return isError;  //! is not error return state 'false'
  }

  onSubmit(e) {
    e.preventDefault();
    const err = this.validate();  //?calling validation function
    
    if (!err) {
      this.setState({
        firstNameError: '',
        lastNameError: '',
        emailError: '',
        nicError: '',
        mobileNumberError: '',
        educationalQualificationsError: '',
        jobDescriptionError: '',
      })
      
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              
              const formData = new FormData();

              formData.append('profileImage', this.state.form.file);
              formData.append('firstName', this.state.form.firstName);
              formData.append('lastName', this.state.form.lastName);
              formData.append('password', this.state.form.nic);
              formData.append('nic', this.state.form.nic);
              formData.append('email', this.state.form.email);
              formData.append('mobileNumber', this.state.form.mobileNumber);
              formData.append('educationalQualifications', this.state.form.educationalQualifications);
              formData.append('jobDescription', this.state.form.jobDescription);
              var myHeaders = new Headers();

              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formData,
                redirect: 'follow'
              };

              fetch(backendURI.url + "/users/customregistration", requestOptions)
                .then((res) => res.json())
                .then((json) => {
                  if (json.state === true) {
                    this.setState({
                      snackbaropen: true,
                      snackbarmsg: json.msg,
                      snackbarcolor: 'success',
                    })
                    window.location.reload();
                  }
                  else {
                    this.setState({
                      snackbaropen: true,
                      snackbarmsg: json.msg,
                      snackbarcolor: 'error',
                    })
                  }
                })
                .catch(error => {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: error,
                    snackbarcolor: 'error',
                  })
                  console.log('error', error)
                });
            }
          },
          {
            label: 'No',
            onClick: () => {

            }
          }
        ]
      })
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////


  render() {

    const { form} = this.state;

    return (
      <div>
        <NavbarGuest />
        <div className="container-fluid ">

          <Snackpop
            msg={this.state.snackbarmsg}
            color={this.state.snackbarcolor}
            time={3000}
            status={this.state.snackbaropen}
            closeAlert={this.closeAlert}
          />
          <Col md="12" xs="12" className="main-div">
            <div>
              <div className="container">
                <p className="reg-head">User Registration</p>
                <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>
                </div>
                <div className="container">
                  <form onSubmit={this.onSubmit}>
                    <Row style={{ marginTop: "20px" }}>
                      <Col md={6} xs="12">
                        <div className="form-group">
                          <label className="text-label">First Name: </label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={form.firstName}
                            onChange={this.onChange}
                            errortext={form.firstNameError}
                          ></input>
                          <p className="reg-error">{this.state.firstNameError}</p>
                        </div>
                      </Col>
                      <Col md={6} xs="12">
                        <div className="form-group">
                          <label className="text-label">Last Name : </label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={form.lastName}

                            onChange={this.onChange}
                          ></input>
                          <p className="reg-error">{this.state.lastNameError}</p>

                        </div>
                      </Col>
                    </Row>


                    <div className="form-group">
                      <label className="text-label">Choose Profile Image : </label>
                    </div>
                    <Row className="input-div">
                      <Col>
                        {/* File input */}
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text"> Upload </span>
                          </div>
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input"
                              id="inputGroupFile01"
                              onChange={this.handleImageChange}
                            />
                            <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgName}</label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row style={{ marginTop: "20px" }} >
                      <Col md={4} xs="12">
                        <div className="form-group">
                          <label className="text-label">E-mail : </label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            value={form.email}
                            onChange={this.onChange}
                          ></input>
                          <p className="reg-error">{this.state.emailError}</p>

                        </div>
                      </Col>
                      <Col md={4} xs="12">
                        <div className="form-group">
                          <label className="text-label">NIC Number : </label>
                          <input
                            type="text"
                            className="form-control"
                            name="nic"
                            value={form.nic}
                            onChange={this.onChange}
                          ></input>
                          <p className="reg-error">{this.state.nicError}</p>

                        </div>
                      </Col>
                      <Col md={4} xs="12">
                        <div className="form-group">
                          <label className="text-label">Mobile Number : </label>
                          <input type="number" className="form-control" name="mobileNumber" onChange={this.onChange}
                            value={form.mobileNumber}
                          ></input>
                          <p className="reg-error">{this.state.mobileNumberError}</p>

                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12} xs="12">
                        <div className="form-group">
                          <label className="text-label">Educational Qualifications : </label>
                          <textarea
                            type="text"
                            className="form-control"
                            value={form.jobdescription}
                            onChange={this.onChange}
                            name="educationalQualifications"
                          ></textarea>
                          <p className="reg-error">{this.state.educationalQualificationsError}</p>

                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12} xs="18">
                        <div className="form-group">
                          <label className="text-label">Job Description : </label>
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Write a description about your career"
                            value={form.jobdescription}
                            onChange={this.onChange}
                            name="jobDescription"
                          ></textarea>
                          <p className="reg-error">{this.state.jobDescriptionError}</p>
                        </div>
                      </Col>
                    </Row>

                    <div className="form-group">
                      <button
                        className="btn btn-info my-4 " style={{ width: "100%" }}
                        type="submit"
                      >Register Now </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </Col>
        </div>
        <Footer />
      </div>
    )
  }
}