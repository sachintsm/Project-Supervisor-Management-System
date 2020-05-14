import React, { Component } from 'react';
import '../../css/coordinator/ProjectGroups.css';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";
import { Row, Col } from "reactstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from '../../utils/Storage';
import Footer from '../shared/Footer'
import axios from 'axios';

const backendURI = require('../shared/BackendURI');

class ProjectGroups extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeProjects: [],
            groupData: [],

            projectId: '',

        }
    }

    async componentDidMount() {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) {  //!check user is logged in or not if not re-directed to the login form
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
        console.log(val)
        this.setState({
            projectId: val
        })
    }

    async searchGroups() {
        await axios.get(backendURI.url + '/createGroups/get/' + this.state.projectId)
            .then(res => {
                
            })
    }

    render() {
        const { activeProjects } = this.state;   // ?load projects to dropdown menu this coordinator

        let activeProjectsList = activeProjects.length > 0
            && activeProjects.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
                )
            }, this)

        return (
            <div className="pg-fullpage">
                <Navbar panel={"coordinator"} />
                <div className="container pg-container-div">
                    <div className="card">
                        <div className="container">
                            <p className="pg-reg-head">Project Group Details</p>

                            <Row >
                                <Col xs="10">
                                    <div className="form-group">
                                        <select className="form-control pg-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                            <option>Select the project</option>
                                            {activeProjectsList}
                                        </select>
                                        <p className="reg-error">{this.state.selectProjectError}</p>
                                    </div>
                                </Col>
                                <Col xs="2">
                                    <button className="btn btn-info" style={{ marginTop: "18px" }} onClick={this.searchGroups}>Search</button>
                                </Col>
                            </Row>
                        </div>

                        <div className="container">
                            <p className="pg-details-head">Project Groups</p>

                            <table className="table table-striped" style={{ marginTop: 20 }} >
                                <thead>
                                    <tr>
                                        <th>Group</th>
                                        <th>Members' Ids</th>
                                        <th>Supervisors</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {this.UserList()} */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                <Footer />

            </div>
        );
    }
}

export default ProjectGroups;