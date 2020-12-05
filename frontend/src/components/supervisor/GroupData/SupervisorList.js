import React, { Component } from 'react';
import axios from 'axios';
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col } from "reactstrap";
import '../../../css/coordinator/GroupData.scss';
import { confirmAlert } from 'react-confirm-alert';

const backendURI = require('../../shared/BackendURI');

class supervisorBlock {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class StudentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supervisorList: [],

            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',
        }

    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    componentDidMount = async () => {
        
        this.setState({
            supervisorList: []
        })
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        await axios.get(backendURI.url + '/users/supervisorList/' + this.props.obj, { headers: headers })
        .then(res => {
            if (res) {
                
                if (res.data.data !== undefined) {
                    const _id = res.data.data._id
                    const name = res.data.data.firstName + " " + res.data.data.lastName

                    let block = new supervisorBlock(_id, name)
                    this.setState({
                        supervisorList: [...this.state.supervisorList, block]
                    })
                }
            }
        })
    }

    delete(data) {
        let id = data
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const data = {
                            _id: this.props.id,
                            index: id
                        }
                        axios.post(backendURI.url + '/createGroups/removeSupervisorIndex', data)
                            .then(res => {
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
                                    window.location.reload()
                                }
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
        return (
            <div>
                {this.state.supervisorList.map((user) => {
                    return (
                        <div key={user.id} className="sl-card-super">
                            <Row >
                                <Col md="12" xs="12">
                                    <p className="sl-text">{user.name}</p>
                                </Col>

                            </Row>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default StudentList;