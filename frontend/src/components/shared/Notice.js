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

class noticeBlock {
  constructor(_id , userType, projectName , date , noticeTittle , notice ,noticeAttachment , toCordinator , toSupervisor , toStudent ){
    this._id = _id;
    this.userType = userType;
    this.projectName = projectName;
    this.date = date;
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
      noticeList:[],
      noticeListCo: [],
      noticeListBlock:[],
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
    console.log(this.userId)
    

   
  }

  getNoticeListCordinator = async () => {
    this.userType = localStorage.getItem("user-level");
    console.log(this.userType)

    const userId = getFromStorage('auth-id').id;

    await axios.get(backendURI.url + '/notice/getNotice/' + userId)
      .then(res => {
        this.setState({ noticeListCo: res.data.data })
      })
    
     for (let i = 0 ; i<this.state.noticeListCo.length ; i++){
       await axios.get(backendURI.url + '/notice/getProjectName/'+ this.state.noticeListCo[i].projectId )
       .then(res=>{

        var _id = this.state.noticeListCo[i]._id;
        var userType = this.state.noticeListCo[i].userType;
        var date = this.state.noticeListCo[i].date;
        var projectName = res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear;
        var noticeTittle = this.state.noticeListCo[i].noticeTittle;
        var notice = this.state.noticeListCo[i].notice;
        var noticeAttachment = this.state.noticeListCo[i].filePath;
        var toCordinator = this.state.noticeListCo[i].toCordinator;
        var toSupervisor = this.state.noticeListCo[i].toSupervisor;
        var toStudent = this.state.noticeListCo[i].toStudent;


        var block = new noticeBlock(_id , userType, projectName , date , noticeTittle , notice ,noticeAttachment , toCordinator , toSupervisor , toStudent )

        this.setState({
          noticeListBlock : [...this.state.noticeListBlock , block]
        })
      //console.log(this.state.noticeListBlock)
       })

     }

  }

  // Notice get from database and map to the array
  getNoticeList() {
    const coId = JSON.parse(localStorage.getItem("auth-id"))
    axios.get(backendURI.url + '/notice/NoticeView/' + coId.id)
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

          var date = new Date();
         // var B = dateobj.toISOString();

            const userType = localStorage.getItem("user-level");
            //const userId = localStorage.getItem("auth-id.id");
           
            const userId = getFromStorage('auth-id').id ;
    
            const formData = new FormData();

            formData.append("userId",userId);
            formData.append("userType",userType);
            formData.append("projectId",this.state.projectId);
            formData.append("noticeTittle", this.state.noticeTittle);
            formData.append("notice", this.state.notice);
            formData.append("date", date);
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
              window.location.reload();
              this.getNoticeList();
              this.getProjectDetails();
              
             // console.log(res.data);
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
          style={{  backgroundColor: '#f5f5f5' }}
        >
          
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
                {this.state.noticeList.length > 0  && (
                  <div>
                   
                    <div>
                      {this.state.noticeList.map((type) => {
                        if(type.userType === 'admin'){
                        return (
                          <div className="card container ch-card "   key={type._id} >
                          <div className="cd-style">

                          <Row  className="cd-notice-tittle-div">
                          <Col md={11} xs={10}>
                           <p className="cd-notice-name">{type.noticeTittle}</p>
                           </Col>
                           <Col className="cd-btn-row" md={1} xs={2}>
                           <DeleteForeverIcon style={{marginTop:"5px"}} className="del-btn" fontSize="large"  onClick={() => this.onDeleteHandler(type._id)} />
                           </Col>
                           </Row>

                           <Row className="cd-user-name-div">
                           <Col md={11} xs={10}>
                           <p className="cd-date">(&nbsp;{type.date}&nbsp;)</p>
                           </Col>
                           </Row>

                              <div className="card-body">
                                <h6>{type.notice}</h6>
                                <a className="cd-atchmnt" href={"http://localhost:4000/notice/noticeAttachment/" + type.noticeAttachment}>
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
          style={{  backgroundColor: "#f8f9fd" }}
        >
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

                {this.state.noticeListBlock.length > 0  && (
                  <div>
                    
                    <div>
                      {this.state.noticeListBlock.map((types) => {
                        if(types.userType === 'coordinator'){
                          return (
                            <div className="card container ch-card "   key={types._id} >
                          <div className="cd-style">

                          <Row  className="cd-notice-tittle-div">
                          <Col md={11} xs={10}>
                          <p className="cd-notice-name-project">{types.noticeTittle}&nbsp;-&nbsp;<small>{types.projectName}</small></p>                           </Col>
                           <Col className="cd-btn-row" md={1} xs={2}>
                           <DeleteForeverIcon style={{marginTop:"5px"}} className="del-btn" fontSize="large"  onClick={() => this.onDeleteHandler(types._id)} />
                           </Col>
                           </Row>

                           <Row className="cd-user-name-div">
                           <Col md={11} xs={10}>
                           <p className="cd-notice-date">(&nbsp;{types.date}&nbsp;)</p>
                           </Col>
                           </Row>

                              <div className="card-body">
                                <h6>{types.notice}</h6>
                                <a className="cd-atchmnt" href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
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
  }else{
    return(
      <h2></h2>
    )
  }
  }
  }

export default Notice;
