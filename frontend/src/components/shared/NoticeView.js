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

          noticeList: [],
          noticeView : [],
          notice:'',
          userType: '',
          // toStudent:'',
          // toSupervisor:'',
          
       }
       this.getNoticeList = this.getNoticeList.bind(this);
      //  this.getNoticeViewList = this.getNoticeViewList.bind(this);
     }

     componentDidMount() {
          this.getNoticeList();
          // this.getNoticeViewList();
      
         

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
  render() {

    if(this.userType === 'student'){

      return (
        <React.Fragment>
        <Navbar panel={"student"} />
        <Container>
        {this.state.noticeList.length > 0 &&(
          <div>
            <h3>Notice View </h3>
            <div>

              {this.state.noticeList.map((type) => {
                if(type.toStudent){
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

                    
                  </Card>
                );
              }
              })}
            </div>
          </div>
        )}
           
           </Container>
           </React.Fragment>
        );   
        
    } else if(this.userType == 'supervisor'){
      return(
        <React.Fragment>
        <Navbar panel={"supervisor"} />
        <Container>
        {this.state.noticeList.length > 0 &&(
          <div>
            <h3>Notice View </h3>
            <div>

              {this.state.noticeList.map((type) => {
                if(type.toSupervisor){
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

                    
                  </Card>
                );
              }
              })}
            </div>
          </div>
        )}
           
           </Container>
           </React.Fragment>
      )
    } else if(this.userType === 'coordinator'){

      return(
        <React.Fragment>
        <Navbar panel={"coordinator"} />
        <Container>
        {this.state.noticeList.length > 0 &&(
          <div>
            <h3>Notice View </h3>
            <div>

              {this.state.noticeList.map((type) => {
                if(type.toCordinator){
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

                    
                  </Card>
                );
              }
              })}
            </div>
          </div>
        )}
           
           </Container>
           </React.Fragment>
      )

    }else{
      return(
        <h2>dbhscjks</h2>
      )
    }
  
  
  }   
}

export default NoticeView
