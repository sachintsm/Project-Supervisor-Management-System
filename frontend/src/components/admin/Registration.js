import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col } from "reactstrap";
import "../../css/admin/Registration.css";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getFromStorage } from '../../utils/Storage';
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CSVReader from "react-csv-reader";
import Footer from '../shared/Footer'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

const backendURI = require('../shared/BackendURI');

export default class registration extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleChangeUsertype = this.handleChangeUsertype.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.state = {
      snackbaropen: false,
      snackbarmsg: '',
      form: {
        firstName: '',
        lastName: '',
        userType: '',
        email: '',
        nic: '',
        mobileNumber: '',


        imgName: '',
      },

      csvData: [],
      startDate: new Date(),
    };
  }
  snackbarClose = (event) => {
    this.setState({ snackbaropen: false })
  }


  async componentDidMount() {
    const authState = await verifyAuth();
    console.log(authState);

    console.log(authState);
    this.setState({
      authState: authState,
    });
    if (!authState) {
      this.props.history.push("/");
    }
  }

  fileUpload = async (e) => {
    e.preventDefault();
    const obj = getFromStorage('auth-token');

    var myHeaders = new Headers();
    myHeaders.append("auth-token", obj.token);

    for (var i = 0; i < this.state.csvData.length - 1; i++) {
      var firstName = this.state.csvData[i][0];
      var lastName = this.state.csvData[i][1];
      var email = this.state.csvData[i][2];
      var password = this.state.csvData[i][3];
      var nic = this.state.csvData[i][3];
      var userType = this.state.csvData[i][4];
      var mobileNumber = this.state.csvData[i][5];
      var birthday = this.state.csvData[i][6];

      var data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        nic: nic,
        userType: userType,
        mobileNumber: mobileNumber,
        birthday: birthday
      }

      await fetch(backendURI.url + "/users/bulkRegister", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': obj.token
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then(json => {
          this.setState({
            snackbaropen: true,
            snackbarmsg: json.msg
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            snackbaropen: true,
            snackbarmsg: err
          })
        })
    }
  }

  onChangeDate = date => {
    this.setState(prevState => ({
      startDate: date
    }))
  }

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
  handleDropdownChange = (e) => {
    const Val = e.target.value
    console.log(Val)
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        userType: Val
      }
    }))
  }

  onSubmit(event) {
    event.preventDefault();

    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const obj = getFromStorage('auth-token');

            const formData = new FormData();

            formData.append('profileImage', this.state.form.file);
            formData.append('firstName', this.state.form.firstName);
            formData.append('lastName', this.state.form.lastName);
            formData.append('password', this.state.form.nic);
            formData.append('nic', this.state.form.nic);
            formData.append('email', this.state.form.email);
            formData.append('userType', this.state.form.userType);
            formData.append('birthday', this.state.startDate);
            formData.append('mobileNumber', this.state.form.mobileNumber);

            var myHeaders = new Headers();
            myHeaders.append("auth-token", obj.token);

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formData,
              redirect: 'follow'
            };

            if (this.state.form.firstName === '' || this.state.form.lastName === '' || this.state.form.nic === '' || this.state.form.email === '' || this.state.form.userType === '' || this.state.form.mobileNumber === '' || this.state.form.lastName === '') {
              this.setState({
                snackbaropen: true,
                snackbarmsg: "Please Fill the Form..!"
              })
            }
            else {
              fetch(backendURI.url + "/users/register", requestOptions)
                .then((res) => res.json())
                .then((json) => {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: json.msg
                  })
                })
                .catch(error => {
                  this.setState({
                    snackbaropen: true,
                    snackbarmsg: error
                  })
                  console.log('error', error)
                });
            }
            
          }
        },
        {
          label: 'No',
          onClick: () => {
            
          }
        }
      ]
    })

  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////




  render() {
    const { form } = this.state;

    const handleForce = data => {
      console.log(data);
      this.setState({
        csvData: data
      })
    };

    return (
      <div>
        <Navbar panel={"admin"} />
        <div className="container-fluid">
          <Snackbar
            open={this.state.snackbaropen}
            autoHideDuration={2000}
            onClose={this.snackbarClose}
            message={<span id="message-id">{this.state.snackbarmsg}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="secondary"
                onClick={this.snackbarClose}
              > x </IconButton>
            ]}
          />


          <Row>
            <Col xs="4">
              <img
                alt='background'
                src={require('../../assets/backgrounds/pngguru.png')}
                className='image'
              />
            </Col>
            <Col xs="8" className="main-div">


              <div className="container">

                <div >
                  <p className="reg-head">User Registration</p>
                  <Tabs className="tab" defaultActiveKey="single" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
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
                                  name="firstName"
                                  value={form.firstName}
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
                                  name="lastName"
                                  value={form.lastName}

                                  onChange={this.onChange}
                                ></input>
                              </div>
                            </Col>
                          </Row>

                          <div className="form-group">
                            <label className="text-label">Choose Profile Image : </label>
                          </div>
                          <Row className="input-div">
                            <Col>
                              {/* File input */}
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
                            </Col>
                          </Row>

                          <Row style={{ marginTop: "20px" }}>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">E-mail : </label>
                                <input
                                  type="email"
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
                                <div className="form-group">
                                  <select className="form-control" id="dropdown" value={form.userType} onChange={this.handleDropdownChange}>
                                    <option>Select User Type</option>
                                    <option value="Student">Student</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Admin">Administrator</option>

                                  </select>
                                </div>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">Mobile Number : </label>
                                <input type="number" className="form-control" name="mobileNumber" onChange={this.onChange}
                                  value={form.mobileNumber}
                                ></input>
                              </div>
                            </Col>
                            <Col>
                              <label className="text-label">Birthday : </label>
                              <div className="form-group">
                                <DatePicker
                                  className="form-control"
                                  selected={this.state.startDate}
                                  onChange={this.onChangeDate}
                                  dateFormat="yyyy-MM-dd"
                                />
                              </div>
                            </Col>
                          </Row>




                          <div className="form-group">
                            <button
                              className="btn btn-info my-4  "
                              type="submit"
                            >Register Now </button>
                          </div>
                        </form>
                      </div>
                    </Tab>


                    <Tab eventKey="bulk" title="Bulk Registration">
                      <div style={{ width: "95%", margin: "auto", marginTop: "50px" }}>


                        <div className="form-group">
                          <label className="text-label">CSV File Format : </label>
                        </div>

                        <img
                          alt='background'
                          src={require('../../assets/images/Reg-CSV-Format.png')}
                          className='image2'
                        />




                        <div className="form-group reg-csv-topic">
                          <label className="text-label">Choose CSV File : </label>
                        </div>


                        <div className="container">
                          <CSVReader
                            cssClass="react-csv-input"
                            onFileLoaded={handleForce}
                            inputStyle={{ color: 'grey' }}
                          />
                        </div>

                        <div className="form-group">
                          <button
                            className="btn btn-info my-4  "
                            onClick={this.fileUpload}
                          >Register Now </button>
                        </div>

                      </div>

                    </Tab>
                  </Tabs>

                </div>
              </div>

            </Col>
          </Row>
        </div>
        <Footer />

      </div>
    );
  }
}
