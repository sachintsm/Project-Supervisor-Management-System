import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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




class Proposals extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    



    render() {
        return (
            <React.Fragment>
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


            <Tab eventKey="Create Link" title="Create Proposel Link" className="pro-tab">

            <div className="card container pro-link-crd">

            <form>

            <Row>
            <p className="pro-link-name">Crate New Proposel</p>
            </Row>

            <div class="form-group pro-form">
            <label for="exampleInputProposel">Proposel Tittle :</label>
            <input type="text" class="form-control" id="exampleInputProposel" placeholder="Proposel Tittle"/>
            </div>

            <div class="form-group pro-form">
            <label for="exampleInputDate">Dead Line :</label>
            <input type="date" class="form-control" id="exampleInputDate"/>
            </div>


            
            
            </form>
            
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