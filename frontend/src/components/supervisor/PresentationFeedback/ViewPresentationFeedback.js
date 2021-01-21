import React, { Component } from "react";
import { getFromStorage } from "../../../utils/Storage";
import axios from "axios";
import BackendURI from "../../shared/BackendURI";
import { Table, Col, Row } from "react-bootstrap";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ProjectName from "./ProjectName";
import GroupName from "./GroupName";
import SupervisorName from "./SupervisorName";
import Snackpop from "../../shared/Snackpop";
import { confirmAlert } from "react-confirm-alert";

class ViewPresentationFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackList: [],
      loading: true,
      successAlert: false,
    };
  }

  componentDidMount() {
    this.getFeedbackList();
  }

  getFeedbackList = async () => {
    const headers = {
      "auth-token": getFromStorage("auth-token").token,
    };

    await axios
      .get(BackendURI.url + "/presentationfeedback/get", { headers: headers })
      .then((res) => {
        this.setState({
          feedbackList: res.data,
          loading: false,
        });
      });
  };

  // onEditHandler = (item) => {
  //     this.props.history.push('/supervisorhome/editpresentationfeedback/' + item._id, { data: item, })
  //
  // }

  onDeleteHandler = async (item) => {
    confirmAlert({
      title: "Feedback",
      message: "Are you sure you want to delete this feedback?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const headers = {
              "auth-token": getFromStorage("auth-token").token,
            };

            await axios
              .delete(
                BackendURI.url + "/presentationfeedback/delete/" + item._id,
                { headers: headers }
              )
              .then((res) => {
                this.setState({
                  successAlert: true,
                });

                this.getFeedbackList();
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  closeAlert = () => {
    this.setState({
      successAlert: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Snackpop
          msg={"Feedback Deleted"}
          color={"success"}
          time={3000}
          status={this.state.successAlert}
          closeAlert={this.closeAlert}
        />

        <div
          style={{
            padding: "0px 30px 20px 30px",
            backgroundColor: "white",
            marginTop: "30px",
          }}
        >
          <div className="heading-div" style={{ paddingTop: "30px" }}>
            <h3 className="heading">Recent Feedbacks</h3>
          </div>
          <Table hover style={{ marginTop: 20, border: "1px solid #DDD" }}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Group</th>
                <th>Author</th>
                <th>Presentation</th>
                <th>Feedback</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {!this.state.loading &&
                this.state.feedbackList.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        <ProjectName id={item.projectId} />
                      </td>
                      <td>
                        <GroupName id={item.groupId} />
                      </td>
                      <td>
                        <SupervisorName id={item.userId} />
                      </td>
                      <td>{item.presentationName}</td>
                      <td>{item.feedback}</td>
                      <td>
                        <Row>
                          {/*<Col><Create className="edit-btn" fontSize="large" onClick={() => this.onEditHandler(item)} /></Col>*/}
                          <Col>
                            <DeleteForeverIcon
                              className="del-btn"
                              fontSize="large"
                              onClick={() => this.onDeleteHandler(item)}
                            />
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </React.Fragment>
    );
  }
}

export default ViewPresentationFeedback;
