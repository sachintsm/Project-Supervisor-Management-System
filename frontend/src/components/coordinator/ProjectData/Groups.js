import React, { Component } from 'react';
import Navbar from '../../shared/Navbar';
import { verifyAuth } from "../../../utils/Authentication";
import "react-datepicker/dist/react-datepicker.css";
import "../../../css/coordinator/ProjectData.scss";
import { getFromStorage } from '../../../utils/Storage';
import Footer from '../../shared/Footer'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Snackpop from "../../shared/Snackpop";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backendURI = require('../../shared/BackendURI');

class groupDataBlock {
    constructor(_id, groupId, projectId, groupMembers, supervisors) {
        this._id = _id;
        this.groupId = groupId;
        this.projectId = projectId;
        this.groupMembers = groupMembers;
        this.supervisors = supervisors;
    }
}
export default class Groups extends Component {

    constructor(props) {
        super(props)
        this.state = {
            groupData: [],
            groupDataBlock: [],
            projectName: '',


            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            projectId: '',
            mouseState: false,

        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    componentDidMount = async () => {
        this.setState({
            projectId: this.props.match.params.id
        })

        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        this.setState({
            spinnerDiv: true,
            groupDataBlock: []
        })
        await axios.get(backendURI.url + '/projects/getProjectName/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    projectName: res.data.data.projectYear + ' ' + res.data.data.projectType + ' ' + res.data.data.academicYear
                })
            })
        await axios.get(backendURI.url + '/createGroups/get/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    groupData: res.data.data
                })
            })
            console.log("Ashan",this.state.groupData)
        if (this.state.groupData.length === 0) {
            this.setState({ spinnerDiv: false })
        } else {
            for (let i = 0; i < this.state.groupData.length; i++) {
                if (this.state.groupData[i].supervisors.length !== 0) {
                    var array1 = [];
                    var array2 = [];
                    for (let j = 0; j < this.state.groupData[i].supervisors.length; j++) {
                        await axios.get(backendURI.url + '/users/getUserName/' + this.state.groupData[i].supervisors[j])
                            .then(res => {
                                var supervisorName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName + ', ';
                                array1.push(supervisorName)
                            })
                    }
                    for (let k = 0; k < this.state.groupData[i].groupMembers.length; k++) {
                        var newMember = this.state.groupData[i].groupMembers[k] + ', '
                        array2.push(newMember)
                    }
                    var block = new groupDataBlock(
                        this.state.groupData[i]._id,
                        this.state.groupData[i].groupId,
                        this.state.groupData[i].projectId,
                        array2,
                        array1
                    )
                    this.setState({ groupDataBlock: [...this.state.groupDataBlock, block] })
                    // this.state.groupDataBlock.push(block)
                } else {
                    var array3 = [];
                    for (let k = 0; k < this.state.groupData[i].groupMembers.length; k++) {
                        var newMemberA = this.state.groupData[i].groupMembers[k] + ', '
                        array3.push(newMemberA)
                    }
                    var blockA = new groupDataBlock(
                        this.state.groupData[i]._id,
                        this.state.groupData[i].groupId,
                        this.state.groupData[i].projectId,
                        array3,
                        ''
                    )
                    this.setState({ groupDataBlock: [...this.state.groupDataBlock, blockA] })
                }
            }
            this.setState({ dataDiv: true, spinnerDiv: false });
        }
    }
    //? opent the gropuData window
    groupDataHandler(data) {
        if (this.state.mouseState == false) {
            this.props.history.push('/coordinatorhome/groupData/' + data, { projectId: this.state.projectId });
        }
    }

    //?delete the group
    deleteGroup(id) {
        confirmAlert({
            title: 'Confirm to Delete?',
            message: 'Are you sure to do this ?',
            buttons: [{
                label: 'Yes',
                onClick: () => {
                    const obj = getFromStorage('auth-token');
                    fetch(backendURI.url + '/createGroups/delete/' + id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': obj.token
                        },
                    })
                        .then(res => res.json())
                        .then(json => {
                            if (json.state === true) {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: json.msg,
                                    snackbarcolor: 'success',
                                })
                                window.location.reload();
                            } else {
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: json.msg,
                                    snackbarcolor: 'error',
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg: err,
                                snackbarcolor: 'error',
                            })
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
        const { spinnerDiv, dataDiv, mouseState } = this.state;
        let noProject;
        if (this.state.groupData.length === 0) {
            noProject = <p className="no-projects">No active groups...</p>
        }
        return (
            <React.Fragment>
                <Navbar panel={"coordinator"} />
                <Snackpop
                    msg={this.state.snackbarmsg}
                    color={this.state.snackbarcolor}
                    time={3000}
                    status={this.state.snackbaropen}
                    closeAlert={this.closeAlert}
                />
                <div className="container sup-main-div">
                    <div className="sup-topic-div">
                        <p className="ch-topic">{this.state.projectName}</p>
                    </div>
                    {noProject}
                    {spinnerDiv && (
                        <div className="spinner">
                            <Spinner style={{ marginBottom: "10px", marginTop: "20px" }} animation="border" variant="info" />
                        </div>
                    )}
                    {dataDiv && (
                        <div className="container">
                            <p className="pg-details-head">Project Groups</p>

                            {/* <table className="table table-striped" style={{ marginTop: 20 }} > */}
                            <Table hover className="pg-table" >

                                <thead>
                                    <tr>
                                        <th className="table-head">Group</th>
                                        <th className="table-head">Members' Ids</th>
                                        <th className="table-head">Supervisors</th>
                                        <th className="table-head" style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.groupDataBlock.map((item) => {
                                        return (
                                            <tr className="pg-table-row" key={item.groupId} onClick={() => this.groupDataHandler(item._id)}>
                                                <td className="table-body">{item.groupId}</td>
                                                <td className="table-body">{item.groupMembers}</td>
                                                <td className="table-body">{item.supervisors}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span onMouseEnter={() => this.setState({ mouseState: true })} onMouseLeave={() => this.setState({ mouseState: false })}>
                                                        <DeleteForeverIcon className="del-btn" fontSize="default" onClick={() => this.deleteGroup(item._id)} />
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
                <Footer />

            </React.Fragment>
        )
    }
}
