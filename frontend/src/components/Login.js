import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { Form } from 'reactstrap';
import '../css/admin/Login.css';
import { setInStorage } from '../utils/Storage';
import { toast } from 'react-toastify';
import Snackpop from "./shared/Snackpop";
import { Col, Row } from 'reactstrap'
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
} from 'react-bootstrap';
import { FiMail, FiLock } from 'react-icons/fi';
import { Spinner } from 'react-bootstrap'
import { Animated } from "react-animated-css";

const backendURI = require('./shared/BackendURI');

export default class login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      signUpError: '',
      signInError: '',
      masterError: '',
      email: '',
      password: '',
      loginError: false,
      emailChange: false,
      passwordChange: false,
      spinnerDiv: true,
      loginDiv: false,
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
      emailChange: true
    });
  }

  notify = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
    });
  };
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
      passwordChange: true
    });
  }
  closeAlert = () => {
    this.setState({
      loginError: false,
    });
  };

  onSignIn(e) {

    e.preventDefault();
    const { email, password } = this.state;

    fetch(backendURI.url + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.state) {
          setInStorage('auth-token', { token: json.token });
          setInStorage('auth-id', { id: json.userId });
          this.setState({
            signInError: json.msg,
            password: '',
            userId: '',
            token: json.token,
          });
          if (json.isAdmin) {
            localStorage.setItem("user-level", "admin")
            setInStorage('isAdmin', true);
          }
          if (json.isStudent) {
            localStorage.setItem("user-level", "student")
            setInStorage('isStudent', true);
          }
          if (json.isSupervisor) {
            localStorage.setItem("user-level", "supervisor")
            setInStorage('isSupervisor', true);
          }
          if (json.isCoordinator) {
            localStorage.setItem("user-level", "coordinator")
            setInStorage('isCoordinator', true);
          }

          if (json.isAdmin) {
            this.props.history.push('/adminhome');
          } else if (json.isCoordinator) {
            this.props.history.push('/coordinatorhome');
          } else if (json.isSupervisor) {
            this.props.history.push('/supervisorhome');
          } else if (json.isStudent) {
            this.props.history.push('/studenthome');
          }
        } else {
          this.setState({
            signInError: json.msg,
          });

          this.setState({
            loginError: true,
          });
          // this.notify('Invalid User Credentials');
        }
      });
  }

  componentDidMount() {
    this.setState({
      spinnerDiv: true,
      loginDiv: false
    })


    setTimeout(() => {
      this.setState({
        spinnerDiv: false,
        loginDiv: true
      })
    }, 2000);
  }


  render() {
    const { spinnerDiv, loginDiv } = this.state
    return (
      <div>

        {spinnerDiv && (
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} animationInDuration={1000}>
            <div>
              <div className="logo-div">
                <div className="row">
                  <img alt='background' src={require('../assets/logo/Project Logo.png')} className='white-logo' />

                </div>
                <div className="row">
                  <div className="spinner-loading">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                  </div>
                </div>

              </div>
            </div>
          </Animated>
        )}


        {loginDiv && (
          <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true} animationInDuration={2000} >
            <div>
              <div
                className='container-fluid login-page'
                style={{
                  backgroundImage: `url(${require('../assets/backgrounds/b1.jpg')})`,
                }}></div>

              < Snackpop
                msg={'Invalid Credentials'}
                color={'error'}
                time={3000}
                status={this.state.loginError}
                closeAlert={this.closeAlert}
                className="z-index-2"
              />

              {/*<ToastContainer hideProgressBar={true} transition={Slide} />*/}
              <div className='row login-panel vertical-center login-card-div'>
                <div className='container abc'>
                  <Row>
                    <Col md={2} lg={3} xs={0} sm={0}></Col>
                    <Col md={8} lg={6} xs={12} sm={12}>
                      <Card className='login-card'>
                        <div style={{ textAlign: 'center' }}>
                          <img alt='background' src={require('../assets/logo/Project Logo.png')} className='logo' />
                        </div>
                        <Form onSubmit={this.onSignIn}>
                          <FormGroup className="form-group-1">
                            <FormLabel className="cp-text">Email</FormLabel>
                            <InputGroup className='mb-3'>
                              <InputGroup.Prepend className="email-icon">
                                <InputGroup.Text id='basic-addon1'>
                                  <FiMail className="email-icon2" size='1.5rem'></FiMail>
                                </InputGroup.Text>
                              </InputGroup.Prepend>

                              <FormControl
                                className="email-formcontrol"
                                style={{ borderColor: this.state.emailChange ? this.state.email === '' ? 'red' : null : null }}
                                type='email'
                                onChange={this.onChangeEmail}
                                aria-describedby='basic-addon1'
                                placeholder={this.state.emailChange && this.state.email === '' ? "Please enter an Email" : null}
                              />
                            </InputGroup>
                          </FormGroup>

                          <FormGroup className="form-group-2">
                            <FormLabel className="cp-text">Password</FormLabel>

                            <InputGroup className='mb-3'>
                              <InputGroup.Prepend className="login-password-icon">
                                <InputGroup.Text id='basic-addon1'>
                                  <FiLock size='1.5rem' className="password-icon2"></FiLock>
                                </InputGroup.Text>
                              </InputGroup.Prepend>
                              <FormControl
                                className="password-formcontrol"
                                style={{ borderColor: this.state.passwordChange ? this.state.password === '' ? 'red' : null : null }}
                                type='password'
                                onChange={this.onChangePassword}
                                placeholder={this.state.passwordChange && this.state.password === '' ? "Please enter a Password" : null}
                              />
                            </InputGroup>
                          </FormGroup>
                          <div className='row btn-div'>
                            <Button type="submit" className="login-btn" variant='primary'>Login </Button>
                          </div>
                        </Form>
                        <div>
                          <Row className="lg-problem">
                            <Col lg={4} md={6} xs={6} sm={6}>
                              <p className="lg-problem-text">Problem with login?</p>
                            </Col>
                            <Col lg={8} md={6} xs={6} sm={6}>
                              <p className="lg-problem-admin">Contact admin</p>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                    <Col md={2} lg={3} xs={0} sm={0}></Col>
                  </Row>

                </div>
              </div>
            </div>
          </Animated>
        )}

      </div>
    );
  }
}
