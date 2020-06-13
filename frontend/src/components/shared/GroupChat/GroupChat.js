import React, { Component } from 'react';
import { verifyAuth } from "../../../utils/Authentication";
import { Grid } from 'semantic-ui-react'
import MessagesContainer from './MessagesContainer'
import InputContainer from './InputContainer'
import "../../../css/shared/GroupChat.scss";
import "react-datepicker/dist/react-datepicker.css";
import 'react-confirm-alert/src/react-confirm-alert.css'
import openSocket from 'socket.io-client';
import axios from 'axios';
import { getFromStorage } from '../../../utils/Storage';

const backendURI = require('../BackendURI');


class GroupChat extends Component {

    constructor(props) {
        super(props)
        this.state = {
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

            groupDetails: [],
            messages: [],

            socket: openSocket(backendURI.url),

            userName: '',
        }

        this.state.socket.on('message', (message) => {
            this.setState({
                messages: [...this.state.messages, message]
            })
        })
    }

    async componentDidMount() {
        console.log(this.props.location.state.groupDetails);
        
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
        });
        if (!authState) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }
        await axios.get(backendURI.url + '/groupChat/' + this.props.location.state.groupDetails._id)
            .then(res => {
                if (res.data.data.length > 0) {
                    this.setState({
                        messages: res.data.data[0].messages
                    })
                }
            })
    }

    handleSubmit = async (sender, content) => {
        const userId = getFromStorage('auth-id')

        let reqBody = {
            groupId: this.props.location.state.groupDetails._id,
            sender: this.state.userName,
            content: content
        }
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        console.log(headers)
        await axios.post(backendURI.url + '/groupChat/', reqBody, { headers: headers })
            .then(res => {
                this.state.socket.emit("message", res.data)
                console.log(res.data);

            })
    }

    render() {
        return (
            <div className='container'>
                <Grid>
                    <Grid.Column width={4} />

                    <Grid.Column width={8}>
                        <Grid.Row className="messages-container">
                            {this.state.messages.length > 0 ?
                                <MessagesContainer messages={this.state.messages} />
                                :
                                <div />
                            }
                        </Grid.Row>

                        <Grid.Row>
                            <InputContainer handleSubmit={this.handleSubmit} />
                        </Grid.Row>
                    </Grid.Column>

                    <Grid.Column width={4} />
                </Grid>
            </div>
        );
    }

}

export default GroupChat;