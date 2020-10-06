import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import { verifyAuth } from "../../utils/Authentication";

import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/coordinator/AssignSupervisors.scss";
import { getFromStorage } from '../../utils/Storage';
import Footer from '../shared/Footer'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Snackpop from "../shared/Snackpop";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';
import { Table, Spinner, Card } from 'react-bootstrap'
import MultiSelect from 'react-multi-select-component';

// import StaffList from './StaffList'

const backendURI = require('../shared/BackendURI');

class finalBlock {
    constructor(id, name, groups, length) {
        this.id = id
        this.name = name
        this.groups = groups
        this.length = length
    }
}

class AssignSupervisors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            activeProjects: [],
            staffOptionList: [],
            selectedStaffList: [],

            projectId: '',

            spinnerDiv1: false,
            spinnerDiv2: false,

            supervisorIdList: [],
            finalBlockArray: [],

            mouseState: false,

            checkboxes: []

        };
        // this.setSelected = this.setSelected.bind(this);
        this.addSupervisors = this.addSupervisors.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.searchGroups = this.searchGroups.bind(this);
        this.deleteSupervisor = this.deleteSupervisor.bind(this);
    }

    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    // setSelected(obj) {
    //     this.setState({
    //         selectedStaffList: obj,
    //     });
    // }
    async componentDidMount() {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const coId = JSON.parse(localStorage.getItem("auth-id"))
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        //? load all the active project names from
        axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
            .then((res => {
                this.setState({
                    activeProjects: res.data.data
                })
            }))

        //? load staff members
        await axios.get(backendURI.url + '/users/stafflist', { headers: headers })
            .then((result) => {
                if (result.data.length > 0) {
                    this.setState({
                        staffList: result.data.map((user) => user),
                    });
                }
            })
            .then((a) => {
                this.state.staffList.map((user) => {
                    const option = {
                        label: user.firstName + ' ' + user.lastName,
                        value: user._id,
                        added: true,
                        email: user.email
                    };
                    this.setState({
                        staffOptionList: [...this.state.staffOptionList, option],
                        selectedStaffList: [...this.state.selectedStaffList, option],
                    });
                    return null;
                });

            })
            .catch((err) => {
                console.log(err);
            });
    }

    //? select project drop down change
    handleDropdownChange = (e) => {
        const val = e.target.value
        this.setState({
            projectId: val
        })
    }

    //? assing supervisors to the projects
    addSupervisors() {

        let selectedStaff = []

        this.state.staffOptionList.map(item=> {
            if(item.added){
                selectedStaff.push(item)
            }
        })

        console.log(selectedStaff)


        if (this.state.projectId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please select the project..!',
                snackbarcolor: 'error'
            })
        }
        else {
            confirmAlert({
                title: 'Confirm to Submit?',
                message: 'Are you sure to do this ?',
                buttons: [{
                    label: 'Yes',
                    onClick: async () => {
                        this.setState({
                            spinnerDiv1: true
                        })
                        const headers = {
                            'auth-token': getFromStorage('auth-token').token,
                        }

                        for (let i = 0; i < this.state.selectedStaffList.length; i++) {
                            const data = {
                                projectId: this.state.projectId,
                                supervisors: this.state.selectedStaffList[i].value
                            }

                            //? add supervisors array at project document
                            await axios.post(backendURI.url + '/projects/addSupervisor', data, { headers: headers })
                                .then(async res => {
                                    if (res.data.state === false) {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'error',
                                        })
                                    }
                                    else {
                                        this.setState({
                                            snackbaropen: true,
                                            snackbarmsg: res.data.msg,
                                            snackbarcolor: 'success',
                                        })
                                        //? set isSupervisor -> true
                                        await axios.get(backendURI.url + '/users/updateSupervisor/' + this.state.selectedStaffList[i].value)
                                            .then(res => {
                                                if (res.data.state === false) {
                                                    this.setState({
                                                        snackbaropen: true,
                                                        snackbarmsg: res.data.msg,
                                                        snackbarcolor: 'error',
                                                        spinnerDiv1: false

                                                    })
                                                }
                                                else {
                                                    this.setState({
                                                        snackbaropen: true,
                                                        snackbarmsg: res.data.msg,
                                                        snackbarcolor: 'success',
                                                        spinnerDiv1: false
                                                    })
                                                }
                                            })
                                    }
                                })
                        }
                        // window.location.reload()
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
    }

    async searchGroups() {
        if (this.state.projectId === '') {
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Please select the project..!',
                snackbarcolor: 'error'
            })
        }
        else {
            this.setState({
                spinnerDiv2: true,
                finalBlockArray: [],
            })

            const headers = {
                'auth-token': getFromStorage('auth-token').token,
            }

            //? project supervisor Id list
            await axios.get(backendURI.url + '/projects/getSupervisors/' + this.state.projectId, { headers: headers })
                .then(res => {
                    this.setState({
                        supervisorIdList: res.data.data.supervisorList
                    })
                })

            for (let i = 0; i < this.state.supervisorIdList.length; i++) {
                var id = this.state.supervisorIdList[i]
                await axios.get(backendURI.url + '/users/getUserName/' + id)
                    .then(async res => {
                        let name = res.data.data[0].firstName + " " + res.data.data[0].lastName
                        let userId = res.data.data[0]._id
                        var array1 = [];
                        var count = 0;
                        let data = {
                            projectId: this.state.projectId,
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
                                this.state.finalBlockArray.push(block)
                            })

                    })
            }
            this.setState({
                spinnerDiv2: false,
                dataDiv: true
            })

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
    //? open the gropuData window
    groupDataHandler(data) {
        if (this.state.mouseState == false) {
            this.props.history.push('/coordinatorhome/supervisorData/' + data, { projectId: this.state.projectId });
        }
    }

    changeState(item){
        item.added = !item.added

    }

    selectAll = () => {

        let newList = this.state.staffOptionList

        this.setState({
            staffOptionList: []
        }, ()=> {
            newList.map(item=>{
                item.added = true
                this.setState({
                    staffOptionList: newList
                })
            })
        })

    }

    deselectAll = () => {

        let newList = this.state.staffOptionList

        this.setState({
            staffOptionList: []
        }, ()=> {
            newList.map(item=>{
                item.added = false
                this.setState({
                    staffOptionList: newList
                })
            })
        })
    }


    render() {
        const { activeProjects, dataDiv, spinnerDiv1, spinnerDiv2, staffOptionList } = this.state;   // ?load projects to dropdown menu this coordinator
        let activeProjectsList = activeProjects.length > 0
            && activeProjects.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
                )
            }, this)


        let list = staffOptionList.length > 0 && staffOptionList.map((item, i) => {
                return (
                    <div key={i}>
                        <Row style={{ marginBottom: "2px" }}>
                            <Col md={4}>
                                {item.label}
                            </Col>
                            <Col md={7}>
                                <Row>
                                    {item.email}
                                </Row>
                                <Row>
                                    {/* {this.props.data.email} */}
                                </Row>
                            </Col>
                            <Col md={1}>
                                <input type="checkbox" defaultChecked={item.added} onChange={() =>this.changeState(item)}/>
                            </Col>
                        </Row>
                    </div>
                )
            })
        return (
            <div>
                <Navbar panel={"coordinator"} />
                <div className="container">

                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                    <div className="container">
                        <Card className="task-card-gd">
                            <Card.Header className="gd-card-header">Assign Supervisors</Card.Header>
                            <Card.Body className="gd-card-body">
                                <Row >
                                    <Col md="12" xs="12">
                                        <div className="form-group as-dropdown-select">
                                            <select className="form-control as-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                                <option>Select the project</option>
                                                {activeProjectsList}
                                            </select>
                                        </div>
                                    </Col>
                                </Row >
                                <Row className="container">
                                    <div className="container" style={{ marginBottom: "20px" }}>
                                        <button type="button" className="btn btn-outline-primary mr-2" onClick={this.selectAll}>
                                            Select All
                                        </button>
                                        <button type="button" className="btn btn-outline-primary mr-2" onClick={this.deselectAll}>
                                            Deselect All
                                        </button>
                                    </div>
                                    <div className="container" style={{ width: "100%" }}>
                                        {list}
                                        {/* {this.state.staffOptionList.map(data => {
                                            return (
                                                <div key={data.value} >
                                                    <StaffList data={data} state={data.added} />
                                                </div>

                                            )
                                        })} */}
                                    </div>
                                </Row >

                                <Row >

                                    <Col md="12" xs="12">
                                        <button style={{ width: '100%' }} className="btn btn-info as-btn" onClick={this.addSupervisors}>Add Now</button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div>

                    {spinnerDiv1 && (
                        <div className="spinner">
                            <Spinner style={{ marginBottom: "10px", marginTop: "-20px" }} animation="border" variant="info" />
                        </div>
                    )}
                    {/* /***************************************************************************************************************************** */}
                    <div className="container">
                        <Card className="task-card-gd">
                            <Card.Header className="gd-card-header">Project Supervisors List</Card.Header>
                            <Card.Body className="gd-card-body">
                                <Row >
                                    <Col md="10" xs="12">
                                        <div className="form-group as-dropdown-select">
                                            <select className="form-control as-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                                <option>Select the project</option>
                                                {activeProjectsList}
                                            </select>
                                        </div>
                                    </Col>
                                    <Col md="2" xs="12">
                                        <button className="btn btn-info as-btn" onClick={this.searchGroups}>Search</button>
                                    </Col>
                                </Row>

                                {spinnerDiv2 && (
                                    <div className="spinner">
                                        <Spinner style={{ marginBottom: "10px", marginTop: "-20px" }} animation="border" variant="info" />
                                    </div>
                                )}
                                {dataDiv && (
                                    <div className="container">
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
                                                                <span onMouseEnter={() => this.setState({ mouseState: true })} onMouseLeave={() => this.setState({ mouseState: false })}>
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
                            </Card.Body>
                        </Card>
                    </div>
                </div >
                <Footer />
            </div>
        );
    }
}

export default AssignSupervisors;