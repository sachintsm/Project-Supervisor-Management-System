import React, { Component } from "react";
import { verifyAuth } from "../../../utils/Authentication";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { getFromStorage } from '../../../utils/Storage';
import Snackpop from "../../shared/Snackpop";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Table} from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { Row, Col } from 'reactstrap';
import ConfirmMeetings from "./ConfirmMeetings";

const backendURI = require('../../shared/BackendURI');

const Meet = React.memo(props => (
    <tr>
        <td className="table-body">{props.meet.groupId}</td>
        <td className="table-body">{props.meet.purpose}</td>

        <td className="table-body" style={{width:"10%"}}>
            <ConfirmMeetings data={props.meet._id} />
        </td>
    </tr>
));

const MeetConfirmed = React.memo(props => (
    <tr>
        <td className="table-body">{props.meetconfirmed.groupId}</td>
        <td className="table-body">{props.meetconfirmed.purpose}</td>
        <td className="table-body">{props.meetconfirmed.date}</td>
        <td className="table-body">{props.meetconfirmed.time}</td>
    </tr>
));

class ViewMeetings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // snackbaropen: false,
            // snackbarmsg: '',
            // snackbarcolor: '',

            // authState: '',
            // snackbaropen: false,
            // snackbarmsg: '',
            groupId: this.props.match.params.id,
            purpose: "",
            time: "",
            supervisor: "",
            super: "",
            supervisorN: [],
            superOptionList: [],
            selectValue: "",

            meetings: [],
        }


    }

    componentDidMount = async () => {

        const authState = await verifyAuth();

        this.setState({
            authState: authState,
            groupDataBlock: [],
            finalBlock: []
        });
        if (!authState) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        const userId = getFromStorage('auth-id').id
        this.setState({
            userId: userId,
        })


        console.log(this.state.userId);


        await axios.get(backendURI.url + '/requestMeeting/getsupervisor/' + this.state.userId)
            .then(response => {
                this.setState({ meetings: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            })

        console.log(this.state.meetings);



    }

    MeetList() {


        return this.state.meetings.map((currentMeet, i) => {
            if (currentMeet.state === "pending" ) {
            return <Meet confirm={this.confirm} meet={currentMeet} key={i} />;
            }
            else return null
        })

    }

    MeetList2() {


        return this.state.meetings.map((currentMeetConfirmed, i) => {
            if (currentMeetConfirmed.state === "confirmed" ) {
            return <MeetConfirmed confirm={this.confirm} meetconfirmed={currentMeetConfirmed} key={i} />;
            }
            else return null
        })

    }

    render() {
        return (
            <React.Fragment >
                <Navbar panel={"supervisor"} />
                <div className="container-fluid">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    {/* ************************************************************************************************************************************************************************** */}

                    <div className="row">
                        {/* <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                            <Sidebar />
                        </div> */}
                        <div className="col-md-12" style={{ minHeight: "1000px" }}>
                            <div className="container">

                                <Tabs defaultActiveKey="request" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

                                    <Tab eventKey="request" title="Meeting Requests" className="tit">
                                        <div className="row" style={{ marginTop: "20px" }}>

                                            <div className="card">
                                                <div>
                                                    <h3 className="sp_head">Meeting Requests</h3>

                                                    <div className="container">
                                                        <div className=" vu-table">

                                                            <Table hover className="vu-table-hover" >
                                                                <thead>
                                                                    <tr>
                                                                        <th className="table-head">Group</th>
                                                                        <th className="table-head">Purpose</th>
                                                                        <th className="table-head" style={{textAlign:"center"}}>Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.MeetList()}

                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Tab>

                                    <Tab eventKey="confirm" title="Confirmed Meetings">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="card">
                                                <div>
                                                    <h3 className="sp_head">Confirmed Meetings</h3>

                                                    <div className="container">
                                                        <div className=" vu-table">
                                                            <Table hover className="vu-table-hover" >
                                                                <thead>
                                                                    <tr>
                                                                        <th>Group</th>
                                                                        <th>Purpose</th>
                                                                        <th>Date</th>
                                                                        <th>Time</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {this.MeetList2()}

                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Tab>
                                    <Tab eventKey="urgent" title="Urgent Meetings">
                                        <div className="row" style={{ marginTop: "20px" }}>
                                            <div className="card">
                                                <div>
                                                    <h3 className="sp_head">Urgent Meetings</h3>

                                                    <div className="container">
                                                        <div className=" vu-table">
                                                            <Table hover className="vu-table-hover" >
                                                                <thead>
                                                                    <tr>
                                                                        <th>Group</th>
                                                                        <th>Purpose</th>
                                                                        <th>Date</th>
                                                                        <th>Time</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/* {this.UserList2()} */}

                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment >
        )
    }
}

export default ViewMeetings;
