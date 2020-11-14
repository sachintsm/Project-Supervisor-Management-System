import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import {Button,} from "react-bootstrap";
import "../../../css/students/supervisorrequests/SupervisorDetails.scss"
const backendURI = require('../../shared/BackendURI');

class SupervisorDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index : this.props.index,
            projectDetails : this.props.projectDetails,
            loading: true
        }
    }

    componentDidMount() {
        this.getSupervisorDetails()
        this.checkLimit()
    }

    getSupervisorDetails = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url + '/users/getSupervisorEmail/' + this.state.index, { headers: headers }).then(res => {
            // console.log(res.data.data)
            this.setState({
                supervisorDetails: res.data.data[0],
                loading:false
            })
        })
    }

    checkLimit = () => {

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        const data = {
            userId: this.state.index,
            projectId: this.state.projectDetails._id
        }
        axios.post(backendURI.url + '/supervisorrequests/checklimit/', {data:data} , { headers: headers }).then(res => {
            this.setState({
                limitAvailability: res.data.isAvailable
            })
        })
    }

    render() {
        return (
            <tr className="supervisor-details">
                <td>
                    {!this.state.loading && <span>{this.state.supervisorDetails.firstName} {this.state.supervisorDetails.lastName}</span>}
                </td>
                <td>
                    {!this.state.loading && <span>{this.state.supervisorDetails.email}</span>}
                </td>
                <td>
                    {!this.state.loading &&
                        <Button variant='info' onClick={this.onCreateProject} style={{ width: '70%' }} > View Projects </Button>}
                </td>
                <td>
                    {!this.state.loading && this.state.limitAvailability &&
                        <Button variant='info' onClick={this.onCreateProject} style={{ width: '70%' }} > Send Request </Button>}
                    {!this.state.loading && !this.state.limitAvailability &&
                        <Button className="disabled-button" disabled variant="outline-danger" style={{ width: '70%' }} > Limit Reached </Button>}
                </td>

            </tr>
        );
    }
}

export default SupervisorDetails;