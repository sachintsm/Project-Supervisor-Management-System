import React, { Component } from 'react';
import { Row } from 'reactstrap';

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
            <div>
                <form>
                    <Row>
                        <input className="form-control" name="sender" placeholder="Name here..."
                            onChange={this.onhandleChange} value={this.state.sender} />
                    </Row>
                    <Row>
                        <input type="text" className="form-control" placeholder="Enter the message here..." name="content"
                            onChange={this.onhandleChange} value={this.state.content} />
                    </Row>
                    <Row>
                        <button className="btn btn-info" onClick={this.onhandleSubmit}>Send </button>
                    </Row>
                </form>
            </div>
        );
    }
}

export default InputContainer;