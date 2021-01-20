import React, { Component } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { Row, Col } from "reactstrap";
import "../../css/shared/index.scss";

const backendURI = require("./BackendURI");

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = { MessageList: {}, loading: true };
    this.getDetails();
  }

  getDetails = () => {
    axios
      .get(backendURI.url + "/users/getstudentdetails/" + this.props.index)
      .then((res) => {
        this.setState({
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          regNumber: res.data.data.regNumber,
          email: res.data.data.email,
          image: res.data.data.imageName,
          index: res.data.data.indexNumber,
          mobile: res.data.data.mobile,
          cat: res.data.data.regNumber.substring(5, 7).toUpperCase(),
        });
      });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      firstName: "",
      lastName: "",
      regNumber: "",
      email: "",
      mobile: "",
      image: "",
      index: "",
    });

    axios
      .get(backendURI.url + "/users/getstudentdetails/" + this.props.index)
      .then((res) => {
        this.setState({
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          regNumber: res.data.data.regNumber,
          email: res.data.data.email,
          image: res.data.data.imageName,
          index: res.data.data.indexNumber,
          mobile: res.data.data.mobile,
          cat: res.data.data.regNumber.substring(5, 7).toUpperCase(),
        });
      });
  };

  render() {
    return (
      <span>
        <span onClick={this.toggle}>
          <span style={{ cursor: "pointer" }}>
            {this.props.index} ({this.state.cat}){" "}
          </span>
        </span>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="index-data">
            <span className="text-name">
              {this.state.firstName} {this.state.lastName}
              <br />
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="container index-data">
              <Row className="data-div">
                <Col md={4}>
                  <img
                    alt=""
                    src={
                      backendURI.url + "/users/profileImage/" + this.state.image
                    }
                    className="image"
                  ></img>
                  <br />
                </Col>
                <Col md={8}>
                  <span className="text">
                    <Row>
                      <Col md={4}>Course &nbsp;&nbsp;:</Col>
                      <Col md={8}>
                        <span className="text-cont">{this.state.cat}</span>
                      </Col>
                    </Row>
                  </span>
                  <span className="text">
                    <Row>
                      <Col md={4}>Reg No&nbsp; :</Col>
                      <Col md={8}>
                        <span className="text-cont">
                          {this.state.regNumber}
                        </span>
                      </Col>
                    </Row>
                  </span>

                  <span className="text">
                    <Row>
                      <Col md={4}>Index &nbsp;&nbsp;&nbsp;&nbsp;:</Col>
                      <Col md={8}>
                        <span className="text-cont">{this.state.index}</span>
                      </Col>
                    </Row>
                  </span>
                  <span className="text">
                    <Row>
                      <Col md={4}>Email &nbsp;&nbsp;&nbsp;&nbsp;:</Col>
                      <Col md={8}>
                        <span className="text-cont">{this.state.email}</span>
                      </Col>
                    </Row>
                  </span>

                  <span className="text">
                    <Row>
                      <Col md={4}>Mobile &nbsp;:</Col>
                      <Col md={8}>
                        <span className="text-cont">{this.state.mobile}</span>
                      </Col>
                    </Row>
                  </span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </span>
    );
  }
}
