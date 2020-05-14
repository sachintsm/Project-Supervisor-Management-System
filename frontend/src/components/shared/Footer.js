import React, { Component } from "react";
import { Form, Toast } from 'reactstrap';
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
} from 'react-bootstrap';
import { FiMail, } from 'react-icons/fi';
import "../../css/shared/Footer.css";
import Contactus from "./Contactus";
// import Iframe from 'react-iframe'

export default class footer extends Component {
  render() {
    return (
      <div className="container-fluid footer-div">
        <div className="container">
          <div className="row">
          <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <p className="companey-name">Team Members</p>
              </div>
              <div className="row">
                <p className="address"> > S.T.S. Muthumala</p>
              </div>
              <div className="row">
                <p className="address"> > S.M.W. Arachchi</p>
              </div>
              <div className="row">
                <p className="address"> > P.A.G. Rajapaksha</p>
              </div>
              <div className="row">
                <p className="address"> > H.I.D.D. Galappaththi</p>
              </div>
              <div className="row">
                <p className="address"> > K.A.B.S. Kumaranayake</p>
              </div>
              <div className="row">
                <p className="address"> > M.S. Mushtaq</p>
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <p className="companey-name">Our Services</p>
              </div>
              
            </div>
            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <p className="companey-name">Contact Us</p>
            </div>

              <Contactus/>
              {/* <div className="row">
                    <div className="col-md-1"><a href="/shared/mailbox"><FiMail size='1.5rem'></FiMail></a></div>
                    <div className="col-md-10">
                    <li><a href="/shared/mailbox">Mail Box</a></li>
                    </div>
    </div> */}

              {/*<Form>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text id='basic-addon1'>
                        <FiMail size='1.5rem'></FiMail>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type='email'
                      onChange={this.onChangeEmail}
                      aria-describedby='basic-addon1'
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Password</FormLabel>

                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text id='basic-addon1'>
                        <FiLock size='1.5rem'></FiLock>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type='password'
                      onChange={this.onChangePassword}
                    />
                  </InputGroup>
                </FormGroup>
                <div className='row' style={{ marginTop: '50px' }}>
                  <div className='col-md-6' style={{ textAlign: 'center' }}>
                    <Button variant='dark' style={{ width: '90%' }}>
                      Send Message
                    </Button>
                  </div>
                  <div className='col-md-6' style={{ textAlign: 'center' }}>
                    <Button
                      variant='dark'
                      style={{ width: '90%' }}
                      onClick={this.onSignIn}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </Form>
              {/*<div className="row">
                <span>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15863.873091019568!2d81.3007025!3d6.2679031!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xea2f77018cc4b90e!2sS%20%26%20S%20Petroleum%20Traders!5e0!3m2!1sen!2slk!4v1585027810833!5m2!1sen!2slk"
                    width="358"
                    height="150"
                    frameBorder="0"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                    title="gMap"
                  ></iframe>
                </span>
              </div>*/}
            </div>
    </div>
    </div>
        <div className="container">
          <hr></hr>
        </div>
        <div className="container">
          <p className="copyright">
            Copyright &copy; 2020 deathstalker Team&trade;. All rights reserved
            &reg;.
          </p>
        </div>
      </div>
    );
  }
}
