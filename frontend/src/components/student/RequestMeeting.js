import React, { Component } from "react";
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Snackpop from "../shared/Snackpop";
import { meetingRequestEmail } from "../shared/emailTemplates";

const backendURI = require("../shared/BackendURI");

class RequestMeeting extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);

    this.state = {
      item: this.props.project,
      group: this.props.group,
      snackbaropen: false,
      snackbarmsg: "",
      snackbarcolor: "",
      groupId: "",
      purpose: "",
      time: "",
      supervisor: "",
      supervisorEmail: "",
      supervisorFname: "",
      supervisorLname: "",
      super: "",
      supervisorN: [],
      superOptionList: [],
      selectValue: "",
      state: "pending",
      purposeError: "",
      dateError: "",
      timeError: "",
      supervisorError: "",
      groupDetails: [],
      activeList: [],
      endedList: [],
      project: "",

      date: new Date(),
    };
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  componentDidMount = async () => {
    console.log(this.state.group);
    for (let j = 0; j < this.state.group.supervisors.length; j++) {
      await axios
        .get(
          backendURI.url +
            "/users/getUserName/" +
            this.state.group.supervisors[j]
        )
        .then((result) => {
          this.setState({
            supervisorN: [...this.state.supervisorN, result.data.data[0]],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  closeAlert = () => {
    this.setState({ snackbaropen: false });
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChangeDate = (date) => {
    this.setState((prevState) => ({
      date: date,
    }));
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async handleDropdownChange(e) {
    this.setState({
      supervisor: e.target.value,
    });
    await axios
      .get(backendURI.url + "/users/getSupervisorEmail/" + e.target.value)
      .then((res) => {
        this.setState({
          supervisorEmail: res.data.data[0].email,
          supervisorFname: res.data.data[0].firstName,
          supervisorLname: res.data.data[0].lastName,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async onSubmit(e) {
    e.preventDefault();
    //calling the validation function
    const obj = {
      groupId: this.state.group._id,
      groupNumber: this.state.group.groupId,
      purpose: this.state.purpose,
      date: this.state.date,
      time: this.state.time,
      supervisor: this.state.supervisor,
      state: this.state.state,
    };

    axios
      .post(backendURI.url + "/requestMeeting/add", obj)
      .then((res) => {
        if (res.data.state === true) {
          this.setState({
            snackbaropen: true,
            snackbarmsg: res.data.msg,
            snackbarcolor: "success",
          });
          window.location.reload();
        } else {
          this.setState({
            snackbaropen: true,
            snackbarmsg: res.data.msg,
            snackbarcolor: "error",
          });
        }
      })
      .catch((error) => {
        this.setState({
          snackbaropen: true,
          snackbarmsg: error,
          snackbarcolor: "error",
        });
        console.log(error);
      });
    this.setState({
      modal: false,
    });

    const email = await meetingRequestEmail(
      this.state.supervisorEmail,
      this.state.group.groupId,
      this.state.purpose,
      this.state.supervisorFname,
      this.state.supervisorLname
    );

    axios
      .post(backendURI.url + "/mail/sendmail", email)

      .then((res) => {
        console.log(res);
      });
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
          <Button
            className="btn btn-info"
            onClick={this.toggle}
            style={{ width: "100%", marginTop: "30px" }}
          >
            New Meet
          </Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Request Meeting</ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row"></div>
                <div
                  style={{ width: "100%", margin: "auto", marginTop: "20px" }}
                >
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <Label for="avatar">Purpose</Label>
                      <Input
                        type="textarea"
                        className="form-control"
                        name="purpose"
                        onChange={this.onChange}
                      />
                      <p className="reg-error">{this.state.messageError}</p>
                    </div>
                    <div className="form-group">
                      <Label for="avatar">Supervisor</Label>
                      <select
                        id="dropdown"
                        onChange={this.handleDropdownChange}
                        className="form-control"
                      >
                        <option value="N/A">Select Supervisor</option>
                        {this.state.supervisorN.map((data, i) => {
                          return (
                            <option key={i} value={data._id}>
                              {data.firstName} {data.lastName}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="form-group">
                      <Button className="btn btn-info my-4" type="submit" block>
                        Send Request
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
export default RequestMeeting;
