import React, { Component } from 'react';
import { Col} from 'reactstrap'
import { Card } from "react-bootstrap";
import '../../css/students/ViewMeeting.scss';

class viewMeetBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meetData: this.props.data
        }
        console.log(this.state.meetData);
    }
    render() {
        const { meetData } = this.state;
        let supervisorProjectList = meetData.length > 0
            && meetData.map((item, i) => {
                return (
                    <div className="container" key={item.id}>
                        <Col md={12} xs={12} sm={12} >
                            <div className="view-meetings">
                                <Card>
                                    <Card.Header style={{marginBottom:"px"}} className="gd-card-header" >
                                        {item.supervisor}
                                        <div className="row">
                                            <Col md={2} className="time">
                                                {item.date.substring(0, 10)}
                                            </Col>
                                            <Col md={6} className="time">
                                                {item.time}
                                            </Col>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <p className="vm-purpose">{item.purpose}</p>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </div>
                )
            })
        return (
            <div className="row" style={{ marginBottom :"20px"}}>
                {supervisorProjectList}
            </div>
        );

    }
}

export default viewMeetBlock;
