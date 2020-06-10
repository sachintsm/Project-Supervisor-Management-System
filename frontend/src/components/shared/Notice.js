import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { verifyAuth } from "../../utils/Authentication";
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
      noticeType: "",
      userTypes:'',
      userId:"",
      viewUserSelect :'Select user to View :',
      projectId: "",
      selectedTypeIndex: 0 ,
     
      succesAlert: false,
      deleteSuccesAlert: false,
      warnAlert: false,
      snackbaropen: false,
      snackbarmsg: "",

      toCordinator: false,
      toSupervisor: false,
      toStudent: false,
     
      
      projectTypeList:[],
      noticeListCoordinator:[],
      activeProjects: [],

      noticeTittleError: "",
      noticeError: "",
      viewUserSelectError:"",
    };

    this.onChangeTittle = this.onChangeTittle.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.onChangeNotice = this.onChangeNotice.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getNoticeListCordinator = this.getNoticeListCordinator.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
   
  }



  componentDidMount() {
   this.getNoticeListCordinator();
   this.getProjectDetails();

    this.userTypes = localStorage.getItem("user-level");
    this.userId = localStorage.getItem("auth-id");
    console.log(this.userId)
    

   
  }

  // Notice get from database and map to the array
  getNoticeListCordinator() {
    // const headers = {
    //   'auth-token':getFromStorage('auth-token').token,
    // }

    const coId = JSON.parse(localStorage.getItem("auth-id"))

    axios.get(backendURI.url + '/notice/NoticeView/' + coId.id)
            .then((res => {
                console.log("ddddd",res.data.data)
                this.setState({
                  noticeListCoordinator: res.data.data
                })
            }))
}

// get project details
  async getProjectDetails() {
    const authState = await verifyAuth();

        this.setState({
            authState: authState,
        });
        if (!authState || (!localStorage.getItem("isCoordinator") && !localStorage.getItem("isAdmin") )) { //!check user is logged in or not if not re-directed to the login form
            this.props.history.push("/");
        }

        const coId = JSON.parse(localStorage.getItem("auth-id"))

        //? load all the active project names from
        axios.get(backendURI.url + '/projects/active&projects/' + coId.id)
            .then((res => {
              console.log("project List",res.data.data)
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
      viewUserSelectError:"",
    }

    if (this.state.noticeTittle.length < 1) {
      isError = true;
      errors.noticeTittleError = 'Notice Tittle required *'
    }
    if (this.state.notice.length < 1) {
      isError = true;
      errors.noticeError = 'Notice Content required *'
    }
    // if (this.state.toCordinator === 'false' && this.state.toStudent=== 'false' && this.state.toSupervisor === 'false') {
    //   isError = true;
    //   errors.viewUserSelectError = 'must be select at least one *'
    // }

    this.setState({
      ...this.state,
      ...errors
    })
    return isError;
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
      noticeAttachment: e.target.files[0],
    });
  }

  

  // when press add notice button call this function then save data in database
  onSubmit(e) {
    e.preventDefault();

    const err = this.validate();

    if (!err) {
      this.setState({
        noticeTittleError: "",
        noticeError: "",
        viewUserSelectError:"",
      })

    confirmAlert({
      title: 'Confirm to submit',
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {

            const headers = {
              'auth-token':getFromStorage('auth-token').token,
            }

            this.state.date = Date();
            const userType = localStorage.getItem("user-level");
            //const userId = localStorage.getItem("auth-id.id");
           
            const userId = getFromStorage('auth-id').id ;
    
            const formData = new FormData();

            formData.append("userId",userId);
            formData.append("userType",userType);
            formData.append("projectId",this.state.projectId);
            formData.append("noticeTittle", this.state.noticeTittle);
            formData.append("notice", this.state.notice);
            formData.append("date", this.state.date);
            formData.append("noticeAttachment", this.state.noticeAttachment);
            formData.append("toCordinator", this.state.toCordinator);
            formData.append("toSupervisor", this.state.toSupervisor);
            formData.append("toStudent", this.state.toStudent);

      
            axios
            .post(backendURI.url + "/notice/addNotice", formData,{headers: headers})
            .then((res) => {
              this.setState({
                succesAlert: true,
              });
              this.getNoticeListCordinator();
              console.log(res.data);
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
      onClick: () => {},
    },
  ],
});
}
  }

  //delete notice

  onDeleteHandler = (id, filePath) => {

   // console.log(filePath);
    confirmAlert({
      title: "Delete Notice",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {

            const headers = {
              'auth-token':getFromStorage('auth-token').token,
            }
            axios
              .delete(backendURI.url + "/notice/delteNotice/" + id,{headers: headers})
              .then((res) => {
                this.setState({
                  deleteSuccesAlert: true,
                });
                this.getNoticeListCordinator();
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


    

    if(this.userTypes === 'admin'){
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
          className="container-fluid container-fluid-div"
          style={{ backgroundColor: "rgb(252, 252, 252)" }}
        >
          
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
                          errortext={this.noticeTittleError}
                        ></FormControl>
                        <p className="reg-error">{this.state.noticeTittleError}</p>
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
                              <span style={{ fontSize: "12px" }}>Studentd</span>
                            }
                          />
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
                {this.state.noticeListCoordinator.length > 0  && (
                  <div>
                    <h3>Notice View </h3>
                    <div>
                      {this.state.noticeListCoordinator.map((type) => {
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

                    <Row>

                    <Col xs="12">
                                    <div className="form-group pg-dropdown-select">
                                        <select className="form-control pg-dropdown-select" id="dropdown" onChange={this.handleDropdownChange}>
                                            <option>Select the project</option>
                                            {activeProjectsList}
                                        </select>
                                        
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
                        ></FormControl>
                        <p className="reg-error">{this.state.noticeTittleError}</p>
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
                        
                      <p style={{ textalign: "left", color: " #6d6d6d" }}>
                      {this.state.viewUserSelect}
                    </p>
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
                              <span style={{ fontSize: "12px" }}>Studentd</span>
                            }
                          />
                        
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

                {this.state.noticeListCoordinator.length > 0  && (
                  <div>
                    <h3>Notice View </h3>
                    <div>
                      {this.state.noticeListCoordinator.map((type) => {
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
