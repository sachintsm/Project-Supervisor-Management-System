import React, { Component } from 'react';
import '../../../css/shared/GroupChat.scss'
import { Col, Row } from 'reactstrap';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
class MessagesContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-main-div">

                {this.props.messages.map((message, i) => {
                    return (
                        <div className="container">
                            <Row>
                                <Col md={1}>
                                    <AccountCircleIcon style={{fontSize: "50px"}} className="chat-propic"/>
                                </Col>  
                                <Col md={7} className="mc-chat-card" key={i}>
                                    <p className="mc-chat-username">{message.userId}</p>
                                    <p className="mc-chat-content">{message.message}</p>
                                </Col>
                                <Col md={4}>

                                </Col>
                            </Row>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default MessagesContainer;