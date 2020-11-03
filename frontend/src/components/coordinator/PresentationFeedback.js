import React, { Component } from 'react';
import '../../css/coordinator/PresentationFeedback.scss';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";
import { Row, Col } from "reactstrap";
import { getFromStorage } from '../../utils/Storage';
import Footer from '../shared/Footer'
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../shared/Snackpop";
import 'react-confirm-alert/src/react-confirm-alert.css'

const backendURI = require('../shared/BackendURI');

class UserBlock {
    constructor(userId, userName, feedback) {
        this.userId = userId;
        this.userName = userName;
        this.feedback = feedback;
    }
}

class PresentationFeedbackBlock {
    constructor(groupId, groupNumber, feedbacks) {
        this.groupId = groupId;
        this.groupNumber = groupNumber
        this.feedbacks = feedbacks
    }
}

class PresentationFeedback extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectId: '',
            presenationType: '',

            activeProjects: [],
            groupData: [],
            groupDataBlock: [],
            supervisorsNames: [],

            allFeedback: [],

            dataDiv: false,
            spinnerDiv: false,

            userBlock: [],
            finalBlock: [],

        }
        this.searchGroups = this.searchGroups.bind(this);
    }

    async componentDidMount() {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const coId = JSON.parse(localStorage.getItem("auth-id"))

        //? load all the active project names from
        axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
            .then((res => {
                this.setState({
                    activeProjects: res.data.data
                })
            }))
    }

    //? select project drop down change
    handleDropdownChange = (e) => {
        const val = e.target.value
        this.setState({
            projectId: val
        })
    }

    handleDropdownPresentationChange = (e) => {
        const val = e.target.value
        console.log(e.target.value);
        this.setState({
            presenationType: val
        })
    }

    async searchGroups() {
        this.setState({
            spinnerDiv: true,
            finalBlock: []
        })
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const projectId = this.state.projectId
        const presenationType = this.state.presenationType

        const data = {
            projectId: projectId,
            presentationName: presenationType
        }

        await axios.post(backendURI.url + '/presentationFeedback/getProjectFeedback', data, { headers: headers })
            .then(res => {
                // console.log(res.data.data);

                this.setState({ allFeedback: res.data.data })
            })


        for (let i = 0; i < this.state.allFeedback.length; i++) {
            this.setState({
                userBlock: []
            })
            for (let j = i; j < this.state.allFeedback.length; j++) {
                if (this.state.allFeedback[i].groupId === this.state.allFeedback[j].groupId) {
                    var fullName = ''
                    await axios.get(backendURI.url + '/users/getUser/' + this.state.allFeedback[j].userId)
                        .then(res => {
                            fullName = res.data.data.firstName + ' ' + res.data.data.lastName;
                        })

                    const ublock = new UserBlock(
                        this.state.allFeedback[j].userId,
                        fullName,
                        this.state.allFeedback[j].feedback);

                    this.setState({ userBlock: [...this.state.userBlock, ublock] })
                }
            }
            const found = this.state.finalBlock.some(el => el.groupId === this.state.allFeedback[i].groupId);
            if (!found) {
                var groupNumber = ''
                await axios.get(backendURI.url + '/createGroups//getGroupData/' + this.state.allFeedback[i].groupId, { headers: headers })
                    .then(res => {
                        groupNumber = res.data.data.groupId
                    })

                const pfblock = new PresentationFeedbackBlock(this.state.allFeedback[i].groupId, groupNumber, this.state.userBlock)
                this.setState({ finalBlock: [...this.state.finalBlock, pfblock] })
            }
        }

        for (let x = 0; x < this.state.finalBlock.length; x++) {
            console.log(this.state.finalBlock[x]);
        }

        this.setState({ dataDiv: true, spinnerDiv: false });
    }

    render() {
        const { activeProjects, dataDiv, spinnerDiv } = this.state;   // ?load projects to dropdown menu this coordinator
        let activeProjectsList = activeProjects.length > 0
            && activeProjects.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
                )
            }, this)
        return (
            <div className="pf-fullpage">
                <Navbar panel={"coordinator"} />
                <div className="container pf-container-div">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <div className="card pg-search-card">
                        <div className="container">
                            <div className="container">

                                <p className="pg-reg-head">Project Groups Presentation Feedbacks </p>

                                <Row >
                                    <Col md="5" xs="12">
                                        <div className="form-group pg-dropdown-select">
                                            <select className="form-control pg-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                                <option>Select the project</option>
                                                {activeProjectsList}
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md="5" xs="12">
                                        <div className="form-group pg-dropdown-select">
                                            <select className="form-control pg-dropdown-select" id="dropdown" onChange={this.handleDropdownPresentationChange}>
                                                <option>Presentation Type</option>
                                                <option value="Preliminary">Preliminary</option>
                                                <option value="Interim">Interim</option>
                                                <option value="Finals">Finals</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md="2" xs="12">
                                        <button className="btn btn-info pg-btn" style={{ width: '100%' }} onClick={this.searchGroups}>Search</button>
                                    </Col>
                                </Row>
                            </div>
                            {spinnerDiv && (
                                <div className="spinner">
                                    <Spinner style={{ marginBottom: "10px", marginTop: "-20px" }} animation="border" variant="info" />
                                </div>
                            )}
                            { dataDiv && (
                                <div className="container">
                                    <p className="pg-details-head">Presentation Feedbacks</p>
                                    <Row>
                                        <Col md="1">
                                            <label className="tble-head">No</label>
                                        </Col>
                                        <Col md="2">
                                            <label className="tble-head">Supervisor</label>
                                        </Col>
                                        <Col md="9">
                                            <label className="tble-head">Feedback</label>
                                        </Col>
                                    </Row>

                                    <hr />
                                    <div>
                                        {this.state.finalBlock.length === 0 && (
                                            <label className="tble-row-nodata" >Data not availabel ..!</label>
                                        )}
                                        {this.state.finalBlock.map(data => {
                                            return (
                                                <Row style={{marginBottom:"20px"}}>
                                                    <Col md="1">
                                                        <label className="tble-row">{data.groupNumber}</label>
                                                    </Col>
                                                    <Col md="11">
                                                        {data.feedbacks.map(item => {
                                                            return (
                                                                <Row>
                                                                    <Col md="2">
                                                                        <label className="tble-row">{item.userName}</label>
                                                                    </Col>
                                                                    <Col md="10">
                                                                        <label className="tble-rowf">{item.feedback}</label>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        })}
                                                    </Col>
                                                    

                                                </Row>
                                            )
                                        })}

                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
    }
}

export default PresentationFeedback;