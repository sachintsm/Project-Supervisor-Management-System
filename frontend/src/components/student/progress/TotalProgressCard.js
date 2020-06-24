import React, {Component} from 'react';
import axios from 'axios'
import {getFromStorage} from "../../../utils/Storage";
import { Row, Col, Card, Container, ProgressBar  } from 'react-bootstrap';
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import Slider from "@material-ui/core/Slider";
import "../../../css/students/progress/TotalProgressCard.scss"
import IndividualTotalProgress from "./IndividualTotalProgress";
const backendURI = require('../../shared/BackendURI');

class TotalProgressCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupId: this.props.groupDetails._id,
            groupDetails: this.props.groupDetails,
            totalProgress: 0,
            totalProgressInt: 0,
            studentProgress: 0,
        }
    }

    componentDidMount() {
        this.getTotalProgress()
    }

    getTotalProgress = () =>{
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/progress/gettotalprogress/'+this.state.groupId,{headers:headers}).then(res=>{
            let totalProgress = parseFloat(res.data)
            this.setState({
                totalProgress:  Math.round(totalProgress * 10) / 10,
                totalProgressInt: Math.round(totalProgress * 1) / 1
            })

        })
    }


    render() {
        return (
            <Container>
                <Row>
                    <Col md={12} className="total-progress-card-div">
                        <Card className="total-progress-card">
                            <Card.Header className="card-header">Total Progress</Card.Header>
                            <Card.Body className="card-body">
                                <Row>
                                    <Col md={4} sm={12} xs={12} className="circular-progress-div">
                                        {this.state.totalProgressInt<51 && <CircularProgressbar styles={buildStyles({textColor: `rgb(150,${this.state.totalProgressInt*(255/50) -100},0)`,pathColor: `rgb(255,${this.state.totalProgressInt*(255/50)},0)`,})}   value={this.state.totalProgress} text={`${this.state.totalProgress}%`} />}
                                        {this.state.totalProgressInt>50 && <CircularProgressbar styles={buildStyles({textColor: `rgb(${255 - ((this.state.totalProgressInt-50)*(255/50)) -100},150,0)` ,pathColor: `rgb(${255 - ((this.state.totalProgressInt-50)*(255/50))},255,0)`,})}   value={this.state.totalProgress} text={`${this.state.totalProgress}%`} />}
                                    </Col>
                                    <Col md={8} sm={12} xs={12} className="individual-progress-div">
                                        {this.state.groupDetails.groupMembers.map(member=>{
                                            return <IndividualTotalProgress key={member} member={member} groupId={this.state.groupDetails._id}/>
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

export default TotalProgressCard;