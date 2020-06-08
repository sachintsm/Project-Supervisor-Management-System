import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../../css/coordinator/SupervisorData.css'
import axios from 'axios';
import { getFromStorage } from '../../../utils/Storage';
import Footer from '../../shared/Footer'
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../../shared/Snackpop";
import { verifyAuth } from "../../../utils/Authentication";
import { Card, Row, Col } from 'reactstrap';

const backendURI = require('../../shared/BackendURI');

class groupDataBlock {
    constructor(_id, groupId, groupName, projectId, groupMembers, supervisors) {
        this._id = _id;
        this.groupId = groupId;
        this.groupName = groupName;
        this.projectId = projectId;
        this.groupMembers = groupMembers;
        this.supervisors = supervisors;
    }
}

class SupervisorProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authState: '',
            projectId: this.props.proId,
            supervisorId: this.props.supId,
            activeProjects: [],
            groupDataBlock: [],
        }
    }

    componentDidMount = async () => {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        const data = {
            projectId: this.state.projectId,
            supervisorId: this.state.supervisorId
        }

        //? load all the active project names from
        await axios.post(backendURI.url + '/createGroups/active&groups/', data)
            .then((res => {
                console.log(res.data.data)
                this.setState({
                    activeProjects: res.data.data,
                })
            }))
        // console.log(this.state.activeProjects);

        for (let i = 0; i < this.state.activeProjects.length; i++) {
            if (this.state.activeProjects[i].supervisors.length !== 0) {
                var array1 = [];
                var array2 = [];
                for (let j = 0; j < this.state.activeProjects[i].supervisors.length; j++) {
                    await axios.get(backendURI.url + '/users/getUserName/' + this.state.activeProjects[i].supervisors[j])
                        .then(res => {
                            var supervisorName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName + ', ';
                            array1.push(supervisorName)
                        })
                }
                for (let k = 0; k < this.state.activeProjects[i].groupMembers.length; k++) {
                    var newMember = this.state.activeProjects[i].groupMembers[k] + ', '
                    array2.push(newMember)
                }
                var block = new groupDataBlock(
                    this.state.activeProjects[i]._id,
                    this.state.activeProjects[i].groupId,
                    'E-supervision',
                    this.state.activeProjects[i].projectId,
                    array2,
                    array1
                )
                // console.log(block);

                this.state.groupDataBlock.push(block)
            } else {
                var array3 = [];
                for (let k = 0; k < this.state.activeProjects[i].groupMembers.length; k++) {
                    var newMemberA = this.state.activeProjects[i].groupMembers[k] + ', '
                    array3.push(newMemberA)
                }
                var blockA = new groupDataBlock(
                    this.state.activeProjects[i]._id,
                    this.state.activeProjects[i].groupId,
                    'E-supervision',
                    this.state.activeProjects[i].projectId,
                    array3,
                    ''
                )
                this.state.groupDataBlock.push(blockA)
            }
        }
        console.log(this.state.groupDataBlock.length)
    }

    render() {
        const percentage = 66;
        console.log(this.state.groupDataBlock)

        return (
            <div>
                <Row>
                    <Col md={4}>

                        {this.state.groupDataBlock.map((item) => {
                            return (
                                <Card>
                                    <div className="container" >
                                        <Row>
                                            <p className="spc-topic">{item.groupId} - {item.groupName}</p>
                                        </Row>

                                        <Row style={{ width: '70%', margin: "auto" }}>
                                            <Col md={12} sm={12} xs={12} className="spc-progress">
                                                <CircularProgressbar value={percentage} text={`${percentage}%`} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <p className="spc-head">Group Members</p>
                                        </Row>
                                        <Row>
                                            <p className="spc-head">Supervisors</p>
                                        </Row>
                                        <Row>
                                            <p className="spc-list">{item.supervisors}</p>
                                        </Row>

                                    </div>
                                </Card>
                            )
                        })}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SupervisorProject;