import React, { Component } from "react";
import "../../css/shared/footer.css";
// import Iframe from 'react-iframe'

export default class footer extends Component {
  render() {
    return (
      <div className="container-fluid footer-div">
        <div className="container">
          <div className="row">
            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <p className="companey-name">S & S Petroleum Traders</p>
              </div>
              <div className="row">
                <p className="address">Kasingama , Thissamaharama.</p>
              </div>
              <div className="row">
                <p className="address">+94 47 2237 489</p>
              </div>
              <div className="row">
                <p className="address">sandspertoleumtraders@gmail.com</p>
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <p className="companey-name">Our Services</p>
              </div>
              <div className="row">
                <p className="address"> > Lanka Super Diesel</p>
              </div>
              <div className="row">
                <p className="address"> > Lanka Auto Diesel</p>
              </div>
              <div className="row">
                <p className="address"> > Lanka Petrol Octane 92</p>
              </div>
              <div className="row">
                <p className="address"> > Lanka Petrol Octane 95</p>
              </div>
              <div className="row">
                <p className="address"> > Lanka Karosene oil</p>
              </div>
              <div className="row">
                <p className="address"> > Litro GAS</p>
              </div>
              <div className="row">
                <p className="address"> > Ceypetco Lubricants</p>
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: " 30px" }}>
              <div className="row">
                <p className="companey-name">Location</p>
              </div>
              <div className="row">
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
              </div>
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
