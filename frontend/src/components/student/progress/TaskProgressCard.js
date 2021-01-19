import React, {Component} from 'react';
import { Row, Col, Card, Container  } from 'react-bootstrap';
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import "../../../css/students/progress/TotalProgressCard.scss"
import IndividualTotalProgress from "./IndividualTotalProgress";

class TaskProgressCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupId: this.props.groupDetails._id,
            groupDetails: this.props.groupDetails,
            taskDetails: this.props.taskDetails,
            studentProgress: 0,
            loading: true,
        }
    }

    componentDidMount() {
        this.setState({
            totalProgress:  Math.round(this.state.taskDetails.totalProgress * 1) / 1,
            totalProgressInt: Math.round(this.state.taskDetails.totalProgress * 1) / 1,
            loading: false
        })
    }

    
    render() {
        return (
            <Container>
                <Row>
                    <Col md={12} className="total-progress-card-div">
                        <Card className="total-progress-card">
                            <Card.Header className="card-header">{this.state.taskDetails.taskTitle} ({this.state.taskDetails.totalProgress}%)</Card.Header>
                            <Card.Body className="card-body">
                                <Row>
                                    <Col md={4} sm={12} xs={12} className="circular-progress-div">

                                        {this.state.totalProgress<=33 && <CircularProgressbar styles={buildStyles({textColor: '#DC3545',pathColor: '#DC3545',})}   value={this.state.totalProgress} text={`${this.state.totalProgress}%`} />}
                                        {this.state.totalProgress<=66 && this.state.totalProgress>33  && <CircularProgressbar styles={buildStyles({textColor: '#FFC107',pathColor: '#FFC107',})}   value={this.state.totalProgress} text={`${this.state.totalProgress}%`} />}
                                        {this.state.totalProgress<=100 && this.state.totalProgress>66  && <CircularProgressbar styles={buildStyles({textColor: '#28A745',pathColor: '#28A745',})}   value={this.state.totalProgress} text={`${this.state.totalProgress}%`} />}
                                    </Col>
                                    <Col md={8} sm={12} xs={12} className="individual-progress-div">

                                        {!this.state.loading && this.state.groupDetails.groupMembers.map(member=>{
                                            return <IndividualTotalProgress key={member} member={member} groupId={this.state.groupDetails._id} totalProgress={this.state.totalProgress} parentComponent={"taskprogress"} taskDetails={this.state.taskDetails}/>
                                        })}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default TaskProgressCard;