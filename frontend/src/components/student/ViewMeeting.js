import React, { Component } from "react";
import { verifyAuth } from "../../utils/Authentication";
import Navbar from "../shared/Navbar";
import Footer from '../shared/Footer';
import '../../css/students/ViewMeeting.css';
import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import RequestMeeting from "./RequestMeeting";


// import ViewProjects from "./ViewProjects";


class ViewMeeting extends Component {
  //   componentDidMount = async () => {
  //     localStorage.setItem("user-level","student")

  //     const authState = await verifyAuth();
  //     this.setState({ authState: authState });
  //     if (!authState || !localStorage.getItem("isStudent"))
  //       this.props.history.push("/");
  //   };
  render() {
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        {/* <ViewProjects/> */}
        <div className="form-group">
          {/* <Button className="btn btn-info my-4" type="submit" block>New Meeting</Button>
           */}
           <RequestMeeting/>
        </div>
        <Footer />

      </React.Fragment>
    );
  }
}

export default ViewMeeting;
