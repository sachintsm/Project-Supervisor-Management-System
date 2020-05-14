import React, { Component } from 'react';
import '../../css/coordinator/ProjectGroups.css';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";
import { Row, Col } from "reactstrap";
import { getFromStorage } from '../../utils/Storage';
import Footer from '../shared/Footer'
import axios from 'axios';

const backendURI = require('../shared/BackendURI');

class groupDataBlock {
    constructor(groupId, projectId, groupMembers, supervisors) {
        this.groupId = groupId;
        this.projectId = projectId;
        this.groupMembers = groupMembers;
        this.supervisors = supervisors;
    }
}
class ProjectGroups extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectId: '',

            activeProjects: [],
            groupData: [],
            groupDataBlock: [],
            supervisorsNames: [],
        }
        this.searchGroups = this.searchGroups.bind(this);
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
        this.setState({
            projectId: val
        })
    }

    async searchGroups() {
        await axios.get(backendURI.url + '/createGroups/get/' + this.state.projectId)
            .then(res => {
                this.setState({
                    groupData: res.data.data
                })
            })
        for (let i = 0; i < this.state.groupData.length; i++) {
            if (this.state.groupData[i].supervisors.length !== 0) {
                var array1 = [];
                for (let j = 0; j < this.state.groupData[i].supervisors.length; j++) {
                    await axios.get(backendURI.url + '/users/getUserName/' + this.state.groupData[i].supervisors[j])
                        .then(res => {
                            var supervisorName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName;
                            array1.push(supervisorName)
                        })

                }
                var block = new groupDataBlock(
                    this.state.groupData[i].groupId,
                    this.state.groupData[i].projectId,
                    this.state.groupData[i].groupMembers,
                    array1
                )
                this.state.groupDataBlock.push(block)
            }
            else {
                var block = new groupDataBlock(
                    this.state.groupData[i].groupId,
                    this.state.groupData[i].projectId,
                    this.state.groupData[i].groupMembers,
                    ''
                )
                this.state.groupDataBlock.push(block)
            }

        }
        for (let i = 0; i < this.state.groupDataBlock.length; i++) {
            console.log(this.state.groupDataBlock[i])
            }
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
                                    </div>
                                </Col>
                                <Col xs="2">
                                    <button className="btn btn-info" style={{ marginTop: "18px", width: "100%" }} onClick={this.searchGroups}>Search</button>
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
                                    {this.state.groupDataBlock.map((item) => {
                                        return (
                                            <tr key={item.groupId}>
                                                <td>{item.groupId}</td>
                                                <td>{item.groupMembers}</td>
                                                <td>{item.supervisors}</td>
                                                <td>Actions</td>
                                            </tr>
                                        )
                                    })}
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