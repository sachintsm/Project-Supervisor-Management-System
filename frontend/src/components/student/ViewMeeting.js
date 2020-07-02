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

    <div className="col-md-12 col-xs-12" style={{ marginBottom: "20px" }}>
      <Card bg="light" text="black" className="col-md-12 col-xs-12 card text-center vmb-req-meeting-card" style={{ marginTop: "0px", marginBottom: "0px" }}>
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
              Supervisor : {props.viewsuperna}<br />
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
      superNa: [],

    };

  }

  componentDidMount = async () => {
    console.log(this.state.group.groupId);

    await axios.get(backendURI.url + '/requestMeeting/get/' + this.state.group.groupId)
      .then(response => {
        console.log(response.data.data);

        this.setState({ meetings: response.data.data });
        console.log(this.state.meetings.length);

      }).catch(function (error) {
        console.log(error);
      })

    for (let i = 0; i < this.state.meetings.length; i++) {
      await axios.get(backendURI.url + '/users/getUserName/' + this.state.meetings[i].supervisor)
        .then(res => {
          console.log(res.data.data);

          var superName = res.data.data[0].firstName + ' ' + res.data.data[0].lastName;
          this.setState({
              superNa:  [...this.state.superNa, superName],
          })
        })
        console.log(this.state.superNa);
        

    }



  }

  UserList() {

    console.log(this.state.meetings);
    return this.state.meetings.map(function (currentViewMeetings,i) {

      return <ViewMeetings viewmeetings={currentViewMeetings}  key={i} />;

    })


  }
  // UserList() {

  //   console.log(this.state.meetings);
  //   return this.state.superNa.map(function ( currentviewsuperna,i) {

  //     return <ViewMeetings  viewsuperna={currentviewsuperna} key={i} />;

  //   })


  // }

  render() {
    return (
      <React.Fragment>

        <Navbar panel={"student"} />
        {/* <ViewProjects/> */}
        <div className="container">

          <div className="form-group">
            <RequestMeeting project={this.state.project} group={this.state.group} />
          </div>
          <div className="row">
            <div className="col-md-12">

              <CardDeck>
                {this.UserList()}
              </CardDeck>
            </div>
          </div>
        </div>
        <Footer />

      </React.Fragment>
    );
  }
}

export default ViewMeeting;
