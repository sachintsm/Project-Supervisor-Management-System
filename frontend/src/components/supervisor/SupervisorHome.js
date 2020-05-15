import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import '../../css/supervisor/SupervisorHome.css'
import Footer from "../shared/Footer";
import Card from '@material-ui/core/Card'
import { Row, Col } from 'reactstrap';
import { Animated } from "react-animated-css";


class SupervisorHome extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount = async () => {
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState || !localStorage.getItem("isSupervisor"))
      this.props.history.push("/");
  }


  render() {
    return (
      <React.Fragment>
        <Navbar panel={"supervisor"} />
        {/* /********************************************************** */}
        
        <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={true} animationInDuration={1500}>
          <div>
            <div className="container">
              <p className="sp-title">Active Projects</p>

              <div>
                <Card className='sp-proj-card'>
                  <Row>
                    <Col md={5}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">2020</p>
                        </Col>
                        <Col md={10}>
                          <p className="sp-proj-content">UOC - Faculty of Science</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={7}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">3rd Year</p>
                        </Col>
                        <Col md={3}>
                          <p className="sp-proj-content">Group 08</p>
                        </Col>
                        <Col md={6}>
                          <p className="sp-proj-content">E-Supervision</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>

                <Card className='sp-proj-card'>
                  <Row>
                    <Col md={5}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">2020</p>
                        </Col>
                        <Col md={10}>
                          <p className="sp-proj-content">UOC - Faculty of Science</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={7}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">3rd Year</p>
                        </Col>
                        <Col md={3}>
                          <p className="sp-proj-content">Group 08</p>
                        </Col>
                        <Col md={6}>
                          <p className="sp-proj-content">E-Supervision</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>

              </div>
            </div>

            <div className="container">
              <p className="sp-title">Recent Projects</p>
              <div>
                <Card className='sp-proj-card'>
                  <Row>
                    <Col md={5}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">2020</p>
                        </Col>
                        <Col md={10}>
                          <p className="sp-proj-content">UOC - Faculty of Science</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={7}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">3rd Year</p>
                        </Col>
                        <Col md={3}>
                          <p className="sp-proj-content">Group 08</p>
                        </Col>
                        <Col md={6}>
                          <p className="sp-proj-content">E-Supervision</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                <Card className='sp-proj-card'>
                  <Row>
                    <Col md={5}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">2020</p>
                        </Col>
                        <Col md={10}>
                          <p className="sp-proj-content">UOC - Faculty of Science</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={7}>
                      <Row>
                        <Col md={2}>
                          <p className="sp-proj-content">3rd Year</p>
                        </Col>
                        <Col md={3}>
                          <p className="sp-proj-content">Group 08</p>
                        </Col>
                        <Col md={6}>
                          <p className="sp-proj-content">E-Supervision</p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>

          </div>
        </Animated>






        {/* /********************************************************** */}
        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default SupervisorHome;
