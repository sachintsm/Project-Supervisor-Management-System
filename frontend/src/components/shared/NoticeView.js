import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";

//import Footer from "../shared/Footer";
//import Navbar from "../shared/Navbar";
import axios from "axios";

import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";

import {
     Button,
     Container,
     Col,
     Row,
     FormControl,
     FormGroup,
   } from "react-bootstrap";

   const backendURI = require("./BackendURI");
class NoticeView extends Component {

     constructor(props) {
       super(props)
     
       this.state = {
        
          projectIdList:[],

          noticeList: [],
          noticeView : [],
          notice:'',
          userType: '',
          // toStudent:'',
          // toSupervisor:'',
          
       }
       this.getNoticeList = this.getNoticeList.bind(this);
       this.getProjectId = this.getProjectId.bind(this);
      //  this.getNoticeViewList = this.getNoticeViewList.bind(this);
     }

     componentDidMount() {
          this.getNoticeList();
          this.getProjectId();
          this.userType = localStorage.getItem("user-level");
          console.log(this.userType)
        }
     
        

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

        getProjectId() {
          axios.get(backendURI.url + "/ProjectSupervisors/getProjectId").then((result) => {
            if (result.data.length > 0) {
              console.log("shbakjd",result.data);
              this.setState({
                projectIdList: result.data.map((pList) => pList),
              });
            } else {
              this.setState({
                projectIdList: [],
              });
            }
          });
        }


  render() {

    

    if(this.userType === 'student'){

      return (
        <React.Fragment>
        <Navbar panel={"student"} />
        <Container>
        {this.state.noticeList.length > 0 &&(
          <div  style={{marginTop:"20px"}}>
            <h3>Notice View </h3>
            <div>

              {this.state.noticeList.map((type) => {
                if(type.toStudent){
                  return (
                    <Card
                      key={type._id}
                      style={{ marginTop: "20px", marginBottom: "10px" }}
                    >
                    <Row>
                      <Col xs="12">
                      <CardContent style={{ paddingBottom: "2px"}}>
                        <h6><b>{type.noticeTittle}</b>({type.userType})</h6>
                      </CardContent>
                      </Col>
                    </Row>  

                      <h6 style={{ color: "#6d6d6d", paddingLeft: "13px" ,fontSize:"2"}}><small>
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

           <Footer />
           </React.Fragment>
        );   
        
    } else if(this.userType === 'supervisor'){
      return(
        <React.Fragment>
        <Navbar panel={"supervisor"} />
        <Container>
        {this.state.noticeList.length > 0 &&(
          <div style={{marginTop:"20px"}}>
            <h3>Notice View </h3>
            <div>

              {this.state.noticeList.map((type) => {
                
                if(type.toSupervisor && type.projectId === "5ebcf3f80de93d0b000bb5a6"){
                  return (
                    <Card
                      key={type._id}
                      style={{ marginTop: "20px", marginBottom: "10px" }}
                    >
                    <Row>
                      <Col xs="12">
                      <CardContent style={{ paddingBottom: "2px"}}>
                        <h6><b>{type.noticeTittle}</b>({type.userType})</h6>
                      </CardContent>
                      </Col>
                    </Row>  

                      <h6 style={{ color: "#6d6d6d", paddingLeft: "13px" ,fontSize:"2"}}><small>
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
           <Footer />
           </React.Fragment>
      )
    } else if(this.userType === 'coordinator'){

      return(
        <React.Fragment>
        <Navbar panel={"coordinator"} />
        <Container>
        {this.state.noticeList.length > 0 &&(
          <div  style={{marginTop:"20px"}}>
            <h3>Notice View </h3>
            <div>

              {this.state.noticeList.map((type) => {
                if(type.toCordinator){
                  return (
                    <Card
                      key={type._id}
                      style={{ marginTop: "20px", marginBottom: "10px" }}
                    >
                    <Row>
                      <Col xs="12">
                      <CardContent style={{ paddingBottom: "2px"}}>
                        <h6><b>{type.noticeTittle}</b>({type.userType})</h6>
                      </CardContent>
                      </Col>
                    </Row>  

                      <h6 style={{ color: "#6d6d6d", paddingLeft: "13px" ,fontSize:"2"}}><small>
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
           <Footer />
           </React.Fragment>
      )

    }else{
      return(
        null
      )
    }
  
  
  }   
}

export default NoticeView
