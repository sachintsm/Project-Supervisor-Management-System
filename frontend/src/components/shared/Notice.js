import React, { Component } from "react";
//import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
//import { verifyAuth } from "../../utils/Authentication";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";

import {getFromStorage} from "../../utils/Storage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


import "../../css/shared/Notice.css";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
import Snackpop from "../shared/Snackpop";
import axios from "axios";

import {
  Button,
  Container,
  Col,
  Row,
  FormControl,
  FormGroup,
} from "react-bootstrap";

const backendURI = require("./BackendURI");

class Notice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //userType:"",
      noticeTittle: "",
      notice: "",
      noticeAttachment: "",
      date: "",
      succesAlert: false,
      deleteSuccesAlert: false,
      warnAlert: false,
      snackbaropen: false,
      toViewType: true,
      toCordinator: false,
      toSupervisor: false,
      toStudent: false,
      snackbarmsg: "",
      noticeType: "",
      userTypes:'',
      noticeList: [],
    };

    this.onChangeTittle = this.onChangeTittle.bind(this);
    this.onChangeNotice = this.onChangeNotice.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getNoticeList = this.getNoticeList.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
  }

  snackbarClose = (event) => {
    this.setState({ snackbaropen: false });
  };

  componentDidMount() {
    this.getNoticeList();

    this.userTypes = localStorage.getItem("user-level");
    

    console.log(this.userTypes)
  }

  // Notice get from database and map to the array
  getNoticeList() {
    axios.get(backendURI.url + "/notice/viewNotice").then((result) => {
      if (result.data.length > 0) {
        console.log(result.data);
        this.setState({
          noticeList: result.data.map((type) => type),
        });

        
      } else {
        this.setState({
          noticeList: [],
        });
      }
    });
  }

  onChangeTittle(e) {
    this.setState({
      noticeTittle: e.target.value,
    });
  }

  onChangeNotice(e) {
    this.setState({
      notice: e.target.value,
    });
  }

  onChangeFile(e) {
    this.setState({
      noticeAttachment: e.target.files[0],
    });
  }

  // when press add notice button call this function then save data in database
  onSubmit(e) {
    e.preventDefault();
    confirmAlert({
      title: "Create Notice",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            this.state.date = Date();

            const userType = localStorage.getItem("user-level");
            const userId = localStorage.getItem("auth-id");

          


            const formData = new FormData();
            formData.append("userId",userId);
            formData.append("userType",userType);
            formData.append("noticeTittle", this.state.noticeTittle);
            formData.append("notice", this.state.notice);
            formData.append("date", this.state.date);
            formData.append("noticeAttachment", this.state.noticeAttachment);
            formData.append("toViewType", this.state.toViewType);
            formData.append("toCordinator", this.state.toCordinator);
            formData.append("toSupervisor", this.state.toSupervisor);
            formData.append("toStudent", this.state.toStudent);

            // form required set
            if (
              this.state.noticeTittle === "" ||
              this.state.notice === "" ||
              this.state.noticeAttachment === ""
            ) {
              this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Form..!",
              });
            } else {
              axios
                .post(backendURI.url + "/notice/addNotice", formData)
                .then((res) => {
                  this.setState({
                    succesAlert: true,
                  });
                  this.getNoticeList();
                  console.log(res.data);
                })
                .catch((error) => {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: error,
                  });
                  console.log(error);
                });
            }

            this.setState({
              noticeTittle: "",
              notice: "",
              noticeAttachment: "",
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

  onDeleteHandler = (id, filePath) => {
    console.log(filePath);
    confirmAlert({
      title: "Delete Notice",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            axios
              .delete(backendURI.url + "/notice/delteNotice/" + id)
              .then((res) => {
                this.setState({
                  deleteSuccesAlert: true,
                });
                this.getNoticeList();
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  closeAlert = () => {
    this.setState({
      succesAlert: false,
      warnAlert: false,
    });
  };



  render() {

    if(this.userTypes == 'admin'){
    return (
      <React.Fragment>
        <Snackpop
          msg={"Successfully Added"}
          color={"success"}
          time={3000}
          status={this.state.succesAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={"Deleted Successfully.."}
          color={"success"}
          time={1000}
          status={this.state.deleteSuccesAlert}
          closeAlert={this.closeAlert}
        />

        <Navbar panel={"admin"} />

        <div
          className="container-fluid container-fluid-div"
          style={{ backgroundColor: "rgb(252, 252, 252)" }}
        >
          <Snackbar
            open={this.state.snackbaropen}
            autoHideDuration={2000}
            onClose={this.snackbarClose}
            message={<span id="message-id">{this.state.snackbarmsg}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="secondary"
                onClick={this.snackbarClose}
              >
                {" "}
                x{" "}
              </IconButton>,
            ]}
          />
          <Row>
            <Col>
              <Container>
                <div
                  className="card"
                  style={{
                    width: "80%",
                    margin: "auto",
                    marginTop: "40px",
                    marginBottom: "40px",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                  }}
                >
                  <div className="container">
                    <h3 style={{ marginTop: "30px" }}>Creating New Notice</h3>

                    <Row className="margin-top-30">
                      <Col>
                        <label className="verticle-align-middle cp-text">
                          Notice Tittle :{" "}
                        </label>
                        <FormControl
                          type="text"
                          style={{ width: "100%" }}
                          placeholder="Notice Tittle"
                          value={this.state.noticeTittle}
                          onChange={this.onChangeTittle}
                        ></FormControl>
                      </Col>
                    </Row>

                    <Row className="margin-top-30">
                      <Col>
                        <div className="form-group">
                          <p style={{ textalign: "left", color: " #6d6d6d" }}>
                            Notice :
                          </p>
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Enter Notice"
                            value={this.state.notice}
                            onChange={this.onChangeNotice}
                          ></textarea>
                        </div>
                      </Col>
                    </Row>

                    <Row className="margin-top-30">
                      <Col md={4} className="form-control-label ">
                        <FormControlLabel
                          className="form-control-label"
                          control={
                            <Checkbox
                              fontSize="5px"
                              checked={this.state.toViewType}
                              onChange={() => {
                                this.setState({
                                  toViewType: !this.state.toViewType,
                                });
                              }}
                              name="checkedB"
                              color="default"
                            />
                          }
                          label={
                            <span
                              style={{ fontSize: "14px", color: "#6d6d6d" }}
                            >
                              To View
                            </span>
                          }
                        />
                      </Col>
                      <Col className="col-padding-5">
                        {this.state.toViewType && (
                          <FormControlLabel
                            className="form-control-label"
                            control={
                              <Checkbox
                                fontSize="5px"
                                checked={this.state.toCordinator}
                                onChange={() => {
                                  this.setState({
                                    toCordinator: !this.state.toCordinator,
                                  });
                                }}
                                name="checkedB"
                                color="default"
                              />
                            }
                            label={
                              <span style={{ fontSize: "12px" }}>
                                Cordinators
                              </span>
                            }
                          />
                        )}
                      </Col>
                      <Col className="col-padding-5">
                        {this.state.toViewType && (
                          <FormControlLabel
                            className="form-control-label"
                            control={
                              <Checkbox
                                fontSize="5px"
                                checked={this.state.toSupervisor}
                                onChange={() => {
                                  this.setState({
                                    toSupervisor: !this.state.toSupervisor,
                                  });
                                }}
                                name="checkedB"
                                color="default"
                              />
                            }
                            label={
                              <span style={{ fontSize: "12px" }}>
                                Supervisors
                              </span>
                            }
                          />
                        )}
                      </Col>
                      <Col className="col-padding-5">
                        {this.state.toViewType && (
                          <FormControlLabel
                            className="form-control-label"
                            control={
                              <Checkbox
                                fontSize="5px"
                                checked={this.state.toStudent}
                                onChange={() => {
                                  this.setState({
                                    toStudent: !this.state.toStudent,
                                  });
                                }}
                                name="checkedB"
                                color="default"
                              />
                            }
                            label={
                              <span style={{ fontSize: "12px" }}>Studentd</span>
                            }
                          />
                        )}
                      </Col>
                    </Row>
                    <Row className="margin-top-30">
                      <Col>
                        <label className="verticle-align-middle cp-text">
                          File Attach :{" "}
                        </label>
                        <FormGroup>
                          <input
                            type="file"
                            name="noticeAttachment"
                            id="exampleFile"
                            onChange={this.onChangeFile}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row style={{ marginTop: "40px", marginBottom: "30px" }}>
                      <Button
                        type="submit"
                        className="cp-btn"
                        variant="info"
                        onClick={this.onSubmit}
                      >
                        Add Notice
                      </Button>
                    </Row>
                  </div>
                </div>
                {this.state.noticeList.length > 0 && (
                  <div>
                    <h3>Notice View </h3>
                    <div>
                      {this.state.noticeList.map((type) => {
                        if(type.userType === 'admin'){
                        return (
                          
                          <Card
                            key={type._id}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                          >
                        
                          
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6>{type.noticeTittle}</h6>
                            </CardContent>
                            <h8
                              style={{ color: "#6d6d6d", paddingLeft: "13px" }}
                            >
                              {type.date}
                            </h8>
                            <CardContent style={{ paddingTop: "2px" }}>
                              <Typography variant="body1" component="p">
                                {type.notice}
                              </Typography>
                            </CardContent>

                            <CardContent
                              style={{
                                paddingBottom: "2px",
                                paddingTop: "1px",
                              }}
                            >
                              <a
                                href={
                                  "http://localhost:4000/notice/noticeAttachment/" +
                                  type.filePath
                                }
                              >
                                Attachment
                              </a>
                            </CardContent>

                            <CardActions>
                              <Button
                                size="small"
                                variant="outline-danger"
                                style={{ width: "20%" }}
                                onClick={() =>
                                  this.onDeleteHandler(type._id, type.filepath)
                                }
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                         
                        );
                      }
                      })}
                    </div>
                  </div>
                )}
              </Container>
            </Col>
          </Row>
        </div>
        <Footer />
      </React.Fragment>
    );
  }else if(this.userTypes == 'coordinator'){
    return(
      <React.Fragment>

      <Snackpop
          msg={"Successfully Added"}
          color={"success"}
          time={3000}
          status={this.state.succesAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={"Deleted Successfully.."}
          color={"success"}
          time={1000}
          status={this.state.deleteSuccesAlert}
          closeAlert={this.closeAlert}
        />

        <Navbar panel={"coordinator"} />

        <div
          className="container-fluid container-fluid-div"
          style={{ backgroundColor: "rgb(252, 252, 252)" }}
        >
          <Snackbar
            open={this.state.snackbaropen}
            autoHideDuration={2000}
            onClose={this.snackbarClose}
            message={<span id="message-id">{this.state.snackbarmsg}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="secondary"
                onClick={this.snackbarClose}
              >
                {" "}
                x{" "}
              </IconButton>,
            ]}
          />

          <Row>
            <Col>
              <Container>
                <div
                  className="card"
                  style={{
                    width: "80%",
                    margin: "auto",
                    marginTop: "40px",
                    marginBottom: "40px",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                  }}
                >
                  <div className="container">
                    <h3 style={{ marginTop: "30px" }}>Creating New Notices</h3>

                    <Row className="margin-top-30">
                      <Col>
                        <label className="verticle-align-middle cp-text">
                          Notice Tittle :{" "}
                        </label>
                        <FormControl
                          type="text"
                          style={{ width: "100%" }}
                          placeholder="Notice Tittle"
                          value={this.state.noticeTittle}
                          onChange={this.onChangeTittle}
                        ></FormControl>
                      </Col>
                    </Row>

                    <Row className="margin-top-30">
                      <Col>
                        <div className="form-group">
                          <p style={{ textalign: "left", color: " #6d6d6d" }}>
                            Notice :
                          </p>
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Enter Notice"
                            value={this.state.notice}
                            onChange={this.onChangeNotice}
                          ></textarea>
                        </div>
                      </Col>
                    </Row>

                    <Row className="margin-top-30">
                      <Col md={4} className="form-control-label ">
                        <FormControlLabel
                          className="form-control-label"
                          control={
                            <Checkbox
                              fontSize="5px"
                              checked={this.state.toViewType}
                              onChange={() => {
                                this.setState({
                                  toViewType: !this.state.toViewType,
                                });
                              }}
                              name="checkedB"
                              color="default"
                            />
                          }
                          label={
                            <span
                              style={{ fontSize: "14px", color: "#6d6d6d" }}
                            >
                              To View
                            </span>
                          }
                        />
                      </Col>
                     
                      <Col className="col-padding-5">
                        {this.state.toViewType && (
                          <FormControlLabel
                            className="form-control-label"
                            control={
                              <Checkbox
                                fontSize="5px"
                                checked={this.state.toSupervisor}
                                onChange={() => {
                                  this.setState({
                                    toSupervisor: !this.state.toSupervisor,
                                  });
                                }}
                                name="checkedB"
                                color="default"
                              />
                            }
                            label={
                              <span style={{ fontSize: "12px" }}>
                                Supervisors
                              </span>
                            }
                          />
                        )}
                      </Col>
                      <Col className="col-padding-5">
                        {this.state.toViewType && (
                          <FormControlLabel
                            className="form-control-label"
                            control={
                              <Checkbox
                                fontSize="5px"
                                checked={this.state.toStudent}
                                onChange={() => {
                                  this.setState({
                                    toStudent: !this.state.toStudent,
                                  });
                                }}
                                name="checkedB"
                                color="default"
                              />
                            }
                            label={
                              <span style={{ fontSize: "12px" }}>Studentd</span>
                            }
                          />
                        )}
                      </Col>
                    </Row>
                    <Row className="margin-top-30">
                      <Col>
                        <label className="verticle-align-middle cp-text">
                          File Attach :{" "}
                        </label>
                        <FormGroup>
                          <input
                            type="file"
                            name="noticeAttachment"
                            id="exampleFile"
                            onChange={this.onChangeFile}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row style={{ marginTop: "40px", marginBottom: "30px" }}>
                      <Button
                        type="submit"
                        className="cp-btn"
                        variant="info"
                        onClick={this.onSubmit}
                      >
                        Add Notice
                      </Button>
                    </Row>
                  </div>
                </div>

                {this.state.noticeList.length > 0  && (
                  <div>
                    <h3>Notice View </h3>
                    <div>
                      {this.state.noticeList.map((type) => {
                        if(type.userType === 'coordinator'){
                        return (
                          <Card
                            key={type._id}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                          >
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6>{type.noticeTittle}</h6>
                            </CardContent>
                            <h8
                              style={{ color: "#6d6d6d", paddingLeft: "13px" }}
                            >
                              {type.date}
                            </h8>
                            <CardContent style={{ paddingTop: "2px" }}>
                              <Typography variant="body1" component="p">
                                {type.notice}
                              </Typography>
                            </CardContent>

                            <CardContent
                              style={{
                                paddingBottom: "2px",
                                paddingTop: "1px",
                              }}
                            >
                              <a
                                href={
                                  "http://localhost:4000/notice/noticeAttachment/" +
                                  type.filePath
                                }
                              >
                                Attachment
                              </a>
                            </CardContent>

                            <CardActions>
                              <Button
                                size="small"
                                variant="outline-danger"
                                style={{ width: "20%" }}
                                onClick={() =>
                                  this.onDeleteHandler(type._id, type.filepath)
                                }
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                        );
                              }
                      })}
                    </div>
                  </div>
                )}

                </Container>
                </Col>
              </Row>
          </div>
          <Footer />
      </React.Fragment>

    )
  }else{
    return(
      <h2></h2>
    )
  }
  }
  }

export default Notice;
