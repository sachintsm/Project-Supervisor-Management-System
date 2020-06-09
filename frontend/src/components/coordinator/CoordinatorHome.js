import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/coordinator/CoordinatorHome.css'
import { Row, Col, Button } from 'reactstrap';
class CoordinatorHome extends Component {
  componentDidMount = async () => {
    localStorage.setItem("user-level", "coordinator")

    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isCoordinator"))
      this.props.history.push("/");
  };
  render() {
    console.log(localStorage)
    return (
      <React.Fragment>
        <Navbar panel={"coordinator"} />
        <div className="container">
          <div className="ch-topic-div">
            <p className="ch-topic">On-going Projects</p>
          </div>

          <div className="card container">
            <Row className="ch-project-name-div">
              <p className="ch-project-name">Project Name</p>
            </Row>
            <Row className="">
              <p className="">Project Name</p>
            </Row>
            <Row className="container ch-btn-row">
              <Col md={2}>
                <Button className="btn btn-info ch-btn-btn">Supervisors</Button>
              </Col>
              <Col md={2}>
                <Button className="btn btn-info ch-btn-btn">Groups</Button>
              </Col>
              <Col md={2}>
                <Button className="btn btn-info ch-btn-btn">Bi-Weekly</Button>
              </Col>
              <Col md={2}>
                <Button className="btn btn-info ch-btn-btn">SRC Documents</Button>
              </Col>
              <Col md={2}>
                <Button className="btn btn-info ch-btn-btn">Proposals</Button>
              </Col>

            </Row>
          </div>

          <div className="ch-topic-div">
            <p className="ch-topic">On-going Projects</p>
          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default CoordinatorHome;
