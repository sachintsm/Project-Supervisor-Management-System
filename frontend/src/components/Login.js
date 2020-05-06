import React, { Component } from "react";
import Card from "@material-ui/core/Card";
//
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Form } from "reactstrap";
import "../css/admin/Login.css";
import { setInStorage } from "../utils/storage";
import { MDBInput, MDBBtn } from "mdbreact";
const backendURI = require("./shared/BackendURI");

export default class login extends Component {
  constructor(props) {
    super(props);

    // if (localStorage.getItem("isAdmin")) {
    //   this.props.history.push("/adminhome");
    // } else if (localStorage.getItem("isCoordinator")) {
    //   this.props.history.push("/coordinatorhome");
    // } else if (localStorage.getItem("isSupervisor")) {
    //   this.props.history.push("/supervisorhome");
    // } else if (localStorage.getItem("isStudent")) {
    //   this.props.history.push("/studenthome");
    // } else {
    //   this.props.history.push("/");
    // }

    this.state = {
      token: "",
      signUpError: "",
      signInError: "",
      masterError: "",
      email: "",
      password: "",
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSignIn() {
    const { email, password } = this.state;

    fetch(backendURI.url + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log("josn", json);
        if (json.state) {
          setInStorage("auth-token", { token: json.token });
          this.setState({
            signInError: json.msg,
            password: "",
            userId: "",
            token: json.token,
          });

          if (json.isAdmin) {
            setInStorage("isAdmin", true);
          }
          if (json.isStudent) {
            setInStorage("isStudent", true);
          }
          if (json.isSupervisor) {
            setInStorage("isSupervisor", true);
          }
          if (json.isCoordinator) {
            setInStorage("isCoordinator", true);
          }

          if (json.isAdmin) {
            this.props.history.push("/adminhome");
          } else if (json.isCoordinator) {
            this.props.history.push("/coordinatorhome");
          } else if (json.isSupervisor) {
            this.props.history.push("/supervisorhome");
          } else if (json.isStudent) {
            this.props.history.push("/studenthome");
          }
        } else {
          this.setState({
            signInError: json.msg,
          });
        }
      });
  }

  render() {
    const { email, password, signInError } = this.state;

    return (
      <div
        className="container-fluid"
        style={{ backgroundColor: "#F8F9FA", minHeight: "700px" }}
      >
        <div className="row">
          <div className="container login-card-div">
            <Card className="login-card">
              <Form>
                {signInError ? <p>{signInError}</p> : null}
                {/* eslint-disable-next-line */}
                <img
                  src={require("../assets/logo/Logo_reg.png")}
                  className="logo"
                />
                <CardContent
                  style={{ marginLeft: "20px", marginRight: "20px" }}
                >
                  <Typography color="textSecondary" gutterBottom>
                    Email
                  </Typography>
                  <MDBInput
                    label="Email"
                    outline
                    icon="envelope"
                    type="text"
                    placeholder="userId"
                    name="email"
                    value={email}
                    onChange={this.onChangeEmail}
                  />
                  <Typography color="textSecondary" gutterBottom>
                    Password
                  </Typography>
                  <MDBInput
                    label="Password"
                    outline
                    icon="key"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={this.onChangePassword}
                  />
                </CardContent>
                <CardActions style={{ marginBottom: "20px" }}>
                  <MDBBtn
                    outline
                    style={{ margin: "auto", width: "40%" }}
                    color="info"
                    size="small"
                  >
                    Forget Password
                  </MDBBtn>
                  <MDBBtn
                    color="info"
                    style={{ margin: "auto", width: "40%" }}
                    onClick={this.onSignIn}
                  >
                    login
                  </MDBBtn>
                </CardActions>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
