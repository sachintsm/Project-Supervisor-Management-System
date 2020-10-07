import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

import '../../../css/coordinator/proposel.scss';

import {
  Button,
  Container,
  Col,
  Row,
  FormControl,
  FormGroup,
} from "react-bootstrap";

export default class SRS extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar panel={"coordinator"} />

        <div className="proposel-style">
          <div className="container-fluid pro-back">
            <div className="container">

              <Tabs defaultActiveKey="Submited SRS" id="uncontrolled-tab-example" className="pro-tabs" style={{ marginBottom: "30px" }}>

                <Tab eventKey="Submited SRS" title="Submited SRS" className="pro-tab">

                  <div className="card conatiner" style={{ margin: "0px 0px 20px 0px" }}>

                    <div className="pro-head">
                      <p className="pro-grp-name">G-08</p>
                    </div>

                    <div className="pro-body">
                      <h6>SRS Details</h6>
                      <a>Attachment </a>
                    </div>

                  </div>

                </Tab>


                <Tab eventKey="Create Link" title="Create SRS" className="pro-tab">

                  <div>
                    <div className="card container pro-link-crd">

                      <form>

                        <Row>
                          <p className="pro-link-name">Crate New SRS</p>
                        </Row>

                        <div className="form-group pro-form">
                          <label for="exampleInputProposel">SRS Tittle :</label>
                          <input type="text" className="form-control" id="exampleInputProposel" placeholder="BiWeekly Tittle" />
                        </div>



                        <Row >

                          <Col md={6} xs="12">
                            <div className="form-group pro-form">
                              <label for="exampleInputDate">Dead Line Date :</label>
                              <input type="date" className="form-control" id="exampleInputDate" />
                            </div>
                          </Col>

                          <Col md={6} xs="12">
                            <div className="form-group pro-form">
                              <label for="exampleInputTime">Dead Line Time :</label>
                              <input type="time" className="form-control" id="exampleInputTime" />
                            </div>
                          </Col>

                        </Row>

                        <Row>
                          <Col md={6} xs="12">
                            <label className="verticle-align-middle  pro-form">File Attach :{" "}</label>
                            <FormGroup className="pro-form">

                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text"> Upload </span>
                                </div>
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="exampleFile"
                                    name="noticeAttachment"
                                  />
                                  <label className="custom-file-label" htmlFor="inputGroupFile01"></label>
                                </div>
                              </div>

                            </FormGroup>
                          </Col>

                          <Col md={6} xs="12">
                            <div className="form-group pro-form">
                              <label className="text-label">State : </label>
                              <div className="form-group">
                                <select className="form-control" id="dropdown" >
                                  <option>Select State</option>
                                  <option value="Student">Pending</option>
                                  <option value="Staff">Open</option>
                                  <option value="Admin">Close</option>
                                </select>
                              </div>
                            </div>

                          </Col>



                        </Row>



                        <Row style={{ marginTop: "10px", marginBottom: "20px" }}>
                          <Button
                            type="submit"
                            className="pro-btn"
                            variant="info"
                            onClick={this.onSubmit}>Add New SRS
            </Button>
                        </Row>

                      </form>

                    </div>

                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>

        <Footer />
      </React.Fragment>


    )
  }
}

