import React, { Component } from 'react';
import { verifyAuth } from "../../../utils/Authentication";
import { Grid } from 'semantic-ui-react'
import MessagesContainer from './MessagesContainer'
import InputContainer from './InputContainer'
import "../../../css/shared/GroupChat.scss";
import "react-datepicker/dist/react-datepicker.css";
import 'react-confirm-alert/src/react-confirm-alert.css'

import { Row, Col } from "reactstrap";
import { getFromStorage } from '../../../utils/Storage';
// import Footer from '../../../Footer'
import { confirmAlert } from 'react-confirm-alert';
// import Snackpop from "../../Snackpop";
// import Navbar from '../../Navbar';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap'
import MultiSelect from 'react-multi-select-component';

import { Button } from 'react-bootstrap'

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
        }
    }

    async componentDidMount() {
        this.setState({
            // groupDetails: this.props.location.state.groupDetails
        })

        const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState) {  //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }
        axios.get(backendURI.url + '/')
            .then(res => {
                this.setState({
                    messages: res
                })
            })
    }

    handleSubmit = (sender, content) => {
        let reqBody = {
            sender : sender,
            content : content
        }

        axios.post(backendURI.url + '/', reqBody)
            .then(res => {
                console.log(res);
                
            })
    }

    render() {
        return (
            <div className='container'>
                <Grid>
                    <Grid.Column width={4} />

                    <Grid.Column width={8}>
                        <Grid.Row className="messages-container">
                            {this.state.messages > 0 ?
                                <MessagesContainer messages={this.state.messages}/>
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