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
            userData: [],

            finalBlock: [],
        }
    }

    async componentDidMount() {
      
        const userId = getFromStorage('auth-id').id
        this.setState({
            userId: userId,
        })


        for (var l = 0; l < this.props.userData.length; l++) {
            if (this.props.userData[l]._id === this.props.messages.userId) {
                const block = {
                    userId: this.props.userData[l]._id,
                    userName: this.props.userData[l].userName,
                    profileImage: this.props.userData[l].profileImage,
                    message: this.props.messages.message
                }
                this.setState({
                    finalBlock: [...this.state.finalBlock, block]
                })
            }

        }
    }

    render() {
        this.state.userId = getFromStorage('auth-id').id;
        let messageContainer = this.state.finalBlock.length > 0
            && this.state.finalBlock.map((message, i) => {

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
                                    <img className="mc-image-other" src={("http://localhost:4000/users/profileImage/" + message.profileImage)} />

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