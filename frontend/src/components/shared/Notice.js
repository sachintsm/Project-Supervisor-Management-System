import React, { Component } from "react";
//import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
//import { verifyAuth } from "../../utils/Authentication";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
//import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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
  Dropdown, 
  DropdownButton, 
  ButtonGroup,
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
      selectedTypeIndex: 0 ,
      noticeList: [],
      projectTypeList:[]
    };

    this.onChangeTittle = this.onChangeTittle.bind(this);
    this.onChangeNotice = this.onChangeNotice.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getNoticeList = this.getNoticeList.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.getCategoryList = this.getCategoryList.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeAcademicYear = this.onChangeAcademicYear.bind(this);

  }

  snackbarClose = (event) => {
    this.setState({ snackbaropen: false });
  };

  componentDidMount() {
    this.getNoticeList();
    this.getCategoryList()

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

  getCategoryList() {

    const headers = {
      'auth-token':getFromStorage('auth-token').token,
    }
    axios.get(backendURI.url + '/projects/projecttype',{headers: headers}).then((result => {
      if (result.data.length > 0) {
        this.setState({
          projectTypeList: result.data.map((type) => type)
        },()=>{
          this.setState({
            type :  this.state.projectTypeList[0].projectType
          })
          if(this.state.projectTypeList[0].isFirstYear){
            this.setState(({
              academicYear: "1st Year"
            }))
          }
          else if(this.state.projectTypeList[0].isSecondYear){
            this.setState(({
              academicYear: "2nd Year"
            }))
          }
          else if(this.state.projectTypeList[0].isThirdYear){
            this.setState(({
              academicYear: "3rd Year"
            }))
          }
          else if(this.state.projectTypeList[0].isFourthYear){
            this.setState(({
              academicYear: "4th Year"
            }))
          }
          else{
            this.setState(({
              academicYear: ''
            }))
          }
        })
      }
      else {
        this.setState({
          projectTypeList: []
        })
      }
    }))

  }

  onChangeType(typeIndex) {
    // console.log(typeIndex)
    this.setState({
      type: this.state.projectTypeList[typeIndex].projectType,
      selectedTypeIndex: typeIndex
    });
    if(this.state.projectTypeList[typeIndex].isFirstYear){
      this.setState(({
        academicYear: "1st Year"
      }))
    }
    else if(this.state.projectTypeList[typeIndex].isSecondYear){
      this.setState(({
        academicYear: "2nd Year"
      }))
    }
    else if(this.state.projectTypeList[typeIndex].isThirdYear){
      this.setState(({
        academicYear: "3rd Year"
      }))
    }
    else if(this.state.projectTypeList[typeIndex].isFourthYear){
      this.setState(({
        academicYear: "4th Year"
      }))
    }
    else{
      this.setState(({
        academicYear: ''
      }))
    }
  }

  onChangeAcademicYear(year) {
    this.setState({
      academicYear: year,
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
              toViewType: true,
              toCordinator: false,
              toSupervisor: false,
              toStudent: false,

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
      deleteSuccesAlert: false,
    });
  };



  render() {

    if(this.userTypes === 'admin'){
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
          time={3000}
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

                    <Row className="margin-top-20">
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
                              Select user to View
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
                    <Row className="margin-top-20">
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
                            style={{ marginTop: "10px", marginBottom: "10px" , paddingBottom:"0.5px" }}
                          >
                          <Row>
                            <Col xs="11">
                            <CardContent style={{ paddingBottom: "2px"}}>
                              <h6><b>{type.noticeTittle}</b></h6>
                            </CardContent>
                            </Col>

                            <Col xs="1">
                              <DeleteForeverIcon style={{marginTop:"5px"}} className="del-btn" fontSize="large"  onClick={() => this.onDeleteHandler(type._id)} />
                            </Col>
                          </Row>  

                            <h6 style={{ color: "#6d6d6d", paddingLeft: "14px" ,fontSize:"2"}}><small>
                              {type.date}</small>
                            </h6>
                        
                            <CardContent style={{ paddingTop: "2px",fontWeight:"300" }}>
                              <Typography variant="body2" component="p" >
                                {type.notice}
                              </Typography>

                              <a href={"http://localhost:4000/notice/noticeAttachment/" +type.filePath}>
                                Attachment
                              </a>
                              </CardContent>
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
  }else if(this.userTypes === 'coordinator'){
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

                    
                    <Row style={{ marginLeft: '0px', marginTop: '20px' }}>
                    <Col lg="4" md="4" sm="6" xs="6">
                    <Row>
                      <p className="cp-text">
                        Project Type
                      </p>
                    </Row>

                    <Row >

                      {
                        this.state.projectTypeList.length == 0 ? (
                            <DropdownButton
                                // className="full-width"
                                as={ButtonGroup}
                                variant={'secondary'}
                                title={"No Items"}
                                onSelect={this.onChangeType}
                                style={{ width: "90%" }}
                            >
                            </DropdownButton>) : (
                            <DropdownButton
                                // className="full-width"
                                as={ButtonGroup}
                                variant={'secondary'}
                                title={this.state.type}
                                onSelect={this.onChangeType}
                                style={{ width: "90%" }}
                            >
                              {this.state.projectTypeList.map((item,index) => {
                                return(
                                    <Dropdown.Item key={item._id} eventKey={index}>
                                      {item.projectType}
                                    </Dropdown.Item>)
                              })}
                            </DropdownButton>)
                      }

                    </Row>
                  </Col>

                  {(this.state.projectTypeList.length>0 && this.state.projectTypeList[this.state.selectedTypeIndex].isAcademicYear)?
                    <Col  lg="4" md="4" sm="12" xs="12" >
                      <Row>
                        <p className="cp-text cp-text2">
                          Academic Year
                        </p>
                      </Row>
                      <Row>

                        <DropdownButton
                            as={ButtonGroup}
                            variant={'secondary'}
                            title={this.state.academicYear}
                            onSelect={this.onChangeAcademicYear}
                            style={{ width: "90%" }}
                            className="full-width"
                        >
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isFirstYear &&
                          <Dropdown.Item eventKey='1st Year'>
                            1st Year
                          </Dropdown.Item>}
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isSecondYear &&
                          <Dropdown.Item eventKey='2nd Year'>
                            2nd Year
                          </Dropdown.Item>}
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isThirdYear &&
                          <Dropdown.Item eventKey='3rd Year'>
                            3rd Year
                          </Dropdown.Item>}
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isFourthYear &&
                          <Dropdown.Item eventKey='4th Year'>
                            4th Year
                          </Dropdown.Item>}
                        </DropdownButton>{' '}
                      </Row>
                    </Col> :  null
                }

                    
                    </Row>

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

                    <Row className="margin-top-20">
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
                            Select user to View
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
                    <Row className="margin-top-20">
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
                            <Row>
                              <Col xs="11">
                              <CardContent style={{ paddingBottom: "2px"}}>
                                <h6><b>{type.noticeTittle}</b></h6>
                              </CardContent>
                              </Col>
  
                              <Col xs="1">
                                <DeleteForeverIcon style={{marginTop:"5px"}} className="del-btn" fontSize="large"  onClick={() => this.onDeleteHandler(type._id)} />
                              </Col>
                            </Row>  
  
                              <h6 style={{ color: "#6d6d6d", paddingLeft: "14px" ,fontSize:"2"}}><small>
                                {type.date}</small>
                              </h6>
                          
                              <CardContent style={{ paddingTop: "2px" , fontWeight:"300"}}>
                                <Typography variant="body2" component="p">
                                  {type.notice}
                                </Typography>
                                <a href={"http://localhost:4000/notice/noticeAttachment/" +type.filePath}>
                                  Attachment
                                </a>
                              </CardContent>
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
