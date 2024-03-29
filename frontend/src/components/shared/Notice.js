import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
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

class noticeBlock {
  constructor(_id, userType, projectName, date, time, noticeTittle, notice, noticeAttachment, toCordinator, toSupervisor, toStudent) {
    this._id = _id;
    this.userType = userType;
    this.projectName = projectName;
    this.date = date;
    this.time = time;

    this.noticeTittle = noticeTittle;
    this.notice = notice;
    this.noticeAttachment = noticeAttachment;
    this.toCordinator = toCordinator;
    this.toSupervisor = toSupervisor;
    this.toStudent = toStudent;

  }
}

class Notice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //userType:"",
      noticeTittle: "",
      notice: "",
      noticeAttachment: "",
      noticeType: "",
      userTypes: '',
      userId: "",
      viewUserSelect: 'Select user to View :',
      projectId: "",
      toCordinator: false,
      toSupervisor: false,
      toStudent: false,

      selectedTypeIndex: 0,

      succesAlert: false,
      deleteSuccesAlert: false,
      warnAlert: false,
      snackbaropen: false,
      snackbarmsg: "",

      projectTypeList: [],
      noticeList: [],
      noticeListCo: [],
      noticeListBlock: [],
      activeProjects: [],

      noticeTittleError: "",
      noticeError: "",
      viewUserSelectError: "",
      projectIdError: "",
      noticeTittleLenthError: "",

      imgname: '',
    };

    this.onChangeTittle = this.onChangeTittle.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.onChangeNotice = this.onChangeNotice.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getNoticeList = this.getNoticeList.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.getNoticeListCordinator = this.getNoticeListCordinator.bind(this);

  }



  componentDidMount() {
    this.getNoticeList();
    this.getProjectDetails();
    this.getNoticeListCordinator();

    this.userTypes = localStorage.getItem("user-level");
    this.userId = localStorage.getItem("auth-id");



  }

  getNoticeListCordinator = async () => {
    this.userType = localStorage.getItem("user-level");

    const userId = getFromStorage('auth-id').id;

    await axios.get(backendURI.url + '/notice/cogetNotice/' + userId)
      .then(res => {
        this.setState({ noticeListCo: res.data.data })
      })

    for (let i = 0; i < this.state.noticeListCo.length; i++) {
      await axios.get(backendURI.url + '/notice/getProjectName/' + this.state.noticeListCo[i].projectId)
        .then(res => {

          var _id = this.state.noticeListCo[i]._id;
          var userType = this.state.noticeListCo[i].userType;
          var date = this.state.noticeListCo[i].date;
          var time = this.state.noticeListCo[i].time;
          var projectName = res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear;
          var noticeTittle = this.state.noticeListCo[i].noticeTittle;
          var notice = this.state.noticeListCo[i].notice;
          var noticeAttachment = this.state.noticeListCo[i].filePath;
          var toCordinator = this.state.noticeListCo[i].toCordinator;
          var toSupervisor = this.state.noticeListCo[i].toSupervisor;
          var toStudent = this.state.noticeListCo[i].toStudent;


          var block = new noticeBlock(_id, userType, projectName, date, time, noticeTittle, notice, noticeAttachment, toCordinator, toSupervisor, toStudent)

          this.setState({
            noticeListBlock: [...this.state.noticeListBlock, block]
          })
        })

    }

  }

  // Notice get from database and map to the array
  getNoticeList() {
    const uId = JSON.parse(localStorage.getItem("auth-id"))
    axios.get(backendURI.url + '/notice/NoticeView/' + uId.id)
      .then((res => {
        this.setState({
          noticeList: res.data.data
        })
      }))
  }

  // get project details
  async getProjectDetails() {
    const authState = await verifyAuth();

    this.setState({
      authState: authState,
    });
    if (!authState || (!localStorage.getItem("isCoordinator") && !localStorage.getItem("isAdmin"))) { //!check user is logged in or not if not re-directed to the login form
      this.props.history.push("/");
    }

    const coId = JSON.parse(localStorage.getItem("auth-id"))

    //? load all the active project names from
    axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
      .then((res => {
        this.setState({
          activeProjects: res.data.data

        })
      }))
  }

  // validaion notice form
  validate = () => {
    let isError = false;
    const errors = {
      noticeTittleError: "",
      noticeError: "",
      viewUserSelectError: "",
      projectIdError: "",
      noticeTittleLenthError: "",
    }

    if (this.userTypes === "coordinator") {

      if (this.state.noticeTittle.length < 1) {
        isError = true;
        errors.noticeTittleError = 'Notice Tittle required *'
      }

      if (this.state.noticeTittle.length >= 60) {
        isError = true;
        errors.noticeTittleLenthError = 'Lenth must be less than 60 *'
      }
      if (this.state.notice.length < 1) {
        isError = true;
        errors.noticeError = 'Notice Content required *'
      }
      if (this.state.toCordinator === 'false' && this.state.toStudent === 'false' && this.state.toSupervisor === 'false') {
        isError = true;
        errors.viewUserSelectError = 'must be select at least one *'
      }


      if (this.state.projectId.length === 0) {
        isError = true;
        errors.projectIdError = 'Project type must be specified *'
      }

      this.setState({
        ...this.state,
        ...errors
      })
      return isError;

    } else if (this.userTypes === "admin") {
      if (this.state.noticeTittle.length < 1) {
        isError = true;
        errors.noticeTittleError = 'Notice Tittle required *'
      }

      if (this.state.noticeTittle.length >= 60) {
        isError = true;
        errors.noticeTittleLenthError = 'Lenth must be less than 60 *'
      }
      if (this.state.notice.length < 1) {
        isError = true;
        errors.noticeError = 'Notice Content required *'
      }
      if (this.state.toCordinator === 'false' && this.state.toStudent === 'false' && this.state.toSupervisor === 'false') {
        isError = true;
        errors.viewUserSelectError = 'must be select at least one *'
      }

      this.setState({
        ...this.state,
        ...errors
      })
      return isError;
    }
  }


  handleDropdownChange = (e) => {
    const val = e.target.value
    this.setState({
      projectId: val
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
      imgname: e.target.files[0].name,
      noticeAttachment: e.target.files[0],
    });
  }



  // when press add notice button call this function then save data in database
  onSubmit(e) {
    e.preventDefault();

    if (this.userTypes === "coordinator") {
      const err = this.validate();

      if (!err) {
        this.setState({
          noticeTittleError: "",
          noticeError: "",
          viewUserSelectError: "",
          projectIdError: "",
          noticeTittleLenthError: "",
        })

        confirmAlert({
          title: 'Confirm to submit',
          message: "Are you sure?",
          buttons: [
            {
              label: "Yes",
              onClick: async () => {

                const headers = {
                  'auth-token': getFromStorage('auth-token').token,
                }

                const date = new Date();
                const dateString = date.toLocaleDateString()
                const timeString = date.toLocaleTimeString()

                // var B = date.toString('dddd, MMMM ,yyyy') ;

                const userType = localStorage.getItem("user-level");
                //const userId = localStorage.getItem("auth-id.id");

                const userId = getFromStorage('auth-id').id;


                const formData = new FormData();


                formData.append("userId", userId);
                formData.append("userType",userType);
                formData.append("projectId", this.state.projectId);
                formData.append("noticeTittle", this.state.noticeTittle);
                formData.append("notice", this.state.notice);
                formData.append("date", dateString);
                formData.append("time", timeString);
                formData.append("noticeAttachment", this.state.noticeAttachment);
                formData.append("toCordinator", this.state.toCordinator);
                formData.append("toSupervisor", this.state.toSupervisor);
                formData.append("toStudent", this.state.toStudent);


                axios
                  .post(backendURI.url + "/notice/addNotice", formData, { headers: headers })
                  .then((res) => {
                    this.setState({
                      succesAlert: true,
                    });
                    window.location.reload();
                    this.getNoticeList();
                    this.getProjectDetails();

                  })
                  .catch((error) => {
                    this.setState({
                      snackbaropen: true,
                      snackbarmsg: error,
                    });
                  });


                this.setState({
                  noticeTittle: "",
                  notice: "",
                  noticeAttachment: "",
                  toCordinator: false,
                  toSupervisor: false,
                  toStudent: false,

                });
              },
            },
            {
              label: "No",
              onClick: () => { },
            },
          ],
        });
      }
    } else {
      const err = this.validate();

      if (!err) {
        this.setState({
          noticeTittleError: "",
          noticeError: "",
          viewUserSelectError: "",
          noticeTittleLenthError: "",
        })

        confirmAlert({
          title: 'Confirm to submit',
          message: "Are you sure?",
          buttons: [
            {
              label: "Yes",
              onClick: async () => {

                const headers = {
                  'auth-token': getFromStorage('auth-token').token,
                }

                var date = new Date();
                const dateString = date.toLocaleDateString()
                const timeString = date.toLocaleTimeString()
            
                const userType = localStorage.getItem("user-level");
                const userId = getFromStorage('auth-id').id;

                const formData = new FormData();

                formData.append("userId", userId);
                formData.append("userType", userType);
                formData.append("projectId", this.state.projectId);
                formData.append("noticeTittle", this.state.noticeTittle);
                formData.append("notice", this.state.notice);
                formData.append("date", dateString);
                formData.append("time", timeString);
                formData.append("noticeAttachment", this.state.noticeAttachment);
                formData.append("toCordinator", this.state.toCordinator);
                formData.append("toSupervisor", this.state.toSupervisor);
                formData.append("toStudent", this.state.toStudent);


                axios
                  .post(backendURI.url + "/notice/addNotice", formData, { headers: headers })
                  .then((res) => {
                    this.setState({
                      succesAlert: true,
                    });
                    window.location.reload();
                    this.getNoticeList();
                    this.getProjectDetails();

                  })
                  .catch((error) => {
                    this.setState({
                      snackbaropen: true,
                      snackbarmsg: error,
                    });
                    console.log(error);
                  });


                this.setState({
                  noticeTittle: "",
                  notice: "",
                  noticeAttachment: "",
                  toCordinator: false,
                  toSupervisor: false,
                  toStudent: false,

                });
              },
            },
            {
              label: "No",
              onClick: () => { },
            },
          ],
        });
      }

    }

  }

  //delete notice

  onDeleteHandler = (id, filePath) => {

    confirmAlert({
      title: "Delete Notice",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {

            const headers = {
              'auth-token': getFromStorage('auth-token').token,
            }
            axios
              .delete(backendURI.url + "/notice/delteNotice/" + id, { headers: headers })
              .then((res) => {
                this.setState({
                  deleteSuccesAlert: true,
                });
                window.location.reload();
                this.getNoticeList();
                this.getProjectDetails();
              })
              .catch((err) => {
                console.log(err);
              });

          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  closeAlert = () => {
    this.setState({
      succesAlert: false,
      deleteSuccesAlert: false,
    });
  };



  render() {

    const { activeProjects } = this.state;   // ?load projects to dropdown menu this coordinator

    let activeProjectsList = activeProjects.length > 0
      && activeProjects.map((item, i) => {
        return (
          <option key={i} value={item._id}>{item.projectYear} - {item.projectType} - {item.academicYear}</option>
        )
      }, this)

    let activeProjectsListid = activeProjects.length > 0
      && activeProjects.map((item, i) => {
        return (
          <option key={i} value={item._id}>{item._id}</option>
        )
      }, this)




    if (this.userTypes === 'admin') {
      return (
        <React.Fragment>

          <Snackpop
            msg={"Successfully Added"}
            color={"success"}
            time={2000}
            status={this.state.succesAlert}
            closeAlert={this.closeAlert}
          />
          <Snackpop
            msg={"Deleted Successfully.."}
            color={"success"}
            time={2000}
            status={this.state.deleteSuccesAlert}
            closeAlert={this.closeAlert}
          />

          <Navbar panel={"admin"} />

          <div
            className="container-fluid create-noticecreate-background">

            <Row>
              <Col>
                <Container>
                  <div
                    className="card"
                    style={{
                      width: "100%",
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
                           c
                            errortext={this.noticeTittleLenthError}
                          ></FormControl>
                          <p className="reg-error">{this.state.noticeTittleError}</p>
                          <p className="reg-error">{this.state.noticeTittleLenthError}</p>
                        </Col>
                      </Row>

                      <Row className="margin-top-20">
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
                              errortext={this.noticeError}
                            ></textarea>
                            <p className="reg-error">{this.state.noticeError}</p>
                          </div>
                        </Col>
                      </Row>

                      <Row className="margin-top-22">
                        <Col md={4} >
                          <div>
                            <p style={{ textalign: "left", color: " #6d6d6d" }}>
                              {this.state.viewUserSelect}
                            </p>
                          </div>

                        </Col>

                        <Col className="col-padding-5">
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
                        </Col>

                        <Col className="col-padding-5">
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

                        </Col>
                        <Col className="col-padding-5">
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
                              <span style={{ fontSize: "12px" }}>Students</span>
                            }
                          />
                        </Col>

                        <p className="reg-error">{this.state.viewUserSelectError}</p>

                      </Row>


                      <Row className="margin-top-20">
                        <Col>
                          <label className="verticle-align-middle cp-text">
                            File Attach :{" "}
                          </label>
                          <FormGroup>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text"> Upload </span>
                              </div>
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  id="exampleFile"
                                  onChange={this.onChangeFile}
                                  name="noticeAttachment"
                                />
                                <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgname}</label>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "40px", marginBottom: "30px" }}>
                        <Button
                          type="submit"
                          className="btn_style"
                          variant="info"
                          style={{ width: '80%' }}
                          onClick={this.onSubmit}
                        >
                          Add Notice
                      </Button>
                      </Row>
                    </div>
                  </div>
                  {this.state.noticeList.length > 0 && (
                    <div>

                      <div>
                        {this.state.noticeList.map((type) => {
                          if (type.userType === 'admin') {
                            return (
                              <div className="card container " style={{ margin: "0px 0px 20px 0px" }} key={type._id} >
                                <div className="crd_style">

                                  <Row className="crd_notice-tittle-div">
                                    <Col md={11} xs={10}>
                                      <p className="crd_notice-name">{type.noticeTittle}</p>
                                    </Col>
                                    <Col className="crd_btn-row" md={1} xs={2}>
                                      <DeleteForeverIcon style={{marginTop: "5px" }} className="delete-btn" fontSize="large" onClick={() => this.onDeleteHandler(type._id)} />
                                    </Col>
                                  </Row>

                                  <Row className="crd_user-name-div">
                                    <Col md={11} xs={10}>
                                      <p className="crd_date">&nbsp;{type.date}&nbsp;&nbsp;{type.time}</p>
                                    </Col>
                                  </Row>

                                  <div className="card-body">
                                    <h6 className="crd_notice_content">{type.notice}</h6>
                                    <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + type.filePath}>
                                      Attachment
                                </a>
                                  </div>
                                </div>
                              </div>
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
        </React.Fragment >
      );

    } else if (this.userTypes === 'coordinator') {
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

          <Navbar panel={"coordinator"} />

          <div
            className="container-fluid create-noticecreate-background">
            <Row>
              <Col>
                <Container>
                  <div
                    className="card"
                    style={{
                      width: "100%",
                      margin: "auto",
                      marginTop: "40px",
                      marginBottom: "40px",
                      paddingLeft: "2%",
                      paddingRight: "2%",
                    }}
                  >
                    <div className="container">
                      <h3 style={{ marginTop: "30px" }}>Creating New Notices</h3>

                      <Row>

                        <Col xs="12">
                          <div className="form-group pg-dropdown-select">
                            <select className="form-control pg-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                              <option>Select the project</option>
                              {activeProjectsList}
                            </select>
                            <p className="reg-error">{this.state.projectIdError}</p>
                          </div>


                        </Col>

                      </Row>

                      <Row className="margin-top-5">
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
                            errortext={this.noticeTittleError}
                            errortext={this.noticeTittleLenthError}
                          ></FormControl>
                          <p className="reg-error">{this.state.noticeTittleError}</p>
                          <p className="reg-error">{this.state.noticeTittleLenthError}</p>
                        </Col>
                      </Row>

                      <Row className="margin-top-20">
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
                            errortext={this.noticeError}
                          ></textarea>
                          <p className="reg-error">{this.state.noticeError}</p>
                        </div>
                      </Col>
                    </Row>

                      <Row className="margin-top-20">
                        <Col>
                          <div className="form-group">
                            <p style={{ textalign: "left", color: " #6d6d6d" }}>
                              {this.state.viewUserSelect}
                            </p>
                          </div>
                        </Col>

                        <Col className="col-padding-5">
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

                        </Col>
                        <Col className="col-padding-5">

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
                              <span style={{ fontSize: "12px" }}>Students</span>
                            }
                          />

                        </Col>

                        <p className="reg-error">{this.state.viewUserSelectError}</p>
                      </Row>


                      

                      <Row className="margin-top-20">
                        <Col>
                          <label className="verticle-align-middle cp-text">
                            File Attach :{" "}
                          </label>

                          <FormGroup>

                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text"> Upload </span>
                              </div>
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  id="exampleFile"
                                  onChange={this.onChangeFile}
                                  name="noticeAttachment"
                                />
                                <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgname}</label>
                              </div>
                            </div>

                          </FormGroup>
                        </Col>
                      </Row>

                      <Row style={{ marginTop: "40px", marginBottom: "30px" }}>
                        <Button
                          type="submit"
                          className="btn_style"
                          variant="info"
                          style={{ width: '80%' }}
                          onClick={this.onSubmit}
                        >
                          Add Notice
                      </Button>
                      </Row>
                    </div>
                  </div>

                  {this.state.noticeListBlock.length > 0 && (
                    <div>

                      <div>
                        {this.state.noticeListBlock.map((types) => {
                          if (types.userType === 'coordinator') {
                            return (
                              <div className="card container " style={{ margin: "0px 0px 20px 0px" }} key={types._id} >
                                <div className="crd_style">

                                  <Row className="crd_notice-tittle-div">
                                    <Col md={11} xs={10}>
                                      <p className="crd_notice-name">{types.noticeTittle}</p>
                                    </Col>
                                    <Col className="crd_btn-row" md={1} xs={2}>
                                      <DeleteForeverIcon className="delete-btn" style={{ marginTop: "5px" }} className="del-btn" fontSize="large" onClick={() => this.onDeleteHandler(types._id)} />
                                    </Col>
                                  </Row>

                                  <Row className="crd_user-name-div">
                                    <Col md={11} xs={10}>
                                      <p className="crd_notice-date">{types.projectName}&nbsp;&nbsp;{types.date}&nbsp;&nbsp;{types.time}</p>
                                    </Col>
                                  </Row>

                                  <div className="card-body">
                                    <h6 className="crd_notice_content">{types.notice}</h6>
                                    <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.filePath}>
                                      Attachment
                                </a>
                                  </div>
                                </div>
                              </div>

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
    } else {
      return (
        <h2></h2>
      )
    }
  }
}

export default Notice;
