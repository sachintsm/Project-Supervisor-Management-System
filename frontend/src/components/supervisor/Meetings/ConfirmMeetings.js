import React, { Component } from 'react';
import axios from 'axios';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import { Row, Col } from "reactstrap";
import Snackpop from "../../shared/Snackpop";
import DatePicker from "react-datepicker";
import { getFromStorage } from "../../../utils/Storage";
import { verifyAuth } from "../../../utils/Authentication";
import TimeInput from 'material-ui-time-picker'

const backendURI = require('../../shared/BackendURI');

export default class ConfirmMeeting extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);


    this.state = {
      item: this.props.project,
      group: this.props.group,
      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',

      groupId: "",
      purpose: "",
      time: "",
      supervisor: "",
      super: "",
      supervisorN: [],
      superOptionList: [],
      selectValue: "",
      meetId: this.props.data,
      meetings: [],

      purposeError: '',
      dateError: '',
      timeError: '',
      supervisorError: '',
      groupDetails: [],
      activeList: [],
      endedList: [],
      project: '',

      date: new Date(),

    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {

    const authState = await verifyAuth();

    this.setState({
      authState: authState,
      groupDataBlock: [],
      finalBlock: []
    });
    if (!authState) {  //!check user is logged in or not if not re-directed to the login form
      this.props.history.push("/");
    }

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }

    const userId = getFromStorage('auth-id').id
    this.setState({
      userId: userId,
    })


    console.log(this.state.meetId);


    await axios.get(backendURI.url + '/requestMeeting/getmeet/' + this.state.meetId)
      .then(response => {
        // this.setState({ meetings: response.data.data });
        this.setState({
          purpose: response.data.data[0].purpose,
          // firstName: response.data.data[0].firstName,
          // lastName: response.data.data[0].lastName,
          // email: response.data.data[0].email,
          // nic: response.data.data[0].nic,
          // mobile: response.data.data[0].mobile

        });
      })
      .catch(function (error) {
        console.log(error);
      })

    console.log(this.state.meetings);


  }
  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChangeDate = date => {
    this.setState(prevState => ({
      date: date
    }))
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      // _id: this.state._id,
      date: this.state.date,
      time: this.state.time,
    };

    axios.post(backendURI.url + '/requestMeeting/updateMeet/' + this.state.meetId, obj)
      .then(res => console.log(res.data));

    // this.props.history.push('/users/editprofile/' + this.props.match.params.id);
    window.location.reload();
  }



  validate = () => {
    // let isError = false;
    // const errors = {
    //     purposeError: '',
    //     dateError: '',
    //     timeError: '',
    //     supervisorError: '',
    // };

    // if (this.state.firstName.length < 1) {
    //   isError = true;
    //   errors.firstNameError = 'First name required *'
    // }
    // if (this.state.lastName.length < 1) {
    //   isError = true;
    //   errors.lastNameError = 'Last name required *'
    // }
    // if (this.state.email.indexOf('@') === -1) {
    //   isError = true;
    //   errors.emailError = 'Invalied email address!'
    // }

    // if (this.state.contactNumber.length === 0 || this.state.contactNumber.length > 10) {
    //   isError = true;
    //   errors.nicError = 'Invalid NIC Contact Number!'
    // }
    // if (this.state.message.length < 1) {
    //   isError = true;
    //   errors.messageError = 'Message required *'
    // }

    // this.setState({
    //   ...this.state,
    //   ...errors
    // })
    // return isError;  //! is not error return state 'false'
  }


  // onSubmit(e) {
  //   e.preventDefault()
  //   const err = this.validate();
  //   //?calling validation function

  //   if (!err) {
  //     this.setState({
  //       purposeError: '',
  //       dateError: '',
  //       timeError: '',
  //       supervisorError: '',
  //     })
  //     const obj = {
  //       groupId: this.state.group.groupId,
  //       purpose: this.state.purpose,
  //       date: this.state.date,
  //       time: this.state.time,


  //     };
  //     console.log("abcd");
  //     console.log(obj);
  //     axios.post(backendURI.url + "/requestMeeting/add", obj)
  //       .then((res) => {
  //         console.log(res.data.state)
  //         if (res.data.state === true) {
  //           this.setState({
  //             snackbaropen: true,
  //             snackbarmsg: res.data.msg,
  //             snackbarcolor: 'success',
  //           })
  //           window.location.reload()
  //         }
  //         else {
  //           this.setState({
  //             snackbaropen: true,
  //             snackbarmsg: res.data.msg,
  //             snackbarcolor: 'error',
  //           })
  //         }
  //         console.log(res.data);
  //       })
  //       .catch((error) => {
  //         this.setState({
  //           snackbaropen: true,
  //           snackbarmsg: error,
  //           snackbarcolor: 'error',
  //         })
  //         console.log(error);
  //       });
  //     this.setState({
  //       modal: false
  //     })
  //   }

  // }

  handleChange = time => {

    console.log(time);
    
    this.setState({
      time: time
    })
    console.log(this.state.time);

  }

  render() {
    return (
      <div>
        <Snackpop
          msg={this.state.snackbarmsg}
          color={this.state.snackbarcolor}
          time={3000}
          status={this.state.snackbaropen}
          closeAlert={this.closeAlert}
        />
        
        <div className="container">
          <Button className="btn btn-info" onClick={this.toggle} style={{ width: "100%", marginTop: "0px" }}>Confirm Meeting</Button>

          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Confirm Meeting</ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row">
                </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <Label for="avatar">Purpose</Label>
                      <Input type="textarea" className="form-control" name="purpose" value={this.state.purpose} onChange={this.onChange} />
                      <p className="reg-error">{this.state.messageError}</p>
                    </div>
                    <Row>
                      <Col>
                        <div className="form-group">
                          <label className="text-label">Date </label>
                          <div className="form-group">
                            <DatePicker
                              className="form-control"
                              selected={this.state.date}
                              onChange={this.onChangeDate}
                              dateFormat="yyyy-MM-dd"
                            />
                          </div>

                        </div>
                      </Col>
                      <Col>
                        <div className="form-group">
                          <label className="text-label">Time </label>
                          <TimeInput
                            mode='12h'
                            onChange={(time) => this.handleChange(time)}
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="form-group">
                      <Button className="btn btn-info" type="submit" block>Confirm Request</Button>
                    </div>
                  </form>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}
