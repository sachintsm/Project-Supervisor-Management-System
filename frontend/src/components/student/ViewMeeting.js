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
import { Card, CardDeck } from 'react-bootstrap';
import axios from 'axios';
const backendURI = require('../shared/BackendURI');




const ViewMeetings = props => (
  <div>
    <br />
    <div className="col-md-4">
      <Card bg="light" text="black" style={{ width: '20rem' }} className="card text-center shadow mycard">
        <div className="overflow">
          {/* <Card.Img variant="top" height="240" src={!props.signupcustomer.businessImg ? company :props.signupcustomer.businessImg} alt="" className="card-img-top" /> */}
        </div>
        {/* <Card.Header><center>Are you from around {props.viewmeetings.signup_city}?</center></Card.Header> */}
        <Card.Body>

          {/* <center>
              <h1>
                  <StarRatingComponent 
                      name="rate1" 
                      starCount={5}
                      value={props.signupcustomer.sumRate/props.signupcustomer.rateTime}
                  />
              </h1>
          </center>   */}
          {/* <Card.Title><center>{props.viewmeetings.signup_company}</center></Card.Title> */}
          <Card.Text >
            Purpose : {props.viewmeetings.purpose} <br />
              Date : {props.viewmeetings.date}<br />
              Time : {props.viewmeetings.time}<br />
              Supervisor : {props.viewmeetings.supervisor}<br />
          </Card.Text>
          {/* <center><Link to={"/customer/more/"+props.signupcustomer._id}>Visit More</Link></center> */}

        </Card.Body>
      </Card>
    </div>
  </div>
)


// import ViewProjects from "./ViewProjects";


class ViewMeeting extends Component {
  //   componentDidMount = async () => {
  //     localStorage.setItem("user-level","student")

  //     const authState = await verifyAuth();
  //     this.setState({ authState: authState });
  //     if (!authState || !localStorage.getItem("isStudent"))
  //       this.props.history.push("/");
  //   };
  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      project: props.location.state.projectDetails,
      group: props.location.state.groupDetails,

    };

  }

  componentDidMount() {
    console.log(this.state.group.groupId);

    axios.get(backendURI.url + '/requestMeeting/get/' + this.state.group.groupId)
      .then(response => {
        console.log(response.data.data);

        this.setState({ meetings: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      })

  }

  UserList() {

    console.log(this.state.meetings);
    return this.state.meetings.map(function (currentViewMeetings, i) {

      return <ViewMeetings viewmeetings={currentViewMeetings} key={i} />;

    })


  }

  render() {
    return (
      <React.Fragment>
        <Navbar panel={"student"} />
        {/* <ViewProjects/> */}
        <div className="form-group">
          <RequestMeeting project={this.state.project} group={this.state.group} />
        </div>
        <div>
          <CardDeck>
            {this.UserList()}
          </CardDeck>
        </div>
        <Footer />

      </React.Fragment>
    );
  }
}

export default ViewMeeting;
