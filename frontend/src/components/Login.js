import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Form } from 'reactstrap';
import '../css/admin/Login.css';
import { setInStorage } from '../utils/Storage';
import { MDBInput, MDBBtn } from 'mdbreact';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { Button } from 'react-bootstrap';

const backendURI = require('./shared/BackendURI');

export default class login extends Component {
  constructor(props) {
    super(props);

    // if (localStorage.getItem("isAdmin")) {
    //   this.props.history.push("/adminhome");
    // } else if (localStorage.getItem("isCoordinator")) {
    //   this.props.history.push("/coordinatorhome");
    // } else if (localStorage.getItem("isSupervisor")) {
    //   this.props.history.push("/supervisorhome");
    // } else if (localStorage.getItem("isStudent")) {
    //   this.props.history.push("/studenthome");
    // } else {
    //   this.props.history.push("/");
    // }

    this.state = {
      token: '',
      signUpError: '',
      // signInError: "",
      masterError: '',
      email: '',
      password: '',
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
  notify = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
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
        // console.log("josn", json);
        if (json.state) {
          setInStorage('auth-token', { token: json.token });
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

          this.notify('Invalid User Credentials');
        }
      });
  }

  render() {
    const { email, password } = this.state;

    return (
      <div
        className='container-fluid'
        style={{ backgroundColor: '#F8F9FA', minHeight: '900px' }}
      >
        <ToastContainer hideProgressBar={true} transition={Slide} />
        <div className='row'>
          <div className='container login-card-div col-md-11'>
            <Card className='login-card'>
              <Form>
                <img
                  src={require('../assets/logo/Logo_reg.png')}
                  className='logo'
                />
                <Button variant='outline-danger'>Danger</Button>
                <Button variant='success' onClick={this.onSignIn}>
                  Login
                </Button>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
