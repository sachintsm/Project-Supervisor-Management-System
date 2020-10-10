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

class finalBlock {
    constructor(id, name, groups, length) {
        this.id = id
        this.name = name
        this.groups = groups
        this.length = length
    }
}

class Supervisors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            projectId: '',

            spinnerDiv: false,
            projectName: '',
            supervisorIdList: [],
            finalBlockArray: [],

            mouseState : false,
        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    async componentDidMount() {

        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        this.setState({
            spinnerDiv: true,
            finalBlockArray: [],
            projectId: this.props.match.params.id
        })
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        //? project supervisor Id list
        await axios.get(backendURI.url + '/projects/getSupervisors/' + this.props.match.params.id, { headers: headers })
            .then(async res => {
                this.setState({
                    projectName: res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear,
                    supervisorIdList: res.data.data.supervisorList
                })
                if (this.state.supervisorIdList.length === 0) {
                    this.setState({ spinnerDiv: false })
                } else {
                    for (let i = 0; i < this.state.supervisorIdList.length; i++) {
                        var id = this.state.supervisorIdList[i]
                        await axios.get(backendURI.url + '/users/getUserName/' + id)
                            .then(async res => {
                                let name = res.data.data[0].firstName + " " + res.data.data[0].lastName
                                let userId = res.data.data[0]._id
                                var array1 = [];
                                var count = 0;
                                let data = {
                                    projectId: this.props.match.params.id,
                                    supervisor: userId
                                }
                                await axios.post(backendURI.url + '/createGroups/getsupervisorGroup', data)
                                    .then((res) => {
                                        count = res.data.data.length
                                        for (let j = 0; j < res.data.data.length; j++) {
                                            var group = res.data.data[j].groupId + " , "
                                            array1.push(group)
                                        }
                                        var block = new finalBlock(userId, name, array1, count)
                                        // this.state.finalBlockArray.push(block)
                                        this.setState({ finalBlockArray: [...this.state.finalBlockArray, block] })
                                    })

                            })
                    }
                    this.setState({
                        spinnerDiv: false,
                        dataDiv: true
                    })
                }
            })


    }
    //? opent the gropuData window
    groupDataHandler(data) {
        if(this.state.mouseState === false){
            this.props.history.push('/coordinatorhome/supervisorData/' + data, { projectId: this.state.projectId });
        }
    }
    async deleteSupervisor(data, groups) {

        const projectId = this.state.projectId;
        const userId = data;
        var array1 = []
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const dt = {
            projectId: projectId,
            supervisor: userId
        }
        //? gett the groups that one supercviser supervised
        await axios.post(backendURI.url + '/createGroups/getsupervisorGroup', dt)
            .then(res => {
                for (let j = 0; j < res.data.data.length; j++) {
                    var group = res.data.data[j].groupId
                    array1.push(group)
                }
            })
        confirmAlert({
            title: 'Confirm to Delete?',
            message: 'Supervisor will also removed from the Groups!',
            buttons: [{
                label: 'Yes',
                onClick: async () => {
                    // //? remove supervisor from the project supervisor list
                    await axios.post(backendURI.url + '/projects/deletesupervisorGroup', dt, { headers: headers })
                        .then(res => {
                        })
                    for (let j = 0; j < array1.length; j++) {
                        data = {
                            projectId: projectId,
                            supervisor: userId,
                            groupId: array1[j]
                        }

                        //? remove supervisor from the Specific groups
                        await axios.post(backendURI.url + '/createGroups/remove-supervisor', data, { headers: headers })
                            .then(res => {
                                if (res.data.state === false) {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'error'
                                    })
                                }
                                else {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: res.data.msg,
                                        snackbarcolor: 'success'
                                    })
                                }
                            })
                    }
                    window.location.reload();
                }
            },
            {
                label: 'No',
                onClick: () => {

                }
            }]
        })
    }
    render() {
        let noProject;
        if (this.state.supervisorIdList.length === 0) {
            noProject = <p className="no-projects">No active supervisors...</p>
        }
        const { dataDiv, spinnerDiv } = this.state;
        return (
            <React.Fragment>
                <Snackpop
                    msg={this.state.snackbarmsg}
                    color={this.state.snackbarcolor}
                    time={3000}
                    status={this.state.snackbaropen}
                    closeAlert={this.closeAlert}
                />
                <Navbar panel={"coordinator"} />
                <div className="container sup-main-div">
                    <div className="sup-topic-div">
                        <p className="ch-topic">{this.state.projectName}</p>
                    </div>
                    {noProject}
                    {spinnerDiv && (
                        <div className="spinner">
                            <Spinner style={{ marginBottom: "20px", marginTop: "20px" }} animation="border" variant="info" />
                        </div>
                    )}
                    {dataDiv && (
                        <div>
                            <Table hover className="as-table" >
                                <thead>
                                    <tr>
                                        <th className="table-head">Supervisor</th>
                                        <th className="table-head">Groups</th>
                                        <th className="table-head">Count</th>
                                        <th className="table-head">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.finalBlockArray.map((item) => {
                                        return (
                                            <tr className="as-table-row" key={item.id} onClick={() => this.groupDataHandler(item.id)}>

                                                <td className="table-body">{item.name}</td>
                                                <td className="table-body">{item.groups}</td>
                                                <td className="table-body">{item.length}</td>
                                                <td className="table-body">
                                                    
                                                    <span onMouseEnter={() => this.setState({mouseState : true})} onMouseLeave={() => this.setState({mouseState : false})}>
                                                        <DeleteForeverIcon className="del-btn" onClick={() => this.deleteSupervisor(item.id, item.groups)} />
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
        );
    }
}

export default Supervisors;