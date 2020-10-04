import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import Navbar from '../shared/Navbar';
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
import {Container, Col, Row} from "react-bootstrap";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { confirmAlert } from "react-confirm-alert";
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import Snackpop from "../shared/Snackpop";



const backendURI = require("../shared/BackendURI");

export default class MailBox extends Component {

  constructor(props) {
    super(props)
    this.state = {MessageList: []}
  }

  componentDidMount = async () => {
    await axios.get(backendURI.url + '/contactUs')
      .then(res => {
        this.setState({ MessageList: res.data })
      }) 
  }

  onDeleteHandler = (id) => {

   // console.log("jkdfndsn")
    confirmAlert({
      title: "Delete Mail",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {

            const headers = {
              'auth-token': getFromStorage('auth-token').token,
            }
            axios
              .delete(backendURI.url + "/contactUs/mail_delete/" + id, { headers: headers })
              .then((res) => {
                this.setState({
                  deleteSuccesAlert: true,
                });
                this.componentDidMount();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
        {
          label: "No",
          onClick: () => { },
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
      return (
        <React.Fragment> 
        
        <Snackpop
        msg={"Deleted Successfully.."}
        color={"success"}
        time={2000}
        status={this.state.deleteSuccesAlert}
        closeAlert={this.closeAlert}
      />


          <Container>
              <div style={{ marginTop: "20px" }}>
                <h3>Mail Box </h3>
                <div>
                  {this.state.MessageList.map(message => {
                    return (
                      <Card style={{ marginTop: "20px", marginBottom: "10px" }} key={message._id}>
                        <Row>
                          <Col xs="11">
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6>{message.firstName} {message.lastName}</h6>
                              </CardContent>
                          </Col>
                          <Col xs="1">
                                <DeleteForeverIcon style={{marginTop:"5px"}} className="del-btn" fontSize="large"  onClick={() => this.onDeleteHandler(message._id)} />
                                
                              {message.messageState && <td style={{ verticalAlign: 'middle' , color: 'green'}}>Read</td>}
                              {!message.messageState && <td style={{ verticalAlign: 'middle' , color: 'red' }}>Unread</td>}
                              </Col>

                            </Row>

                        
                        {/* <h6 style={{ color: "#6d6d6d", paddingLeft: "13px", fontSize: "2" }}><small>
                          {message.data}</small>
                        </h6> */}

                        <CardContent style={{ paddingTop: "2px", fontWeight: "300" }}>
                          {message.message}<br/>
                          {message.contactNumber}<br/>
                          {message.email}
                          {/* {message.messageState && <td style={{ verticalAlign: 'middle' , color: 'green'}}>Read</td>}
                              {!message.messageState && <td style={{ verticalAlign: 'middle' , color: 'red' }}>Unread</td>} */}
                         </CardContent>
                        <h6 style={{ color: "#6d6d6d", paddingLeft: "13px", fontSize: "2" }}><small>
                         </small>
                        </h6>                      
                      </Card>
                    );
                  })}              
                </div>
              </div>
          </Container>        
        </React.Fragment>
      )  
  }
}
