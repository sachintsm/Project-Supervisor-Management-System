import React, { Component } from "react";
import "../../css/shared/Footer.css";
import Contactus from "./Contactus";

export default class footer extends Component {
  render() {
    return (
      <div className="container-fluid footer-div">
        <div className="container">
          <div className="row">
            <div className="col-md-3" style={{ marginTop: " 30px" }}>
              <div className="row"></div>

              <img
                style={{ width: "17rem" }}
                alt=""
                src={require("../../assets/logo/Project Logo white.png")}
              />
            </div>

            <div className="col-md-6" style={{ marginTop: " 30px" }}>
              <p className="companey-name">About</p>
              <p className="footer-text">
                <b>E Supervision</b> is an IT project supervision platform
                designed specifically for universities, that will help improve
                the effectiveness of the procedures of projects undertaken by
                the students.
              </p>
              <p className="footer-text">
                To aid the students in successfully completing assigned
                projects, universities often assign supervisors, mainly
                lecturers from the academic staff. E Supervision will take the
                supervising process to the next level, providing access to both
                parties to collaborate anytime. Keeping track of the progress,
                approving or reviewing submissions, student-supervisor meetings,
                will be a whole lot easier and efficient than ever before.
              </p>
            </div>

            <div className="col-md-3" style={{ marginTop: " 30px" }}>
              <p className="companey-name">Contact Us</p>
              <div className="col-md-12  zero-padding">
                <Contactus />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <hr></hr>
        </div>
        <div className="container">
          <p className="copyright">
            Copyright &copy; 2020 e-Supervision Team. All rights reserved &reg;.
          </p>
        </div>
      </div>
    );
  }
}
