import React, { Component } from "react";

import axios from "axios";

import "react-confirm-alert/src/react-confirm-alert.css";

import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { Row, Col } from "reactstrap";

import DatePicker from "react-datepicker";

import { getFromStorage } from "../../../utils/Storage";

import { verifyAuth } from "../../../utils/Authentication";

import { meetingRequestConfirmEmail } from "../../shared/emailTemplates";

import Snackpop from "../../shared/Snackpop";

const backendURI = require("../../shared/BackendURI");

export default class ConfirmMeeting extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.onChangeDate = this.onChangeDate.bind(this);

    this.state = {
      snackbaropen: false,

      snackbarmsg: "",

      snackbarcolor: "",

      item: this.props.project,

      group: this.props.group,

      groupId: "",

      groupEmail: "",

      purpose: "",

      supervisor: "",

      super: "",

      meetId: this.props.data,

      project: "",

      date: new Date(),

      time: "",
    };

    this.onSubmit = this.onSubmit.bind(this);

    this.onTimeChange = this.onTimeChange.bind(this);
  }

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  componentDidMount = async () => {
    console.log(this.state.meetId);

    const authState = await verifyAuth();

    this.setState({
      authState: authState,

      groupDataBlock: [],

      finalBlock: [],
    });

    if (!authState) {
      //!check user is logged in or not if not re-directed to the login form

      this.props.history.push("/");
    }

    const userId = getFromStorage("auth-id").id;

    this.setState({
      userId: userId,
    });

    await axios
      .get(backendURI.url + "/requestMeeting/getmeet/" + this.state.meetId)

      .then((response) => {
        this.setState({
          purpose: response.data.data[0].purpose,

          groupId: response.data.data[0].groupId,
        });
      })

      .catch(function (error) {
        console.log(error);
      });

    await axios
      .get(backendURI.url + "/createGroups/requestemail/" + this.state.groupId)

      .then((res) => {
        this.setState({
          groupEmail: res.data.data[0].groupEmail,
        });
      });
  };

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChangeDate = (date) => {
    this.setState((prevState) => ({
      date: date,
    }));
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async onSubmit(e) {
    e.preventDefault();

    const obj = {
      date: this.state.date,

      time: this.state.time,
    };

    console.log(obj.time);

    axios
      .post(
        backendURI.url + "/requestMeeting/updateMeet/" + this.state.meetId,
        obj
      )

      .then((res) => {
        console.log(res);

        if (res.data.state === true) {
          this.setState({
            snackbaropen: true,

            snackbarmsg: "Meeting successfully confirmed!",

            snackbarcolor: "success",
          });
        } else {
          this.setState({
            snackbaropen: true,

            snackbarmsg: "Confirmation error!",

            snackbarcolor: "error",
          });
        }
      });

    const email = await meetingRequestConfirmEmail(
      this.state.groupEmail,
      this.state.groupId,
      this.state.date,
      this.state.time
    );

    axios
      .post(backendURI.url + "/mail/sendmail", email)

      .then((res) => {
        console.log(res);
      });

    window.location.reload();
  }

  onTimeChange(e) {
    this.setState({ time: e.target.value });

    console.log(this.state.time);
  }

  render() {
    return (
      <div>
        <Snackpop
          msg={this.state.snackbarmsg}
          color={this.state.snackbarcolor}
          time={3000}
          status={this.state.snackbaropen}
          closeAlert={this.closeAlert}
        />

        <div className="container">
          <Button
            className="btn btn-info"
            onClick={this.toggle}
            style={{ width: "100%", marginTop: "0px" }}
          >
            Confirm Meeting
          </Button>

          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Confirm Meeting</ModalHeader>

            <ModalBody>
              <div className="container">
                <div className="row"></div>
                <div
                  style={{ width: "100%", margin: "auto", marginTop: "20px" }}
                >
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <Label for="avatar">Purpose</Label>

                      <Input
                        type="textarea"
                        className="form-control"
                        name="purpose"
                        value={this.state.purpose}
                        readOnly
                      />

                      <p className="reg-error">{this.state.messageError}</p>
                    </div>

                    <Row>
                      <Col>
                        <div className="form-group">
                          <label className="text-label">Date </label>

                          <div className="form-group">
                            <DatePicker
                              className="form-control"
                              selected={this.state.date}
                              onChange={this.onChangeDate}
                              dateFormat="yyyy-MM-dd"
                            />
                          </div>
                        </div>
                      </Col>

                      <Col>
                        <div className="form-group">
                          <label className="text-label">Time </label>

                          <input
                            className="form-control"
                            type="time"
                            name="time"
                            onChange={this.onTimeChange}
                          ></input>
                        </div>
                      </Col>
                    </Row>

                    <div className="form-group">
                      <Button className="btn btn-info" type="submit" block>
                        Confirm Request
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
