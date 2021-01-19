import React, { Component } from 'react';
import axios from 'axios';
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col } from "reactstrap";
import '../../../css/coordinator/GroupData.scss';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../../shared/Snackpop";
import Index from "../../shared/Index";
const backendURI = require('../../shared/BackendURI');

class studentBlock {
    constructor(id, name, index, reg) {
        this.id = id;
        this.name = name;
        this.index = index;
        this.reg = reg;
    }
}

class StudentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            studentList: [],

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
            studentList: []
        })
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        await axios.get(backendURI.url + '/users/studentList/' + this.props.obj, { headers: headers })
            .then(res => {
                // console.log(res)
                if (res.data.data) {
                    const _id = res.data.data._id
                    const name = res.data.data.firstName + " " + res.data.data.lastName
                    const index = res.data.data.indexNumber
                    const reg = res.data.data.regNumber

                    let block = new studentBlock(_id, name, index, reg)

                    this.setState({
                        studentList: [...this.state.studentList, block]
                    })
                }
            })
    }
    
    delete(data) {
        let index = data
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to remove this student from the group?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const data = {
                            _id: this.props.id,
                            index: index
                        }
                        axios.post(backendURI.url + '/createGroups/removeStudentIndex', data)
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
                <Snackpop
                    msg={this.state.snackbarmsg}
                    color={this.state.snackbarcolor}
                    time={3000}
                    status={this.state.snackbaropen}
                    closeAlert={this.closeAlert}
                />
                {this.state.studentList.map((user, index) => {
                    return (
                        <div key={user.id} className="sd-sl-card-student">
                            <Row >
                                <Col md="3" xs="6">
                                    <span className="stu-index-data">  <Index id={user.id} index={user.index} /></span>
                                    {/* <p className="sl-text">{user.index}</p> */}
                                </Col>
                                <Col md="3" xs="6">
                                    <p className="sl-text">{user.reg}</p>
                                </Col>
                                <Col md="5" xs="10">
                                    <p className="sl-text">{user.name}</p>
                                </Col>
                                <Col md="1" xs="2">
                                    <DeleteForeverIcon className="gd-del-btn" onClick={() => this.delete(user.index)} />
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