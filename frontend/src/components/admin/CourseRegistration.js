import React, { Component } from 'react';
import { Row, Col } from 'reactstrap'
import Navbar from '../shared/Navbar'
import Snackpop from "../shared/Snackpop"
import Footer from "../shared/Footer"
import '../../css/admin/CourseRegistration.scss'


class CourseRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

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
                        <p className="reg-head">User Registration</p>
                    </div>

                </div>
                <Footer />

            </div>
        );
    }
}

export default CourseRegistration;