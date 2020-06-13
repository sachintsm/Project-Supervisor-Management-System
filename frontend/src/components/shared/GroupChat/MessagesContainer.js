import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';



class MessagesContainer extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Comment.Group>

                {this.props.messages.map((message, i) => {
                    return(
                        <Comment key={i}>
                            <Comment.Author as="b">{message.userId}</Comment.Author>
                            <Comment.Text>{message.message}</Comment.Text>
                        </Comment>
                    )
                })}
            </Comment.Group>
        );
    }
}

export default MessagesContainer;