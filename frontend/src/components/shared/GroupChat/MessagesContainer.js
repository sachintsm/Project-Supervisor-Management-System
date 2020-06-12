import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';



class MessagesContainer extends Component {
    render() {
        console.log(this.props.messages)
        return (
            <Comment.Group>
                
                {this.props.messages.map((message, i) => {
                    return(
                        <Comment key={i}>
                            <Comment.Author as="b">{message.sender}</Comment.Author>
                            <Comment.Text>{message.content}</Comment.Text>
                        </Comment>
                    )
                })}
            </Comment.Group>
        );
    }
}

export default MessagesContainer;