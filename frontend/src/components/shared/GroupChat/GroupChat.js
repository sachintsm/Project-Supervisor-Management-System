import React, { Component } from "react";
import { verifyAuth } from "../../../utils/Authentication";
import MessagesContainer from "./MessagesContainer";
import InputContainer from "./InputContainer";
import "../../../css/shared/GroupChat.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import openSocket from "socket.io-client";
import axios from "axios";
import { getFromStorage } from "../../../utils/Storage";
import Navbar from "../../shared/Navbar";
import { Card } from "react-bootstrap";

const backendURI = require("../BackendURI");

class GroupChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbaropen: false,
      snackbarmsg: "",
      snackbarcolor: "",

      groupDetails: this.props.location.state.groupDetails,
      messages: [],

      socket: openSocket(backendURI.url),

      userName: "",

      groupMembers: [],
      supervisors: [],
      userData: [],
      finalBlock: [],

      dataDiv: false,
    };

    this.state.socket.on("message", (message) => {
      this.setState({
        messages: [...this.state.messages, message],
      });
    });
  }

  async componentDidMount() {
    const authState = await verifyAuth();
    this.setState({
      authState: authState,
    });
    if (!authState) {
      //!check user is logged in or not if not re-directed to the login form
      this.props.history.push("/");
    }
    await axios
      .get(
        backendURI.url +
          "/groupChat/" +
          this.props.location.state.groupDetails._id
      )
      .then((res) => {
        // console.log(res.data.data);

        if (res.data.data.length > 0) {
          this.setState({
            messages: res.data.data[0].messages,
          });
        }
      });
    for (var i = 0; i < this.state.groupDetails.groupMembers.length; i++) {
      await axios
        .get(
          backendURI.url +
            "/users/getStudentDetails/" +
            this.state.groupDetails.groupMembers[i]
        )
        .then((res) => {
          console.log(res.data.data._id);
          const data = {
            _id: res.data.data._id,
            userName: res.data.data.firstName + " " + res.data.data.lastName,
            profileImage: res.data.data.imageName,
          };
          this.setState({
            userData: [...this.state.userData, data],
          });
        });
    }
    for (var j = 0; j < this.state.groupDetails.supervisors.length; j++) {
      await axios
        .get(
          backendURI.url +
            "/users/getUser/" +
            this.state.groupDetails.supervisors[j]
        )
        .then((res) => {
          const data = {
            _id: res.data.data._id,
            userName: res.data.data.firstName + " " + res.data.data.lastName,
            profileImage: res.data.data.imageName,
          };
          this.setState({
            userData: [...this.state.userData, data],
          });
        });
    }
    this.setState({
      dataDiv: true,
    });
  }

  handleSubmit = async (sender, content) => {
    const userId = getFromStorage("auth-id").id;

    let reqBody = {
      userId: userId,
      groupId: this.props.location.state.groupDetails._id,
      content: content,
    };
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };
    await axios
      .post(backendURI.url + "/groupChat/", reqBody, { headers: headers })
      .then((res) => {
        this.state.socket.emit("message", res.data);
        console.log(res.data);
      });
  };

  render() {
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        <div className="container">
          <Card className="task-card-cb">
            <Card.Header className="gd-card-header">Chat Room</Card.Header>
            <Card.Body className="gd-card-body messages-container">
              {this.state.dataDiv &&
                this.state.messages.map((data) => {
                  return (
                    <MessagesContainer
                      messages={data}
                      userData={this.state.userData}
                    />
                  );
                })}
            </Card.Body>
            <div className="input-container">
              <InputContainer handleSubmit={this.handleSubmit} />
            </div>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default GroupChat;
