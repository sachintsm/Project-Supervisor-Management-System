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
import Snackpop from "../shared/Snackpop";
import DatePicker from "react-datepicker";
import { getFromStorage } from "../../utils/Storage";
import Select from '@material-ui/core/Select';



const backendURI = require('../shared/BackendURI');


export default class RequestMeeting extends Component {

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
      super:"",
      supervisorN: [],
      superOptionList: [],
      selectValue: "",

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
    console.log(this.state.group.supervisors);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);

  }

  componentDidMount = async () => {

    for (let j = 0; j < this.state.group.supervisors.length; j++) {

      await axios.get(backendURI.url + '/users/getUserName/' + this.state.group.supervisors[j])
        .then((result) => {
          console.log(result.data.data[0]);

          this.setState({
            supervisorN: [...this.state.supervisorN, result.data.data[0]],
          });
        })

        .catch((err) => {
          console.log(err);
        });

    }
    console.log(this.state.supervisorN);


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

  handleDropdownChange(e) {
    console.log(e.target.value)
    this.setState({ supervisor: e.target.value,
      super: e.target.value1
     });
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


  onSubmit(e) {
    e.preventDefault()
    const err = this.validate();
    //?calling validation function

    if (!err) {
      this.setState({
        purposeError: '',
        dateError: '',
        timeError: '',
        supervisorError: '',
      })
      const obj = {
        groupId: this.state.group.groupId,
        purpose: this.state.purpose,
        date: this.state.date,
        time: this.state.time,
        supervisor: this.state.supervisor,

      };
      console.log("abcd");
      console.log(obj);
      axios.post(backendURI.url + "/requestMeeting/add", obj)
        .then((res) => {
          console.log(res.data.state)
          if (res.data.state === true) {
            this.setState({
              snackbaropen: true,
              snackbarmsg: res.data.msg,
              snackbarcolor: 'success',
            })
            window.location.reload()
          }
          else {
            this.setState({
              snackbaropen: true,
              snackbarmsg: res.data.msg,
              snackbarcolor: 'error',
            })
          }
          console.log(res.data);
        })
        .catch((error) => {
          this.setState({
            snackbaropen: true,
            snackbarmsg: error,
            snackbarcolor: 'error',
          })
          console.log(error);
        });
      this.setState({
        modal: false
      })
    }

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
          <Button className="btn btn-info" onClick={this.toggle} style={{ width: "100%", marginTop: "30px" }}>
            New Meet
       </Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Request Meeting</ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row">
                </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                  <form onSubmit={this.onSubmit}>

                    <div className="form-group">
                      <Label for="avatar">Purpose</Label>
                      <Input type="textarea" className="form-control" name="purpose" onChange={this.onChange} />
                      <p className="reg-error">{this.state.messageError}</p>

                    </div>


                    <Row>
                      <Col>
                        <div className="form-group">
                          <label className="text-label">Date </label>
                          {/* <input type="text" className="form-control" name="date" onChange={this.onChange} />
                        <p className="reg-error">{this.state.firstNameError}</p> */}
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
                          <input type="text" className="form-control" name="time" onChange={this.onChange} />
                          <p className="reg-error">{this.state.lastNameError}</p>

                        </div>
                      </Col>
                    </Row>

                    {/* <div className="form-group">
                    <Label for="avatar">Supervisor</Label>
                    <Input type="text" className="form-control" name="supervisor" onChange={this.onChange} />
                    <p className="reg-error">{this.state.emailError}</p>

                  </div> */}
                    <div className="form-group">
                      <Label for="avatar">Supervisor</Label>

                      <select id="dropdown" onChange={this.handleDropdownChange} className="form-control" >
                        <option value="N/A">Select Supervisor</option>

                        {this.state.supervisorN.map((data, i) => {
                          return (
                            <option key={i}  value={data._id}>{data.firstName} {data.lastName}</option>
                          )

                        })}

                      </select>
                    </div>

                    <div className="form-group">
                      <Button className="btn btn-info my-4" type="submit" block>Send Request</Button>
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

