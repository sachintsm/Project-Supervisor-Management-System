import React, { Component } from 'react';
import { Input, Label, Button, Modal, ModalHeader, ModalBody, Row, Col, } from 'reactstrap';
import axios from 'axios';
import Snackpop from "../../shared/Snackpop";
import DatePicker from "react-datepicker";
import TimeInput from 'material-ui-time-picker';
import '../../../css/supervisor/Meeting.scss';
import { getFromStorage } from '../../../utils/Storage';

const backendURI = require('../../shared/BackendURI');

class UrgentMeeting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      snackbaropen: false,
      snackbarmsg: '',
      snackbarcolor: '',
      groupId: this.props.groupId,
      groupNumber: this.props.groupNumber,
      date: new Date(),
      meetingTime: '',
      link:'',
    }
    this.createMeeting = this.createMeeting.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onLinkChange = this.onLinkChange.bind(this);


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
    this.setState({
      purpose: e.target.value,
    });
  };

  onLinkChange(e) {
    this.setState({  link : e.target.value })

  }

  onTimeChange(e) {
    this.setState({ meetingTime: e.target.value })
    console.log(this.state.meetingTime);

  }

  createMeeting(e) {
    e.preventDefault();
    if (this.state.meetingTime == '') {
      this.setState({
        snackbaropen: true,
        snackbarmsg: "Please set the time!",
        snackbarcolor: 'error',
      })
    }

    else {
      const obj = {
        purpose: this.state.purpose,
        date: this.state.date,
        time: this.state.meetingTime,
        link: this.state.link,
        supervisor: getFromStorage('auth-id').id,
        groupId: this.state.groupId,
        groupNumber: this.state.groupNumber
      }
      const headers = {
        'auth-token': getFromStorage('auth-token').token,
      }

      axios.post(backendURI.url + '/requestMeeting/urgentMeeting', obj, { headers: headers })
        .then(res => {
          if (res.data.state === true) {
            this.setState({
              snackbaropen: true,
              snackbarmsg: res.data.msg,
              snackbarcolor: 'success',
            })
            window.location.reload(false);
          }

          else {
            this.setState({
              snackbaropen: true,
              snackbarmsg: res.data.msg,
              snackbarcolor: 'error',
            })
          }
        })
    }
  }



  render() {
    return (
      <div className="ug-meetings">
        <Snackpop
          msg={this.state.snackbarmsg}
          color={this.state.snackbarcolor}
          time={3000}
          status={this.state.snackbaropen}
          closeAlert={this.closeAlert}
        />
        <button className="btn btn-info urgentMeeting" onClick={this.toggle}>New Urgent Meeting</button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>New Urgent Meeting</ModalHeader>
          <ModalBody>
            <div className="container">
              <div className="row">
              </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                <form onSubmit={this.createMeeting}>
                  <div className="form-group">
                    <Label for="avatar">Purpose</Label>
                    <Input type="textarea" className="form-control" name="purpose" onChange={this.onChange} />
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
                        <input className="form-control" type="time" name="time" onChange={this.onTimeChange}></input>
                      </div>
                    </Col>
                  </Row>
                  <div className="form-group">
                    <Label for="avatar">Link</Label>
                    <Input a type="textarea" className="form-control" name="link" onChange={this.onLinkChange} />
                  </div>
                  <div className="form-group">
                    <Button className="btn btn-info" type="submit" block>Create Meeting</Button>
                  </div>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }

}



export default UrgentMeeting;

