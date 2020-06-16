import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import { getFromStorage } from '../../utils/Storage';
import { Spinner } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


//import Footer from "../shared/Footer";
//import Navbar from "../shared/Navbar";
import axios from "axios";

import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
//import ProjectList from '../shared/ProjectList'

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

      spinnerDiv1: true,

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
        var date = this.state.noticeList[i].date;
        var projectName = res.data.data.projectYear + " " + res.data.data.projectType + " " + res.data.data.academicYear;
        var noticeTittle = this.state.noticeList[i].noticeTittle;
        var notice = this.state.noticeList[i].notice;
        var noticeAttachment = this.state.noticeList[i].filePath;
        var toCordinator = this.state.noticeList[i].toCordinator;
        var toSupervisor = this.state.noticeList[i].toSupervisor;
        var toStudent = this.state.noticeList[i].toStudent;


        var block = new noticeBlock(_id , userType, projectName , date , noticeTittle , notice ,noticeAttachment , toCordinator , toSupervisor , toStudent )

        this.setState({
          noticeListBlock : [...this.state.noticeListBlock , block]
        })
console.log(this.state.noticeListBlock)
       })

     }
 this.setState({
        spinnerDiv1: false
      })

      // await axios.get(backendURI.url + '/notice/getNotice')
      // .then(res)
    
  }

  

  render() {


    
 const { spinnerDiv1 } = this.state
    if(this.state.noticeListBlock.length == 0 && this.userType === 'coordinator' ){
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

    if(this.state.noticeListBlock.length == 0 && this.userType === 'supervisor' ){
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
          <Container>
          <Tabs defaultActiveKey="Coordinators Notices" id="uncontrolled-tab-example" style={{ marginTop: "20px" }}>
          <Tab eventKey="Coordinators Notices" title="Published By Coordinators" className="tit">
            {this.state.noticeListBlock.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice</h3>
                <div>
                  {this.state.noticeListBlock.map((types) => {
                    return (

                      <Card
                        key={types._id}
                        style={{ marginTop: "20px", marginBottom: "10px" }}
                      >

                        <Row>
                          <Col xs="12">
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6><b>{types.noticeTittle}</b><small>({types.projectName})</small></h6>
                              <h6>by <small>({types.userType}</small><small>
                              {types.date})</small></h6>
                            </CardContent>
                          </Col>
                        </Row>

                        <CardContent style={{ paddingTop: "2px", fontWeight: "300" }}>
                          <Typography variant="body2" component="p">
                            {types.notice}
                          </Typography>
                          <a href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
                            Attachment
                      </a>
                        </CardContent>
                      </Card>
                    );

                  })}
                </div>
              </div>
            )}
            </Tab>
            <Tab eventKey="admins" title="Published By Admins">
            <h2>ndcksjnc</h2>
            </Tab>

            </Tabs>
          </Container>
          <Footer />
        </React.Fragment>
      )

    }else if(this.userType === 'supervisor'){

      return (
        <React.Fragment>
          <Navbar panel={"supervisor"} />
          <Container>
          
          {spinnerDiv1 && (
            <div className="spinner">
              <Spinner style={{ marginBottom: "20px" , marginLeft:'300px',marginTop:'20px' }} animation="border" variant="info" />
            </div>
          )}

            {this.state.noticeListBlock .length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice</h3>
                <div>

                  {this.state.noticeListBlock .map(types => {
                    if(types.toSupervisor){
                    return (
                      <Card
                        key={types._id}
                        style={{ marginTop: "20px", marginBottom: "10px" }}
                      >
                      <Row>
                      <Col xs="12">
                        <CardContent style={{ paddingBottom: "2px" }}>
                          <h6><b>{types.noticeTittle}</b><small>({types.projectName})</small></h6>
                          <h6>by <small>({types.userType}</small><small>
                          {types.date})</small></h6>
                        </CardContent>
                      </Col>
                    </Row>

                       

                        <CardContent style={{ paddingTop: "2px", fontWeight: "300" }}>
                          <Typography variant="body2" component="p">
                            {types.notice}
                          </Typography>
                          <a href={"http://localhost:4000/notice/noticeAttachment/" + types.noticeAttachment}>
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
