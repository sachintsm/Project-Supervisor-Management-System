import React, { Component } from 'react';
import '../../css/coordinator/GroupData.css';
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

const backendURI = require('../shared/BackendURI');
class GroupData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            groupData: [],
        }

    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    componentDidMount = async () => {
        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || !localStorage.getItem("isCoordinator")) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url + '/createGroups/getGroupData/' + this.props.match.params.id, { headers: headers })
            .then(res => {
                console.log(res.data.data)
                this.setState({
                    groupData: res.data.data
                })
            })
    }

    render() {
        return (
            <div className="pg-fullpage">
                <Navbar panel={"coordinator"} />
                <div className="container pg-container-div">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />

                    <div className="card">
                        <div className="container">
                            <p className="gd-reg-head">Group - {this.state.groupData.groupId}</p>
                        </div>
                        <div className="container">
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GroupData;