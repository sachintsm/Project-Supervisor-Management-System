import React, {Component} from 'react';
import CoordinatorList from "../admin/CoordinatorList";
import { Container, Row, Col, Spinner } from 'react-bootstrap';

class ProjectDetailsCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            item: this.props.project
        }
    }
    render() {
        return (
            <div>
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
        );
    }
}

export default ProjectDetailsCard;