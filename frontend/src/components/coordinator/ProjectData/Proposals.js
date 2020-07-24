import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios'
import { verifyAuth } from "../../../utils/Authentication";
import { getFromStorage } from "../../../utils/Storage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Snackpop from "../../shared/Snackpop";



import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';


import '../../../css/coordinator/proposel.scss';

import {
    Button,
    Container,
    Col,
    Row,
    FormControl,
    FormGroup,
  } from "react-bootstrap";
  const backendURI = require("../../shared/BackendURI");





class Proposals extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeProposelTittle = this.onChangeProposelTittle.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);

    
        this.state = {

          proposelTittle:"",
          deadDate :"",
          deadTime :"",
          proposelAttachment : "",
          imgname: '',
          state : "",

             
        }
    }

    handleDropdownChange = (e) => {
      const val = e.target.value
      this.setState({
        state : val
      });
    }

    onChangeProposelTittle(e) {
      this.setState({
        proposelTittle: e.target.value,
      });
    }

    onChangeDate = (e)=>{
      this.setState({
        deadDate : e.target.value,
      })
    }

    onChangeTime = (e) =>{
      this.setState({
        deadTime : e.target.value,
      })
    }

    onChangeFile =  (e)=>{
      this.setState ({
        imgname: e.target.files[0].name,
        proposelAttachment: e.target.files[0],
      })
    }


    onSubmit(e) {
      e.preventDefault();
      
          confirmAlert({
            title: 'Confirm to submit',
            message: "Are you sure?",
            buttons: [
              {
                label: "Yes",
                onClick: async () => {
  
                  const headers = {
                    'auth-token': getFromStorage('auth-token').token,
                  }
  
                  const date = new Date();
                  
  
                  const userType = localStorage.getItem("user-level");
                 
                  const userId = getFromStorage('auth-id').id;
  
                  const formData = new FormData();
  
  
                  formData.append("userId",userId);
                  formData.append("userType",userType);
                  formData.append("proposelTittle",this.state.proposelTittle);
                  formData.append("deadDate",this.state.deadDate);
                  formData.append("deadTime",this.state.deadTime);
                  formData.append("proposelAttachment",this.state.proposelAttachment);
                  formData.append("state",this.state.state);
    
  
                  axios
                    .post(backendURI.url + "/proposel/addProposel", formData, { headers: headers })
                    .then((res) => {
                      this.setState({
                        succesAlert: true,
                      });
                      window.location.reload();
                     
                    })
                    .catch((error) => {
                      this.setState({
                        snackbaropen: true,
                        snackbarmsg: error,
                      });
                      console.log(error);
                    });
  
  
                  this.setState({
                    proposelTittle:"",
                    deadDate:"",
                    deadTime:"",
                    proposelAttachment:""
  
                  });
                },
              },
              {
                label: "No",
                onClick: () => { },
              },
            ],
          });
        }


    render() {

        return (
            <React.Fragment>

            <Snackpop
            msg={"Successfully Added"}
            color={"success"}
            time={2000}
            status={this.state.succesAlert}
            closeAlert={this.closeAlert}
          />
          <Snackpop
            msg={"Deleted Successfully.."}
            color={"success"}
            time={2000}
            status={this.state.deleteSuccesAlert}
            closeAlert={this.closeAlert}
          />

            <Navbar panel={"coordinator"} />

            <div className="proposel-style">
            <div className="container-fluid pro-back">
            <div className="container">

            <Tabs defaultActiveKey="Submited Proposel" id="uncontrolled-tab-example"  className="pro-tabs" style={{marginBottom:"30px"}}>

            <Tab eventKey="Submited Proposel" title="Submited Proposel" className="pro-tab">
            
            <div className="card conatiner" style={{ margin: "0px 0px 20px 0px" }}>

            <div className="pro-head">
            <p className="pro-grp-name">G-08</p>
            </div>

            <div className="pro-body">
                <h6>Proposel Details</h6>
                <a>Attachment </a>
            </div>

            </div>
            
            </Tab>




            <Tab eventKey="Create Link" title="Create Proposel" className="pro-tab">
            
            <div>
            <div className="card container pro-link-crd">

            <form onSubmit={this.onSubmit}>

            <Row>
            <p className="pro-link-name">Crate New Proposel</p>
            </Row>

            <div className="form-group pro-form">
            <label >Proposel Tittle :</label>
            <input type="text" className="form-control" id="exampleInputProposel" placeholder="Proposel Tittle"
            name="proposelTittle" value={this.state.proposelTittle} onChange={this.onChangeProposelTittle}/>
            </div>


           
        <Row > 
            <Col  md={6} xs="12">
            <div className="form-group pro-form">
            <label >Dead Line Date :</label>
            <input type="date" className="form-control" id="exampleInputDate" name="deadDate"
            value={this.state.deadDate} onChange={this.onChangeDate}/>
            </div>
            </Col>

            <Col md={6} xs="12">
            <div className="form-group pro-form">
            <label >Dead Line Time :</label>
            <input type="time" className="form-control" id="exampleInputTime" name="deadTime"
            value={this.state.deadTime} onChange={this.onChangeTime}/>
            </div>
            </Col>

        </Row>

        <Row>
            <Col md={6} xs="12">
            <label className="verticle-align-middle  pro-form">File Attach :{" "}</label>
            <FormGroup  className="pro-form">

            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text"> Upload </span>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="exampleFile"
                  onChange={this.onChangeFile}
                  name="proposelAttachment"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgname}</label>
              </div>
            </div>

          </FormGroup>
            </Col>

            <Col  md={6} xs="12">
            <div className="form-group pro-form">
                    <label className="text-label">State : </label>
                    <div className="form-group">
                        <select className="form-control" id="dropdown" value={this.state.state} onChange={this.handleDropdownChange} >
                            <option>Select State</option>
                            <option value="Pending">Pending</option>
                            <option value="Open">Open</option>
                            <option value="Close">Close</option>
                        </select>
                    </div>
                    </div>
        
            </Col>

        </Row>
            <Row style={{ marginTop: "10px", marginBottom: "20px" }}>
                <Button
                type="submit"
                className="pro-btn"
                variant="info"
                onClick={this.onSubmit}>Add Proposel
                </Button>
            </Row>
            
            </form>
            
            </div>
            </div>
            </Tab>
            </Tabs>
            </div>
            </div>
            </div>

            <Footer />
           </React.Fragment>
        );
    }
}

export default Proposals;