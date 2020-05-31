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
       this.getNoticeViewList = this.getNoticeViewList.bind(this);
     }

     componentDidMount() {
          this.getNoticeList();
          this.getNoticeViewList();
      
         

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

        getNoticeViewList() {
              axios.get(backendURI.url + "/notice/viewNotices").then((result) => {
                if (result.data.length > 0) {
                  console.log(result.data);
                  this.setState({
                    noticeView : result.data.map((noticeview) => noticeview),
                  });
                } else {
                  this.setState({
                    NoticeView: [],
                  });
                }
              });
            }


  render() {

    
    if(this.state.noticeList.length > 0 && this.userType == 'student'){

      return (

        <React.Fragment>
        <Navbar panel={"student"} />
        <Container>

           <h2>Ashan</h2>

           </Container>
           </React.Fragment>
        );   
        
    }else{
      return(
        <React.Fragment>
        <Navbar panel={"supervisor"} />
        <Container>
        <h2>No Notice</h2>
        </Container>
        </React.Fragment>
      )
    } }   
}

export default NoticeView
