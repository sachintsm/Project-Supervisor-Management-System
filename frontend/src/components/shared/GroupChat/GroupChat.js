import React, { Component } from 'react';
import { verifyAuth } from "../../../utils/Authentication";
import MessagesContainer from './MessagesContainer'
import InputContainer from './InputContainer'
import "../../../css/shared/GroupChat.scss";
import "react-datepicker/dist/react-datepicker.css";
import 'react-confirm-alert/src/react-confirm-alert.css'
import openSocket from 'socket.io-client';
import axios from 'axios';
import { getFromStorage } from '../../../utils/Storage';
import Navbar from '../../shared/Navbar'
import { Card } from 'react-bootstrap';

const backendURI = require('../BackendURI');


class GroupChat extends Component {

    constructor(props) {
        super(props)
        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            groupDetails: this.props.location.state.groupDetails,
            messages: [],

            socket: openSocket(backendURI.url),

            userName: '',

            groupMembers: [],
            supervisors: [],
        }

        this.state.socket.on('message', (message) => {
            this.setState({
                messages: [...this.state.messages, message]
            })
        })
    }

    async componentDidMount() {
       
        const authState = await verifyAuth();
        const userId = getFromStorage('auth-id')
        await axios.get(backendURI.url + '/users/getUserName/' + userId.id)
            .then(res => {
                var name = res.data.data[0].firstName + ' ' + res.data.data[0].lastName;
                this.setState({
                    userName: name
                })
            })
        this.setState({
            authState: authState,
        })
        if (!authState) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }
        await axios.get(backendURI.url + '/groupChat/' + this.props.location.state.groupDetails._id)
            .then(res => {
                // console.log(res.data.data);

                if (res.data.data.length > 0) {
                    this.setState({
                        messages: res.data.data[0].messages
                    })
                }
            })
    }

    handleSubmit = async (sender, content) => {
        const userId = getFromStorage('auth-id').id
        // var profileImage = ''
        // await axios.get(backendURI.url + '/users/getUserImage/' + userId)
        //     .then(res => {
        //         // console.log(res.data.data[0].imageName);
        //         profileImage = res.data.data[0].imageName
        //     })
        let reqBody = {
            userId: userId,
            // profileImage: profileImage,
            groupId: this.props.location.state.groupDetails._id,
            // sender: this.state.userName,
            content: content
        }
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        await axios.post(backendURI.url + '/groupChat/', reqBody, { headers: headers })
            .then(res => {
                this.state.socket.emit("message", res.data)
                console.log(res.data);
            })
    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className='container'>
                    <Card className="task-card-cb">
                        <Card.Header className="gd-card-header">
                            Chat Room
                        </Card.Header>
                        <Card.Body className="gd-card-body messages-container" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
                            {this.state.messages.length > 0 ?
                                <MessagesContainer messages={this.state.messages} groupDetails={this.state.groupDetails}/>
                                :
                                <div />
                            }
                        </Card.Body>
                        <div className="input-container">
                            <InputContainer handleSubmit={this.handleSubmit} />
                        </div>
                    </Card>
                </div>
            </React.Fragment>
        );
    }

}

export default GroupChat;