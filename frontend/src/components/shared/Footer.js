import React, { Component } from "react";
import "../../css/shared/Footer.css";
import Contactus from "./Contactus";

export default class footer extends Component {
  render() {
    return (
      <div className="container-fluid footer-div">
        <div className="container">
          <div className="row">
            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                {/* <p className="companey-name">Team Members</p> */}
              </div>
              {/* <div className="row">
              <img style={{ width: '18rem' }}  src={require('../../assets/logo/Project Logo white.png')} />
              </div> */}
              {/* <div className="row">
                <p className="address"> S.M.W. Arachchi</p>
              </div> */}
              <div className="row">
                <img style={{ width: '17rem' }} src={require('../../assets/logo/Project Logo white.png')} />
              </div>
              {/* <div className="row">
                <p className="address"> H.I.D.D. Galappaththi</p>
              </div>
              <div className="row">
                <p className="address"> K.A.B.S. Kumaranayake</p>
              </div>
              <div className="row">
                <p className="address"> M.S. Mushtaq</p>
              </div> */}
            </div>

            <div className="col-md-4" style={{ marginTop: " 30px" }}>
                <p>E-Supervision is a IT project supervision platform for university student. </p>
            </div>

            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <div className="col-md-12 zero-padding">
                  <p className="companey-name">Contact Us</p>
                </div>
                <div className="col-md-12  zero-padding">
                  <Contactus />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <hr></hr>
        </div>
        <div className="container">
          <p className="copyright">
            Copyright &copy; 2020 e-Supervision Team.
            All rights reserved
            &reg;.
          </p>
        </div>
      </div>
    );
  }
}
