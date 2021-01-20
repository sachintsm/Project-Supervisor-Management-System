import React, { Component } from "react";
import axios from "axios";
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col, Card, Container } from "react-bootstrap";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "../../../css/students/progress/TotalProgressCard.scss";
import IndividualTotalProgress from "./IndividualTotalProgress";

const backendURI = require("../../shared/BackendURI");

class TotalProgressCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: this.props.groupDetails._id,
      groupDetails: this.props.groupDetails,
      totalProgress: 0,
      totalProgressInt: 0,
      studentProgress: 0,
      loading: true,
    };
    this.getTotalProgress();
  }

  getTotalProgress = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    axios
      .get(
        backendURI.url + "/progress/gettotalprogress/" + this.state.groupId,
        { headers: headers }
      )
      .then((res) => {
        let totalProgress = parseFloat(res.data);
        this.setState({
          totalProgress: totalProgress,
          totalProgressInt: Math.round(totalProgress * 1) / 1,
          loading: false,
        });
      });
  };

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
                    {this.state.totalProgressInt <= 33 && (
                      <CircularProgressbar
                        styles={buildStyles({
                          textColor: "#DC3545",
                          pathColor: "#DC3545",
                        })}
                        value={this.state.totalProgressInt}
                        text={`${this.state.totalProgressInt}%`}
                      />
                    )}
                    {this.state.totalProgressInt <= 66 &&
                      this.state.totalProgressInt > 33 && (
                        <CircularProgressbar
                          styles={buildStyles({
                            textColor: "#FFC107",
                            pathColor: "#FFC107",
                          })}
                          value={this.state.totalProgressInt}
                          text={`${this.state.totalProgressInt}%`}
                        />
                      )}
                    {this.state.totalProgressInt <= 100 &&
                      this.state.totalProgressInt > 66 && (
                        <CircularProgressbar
                          styles={buildStyles({
                            textColor: "#28A745",
                            pathColor: "#28A745",
                          })}
                          value={this.state.totalProgressInt}
                          text={`${this.state.totalProgressInt}%`}
                        />
                      )}
                  </Col>
                  <Col
                    md={8}
                    sm={12}
                    xs={12}
                    className="individual-progress-div"
                  >
                    {!this.state.loading &&
                      this.state.groupDetails.groupMembers.map((member) => {
                        return (
                          <IndividualTotalProgress
                            key={member}
                            member={member}
                            groupId={this.state.groupDetails._id}
                            totalProgress={this.state.totalProgress}
                            parentComponent={"totalProgress"}
                          />
                        );
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
