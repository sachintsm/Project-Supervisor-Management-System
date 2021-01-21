import React, { Component } from "react";
import Snackpop from "../shared/Snackpop";
import axios from "axios";
import Navbar from "../shared/Navbar";
import "../../css/admin/EditUser.css";
import Footer from "../shared/Footer";
import { passwordResetEmail } from "../shared/emailTemplates";
import { confirmAlert } from "react-confirm-alert";
import { verifyAuth } from "../../utils/Authentication";

const backendURI = require("../shared/BackendURI");

// const userId = localStorage.getItem("auth-id");

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: "",
      snackbaropen: false,
      snackbarmsg: "",
      snackbarcolor: "",

      id: "",
      firstName: "",
      lastName: "",
      email: "",
      birthday: "",
      nic: "",
      mobile: "",
      isStudent: "",
      isAdmin: "",
      isStaff: "",
      isSupervisor: "",
      isCoordinator: "",
      isDeleted: "",
    };

    this.onChange = this.onChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.ResetUserPassword = this.ResetUserPassword.bind(this);
  }

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  async componentDidMount() {
    const authState = await verifyAuth();

    this.setState({ authState: authState });

    if (!authState || !localStorage.getItem("isAdmin"))
      this.props.history.push("/");

    axios
      .get(backendURI.url + "/users/get/" + this.props.match.params.id)

      .then((response) => {
        console.log(response.data.data[0].firstName);

        this.setState({
          id: response.data.data[0]._id,
          firstName: response.data.data[0].firstName,
          lastName: response.data.data[0].lastName,
          email: response.data.data[0].email,
          nic: response.data.data[0].nic,
          mobile: response.data.data[0].mobile,
        });
      })

      .catch(function (error) {
        console.log(error);
      });
  }

  onChange = (e) => {
    e.persist = () => {};
    let store = this.state;
    store[e.target.name] = e.target.value;
    this.setState(store);
  };

  onSubmit(e) {
    e.preventDefault();

    const obj = {
      // _id: this.state._id,

      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      nic: this.state.nic,
      mobile: this.state.mobile,
    };

    confirmAlert({
      title: "Confirm to update",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .post(
                backendURI.url +
                  "/users/updateUser/" +
                  this.props.match.params.id,
                obj
              )
              .then((res) => {
                console.log(res.data.state);
                if (res.data.state === true) {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.msg,
                    snackbarcolor: "success",
                  });
                } else {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.msg,
                    snackbarcolor: "error",
                  });
                }
              });

            // this.props.history.push('/users/editprofile/' + this.props.match.params.id);

            window.location.reload();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  async ResetUserPassword(data) {
    confirmAlert({
      title: "Confirm to reset",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .post(backendURI.url + "/users/updatePasswordA/" + data)
              .then(async (res) => {
                // console.log(res.data));

                if (res.data.state === true) {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.msg,
                    snackbarcolor: "success",
                  });
                } else {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: res.data.msg,
                    snackbarcolor: "error",
                  });
                }

                const email = await passwordResetEmail(
                  this.state.email,
                  this.state.firstName,
                  this.state.lastName
                );
                axios
                  .post(backendURI.url + "/mail/sendmail", email)
                  .then((res) => {
                    console.log(res);
                  });

                // this.props.history.push('adminhome/viewusers/');
                window.location.reload();
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar panel={"admin"} />

        <div className="container-fluid">
          <Snackpop
            msg={this.state.snackbarmsg}
            color={this.state.snackbarcolor}
            time={4000}
            status={this.state.snackbaropen}
            closeAlert={this.closeAlert}
          />

          {/* ************************************************************************************************************************************************************************** */}

          <div className="row">
            <div
              className="col-md-12"
              style={{ backgroundColor: "#f8f9fd", minHeight: "60px" }}
            >
              <div className="container">
                <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col-md-8">
                    <div className="card">
                      <div>
                        <h3 className="head_topic1">Update User</h3>

                        <div>
                          <form onSubmit={this.onSubmit}>
                            <div className="form-group labl">
                              <label>First name</label>

                              <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                value={this.state.firstName}
                                onChange={this.onChange}
                              />
                            </div>

                            <div className="form-group labl">
                              <label>Last name</label>

                              <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                value={this.state.lastName}
                                onChange={this.onChange}
                              />
                            </div>

                            <div className="form-group labl">
                              <label>Email</label>

                              <input
                                type="text"
                                name="email"
                                className="form-control"
                                value={this.state.email}
                                onChange={this.onChange}
                              />
                            </div>

                            <div className="form-group labl">
                              <label>NIC</label>

                              <input
                                type="text"
                                name="nic"
                                className="form-control"
                                value={this.state.nic}
                                onChange={this.onChange}
                              />
                            </div>

                            <div className="form-group labl">
                              <label>Contact Number</label>

                              <input
                                type="text"
                                name="mobile"
                                className="form-control"
                                value={this.state.mobile}
                                onChange={this.onChange}
                              />
                            </div>

                            <div className="form-group labl">
                              <br />

                              <input
                                type="submit"
                                value="Update User"
                                className="btn btn-info btn-length"
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card">
                      <div className="container">
                        <h3 className="head_topic">Reset Password</h3>

                        <div>
                          <div>
                            <p classname="para1">
                              When you press the "Reset Password" button, It
                              automatically assigns the user's NIC number as
                              user's password.
                            </p>
                          </div>

                          <div className="form-group labl">
                            <br />

                            {/* <DeleteForeverIcon className="del-btn" fontSize="large" onClick={() => this.ResetUserPassword(this.state.id)} /> */}

                            <input
                              type="submit"
                              value="Reset password"
                              className="btn btn-danger btn-length"
                              onClick={() =>
                                this.ResetUserPassword(this.state.id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </React.Fragment>
    );
  }
}

export default EditUser;
