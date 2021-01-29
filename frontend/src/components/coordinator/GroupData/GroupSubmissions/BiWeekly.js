import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Navbar from "../../../shared/Navbar";
import "../../../../css/coordinator/GroupSubmission.scss";
import Footer from "../../../shared/Footer";
import { Link } from "react-router-dom";

class BiWeekly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: props.match.params.id,
    };
  }
  render() {
    return (
      <div style={{ backgroundColor: "#f8f8f8" }}>
        <Navbar panel={"coordinator"} />
        <div className="container group-submission">
          <Card className="submission-card">
            <Card.Header className="gd-card-header">
              G1 - Traffic Optimiser BiWeekly Submissions
            </Card.Header>
            <Card.Body className="gd-card-body">
              <span className="prop-sub-title">
                This is the proposal submission title
              </span>
              <Row className="prop-sub-row">
                <Col md={2}>
                  <p className="prop-sub-date">Submission dead line </p>
                </Col>
                <Col md={1}>
                  <p className="prop-sub-date">: </p>
                </Col>
                <Col md={9}>
                  <p className="prop-sub-date">2020 - 12 - 01 11:55 PM</p>
                </Col>
              </Row>

              <Row>
                <Col md={2}>
                  <p className="prop-sub-date">Submitted date </p>
                </Col>
                <Col md={1}>
                  <p className="prop-sub-date">: </p>
                </Col>
                <Col md={9}>
                  <p className="prop-sub-date">2020 - 12 - 01 11:55 PM</p>
                </Col>
              </Row>

              <Row>
                <Col md={2}>
                  <p className="prop-sub-date">Uploaded file </p>
                </Col>
                <Col md={1}>
                  <p className="prop-sub-date">: </p>
                </Col>
                <Col md={9}>
                  <Link className="prop-sub-attachment">
                    Group_project_2_group_01.pdf
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
}

export default BiWeekly;
