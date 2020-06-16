import React, { Component } from 'react'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";
import {Container, Col, Row} from "react-bootstrap";

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

  render() {   
      return (
        <React.Fragment>       
          <Container>
              <div style={{ marginTop: "20px" }}>
                <h3>Notice View </h3>
                <div>
                  {this.state.MessageList.map(message => {
                    return (
                      <Card style={{ marginTop: "20px", marginBottom: "10px" }}>
                        <Row>
                          <Col xs="12">
                            <CardContent style={{ paddingBottom: "2px" }}>
                              <h6>{message.firstName} {message.lastName}</h6>
                            </CardContent>
                          </Col>
                        </Row>

                        <CardContent style={{ paddingTop: "2px", fontWeight: "300" }}>
                          {message.message}<br/>
                          {message.contactNumber}<br/>
                          {message.email}
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
