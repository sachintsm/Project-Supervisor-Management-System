import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import '../../css/admin/ProjectTypes.css';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
import MultiSelect from 'react-multi-select-component';
import Snackpop from '../shared/Snackpop';
import MuiAlert from '@material-ui/lab/Alert';
import Footer from '../shared/Footer';
// import YearPicker from 'react-year-picker';
import {
  Button,
  Container,
  Col,
  Row,
  //   Dropdown,
  //   DropdownButton,
  //   ButtonGroup,
  FormControl,
} from 'react-bootstrap';
const backendURI = require('../shared/BackendURI');

class ProjectTypes extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      succesAlert: false,
      warnAlert: false,
      componentType: 'add',
      title: 'Add New Project Category',
      isAcademicYear: true,
      isFirstYear: false,
      isSecondYear: false,
      isThirdYear: false,
      isFourthYear: false,
      projectType: '',
    };
  }

  submit() {
    if (this.state.projectType === '') {
      this.setState({
        warnAlert: true,
      });
    } else {
      axios
        .post(backendURI.url + '/projects/projecttype', this.state)
        .then((res) => {
          this.setState({
            succesAlert: true,
          });
          console.log(res.data);
        });
    }
  }

  closeAlert = () => {
    this.setState({
      succesAlert: false,
      warnAlert: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Snackpop
          msg={'Successfully Added'}
          color={'success'}
          time={3000}
          status={this.state.succesAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={'Please define a Project Type'}
          color={'error'}
          time={3000}
          status={this.state.warnAlert}
          closeAlert={this.closeAlert}
        />

        {/* 
        <Snackbar
          anchorOrigin={'top'}
          open={this.state.succesAlert}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <this.Alert severity='success' onClose={this.handleClose}>
            Success
          </this.Alert>
        </Snackbar>

        <Snackbar
          open={this.state.warnAlert}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <this.Alert severity='error' onClose={this.handleClose}>
            Please define Project Type
          </this.Alert>
        </Snackbar> */}

        <Navbar panel={'admin'} />

        <div className='container-fluid container-fluid-div'>
          <Row>
            <Col>
              <Container>
                <div className='card card-div'>
                  <h3>{this.state.title}</h3>
                  <Row className='margin-top-30'>
                    <Col md={3}>
                      <span className='verticle-align-middle'>
                        Project Type{' '}
                      </span>
                    </Col>
                    <Col md={9}>
                      <FormControl
                        type='text'
                        style={{ width: '100%' }}
                        placeholder='Undergraduate / BIT / Master / etc'
                        onChange={(e) => {
                          this.setState({ projectType: e.target.value });
                        }}
                      ></FormControl>
                    </Col>
                  </Row>
                  <Row className='margin-top-30'>
                    <Col md={4} className='form-control-label'>
                      <FormControlLabel
                        className='form-control-label'
                        control={
                          <Checkbox
                            fontSize='5px'
                            checked={this.state.isAcademicYear}
                            onChange={() => {
                              this.setState({
                                isAcademicYear: !this.state.isAcademicYear,
                              });
                            }}
                            name='checkedB'
                            color='default'
                          />
                        }
                        label={
                          <span style={{ fontSize: '12px' }}>
                            Academic Years
                          </span>
                        }
                      />
                    </Col>
                    <Col>
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <Checkbox
                              fontSize='5px'
                              checked={this.state.isFirstYear}
                              onChange={() => {
                                this.setState({
                                  isFirstYear: !this.state.isFirstYear,
                                });
                              }}
                              name='checkedB'
                              color='default'
                            />
                          }
                          label={
                            <span style={{ fontSize: '12px' }}>1st Year</span>
                          }
                        />
                      )}
                    </Col>
                    <Col>
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <Checkbox
                              fontSize='5px'
                              checked={this.state.isSecondYear}
                              onChange={() => {
                                this.setState({
                                  isSecondYear: !this.state.isSecondYear,
                                });
                              }}
                              name='checkedB'
                              color='default'
                            />
                          }
                          label={
                            <span style={{ fontSize: '12px' }}>2nd Year</span>
                          }
                        />
                      )}
                    </Col>
                    <Col>
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <Checkbox
                              fontSize='5px'
                              checked={this.state.isThirdYear}
                              onChange={() => {
                                this.setState({
                                  isThirdYear: !this.state.isThirdYear,
                                });
                              }}
                              name='checkedB'
                              color='default'
                            />
                          }
                          label={
                            <span style={{ fontSize: '12px' }}>3rd Year</span>
                          }
                        />
                      )}
                    </Col>
                    <Col>
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <Checkbox
                              fontSize='5px'
                              checked={this.state.isFourthYear}
                              onChange={() => {
                                this.setState({
                                  isFourthYear: !this.state.isFourthYear,
                                });
                              }}
                              name='checkedB'
                              color='default'
                            />
                          }
                          label={
                            <span style={{ fontSize: '12px' }}>4th Year</span>
                          }
                        />
                      )}
                    </Col>
                  </Row>

                  <Row className='margin-top-30 margin-bottom-20'>
                    <Col md={3}></Col>
                    <Col md={6}>
                      <Button
                        variant='info'
                        style={{ width: '90%' }}
                        onClick={this.submit}
                      >
                        {this.state.componentType === 'add' &&
                          'Add Project Category'}
                        {this.state.componentType === 'edit' &&
                          'Edit Project Category'}
                      </Button>
                    </Col>
                    <Col md={3}></Col>
                  </Row>
                </div>
              </Container>
            </Col>
          </Row>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default ProjectTypes;
