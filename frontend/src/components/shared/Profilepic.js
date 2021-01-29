import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import "../../css/shared/Profile.scss";
import { getFromStorage } from "../../utils/Storage";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import { Row, Col } from "reactstrap";
import Snackpop from "./Snackpop";

const backendURI = require("./BackendURI");

class Profilepic extends Component {
  async componentDidMount() {
    const authState = await verifyAuth();
    const userData = getFromStorage("auth-id");
    this.setState({ authState: authState });

    if (!authState) {
      this.props.history.push("/");
    } else {
      axios
        .get(backendURI.url + "/users/get/" + userData.id)
        .then((response) => {
          this.setState({
            mulImage: response.data.data[0].imageName,
            username: response.data.data[0].firstName,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  constructor(props) {
    super(props);
    this.onChangeP = this.onChangeP.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.state = {
      form: {
        multerImage: "",
      },
      username: "",
      mulImage: "",
      snackbaropen: false,
      snackbarmsg: "",
      snackbarcolor: "",

      imgName: "",
    };
  }
  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };

  onFormSubmit(e) {
    e.preventDefault();
    if (!this.state.form.file) {
      this.setState({
        snackbaropen: true,
        snackbarmsg: "Please select a picture.",
        snackbarcolor: "error",
      });
    } else {
      confirmAlert({
        title: "Confirm to change",
        message: "Are you sure to change?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              const userData = getFromStorage("auth-id");
              let formData = new FormData();
              formData.append("profileImage", this.state.form.file);
              axios
                .post(
                  backendURI.url + "/users/uploadmulter/" + userData.id,
                  formData
                )
                .then((response) => {
                  console.log(response);
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: response.data.msg,
                    snackbarcolor: "success",
                  });
                })
                .catch((error) => {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: "Uploading Error!",
                    snackbarcolor: "error",
                  });
                });
            },
          },
          {
            label: "No",
            onClick: () => {
              window.location.reload(false);
            },
          },
        ],
      });
    }
  }
  onChangeP(e) {
    this.setState({
      multerImage: e.target.files[0].name,
    });
    this.setState({
      form: {
        file: e.target.files[0],
      },
    });
  }
  render() {
    return (
      <div className="container user-profile">
        <Snackpop
          msg={this.state.snackbarmsg}
          color={this.state.snackbarcolor}
          time={3000}
          status={this.state.snackbaropen}
          closeAlert={this.closeAlert}
        />
        <div className="testimonial-card" style={{ backgroundColor: "white" }}>
          <div className="card-body1">
            {this.state.mulImage === "" ? (
              <img
                alt=""
                src={require("../../assets/images/default.jpg")}
                className="profilepic"
                style={{ padding: "10px" }}
              />
            ) : (
              <img
                alt=""
                src={
                  "http://localhost:4000/users/profileImage/" +
                  this.state.mulImage
                }
                className="profilepic"
                style={{ padding: "10px" }}
              />
            )}{" "}
            <br></br>
          </div>
        </div>
        <div className="testimonial-card1">
          <div className="card-body1">
            <div className="form-group1">
              <form onSubmit={this.onFormSubmit}>
                <Row>
                  <Col md={12} xs="12">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text"> Upload </span>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          onChange={this.onChangeP}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="inputGroupFile01"
                        >
                          {this.state.multerImage}
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-info my-4"
                      style={{ width: "100%" }}
                    >
                      Upload
                    </button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profilepic;
