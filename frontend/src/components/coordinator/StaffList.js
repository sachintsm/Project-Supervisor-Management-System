import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

class StaffList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            btnState: this.props.state
        }
    }

    render() {
        // console.log(this.props.state);
        return (
            <div>
                <Row style={{ marginBottom: "2px" }}>
                    <Col md={3}>
                        {this.props.data.label}
                    </Col>
                    <Col md={7}>
                        <Row>
                            {this.props.data.email}
                        </Row>
                        <Row>
                            {/* {this.props.data.email} */}
                        </Row>
                    </Col>
                    <Col md={2}>
                        {
                            this.state.btnState === false && (
                                <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => this.props.changeState(this.state.btnState, this.props.data.value)} >Add Now</button>
                            )
                        }
                        {
                            this.state.btnState === true && (
                                <button className="btn btn-success" style={{ width: '100%' }} onClick={() => this.props.changeState(this.state.btnState, this.props.data.value)}>Added</button>
                            )
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}

export default StaffList;