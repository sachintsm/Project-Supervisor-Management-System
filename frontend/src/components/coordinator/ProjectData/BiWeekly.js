import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";


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

export default class BiWeekly extends Component {

    constructor(props) {
        super(props)
    
        this.state = {

          userTypes: '',
          userId: "",
          componentType: 'add',
          tittle : "Create New Byweekly",
          projectId:this.props.match.params.id,
          byweeklylTittle: "",
          byweeklyDiscription:"",
          deadDate :"",
          deadTime :"",
          byweeklyAttachment : "",
          imgname: '',
          toLateSubmision:false,

          byweeklyList :[],
          byweeklyId : "",
        }
    }
    
    render() {

        
        
        return (
                <React.Fragment>
                <Navbar panel={"coordinator"} />
    
                <div className="proposel-style">
                <div className="container-fluid pro-back">
                <div className="container">
    
                <Tabs defaultActiveKey="Submited BiWeekly" id="uncontrolled-tab-example"  className="pro-tabs" style={{marginBottom:"30px"}}>
    
                <Tab eventKey="Submited BiWeekly" title="Submited BiWeekly" className="pro-tab">
                
                <div className="card conatiner" style={{ margin: "0px 0px 20px 0px" }}>
    
                <div className="pro-head">
                <p className="pro-grp-name">G-08</p>
                </div>
    
                <div className="pro-body">
                    <h6>Biweekly Details</h6>
                    <a>Attachment </a>
                </div>
    
                </div>
                
                </Tab>
    
    
                <Tab eventKey="Create Link" title="Create BiWeekly" className="pro-tab">
                
                <div>



            <div className="card container pro-link-crd">
    
                
            <form onSubmit={this.onSubmit}>

            <Row>
            <p className="pro-link-name">{this.state.tittle}</p>
            </Row>

            <div className="form-group pro-form">
            <label >Byweekly Tittle :</label>
            <input type="text" className="form-control" id="exampleInputByweekly" placeholder="Ex :- Bi-Weekly Report"
            name="proposelTittle" value={this.state.proposelTittle} onChange={this.onChangeProposelTittle}/>
            </div>

            <div className="form-group pro-form">
            <label >Proposel Discription :</label>
            <textarea type="text" className="form-control" id="exampleInputProposel" placeholder="Discription"
            name="proposelTittle" value={this.state.proposelDiscription} onChange={this.onChangeproposelDiscription}/>
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

            <Col className="col-padding-5 check-box"  md={6} xs={12}>
            
            <FormControlLabel
              className="form-control-label"
              control={
                <Checkbox
                  fontSize="5px"
                  checked={this.state.toLateSubmision}
                  onChange={() => {
                    this.setState({
                      toLateSubmision: !this.state.toLateSubmision,
                    });
                  }}
                  name="checkedB"
                  color="default"
                />
              }
              label={
                <span style={{ fontSize: "14px" }}>
                Permision For Late Submision
                </span>
              }
            />
          
        
            </Col>

        </Row>
        <Row style={{ marginTop: '40px', marginBottom: '30px' }}>
        <Col md={1}></Col>
        {this.state.componentType === 'edit' &&
        <Col>
          <Button
              variant='danger'
              onClick={this.goBack}
              style={{ width: '100%' }}
          >
            Cancel
          </Button>
        </Col>}
        <Col>
          <Button
              variant='info'
              onClick={this.onSubmit}
              style={{ width: '100%' }}
          >
            {this.state.componentType === 'add' &&
            'Add Submision Now'}
            {this.state.componentType === 'edit' &&
            'Edit Now'}
          </Button>
        </Col>
        <Col md={1}></Col>
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
