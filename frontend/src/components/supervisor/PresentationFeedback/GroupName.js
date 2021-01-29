import React, { Component } from "react";
import { getFromStorage } from "../../../utils/Storage";
import axios from "axios";

const backendURI = require("../../shared/BackendURI");

class GroupName extends Component {
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
      .get(backendURI.url + "/createGroups/getGroupData/" + this.state.id, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          groupDetails: res.data.data,
          loading: false,
        });
      });
  };

  render() {
    return (
      <span>
        {!this.state.loading && (
          <div>
            {this.state.groupDetails.groupName}
            <br /> ( G{this.state.groupDetails.groupId} )
          </div>
        )}
      </span>
    );
  }
}

export default GroupName;
