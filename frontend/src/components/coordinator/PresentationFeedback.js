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
            groupDataBlock: []
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
                console.log(res.data.data);

                this.setState({ allFeedback: res.data.data })
            })

        var finalArray = [];

        for (let i = 0; i < this.state.allFeedback.length; i++) {
            var userArray = []
            var feedbackArray = []
            for (let j = i; j < this.state.allFeedback.length; j++) {
                if (this.state.allFeedback[i].groupId === this.state.allFeedback[j].groupId) {
                    // console.log(this.state.allFeedback[i].groupId);
                    userArray.push(this.state.allFeedback[j].userId)
                    feedbackArray.push(this.state.allFeedback[j].feedback)
                }

            }
            console.log(feedbackArray);
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
                <div className="container pg-container-div">
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

                                <p className="pg-reg-head">Project Group Details</p>

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
                            {dataDiv && (
                                <div className="container">
                                    <p className="pg-details-head">Presentation Feedbacks</p>

                                    {/* <table className="table table-striped" style={{ marginTop: 20 }} > */}
                                    <Table hover className="pg-table project-groups" >

                                        <thead>
                                            <tr>
                                                <th className="table-head">No.</th>
                                                <th className="table-head">Supervisor</th>
                                                <th className="table-head">Feedback</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.groupDataBlock.map((item) => {
                                                return (
                                                    <tr className="pg-table-row" key={item.groupId} onClick={() => this.groupDataHandler(item._id)}>
                                                        <td className="table-body tbl-item">{item.groupId}</td>
                                                        <td className="table-body tbl-item">{item.groupEmail}</td>
                                                        <td className="table-body tbl-item">{item.groupMembers}</td>

                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
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