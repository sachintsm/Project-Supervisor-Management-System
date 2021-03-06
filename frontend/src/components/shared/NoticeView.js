import React, { Component } from 'react'
import { getFromStorage } from '../../utils/Storage';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "../../css/shared/Notice.css";
import axios from "axios";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
import UserNameList from '../shared/UserNameList'
import {
  Row,
} from "react-bootstrap";

const backendURI = require("./BackendURI");


class noticeBlock {
  constructor(_id, userType, userId, projectName, date, time,noticeTittle, notice, noticeAttachment, toCordinator, toSupervisor, toStudent) {
    this._id = _id;
    this.userType = userType;
    this.userId = userId;
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

class studentNoticeBlock {
  constructor(_id, userType, userId, projectName, date,time, noticeTittle, notice, noticeAttachment, toCordinator, toSupervisor, toStudent) {
    this._id = _id;
    this.userType = userType;
    this.userId = userId;
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

class NoticeView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      getProjectId: [],
      noticeList: [],
      allNoticeList: [],
      notice: '',
      userType: '',
      noticeListBlock: [],
      studentNoticeList: [],
      studentNoticeListBlock: [],
    }

  }

  componentDidMount = async () => {

    this.userType = localStorage.getItem("user-level");
    const userId = getFromStorage('auth-id').id;

    if (this.userType === 'coordinator' || this.userType === 'supervisor') {

      await axios.get(backendURI.url + '/notice/getNotice/' + userId)
        .then(res => {
          this.setState({ noticeList: res.data.data })
        })


      for (let i = 0; i < this.state.noticeList.length; i++) {
        await axios.get(backendURI.url + '/notice/getProjectName/' + this.state.noticeList[i].projectId)
          .then(res => {

            var _id = this.state.noticeList[i]._id;
            var userType = this.state.noticeList[i].userType;
            var userId = this.state.noticeList[i].userId;
            var date = this.state.noticeList[i].date;
            var time = this.state.noticeList[i].time;
            var projectName = res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear;
            var noticeTittle = this.state.noticeList[i].noticeTittle;
            var notice = this.state.noticeList[i].notice;
            var noticeAttachment = this.state.noticeList[i].filePath;
            var toCordinator = this.state.noticeList[i].toCordinator;
            var toSupervisor = this.state.noticeList[i].toSupervisor;
            var toStudent = this.state.noticeList[i].toStudent;


            var block = new noticeBlock(_id, userType, userId, projectName, date,time, noticeTittle, notice, noticeAttachment, toCordinator, toSupervisor, toStudent)

            this.setState({
              noticeListBlock: [...this.state.noticeListBlock, block]
            })
          })

      }

    } else if (this.userType === 'student') {

      await axios.get(backendURI.url + '/notice/getNoticeByStudent/' + userId)
        .then(res => {
          this.setState({ studentNoticeList: res.data.data })
        })

      for (let i = 0; i < this.state.studentNoticeList.length; i++) {
        await axios.get(backendURI.url + '/notice/getProjectName/' + this.state.studentNoticeList[i].projectId)
          .then(res => {

            var _id = this.state.studentNoticeList[i]._id;
            var userType = this.state.studentNoticeList[i].userType;
            var userId = this.state.studentNoticeList[i].userId;
            var date = this.state.studentNoticeList[i].date;
            var time = this.state.studentNoticeList[i].time;
            var projectName = res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear;
            var noticeTittle = this.state.studentNoticeList[i].noticeTittle;
            var notice = this.state.studentNoticeList[i].notice;
            var noticeAttachment = this.state.studentNoticeList[i].filePath;
            var toCordinator = this.state.studentNoticeList[i].toCordinator;
            var toSupervisor = this.state.studentNoticeList[i].toSupervisor;
            var toStudent = this.state.studentNoticeList[i].toStudent;


            var block = new studentNoticeBlock(_id, userType, userId, projectName, date,time, noticeTittle, notice, noticeAttachment, toCordinator, toSupervisor, toStudent)

            this.setState({
              studentNoticeListBlock: [...this.state.studentNoticeListBlock, block]
            })
          })

      }

    }

    await axios.get(backendURI.url + '/notice/getAdminNotice')
      .then(res => {
        this.setState({
          allNoticeList: res.data
        })

      })

  }



  render() {


    if (this.userType === 'coordinator') {

      return (
        <React.Fragment>
          <Navbar panel={"coordinator"} />

          <div
          className="container-fluid notice-background">
          
            <div className="container">
              <Tabs defaultActiveKey="Coordinators Notices" id="uncontrolled-tab-example" style={{ marginBottom: "30px",width: "100%" }}>
                <Tab eventKey="Coordinators Notices" title="Published By Coordinators" className="tb-style" >

                  {this.state.noticeListBlock.length > 0 && (
                    <div >
                      {this.state.noticeListBlock.map((types) => {
                        return (
                          <div className="card container" style={{ margin: "0px 0px 20px 0px" }} key={types._id} >
              
                              <Row className="crd_notice-tittle-div">
                                <p className="crd_notice-name">{types.noticeTittle}</p><p className="crd_projects-name">&nbsp;-&nbsp;{types.projectName}</p>
                              </Row>

                              <Row className="crd_user-name-div">
                                <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp; {types.time}</p>
                              </Row>

                              <div className="card-body">
                              <h6 className="crd_notice_content">{types.notice}</h6>
                                <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.noticeAttachment}>
                                  Attachment
                                </a>
                              </div>
                            
                          </div>
                        );
                      })}

                    </div>
                  )}

                  {this.state.noticeListBlock.length === 0 &&(

                    <div>
                    <h2>Coordinators Not Published Notices</h2>
                    </div>
                  )}
                </Tab>

                <Tab eventKey="admins" title="Published By Admins">
              
                  {this.state.allNoticeList.length > 0 && (
                    <div>
                      {this.state.allNoticeList.map((types) => {
                        if (types.toCordinator) {
                          return (
                            <div className="card container" style={{ margin: "20px 0px 20px 0px" }} key={types._id} >
                          

                                <Row className="crd_notice-tittle-div">
                                  <p className="crd_notice-name">{types.noticeTittle}</p>
                                </Row>

                                <Row className="crd_user-name-div">
                                  <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp; {types.time}</p>
                                </Row>

                                <div className="card-body">
                                  <h6 className="crd_notice_content">{types.notice}</h6>
                                  <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.filePath}>
                                    Attachment
                                  </a>
                                </div>
                              </div>
                          
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  {this.state.allNoticeList.length === 0 &&(
                    <div>
                  <h2>Admins Not publish Notices</h2>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </div>
            </div>
          <Footer />
        </React.Fragment>
      )

    }else if (this.userType === 'supervisor') {

      return (
        <React.Fragment>
          <Navbar panel={"supervisor"} />
          <div
          className="container-fluid notice-background">

            <div className="container">
              <Tabs defaultActiveKey="Coordinators Notices" id="uncontrolled-tab-example" style={{ marginBottom: "30px", marginTop: "30px", width: "100%" }}>
                <Tab eventKey="Coordinators Notices" title="Published By Coordinators" className="tb-style" >
                
                  {this.state.noticeListBlock.length > 0 && (
                    <div >
                      {this.state.noticeListBlock.map((types) => {
                        return (
                          <div className="card container  " style={{ margin: "0px 0px 20px 0px" }} key={types._id} >
                        

                              <Row className="crd_notice-tittle-div">
                                <p className="crd_notice-name">{types.noticeTittle}</p><p className="crd_projects-name">&nbsp;-&nbsp;{types.projectName}</p>
                              </Row>

                              <Row className="crd_user-name-div">
                                <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp; {types.time}</p>
                              </Row>

                              <div className="card-body">
                                <h6 className="crd_notice_content">{types.notice}</h6>
                                <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.noticeAttachment}>
                                  Attachment
                            </a>
                              </div>
                            </div>
                          
                        );
                      })}

                    </div>
                  )}
                  {this.state.noticeListBlock.length === 0 &&(

                    <div>
                    <h2>Coordinators Not Published Notices</h2>
                    </div>
                  )}
                </Tab>
                <Tab eventKey="admins" title="Published By Admins">
              
                  {this.state.allNoticeList.length > 0 && (
                    <div>
                      {this.state.allNoticeList.map((types) => {
                        if (types.toSupervisor) {
                          return (
                            <div className="card container " style={{ margin: "0px 0px 20px 0px" }} key={types._id} >
        
                                <Row className="crd_notice-tittle-div">
                                  <p className="crd_notice-name">{types.noticeTittle}</p>
                                </Row>

                                <Row className="crd_user-name-div">
                                  <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp; {types.time}</p>
                                </Row>

                                <div className="card-body">
                                  <h6 className="crd_notice_content">{types.notice}</h6>
                                  <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.filePath}>
                                    Attachment
                                  </a>
                                </div>
                              </div>
                            
                          );
                        }
                        return null
                      })}
                    </div>

                  )}

                  {this.state.allNoticeList.length === 0 &&(
                    <div>
                  <h2>Admins Not publish Notices</h2>
                    </div>
                  )}

                </Tab>
              </Tabs>
            </div>
          </div>
          <Footer />

        </React.Fragment>
      )
    } else if (this.userType === 'admin') {
      return (

        <React.Fragment>
          <Navbar panel={"admin"} />
          <div
          className="container-fluid admin-notice-background">
            <div className="container">
              {this.state.allNoticeList.length > 0 && (
                <div>
                  {this.state.allNoticeList.map((types) => {
                    return (
                      <div className="card container  " style={{ margin: "30px 0px 20px 0px" }} key={types._id} >
                      

                          <Row className="crd_notice-tittle-div">
                            <p className="crd_notice-name">{types.noticeTittle}</p>
                          </Row>

                          <Row className="crd_user-name-div">
                            <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp;{types.time}</p>
                          </Row>

                          <div className="card-body">
                            <h6 className="crd_notice_content">{types.notice}</h6>
                            <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.filePath}>
                              Attachment
                                  </a>
                          </div>
                        </div>
                      
                    );
                  })}
                </div>
              )}

              {this.state.allNoticeList.length === 0 &&(
                <div>
              <h2>Admins Not publish Notices</h2>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </React.Fragment>
      )
    } else if (this.userType === 'student') {
      return (
        <React.Fragment>
          <Navbar panel={"student"} />
          <div
          className="container-fluid notice-background">
            <div className="container">
              <Tabs defaultActiveKey="Coordinators Notices" id="uncontrolled-tab-example" style={{ marginBottom: "30px", marginTop: "30px", width: "100%" }}>
                <Tab eventKey="Coordinators Notices" title="Published By Coordinators" className="tb-style" >
                
                  {this.state.studentNoticeListBlock.length > 0 && (
                    <div >
                      {this.state.studentNoticeListBlock.map((types) => {
                        return (
                          <div className="card container " style={{ margin: "0px 0px 20px 0px" }} key={types._id} >
                            

                              <Row className="crd_notice-tittle-div">
                                <p className="crd_notice-name">{types.noticeTittle}</p><p className="cd-projects-name">&nbsp;-&nbsp;{types.projectName}</p>
                              </Row>

                              <Row className="crd_user-name-div">
                                <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp; {types.time}</p>
                              </Row>

                              <div className="card-body">
                                <h6 className="crd_notice_content">{types.notice}</h6>
                                <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.noticeAttachment}>
                                  Attachment
                            </a>
                              </div>
                            </div>
                          
                        );
                      })}

                    </div>
                  )}
                 
                  {this.state.studentNoticeListBlock.length === 0 &&(

                    <div>
                    <h2>Coordinators Not Published Notices</h2>
                    </div>
                  )}
                </Tab>
                <Tab eventKey="admins" title="Published By Admins">
                
                  {this.state.allNoticeList.length > 0 && (
                    <div>
                      {this.state.allNoticeList.map((types) => {
                        if (types.toStudent) {
                          return (
                            <div className="card container  " style={{ margin: "0px 0px 20px 0px" }} key={types._id} >
                            

                                <Row className="crd_notice-tittle-div">
                                  <p className="crd_notice-name">{types.noticeTittle}</p>
                                </Row>

                                <Row className="crd_user-name-div">
                                  <UserNameList id={types} />  <p className="crd_date">-&nbsp; {types.date}&nbsp; {types.time}</p>
                                </Row>

                                <div className="card-body">
                                  <h6 className="crd_notice_content">{types.notice}</h6>
                                  <a className="crd_atchmnt" href={backendURI.url+"/notice/noticeAttachment/" + types.filePath}>
                                    Attachment
                                  </a>
                                </div>
                              </div>
                          
                          );
                        }
                        return null
                      })}
                    </div>

                  )}

                  {this.state.allNoticeList.length === 0 &&(
                    <div>
                  <h2>Admins Not publish Notices</h2>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
          <Footer />
        </React.Fragment>

      )
    } else {
      return (
        null
      )
    }
  }
}
export default NoticeView
