import React, { Component } from 'react';
import { Col, Row } from 'reactstrap'
import Card from "@material-ui/core/Card";
import '../../css/supervisor/SupervisorHome.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Link } from 'react-router-dom';

class groupList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupData: this.props.data,

        }
        console.log(this.state.groupData);
        this.onClickGroup = this.onClickGroup.bind(this);
    }



    onClickGroup(data) {
        console.log(data);
        this.props.history.push('/supervisorhome/groupData/' + data);
    }

    render() {
        const { groupData } = this.state;
        let supervisorProjectList = groupData.length > 0
            && groupData.map((item, i) => {
                if (item.progress >= 75) {
                    return (
                        <Col md={4} xs={12} sm={6} key={item._id}>
                            <Link to={`/supervisorhome/groupData/${item._id}`}>
                            <Card className='sh-proj-card' onClick={() => this.onClickGroup(item._id)} >
                                <div className="container" >
                                    <Row className="shpc-topic-div">
                                        <p className="shpc-topic">{item.groupId}  {item.groupName}</p>
                                    </Row>

                                    <Row style={{ width: '70%', margin: "auto" }}>
                                        <Col md={12} sm={12} xs={12} className="shpc-progress">
                                            <CircularProgressbar value={item.progress} text={`${item.progress.toFixed(2)}%`} styles={{
                                                path: {
                                                    stroke: '#388e3c'
                                                },
                                                text: {
                                                    fill: '#388e3c'
                                                }
                                            }} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <p className="shpc-head">Group Members</p>
                                    </Row>
                                    <Row>
                                        <p className="shpc-list">{item.groupMembers}</p>
                                    </Row>
                                    <Row>
                                        <p className="shpc-head">Supervisors</p>
                                    </Row>
                                    <Row>
                                        <p className="shpc-list">{item.supervisors}</p>
                                    </Row>

                                </div>
                            </Card>
                            </Link>
                        </Col>
                    )
                }
                else if (item.progress >= 25) {
                    return (
                        <Col md={4} xs={12} sm={6} key={item._id}>
                            <Link to={`/supervisorhome/groupData/${item._id}`}>
                                <Card className='sh-proj-card' >
                                    <div className="container" >
                                        <Row className="shpc-topic-div">
                                            <p className="shpc-topic">{item.groupId}  {item.groupName}</p>
                                        </Row>

                                        <Row style={{ width: '70%', margin: "auto" }}>
                                            <Col md={12} sm={12} xs={12} className="shpc-progress">
                                                <CircularProgressbar value={item.progress} text={`${item.progress.toFixed(2)}%`} styles={{
                                                    path: {
                                                        stroke: `#fbc02d`
                                                    },
                                                    text: {
                                                        fill: '#fbc02d'
                                                    }
                                                }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <p className="shpc-head">Group Members</p>
                                        </Row>
                                        <Row>
                                            <p className="shpc-list">{item.groupMembers}</p>
                                        </Row>
                                        <Row>
                                            <p className="shpc-head">Supervisors</p>
                                        </Row>
                                        <Row>
                                            <p className="shpc-list">{item.supervisors}</p>
                                        </Row>

                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    )
                }
                else {
                    return (

                        <Col md={4} xs={12} sm={6} key={item._id}>
                            <Link to={`/supervisorhome/groupData/${item._id}`}>
                            <Card className='sh-proj-card' onClick={() => this.onClickGroup(item._id)}>
                                <div className="container" >
                                    <Row className="shpc-topic-div">
                                        <p className="shpc-topic">{item.groupId}  {item.groupName}</p>
                                    </Row>

                                    <Row style={{ width: '70%', margin: "auto" }}>
                                        <Col md={12} sm={12} xs={12} className="shpc-progress">
                                            <CircularProgressbar value={item.progress} text={`${item.progress.toFixed(2)}%`} styles={{
                                                path: {
                                                    stroke: `#e53935`
                                                },
                                                text: {
                                                    fill: '#e53935'
                                                }
                                            }} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <p className="shpc-head">Group Members</p>
                                    </Row>
                                    <Row>
                                        <p className="shpc-list">{item.groupMembers}</p>
                                    </Row>
                                    <Row>
                                        <p className="shpc-head">Supervisors</p>
                                    </Row>
                                    <Row>
                                        <p className="shpc-list">{item.supervisors}</p>
                                    </Row>

                                </div>
                            </Card>
                            </Link>
                        </Col>
                    )
                }

            })
        return (
            <div className="row">

                {supervisorProjectList}
            </div>
        );
    }
}

export default groupList;   