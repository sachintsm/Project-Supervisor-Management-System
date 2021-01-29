import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

class Snackpop extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.Alert = this.Alert.bind(this);
    this.state = {
      succesAlert: true,
    };
  }

  handleClose() {
    this.props.closeAlert();
  }

  Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  render() {
    return (
      <Snackbar
        open={this.props.status}
        autoHideDuration={this.props.time}
        onClose={this.handleClose}
      >
        <this.Alert severity={this.props.color} onClose={this.handleClose}>
          {this.props.msg}
        </this.Alert>
      </Snackbar>
    );
  }
}

export default Snackpop;
