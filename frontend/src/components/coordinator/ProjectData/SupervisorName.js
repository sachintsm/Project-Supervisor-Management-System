import React, { Component } from "react";
import { getFromStorage } from "../../../utils/Storage";
import axios from "axios";

const backendURI = require("../../shared/BackendURI");

class SupervisorName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      loading: true,
    };
  }

  componentDidMount() {
    this.getName();
  }

  getName = () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    axios
      .get(backendURI.url + "/users/supervisorList/" + this.state.id, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          supervisorName:
            res.data.data.firstName + " " + res.data.data.lastName,
        });
      });
  };

  render() {
    return <span>{this.state.supervisorName} :</span>;
  }
}

export default SupervisorName;
