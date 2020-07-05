

import React, { Component } from "react";
// import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../../shared/Navbar";
// import '../../css/supervisor/SupervisorHome.css'
import Footer from "../../shared/Footer";
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
// import { getFromStorage } from '../../utils/Storage';
// import Snackpop from "../shared/Snackpop";
// import { Row, Col } from 'reactstrap';
// import { Spinner } from 'react-bootstrap'
// import GroupList from "./GroupList";
// const backendURI = require('../shared/BackendURI');


class ViewMeetings extends Component {

    constructor(props) {
        super(props);


    }

    componentDidMount = async () => {


    }
    render() {





        return (
            <div className="sh-fullpage">
                <Navbar panel={"supervisor"} />
                <div className="container">
                    {/* <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    /> */}

                    <div className="container">

                        <h1>ViewMeetings</h1>




                    </div>

                </div>
                <Footer />
            </div>
        );
    }
}

export default ViewMeetings;
