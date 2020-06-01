import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { Form } from 'reactstrap';
import '../css/admin/Login.css';
import { setInStorage } from '../utils/Storage';
import { ToastContainer, toast, Slide } from 'react-toastify';
import Snackpop from "./shared/Snackpop";

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
      token: '',
      signUpError: '',
      signInError: '',
      masterError: '',
      email: '',
      password: '',
      loginError: false,
      emailChange:false,
      passwordChange: false
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
  
  onSignIn() {
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
        console.log(json);
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
            setInStorage('isAdmin', true);
          }
          if (json.isStudent) {
            setInStorage('isStudent', true);
          }
          if (json.isSupervisor) {
            setInStorage('isSupervisor', true);
          }
          if (json.isCoordinator) {
            setInStorage('isCoordinator', true);
          }

          if (json.isAdmin) {
            this.props.history.push('/adminhome');
            console.log("admin")

          } else if (json.isCoordinator) {
            this.props.history.push('/coordinatorhome');
          } else if (json.isSupervisor) {
            console.log("supervisor")
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

  render() {
    return (
      <div
        className='container-fluid login-page'
        style={{
          backgroundColor: '#F8F9FA',

          verticalAlign: 'middle',
          backgroundImage: `url(${require('../assets/backgrounds/background.jpg')})`,
        }}
      >

        <Snackpop
            msg={'Invalid Credentials'}
            color={'error'}
            time={3000}
            status={this.state.loginError}
            closeAlert={this.closeAlert}
        />
        {/*<ToastContainer hideProgressBar={true} transition={Slide} />*/}
        <div className='row vertical-center'>
          <div className='container login-card-div col-md-5 col-sm-11 col-xs-11 col-lg-5'>
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
                  <FormLabel className="cp-text">Email</FormLabel>
                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text id='basic-addon1'>
                        <FiMail size='1.5rem'></FiMail>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      style={{borderColor: this.state.emailChange ?  this.state.email==='' ? 'red': null:null}}
                      type='email'
                      onChange={this.onChangeEmail}
                      aria-describedby='basic-addon1'
                      placeholder={this.state.emailChange && this.state.email==='' ?"Please enter an Email":null}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <FormLabel  className="cp-text">Password</FormLabel>

                  <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                      <InputGroup.Text id='basic-addon1'>
                        <FiLock size='1.5rem'></FiLock>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      style={{borderColor: this.state.passwordChange ? this.state.password==='' ? 'red': null:null}}
                      type='password'
                      onChange={this.onChangePassword}
                      placeholder={this.state.passwordChange && this.state.password==='' ?"Please enter a Password":null}
                    />
                  </InputGroup>
                </FormGroup>
                <div className='row' style={{ marginTop: '50px' }}>
                  {/*<div className='col-md-6 col-sm-12' style={{ textAlign: 'center' }}>*/}
                  {/*  <Button variant='outline-dark' style={{ width: '90%' }}>*/}
                  {/*    Forget Password*/}
                  {/*  </Button>*/}
                  {/*</div>*/}
                  <div className='col-md-12 col-sm-12' style={{ textAlign: 'center' }}>
                    <Button
                      variant='dark'
                      style={{ width: '90%' , cursor: 'pointer'}}
                      onClick={() => this.onSignIn()}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
