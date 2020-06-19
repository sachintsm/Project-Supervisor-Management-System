import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import { getFromStorage } from '../../utils/Storage';


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
      getProjectId: [],
      NoticeList: [],
      allNoticeList:[],
      notice: '',
      userType: '',
    }

  }

  componentDidMount = async () => {

    this.userType = localStorage.getItem("user-level");
    console.log(this.userType)

    const userId = getFromStorage('auth-id').id;

    await axios.get(backendURI.url + '/notice/getAllActiveProjectId/' + userId)
      .then(res => {
        this.setState({ NoticeList: res.data.data })
      })
    
      await axios.get(backendURI.url + '/notice/viewNotice')
      .then((res => {
          this.setState({
            allNoticeList: res.data
          })
      }))
  }



  render() {
    
    if (this.userType === 'coordinator') {

      return (
        <React.Fragment>
          <Navbar panel={"coordinator"} />
          <Container>

            {this.state.NoticeList.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice View </h3>
                <div>

                  {this.state.NoticeList.map(types => {
                    return (
                      <Card
                        key={types._id}
                        style={{ marginTop: "20px", marginBottom: "10px" }}
                      >
                        <Row>
                          <Col xs="12">
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6><b>{types.noticeTittle}</b>({types.userType})</h6>
                            </CardContent>
                          </Col>
                        </Row>

                        <h6 style={{ color: "#6d6d6d", paddingLeft: "13px", fontSize: "2" }}><small>
                          {types.data}</small>
                        </h6>

                        <CardContent style={{ paddingTop: "2px", fontWeight: "300" }}>
                          <Typography variant="body2" component="p">
                            {types.notice}
                          </Typography>
                          <a href={"http://localhost:4000/notice/noticeAttachment/" + types.filePath}>
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
          <Footer />
        </React.Fragment>
      )

    }else if(this.userType === 'supervisor'){

      return (
        <React.Fragment>
          <Navbar panel={"supervisor"} />
          <Container>

            {this.state.NoticeList.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3>Notice View </h3>
                <div>

                  {this.state.NoticeList.map(types => {
                    if(types.toSupervisor){
                    return (
                      <Card
                        key={types._id}
                        style={{ marginTop: "20px", marginBottom: "10px" }}
                      >
                        <Row>
                          <Col xs="12">
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6><b>{types.noticeTittle}</b>({types.userType})</h6>
                            </CardContent>
                          </Col>
                        </Row>

                        <h6 style={{ color: "#6d6d6d", paddingLeft: "13px", fontSize: "2" }}><small>
                          {types.data}</small>
                        </h6>

                        <CardContent style={{ paddingTop: "2px", fontWeight: "300" }}>
                          <Typography variant="body2" component="p">
                            {types.notice}
                          </Typography>
                          <a href={"http://localhost:4000/notice/noticeAttachment/" + types.filePath}>
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
