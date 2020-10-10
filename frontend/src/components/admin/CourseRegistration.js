import React, { Component } from 'react';
import Navbar from '../shared/Navbar'
import Snackpop from "../shared/Snackpop"
import Footer from "../shared/Footer"
import '../../css/admin/CourseRegistration.scss'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import axios from 'axios';
import { getFromStorage } from "../../utils/Storage";
import CloseIcon from '@material-ui/icons/Close';

const backendURI = require('../shared/BackendURI');

class CourseRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            courseName: '',
            courseCode: '',

            courseNameError: '',
            courseCodeError: '',

            courses: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    componentDidMount() {
        axios.get(backendURI.url + '/courseTypes/get')
            .then(res => {
                this.setState({ courses: res.data.data })
            })
    }

    onChange(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    onSubmit(e) {
        e.preventDefault();

        const err = this.validate();  //?calling validation function


        if (!err) {
            this.setState({
                courseCodeError: '',
                courseNameError: '',
            })

            const data = {
                courseCode: this.state.courseCode,
                courseName: this.state.courseName
            }
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            const headers = {
                                'auth-token': getFromStorage('auth-token').token,
                            }

                            axios.post(backendURI.url + '/courseTypes/add', data, { headers: headers })
                                .then(res => {

                                    if (res.data.state === true) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'success',
                                        })
                                        window.location.reload();
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error',
                                        })
                                    }
                                })
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

    validate = () => {
        let isError = false;
        const errors = {
            courseName: '',
            courseCode: '',
        }

        if (this.state.courseName.length < 1) {
            isError = true;
            errors.courseNameError = 'Course name required *'
        }
        if (this.state.courseCode.length < 1) {
            isError = true;
            errors.courseCodeError = 'Course code required *'
        }

        this.setState({
            ...this.state,
            ...errors
        })

        return isError;  //! is not error return state 'false'
    }

    deleteCourse = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const headers = {
                            'auth-token': getFromStorage('auth-token').token,
                        }

                        await axios.delete(backendURI.url + '/courseTypes/' + id, { headers: headers })
                            .then(res => {

                                if (res.data.state === true) {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'success',
                                    })
                                    window.location.reload();
                                }
                                else {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'error',
                                    })
                                }
                            })
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

    render() {
        return (
            <div>
                <Navbar panel={"admin"} />
                <div className="container-fluid ">

                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                    <div className="container course-registration">
                        <p className="reg-head">Course Registration</p>

                        <div className="card cr-card">
                            <div className="container cr-content" style={{ marginTop: "20px", marginBottom: "10px" }} >
                                <div className="container">
                                    <label className="text-label-cr">Course Name (i.e. : Computer Science)</label>
                                    <input className="form-control" type="text" onChange={this.onChange} name="courseName"></input>
                                    <p className="reg-error">{this.state.courseNameError}</p>

                                    <label className="text-label-cr">Course Code (i.e. : CS)</label>
                                    <input className="form-control" type="text" onChange={this.onChange} name="courseCode"></input>
                                    <p className="reg-error">{this.state.courseCodeError}</p>

                                    <button className="form-control btn btn-info my-4" type="submit" onClick={this.onSubmit}>Register</button>
                                </div>
                            </div>
                            <div className="container cr-content" style={{ marginBottom: "20px" }}>
                                <div className="container">
                                    {this.state.courses.map((data) => {
                                        return (
                                            <span className="course-name-div" key={data._id} >
                                                <label className="course-name" style={{ marginTop: "-15px" }}> &nbsp;{data.courseName} &nbsp;</label>
                                                <span className="course-name-close">
                                                    &nbsp;<CloseIcon style={{ fontSize: "15px", marginTop: "-5px" }} onClick={() => this.deleteCourse(data._id)} />&nbsp;
                                                </span>
                                            </span>
                                        )
                                    })}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <Footer />

            </div>
        );
    }
}

export default CourseRegistration;