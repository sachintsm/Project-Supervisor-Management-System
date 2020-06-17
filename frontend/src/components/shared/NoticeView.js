import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import { getFromStorage } from '../../utils/Storage';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "../../css/shared/Notice.css";



import axios from "axios";

import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
import UserNameList from '../shared/UserNameList'


import {
  Button,
  Container,
  Col,
  Row,
  FormControl,
  FormGroup,
} from "react-bootstrap";
import { red } from '@material-ui/core/colors';

const backendURI = require("./BackendURI");


class noticeBlock {
  constructor(_id , userType,userId, projectName , date , noticeTittle , notice ,noticeAttachment , toCordinator , toSupervisor , toStudent ){
    this._id = _id;
    this.userType = userType;
    this.userId = userId;
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

class NoticeView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      getProjectId: [],
      noticeList: [],
      allNoticeList:[],
      notice: '',
      userType: '',
      noticeListBlock:[],
    }

  }

  componentDidMount = async () => {

    this.userType = localStorage.getItem("user-level");
    console.log(this.userType)

    const userId = getFromStorage('auth-id').id;

    await axios.get(backendURI.url + '/notice/getNotice/' + userId)
      .then(res => {
        this.setState({ noticeList: res.data.data })
      })
    
     for (let i = 0 ; i<this.state.noticeList.length ; i++){
       await axios.get(backendURI.url + '/notice/getProjectName/'+ this.state.noticeList[i].projectId )
       .then(res=>{

        var _id = this.state.noticeList[i]._id;
        var userType = this.state.noticeList[i].userType;
        var userId = this.state.noticeList[i].userId;
        var date = this.state.noticeList[i].date;
        var projectName = res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear;
        var noticeTittle = this.state.noticeList[i].noticeTittle;
        var notice = this.state.noticeList[i].notice;
        var noticeAttachment = this.state.noticeList[i].filePath;
        var toCordinator = this.state.noticeList[i].toCordinator;
        var toSupervisor = this.state.noticeList[i].toSupervisor;
        var toStudent = this.state.noticeList[i].toStudent;


        var block = new noticeBlock(_id , userType,userId, projectName , date , noticeTittle , notice ,noticeAttachment , toCordinator , toSupervisor , toStudent )

        this.setState({
          noticeListBlock : [...this.state.noticeListBlock , block]
        })
//console.log(this.state.noticeListBlock)
       })

     }
      await axios.get(backendURI.url + '/notice/getAdminNotice')
      .then(res=>{
//console.log(res.data)
        this.setState({
          allNoticeList : res.data
        })

      })
    
  }

  

  render() {
    if((this.state.noticeListBlock.length == 0 && this.state.allNoticeList == 0)&& this.userType === 'coordinator' ){
      return(
        <React.Fragment>
        <Navbar panel={"coordinator"} />
          <Container>
        <h2>No Notice</h2>
        </Container>
        <Footer />
        </React.Fragment>
      )
    }

    if((this.state.noticeListBlock.length == 0 && this.state.allNoticeList == 0) && this.userType === 'supervisor' ){
      return(
        <React.Fragment>
        <Navbar panel={"supervisor"} />
          <Container>
        <h2>No Notice</h2>
        </Container>
        <Footer />
        </React.Fragment>
      )
    }
   
    if (this.userType === 'coordinator') {

      return (
        <React.Fragment>
          <Navbar panel={"coordinator"} />
          <div className ='container'>
          <Tabs defaultActiveKey="Coordinators Notices" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
          <Tab eventKey="Coordinators Notices" title="Published By Coordinators" className="tit">
            {this.state.noticeListBlock.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h3>Notice</h3>
                <div>
                  {this.state.noticeListBlock.map((types) => {
                    return (
                      <div className="card ch-card" div key={types._id} >
                      <div className="card-header container cd-header ">
                      <h6><b>{types.noticeTittle}</b> &nbsp; - &nbsp;{types.projectName}<br/>
                      <small><UserNameList  id={types}/></small></h6>
                      </div>
                      <div className="card-body">
                        
                          <h6 className="cd-body-h6">{types.notice}</h6>
                          <a className="cd-atchmnt" href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
                          Attachment
                          </a>
                      
                      </div>
                    </div>
                  
                     
                    );
                  })}
                </div>
              </div>
            )}
            </Tab>

            <Tab eventKey="admins" title="Published By Admins">
            {this.state.allNoticeList.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice</h3>
                <div>
                  {this.state.allNoticeList.map((types) => {
                    if(types.toCordinator){
                    return (
                      <div className="card ch-card" div key={types._id} >
                      <div className="card-header container cd-header ">
                      <h6><b>{types.noticeTittle}</b> &nbsp; - &nbsp;{types.userType}<br/>
                      <small><UserNameList  id={types}/></small></h6>
                      </div>
                      <div className="card-body">
                        
                          <h6 className="cd-body-h6">{types.notice}</h6>
                          <a className="cd-atchmnt" href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
                          Attachment
                          </a>
                      
                      </div>
                    </div>
                  
                    );
                  }
                  })}
                </div>
              </div>
            )}
            </Tab>

            </Tabs>
            </div>
          <Footer />
        </React.Fragment>
      )

    }else if(this.userType === 'supervisor'){

      return (
        <React.Fragment>
          <Navbar panel={"supervisor"} />
          <Container>
          
          <Tabs defaultActiveKey="Coordinators Notices" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>

          <Tab eventKey="Coordinators Notices" title="Published By Coordinators" className="tit">

            {this.state.noticeListBlock .length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice</h3>
                <div>

                  {this.state.noticeListBlock .map(types => {
                    if(types.toSupervisor){
                    return (
                      <div className="card ch-card" div key={types._id} >
                      <div className="card-header container cd-body ">
                      <h6><b>{types.noticeTittle}</b> &nbsp; - &nbsp;{types.projectName}<br/>
                      <small><UserNameList  id={types}/></small></h6>
                      </div>
                      <div className="card-body">
                        
                          <h6 className="cd-body-h6">{types.notice}</h6>
                          <a className="cd-atchmnt" href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
                          Attachment
                          </a>
                      
                      </div>
                    </div>
                    );
                  }
                  })}
                </div>
              </div>
            )}
            </Tab>
            <Tab eventKey="admins" title="Published By Admins">

            {this.state.allNoticeList.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice</h3>
                <div>
                  {this.state.allNoticeList.map((types) => {
                    if(types.toSupervisor){
                    return (
                      <div className="card ch-card" div key={types._id} >
                      <div className="card-header container cd-header ">
                      <h6><b>{types.noticeTittle}</b> &nbsp; - &nbsp;{types.userType}<br/>
                      <small><UserNameList  id={types}/></small></h6>
                      </div>
                      
                      <div className="card-body">
                          <h6 className="cd-body-h6">{types.notice}</h6>
                          <a className="cd-atchmnt" href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
                          Attachment
                          </a>
                      
                      </div>
                    </div>
                    );
                  }
                  })}
                </div>
              </div>
            )}
            </Tab>
            </Tabs>
          </Container>
          <Footer />
        </React.Fragment>
      )
    } else{
      return(
        null
      )
    }
  }
}
export default NoticeView
