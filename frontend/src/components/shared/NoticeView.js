import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";

//import Footer from "../shared/Footer";
//import Navbar from "../shared/Navbar";
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
class NoticeView extends Component {

     constructor(props) {
       super(props)
     
       this.state = {

          noticeList: [],
          noticeView : [],
          notice:'',
          userType:'',
          // toStudent:'',
          // toSupervisor:'',
          
       }
       this.getNoticeList = this.getNoticeList.bind(this);
       this.getNoticeViewList = this.getNoticeViewList.bind(this);
     }

     componentDidMount() {
          this.getNoticeList();
          this.getNoticeViewList();
      
          //console.log(localStorage)

          this.userType = localStorage.getItem("user-level");
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

    

    
    return (
      <React.Fragment>
      <div>
      <Row>
      <Col>
        <Container>
        {this.state.noticeList.length > 0 && (
          <div>
            <h3>Notice View </h3>
            <div>
              {this.state.noticeList.map((type) => {
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
              })}
            </div>
          </div>
        
        )}
        </Container>
        </Col>
        </Row>
      </div>
     
      </React.Fragment>
      );     
  }
}

export default NoticeView
