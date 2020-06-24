import React, {Component} from 'react';
import CoordinatorList from "../admin/CoordinatorList";
import { Row, Col, Spinner } from 'react-bootstrap';
import {getFromStorage} from "../../utils/Storage";
import axios from 'axios';
import "../../css/students/ProjectDetailsCard.scss"

const backendURI = require('../shared/BackendURI');

class ProjectDetailsCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            item: this.props.project,
            groupDetails: [],
            loading: true,
        }
        this.getGroup()
    }

    getGroup  = () => {
        const userId = getFromStorage("auth-id").id;
        const project ={
            projectId: this.state.item._id
        }

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.post(backendURI.url+'/createGroups/groupDetails/'+userId,project,{headers:headers}).then(
            res=>{
                this.setState({
                    groupDetails: res.data,
                    loading: false
                })
            }
        )
    }



    render() {
        return (
            <div className="project-details-card-div">
                {this.state.loading &&
                <Col style={{textAlign:'center'}}>
                    <Spinner animation="border" className="spinner" style={{alignContent:'center'}}/>
                </Col>}
                {!this.state.loading &&
                <div>
                    <Row>
                        <Col lg={5} md={6} sm={6} xs={6}><span className="bold-text">Project Title </span></Col>
                        {/*<Col lg={1} md={1} sm={0} xs={0}><span className="bold-text">: </span></Col>*/}
                        <Col lg={7} md={6} sm={6} xs={6}><span className="normal-text" >{this.state.groupDetails.groupName}</span></Col>
                    </Row>
                    <Row>
                        <Col lg={5} md={6} sm={6} xs={6}><span className="bold-text">Project Year </span></Col>
                        {/*<Col lg={1} md={1} sm={0} xs={0}><span className="bold-text">: </span></Col>*/}
                        <Col lg={7} md={6} sm={6} xs={6}><span className="normal-text">{this.state.item.projectYear}</span></Col>
                    </Row>
                    <Row>
                        <Col lg={5} md={6} sm={6} xs={6}><span className="bold-text">Project Type</span></Col>
                        {/*<Col lg={1} md={1} sm={0} XS={0}><span className="bold-text">: </span></Col>*/}
                        <Col lg={7} md={6} sm={6} xs={6}><span className="normal-text">{this.state.item.projectType}</span></Col>
                    </Row>
                    <Row>
                        <Col lg={5} md={6} sm={6} xs={6}><span className="bold-text">Academic Year</span></Col>
                        {/*<Col lg={1} md={1} sm={0} xs={0}><span className="bold-text">: </span></Col>*/}
                        <Col lg={5} md={6} sm={6} xs={6}><span className="normal-text">{this.state.item.academicYear}</span></Col>
                    </Row>
                    <Row>
                        <Col lg={5} md={6} sm={6} xs={6}><span className="bold-text">Coordinators</span></Col>
                        {/*<Col lg={1} md={1} sm={0} XS={0}><span className="bold-text">: </span></Col>*/}
                        <Col lg={7} md={6} sm={6} xs={6}><span className="normal-text"><CoordinatorList idList={this.state.item}/></span></Col>
                    </Row>
                </div>
                }
            </div>
        );
    }
}

export default ProjectDetailsCard;