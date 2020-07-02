import React, { Component } from 'react';
import { Row ,Col} from 'reactstrap';
import SendIcon from '@material-ui/icons/Send';
class InputContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sender: '',
            content: '',
        }
        this.onhandleChange = this.onhandleChange.bind(this);
        this.onhandleSubmit = this.onhandleSubmit.bind(this)
    }
    onhandleChange(e) {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value;
        this.setState(store);
    }
    onhandleSubmit = (e) => {
        e.preventDefault();

        this.props.handleSubmit(this.state.sender, this.state.content)
        this.setState({
            sender: '',
            content: '',
        })
    }
    render() {
        return (
            <div className="container"> 
                <form>
                    <Row className="chat-input-row">
                        <Col md={11} xs={10}>
                            <input type="text" className="form-control" placeholder="Enter the message here..." name="content"
                                onChange={this.onhandleChange} value={this.state.content} required/>
                        </Col>
                        <Col md={1} xs={2}>
                            <button className="btn chat-send-btn" onClick={this.onhandleSubmit} disabled={this.state.content === ''}><SendIcon fontSize="large" className="send-icon"/> </button>
                        </Col>
                    </Row>
                </form>
                
            </div>
        );
    }
}

export default InputContainer;