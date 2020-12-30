import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";

const backendURI = require('../../shared/BackendURI');

class RequestHistory extends Component {


    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            request: this.props.requestDetails,
            loading: true
        }
    }

    componentDidMount() {
        this.getSupervisorDetails()
    }

    getSupervisorDetails = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url + '/users/getSupervisorEmail/' + this.state.request.supervisorId, { headers: headers }).then(res => {
            this.setState({
                supervisorDetails: res.data.data[0],
                loading:false
            })
        })
    }

    render() {
        return (
            <tr>
                {!this.state.loading && (
                    <React.Fragment>
                        <td>{this.state.request.date}</td>
                        <td>{this.state.request.time}</td>
                        <td>{this.state.supervisorDetails.firstName} {this.state.supervisorDetails.lastName}    </td>
                        <td>{this.state.request.description}</td>
                        {this.state.request.status==="Pending" && <td>{this.state.request.status}</td>}
                        {this.state.request.status==="Accepted" && <td style={{color: "green"}}>{this.state.request.status}</td>}
                        {this.state.request.status==="Declined" && <td style={{color: "red"}}>{this.state.request.status}</td>}
                    </React.Fragment>
                )}
            </tr>
        );
    }
}

export default RequestHistory;