import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { Form } from 'reactstrap';
import '../css/admin/Login.css';
import { setInStorage } from '../utils/Storage';
import { ToastContainer, toast, Slide } from 'react-toastify';
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
} from 'react-bootstrap';
import { FiMail, FiLock } from 'react-icons/fi';

const backendURI = require('./shared/BackendURI');

export default class login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      signUpError: "",
      signInError: "",
      masterError: "",
      email: "",
      password: "",
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSignIn() {
    const { email, password } = this.state;

    fetch(backendURI.url + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log("josn", json);
        if (json.state) {
          setInStorage("auth-token", { token: json.token });
          setInStorage("auth-id", { id: json.userId });
          this.setState({
            signInError: json.msg,
            password: "",
            userId: "",
            token: json.token,
          });
          console.log(json)
          if (json.isAdmin) {
            setInStorage("isAdmin", true);
          }
          if (json.isStudent) {
            setInStorage("isStudent", true);
          }
          if (json.isSupervisor) {
            setInStorage("isSupervisor", true);
          }
          if (json.isCoordinator) {
            setInStorage("isCoordinator", true);
          }

          if (json.isAdmin) {
            this.props.history.push("/adminhome");
          } else if (json.isCoordinator) {
            this.props.history.push("/coordinatorhome");
          } else if (json.isSupervisor) {
            this.props.history.push("/supervisorhome");
          } else if (json.isStudent) {
            this.props.history.push("/studenthome");
          }
        } else {
          this.setState({
            signInError: json.msg,
          });
        }
      });
  }

  render() {
<<<<<<< HEAD
    const { email, password, signInError } = this.state;

    return (
      <div
        className="container-fluid"
        style={{ backgroundColor: "#F8F9FA", minHeight: "730px" }}
      >
        <div className="row">
          <div className="container login-card-div">
            <Card className="login-card">
              <Form>
                {signInError ? <p>{signInError}</p> : null}
                {/* eslint-disable-next-line */}
                <img
                  src={require("../assets/logo/Logo_reg.png")}
                  className="logo"
                />
                <CardContent
                  style={{ marginLeft: "20px", marginRight: "20px" }}
                >
                  <Typography color="textSecondary" gutterBottom>
                    Email
                  </Typography>
                  <MDBInput
                    outline
                    icon="envelope"
                    type="text"
                    placeholder="userId"
                    name="email"
                    value={email}
                    onChange={this.onChangeEmail}
                  />
                  <Typography color="textSecondary" gutterBottom>
                    Password
                  </Typography>
                  <MDBInput
                    outline
                    icon="key"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={this.onChangePassword}
                  />
                </CardContent>
                <CardActions style={{ marginBottom: "20px", marginRight: "20px", marginLeft: "20px" }}>
                  <MDBBtn
                    style={{ margin: "auto", width: "45%", borderColor: "#263238", backgroundColor: "#ffffff00", color: "#263238" }}
                    color="info"
                    className="btnOne"
                    size="small"
                  >Forget Password</MDBBtn>
                  <MDBBtn
                    color="primary"
                    style={{ margin: "auto", width: "45%", backgroundColor:"#263238", color:"white" }}
                    onClick={this.onSignIn}
                  >Sign In</MDBBtn>
                </CardActions>
=======
    return (
      <div
        className='container-fluid'
        style={{
          backgroundColor: '#F8F9FA',
          minHeight: '730px',
          backgroundImage: `url(${require('../assets/backgrounds/background.jpg')})`,
          backgroundPosition: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <ToastContainer hideProgressBar={true} transition={Slide} />
        <div className='row'>
          <div className='container login-card-div col-md-9'>
            <Card className='login-card'>
              <div style={{ textAlign: 'center' }}>
                <img
                  alt='background'
                  src={require('../assets/logo/logo.png')}
                  className='logo'
                />
              </div>

              <Form>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text id='basic-addon1'>
                        <FiMail size='1.5rem'></FiMail>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type='email'
                      onChange={this.onChangeEmail}
                      aria-describedby='basic-addon1'
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Password</FormLabel>

                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text id='basic-addon1'>
                        <FiLock size='1.5rem'></FiLock>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type='password'
                      onChange={this.onChangePassword}
                    />
                  </InputGroup>
                </FormGroup>
                <div className='row' style={{ marginTop: '50px' }}>
                  <div className='col-md-6' style={{ textAlign: 'center' }}>
                    <Button variant='outline-dark' style={{ width: '90%' }}>
                      Forget Password
                    </Button>
                  </div>
                  <div className='col-md-6' style={{ textAlign: 'center' }}>
                    <Button
                      variant='dark'
                      style={{ width: '90%' }}
                      onClick={this.onSignIn}
                    >
                      Login
                    </Button>
                  </div>
                </div>
>>>>>>> 4cab35c1a3795e7fd46c74d8616723acd6f931a9
              </Form>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
