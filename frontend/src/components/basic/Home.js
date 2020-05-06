import React, { Component } from "react";
import { MDBCard, MDBCardTitle, MDBCol } from "mdbreact";
import "../../css/admin/login.css";
import "../../css/Basic/home.css";
import { Link } from "react-router-dom";
import { verifyAuth } from "../../utils/Authentication";
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: "",
    };
  }

  componentDidMount = async () => {
    const authState = await verifyAuth();
    this.setState({ authState: authState });
    if (!authState) this.props.history.push("/");
  };

  render() {
    return (
      <div className="home-div">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <MDBCol>
                <Link to="/registration">
                  <MDBCard style={{ width: "100%", minHeight: "80px" }}>
                    <MDBCardTitle style={{ margin: "auto", color: "black" }}>
                      User Registration
                    </MDBCardTitle>
                  </MDBCard>
                </Link>
              </MDBCol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
