import React, { Component } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../Css/Admin/registration.css";
import axios from "axios";
import Sidebar from "./shared/Sidebar";
import { verifyAuth } from "../utils/authentication";
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
    e.persist = () => {};
    let store = this.state;
    store.form[e.target.name] = e.target.value;
    this.setState(store);
  };

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
      <Col className="row">
        <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
          <Sidebar />
        </div>
        <div className="col-md-10">
          <React.Fragment>
            <h3 style={{ textAlign: "center", marginTop: "50px" }}>
              User Registration
            </h3>

            <div className="card">
              <div style={{ width: "90%", margin: "auto" }}>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group" style={{ marginTop: "50px" }}>
                    <label>Full Name : </label>
                    <input
                      name="fullName"
                      type="text"
                      className="form-control"
                      value={form.fullName}
                      onChange={this.onChange}
                    ></input>
                  </div>
                  <div className="form-group">
                    <label>Password : </label>
                    <input
                      type="text"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={this.onChange}
                    ></input>
                  </div>

                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>User ID : </label>
                        <input
                          type="text"
                          className="form-control"
                          name="userId"
                          value={form.userId}
                          onChange={this.onChange}
                        ></input>
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <label>Usertype : </label>
                        <Select
                          value={selectedOption}
                          options={options}
                          onChange={this.onChange}
                          // name="userType"
                        />
                      </div>
                    </Col>
                    <Col>
                      <label>Birthday : </label>
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
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>E-mail : </label>
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
                        <label>NIC Number : </label>
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
                        <label>Mobile Number 1 : </label>
                        <input
                          type="text"
                          className="form-control"
                          name="mobileOne"
                          value={form.mobileOne}
                          onChange={this.onChange}
                        ></input>
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <label>Mobile Number 2 : </label>
                        <input
                          type="text"
                          className="form-control"
                          name="mobileTwo"
                          value={form.mobileTwo}
                          onChange={this.onChange}
                        ></input>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label>EPF Number : </label>
                        <input
                          type="text"
                          className="form-control"
                          name="epf"
                          value={form.epf}
                          onChange={this.onChange}
                        ></input>
                      </div>
                    </Col>
                    <Col>
                      <div className="form-group">
                        <label>ETF Number : </label>
                        <input
                          type="text"
                          className="form-control"
                          name="etf"
                          value={form.etf}
                          onChange={this.onChange}
                        ></input>
                      </div>
                    </Col>
                  </Row>
                  <div className="form-group">
                    <label>Address : </label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="address"
                      value={form.address}
                      onChange={this.onChange}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Others : </label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="other"
                      value={form.other}
                      onChange={this.onChange}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <button
                      className="btn btn-info my-4 btn-block "
                      type="submit"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </React.Fragment>
        </div>
      </Col>
    );
  }
}
