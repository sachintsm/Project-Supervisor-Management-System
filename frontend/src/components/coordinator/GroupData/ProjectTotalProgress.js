import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from "react-router-dom";
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col, Card } from 'react-bootstrap';
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "../../../css/coordinator/TotalProgressCard.scss"
import IndividualTotalProgress from "./IndividualTotalProgress";
const backendURI = require('../../shared/BackendURI');

class ProjectTotalProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupDetails: this.props.groupDetails,
            totalProgress: 0,
            totalProgressInt: 0,
            studentProgress: 0,
            loading: true,
            groupId: this.props.id,
            projectId: props.location.state.projectId,
            project: [],
        }

        this.getTotalProgress()
        this.individualProgressTask = this.individualProgressTask.bind(this);
    }

    getTotalProgress = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        
        axios.get(backendURI.url + '/progress/gettotalprogress/' + this.state.groupId, { headers: headers }).then(res => {
            let totalProgress = 0;
            if (res.data !== 'NaN') {
                totalProgress = parseFloat(res.data)
            }

            this.setState({
                totalProgress: totalProgress,
                totalProgressInt: Math.round(totalProgress * 1) / 1,
                loading: false
            })

        })
    }
    async componentDidMount() {
        //? get project details
        await axios.get(backendURI.url + '/projects/getProject/' + this.state.projectId)
            .then(res => {
                this.setState({
                    project: res.data.data
                })
            })
    }

    individualProgressTask() {
        this.props.history.push('/studenthome/viewproject/progresstasks', { projectDetails: this.state.project, groupDetails: this.state.groupDetails })
    }

    render() {
        return (
            <Row>
                <Col md={12} className="total-progress-card-div-co">
                    <Card className="total-progress-card" onClick={() => this.individualProgressTask()}>
                        <Card.Header className="card-header">Total Progress</Card.Header>
                        <Card.Body className="card-body">
                            <Row>
                                <Col md={4} sm={12} xs={12} className="circular-progress-div">
                                    {this.state.totalProgressInt < 51
                                        && <CircularProgressbar
                                            styles={buildStyles({ textColor: `rgb(150,${this.state.totalProgressInt * (255 / 50) - 100},0)`, pathColor: `rgb(255,${this.state.totalProgressInt * (255 / 50)},0)`, })}
                                            value={this.state.totalProgress}
                                            text={`${this.state.totalProgressInt}%`} />}

                                    {this.state.totalProgressInt > 50
                                        && <CircularProgressbar
                                            styles={buildStyles({ textColor: `rgb(${255 - ((this.state.totalProgressInt - 50) * (255 / 50)) - 100},150,0)`, pathColor: `rgb(${255 - ((this.state.totalProgressInt - 50) * (255 / 50))},255,0)`, })}
                                            value={this.state.totalProgress}
                                            text={`${this.state.totalProgressInt}%`} />}
                                </Col>
                                <Col md={8} sm={12} xs={12} className="individual-progress-div">
                                    {!this.state.loading && this.state.groupDetails.groupMembers.map(member => {
                                        return <IndividualTotalProgress key={member} member={member} groupId={this.state.groupDetails._id} totalProgress={this.state.totalProgress} parentComponent={"totalProgress"} />
                                    })}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default withRouter(ProjectTotalProgress);
