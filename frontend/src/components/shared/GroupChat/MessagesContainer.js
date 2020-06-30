import React, { Component } from 'react';
import '../../../css/shared/GroupChat.scss'
import { Col, Row } from 'reactstrap';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { getFromStorage } from '../../../utils/Storage';
import axios from 'axios';
const backendURI = require('../BackendURI');

class MessagesContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            imagename: '',

            messages: this.props.messages
        }
    }

    componentDidMount() {
        console.log("saa")
    }
    render() {
        console.log("render")

        this.state.userId = getFromStorage('auth-id').id;
        let messageContainer = this.props.messages.length > 0
            && this.props.messages.map((message, i) => {             
                if (message.userId === this.state.userId) {
                    return (
                        <div className="container x" key={i}>
                            <Row>
                                <Col md={5} xs={2}>
                                </Col>
                                <Col className="mc-chat-card-me" md={6} xs={8}>
                                    {/* <p className="mc-chat-username-me" style={{ textAlign: "right" }}>You</p> */}
                                    <p className="mc-chat-content-me" style={{ textAlign: "right" }}>{message.message}</p>
                                </Col>
                                <Col md={1} xs={2}>
                                    {/* <AccountCircleIcon style={{ fontSize: "35px" }} className="chat-propic" /> */}
                                    <img className="mc-image" src={("http://localhost:4000/users/profileImage/" + message.profileImage)} />
                                </Col>
                            </Row>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="container x" key={i}>
                            <Row>
                                <Col md={1} xs={2}>
                                   
                                    {/* <AccountCircleIcon style={{ fontSize: "35px" }} className="chat-propic" /> */}
                                    <img  className="mc-image" src={("http://localhost:4000/users/profileImage/" + message.profileImage)} />

                                </Col>
                                <Col md={6} xs={8} className="mc-chat-card">
                                    <p className="mc-chat-username">{message.userName}</p>
                                    <p className="mc-chat-content">{message.message}</p>
                                </Col>
                                <Col md={5} xs={2}>

                                </Col>
                            </Row>
                        </div>
                    )
                }
            })

        return (
            <div className="container-main-div">
                {messageContainer}
            </div>
        );
    }
}

export default MessagesContainer;