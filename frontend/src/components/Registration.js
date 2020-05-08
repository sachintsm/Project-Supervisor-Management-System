import React, { Component } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../css/admin/Registration.css";
import axios from "axios";
import { verifyAuth } from "../utils/Authentication";
import Navbar from "../components/shared/Navbar";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { FileInput, SVGIcon } from 'react-md';
const backendURI = require("./shared/BackendURI");

const options = [
  { value: "Administartor", label: "Administrator" },
  { value: "Manager", label: "Manager" },
  { value: "Pumper", label: "Pumper" },
];

export default class registration extends Component {
  constructor(props) {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      form: {
        fullName: "",
        password: "",
        userId: "",
        userType: "",
        birthday: "",
        email: "",
        nic: "",
        mobileOne: "",
        mobileTwo: "",
        epf: "",
        etf: "",
        address: "",
        other: "",

        imgName: '',
      },
    };
  }
  async componentDidMount() {
    const authState = await verifyAuth();
    console.log(authState);
    this.setState({
      authState: authState,
    });
    if (!authState) {
      this.props.history.push("/login");
    }
  }

  state = {
    selectedOption: null,
    startDate: new Date(),
  };

  handleChangeBirthday = (date) => {
    this.setState({
      startDate: date,
    });
  };

  handleChangeUsertype = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  onChange = (e) => {
    e.persist = () => { };
    let store = this.state;
    store.form[e.target.name] = e.target.value;
    this.setState(store);
  };
  handleImageChange = (e) => {
    const Val = e.target.files[0]
    this.setState({
      imgName: Val.name
    })
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        file: Val
      }
    }))
  }
  onSubmit(event) {
    event.preventDefault();

    axios
      .post(backendURI.url + "/users/register", this.state.form)
      .then((res) => {
        console.log(res);
      });
    console.log(this.state.form);
  }

  render() {
    const { selectedOption, form } = this.state;

    return (
      <div>
        <Navbar panel={"admin"} />
        <div className="container-fluid">

          <Row>
            <Col xs="4">
              <img
                alt='background'
                src={require('../assets/backgrounds/reg-wallpaper.png')}
                className='image'
              />
            </Col>
            <Col xs="8" className="main-div">
              <div className="container">

                <div >
                  <h3 className="topic"> User Registration</h3>
                  <Tabs className="topic" defaultActiveKey="single" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                    <Tab eventKey="single" title="Registration">
                      <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>
                        <form onSubmit={this.onSubmit}>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">First Name: </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="email"
                                  value={form.email}
                                  onChange={this.onChange}
                                ></input>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">Last Name : </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="nic"
                                  value={form.nic}
                                  onChange={this.onChange}
                                ></input>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">E-mail : </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="email"
                                  value={form.email}
                                  onChange={this.onChange}
                                ></input>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">NIC Number : </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="nic"
                                  value={form.nic}
                                  onChange={this.onChange}
                                ></input>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">Usertype : </label>
                                <Select
                                  value={selectedOption}
                                  options={options}
                                  onChange={this.onChange}
                                // name="userType"
                                />
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">Mobile Number : </label>
                                <input type="text" className="form-control" name="userId" value={form.userId} onChange={this.onChange}
                                ></input>
                              </div>
                            </Col>
                            <Col>
                              <label className="text-label">Birthday : </label>
                              <div className="form-group">
                                <DatePicker
                                  className="form-control"
                                  selected={this.state.startDate}
                                  onChange={this.onChange}
                                  // name="birthday"
                                  value={form.birthday}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div className="form-group">
                            <label className="text-label">Choose Profile Image : </label>
                          </div>


                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text"> Upload </span>
                            </div>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                onChange={this.handleImageChange}
                              />
                              <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgName}</label>
                            </div>
                          </div>

                          <div className="form-group">
                            <button
                              className="btn btn-info my-4 btn-block "
                              type="submit"
                            >Register Now </button>
                          </div>
                        </form>
                      </div>
                    </Tab>
                    <Tab eventKey="bulk" title="Bulk Registration">

                    </Tab>
                  </Tabs>

                </div>
              </div>

            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
