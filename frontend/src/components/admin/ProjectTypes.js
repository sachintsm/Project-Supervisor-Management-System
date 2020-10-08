import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import '../../css/admin/ProjectTypes.scss';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
import Snackpop from '../shared/Snackpop';
import Footer from '../shared/Footer';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import {
  Button,
  Container,
  Col,
  Row,
  FormControl,
  Table,
} from 'react-bootstrap';
import { getFromStorage } from "../../utils/Storage";
import { confirmAlert } from "react-confirm-alert";
const backendURI = require('../shared/BackendURI');

const CustomCheckbox = withStyles({
  root: {
    color: grey,
    '&$checked': {
      color: '#17A2BB',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

class ProjectTypes extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onEditHandler = this.onEditHandler.bind(this);
    this.getCategoryList = this.getCategoryList.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      id: '',
      succesAlert: false,
      warnAlert: false,
      editAlert: false,
      componentType: 'add',
      title: 'Add New Project Type',
      isAcademicYear: true,
      isFirstYear: false,
      isSecondYear: false,
      isThirdYear: false,
      isFourthYear: false,
      projectType: '',
      projectTypeList: []
    };
  }

  componentDidMount() {
    this.getCategoryList()
  }

  getCategoryList() {

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }

    axios.get(backendURI.url + '/projects/projecttype', { headers: headers }).then((result => {
      if (result.data.length > 0) {
        this.setState({
          projectTypeList: result.data.map((type) => type)
        })
      }
      else {
        this.setState({
          projectTypeList: []
        })
      }
    }))
  }

  submit() {
    if (this.state.projectType2) {
      this.setState({
        projectType: this.state.projectType1 + " ( " + this.state.projectType2 + " )"
      })
    }
    else {
      this.setState({
        projectType: this.state.projectType1
      })
    }
    confirmAlert({
      title: 'Project Type',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {

            const headers = {
              'auth-token': getFromStorage('auth-token').token,
            }

            if (this.state.projectType1 === '') {
              this.setState({
                warnAlert: true,
              });
            } else {

              if (this.state.componentType === 'add') {
                axios
                  .post(backendURI.url + '/projects/projecttype', this.state, { headers: headers })
                  .then((res) => {
                    this.setState({
                      succesAlert: true,
                    });
                    this.getCategoryList()
                  }).catch(err => console.log(err));
              }

              if (this.state.componentType === 'edit') {
                axios.patch(backendURI.url + '/projects/projecttype/' + this.state.id, this.state, { headers: headers }).then(res => {
                }).catch(err => {
                  console.log(err)
                })

                this.setState({
                  editAlert: true,
                  componentType: "add",
                  title: 'Add New Project Type',
                })
                this.getCategoryList()
              }
            }
            this.setState({
              projectType1: '',
              projectType2: ''
            })
          }
        },
        {
          label: 'No',
          onClick: () => {

          }
        }
      ]
    })

  }

  goBack() {
    this.setState({
      componentType: "add",
      title: 'Add New Project Type',
    })
  }

  onDeleteHandler = (id) => {
    confirmAlert({
      title: 'Delete Type',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {

            const headers = {
              'auth-token': getFromStorage('auth-token').token,
            }
            axios.patch(backendURI.url + '/projects/projecttype/delete/' + id, { headers: headers }).then(res => {
              this.getCategoryList()
            }).catch(err => console.log(err))
          }
        },
        {
          label: 'No',
          onClick: () => {

          }
        }
      ]
    })
  }

  onEditHandler = (type) => {
    // console.log(type)
    this.setState({
      componentType: 'edit',
      title: 'Edit Project Type',
      isAcademicYear: type.isAcademicYear,
      isFirstYear: type.isFirstYear,
      isSecondYear: type.isSecondYear,
      isThirdYear: type.isThirdYear,
      isFourthYear: type.isFourthYear,
      projectType1: type.projectType1,
      projectType2: type.projectType2,
      id: type._id,
    }, () => { window.scrollTo(0, 0) })
  }

  closeAlert = () => {
    this.setState({
      succesAlert: false,
      warnAlert: false,
      editAlert: false,
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
          msg={'Successfully Edited'}
          color={'success'}
          time={3000}
          status={this.state.editAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={'Please define a Project Type Name'}
          color={'error'}
          time={3000}
          status={this.state.warnAlert}
          closeAlert={this.closeAlert}
        />

        <Navbar panel={'admin'} />

        <div className='container-fluid container-fluid-div'>
          <Row>
            <Col>
              <Container>
                <div className='card card-div-1'>
                  <h3 className="title">{this.state.title}</h3>
                  <Row className='mt-30'>
                    <Col >
                      <label className='verticle-align-middle cp-text'>
                        Type Name{' '}
                      </label>
                      <FormControl
                        type='text'
                        className="placeholder-text"
                        placeholder='Undergraduate / BIT / Master etc...'
                        value={this.state.projectType1}
                        onChange={(e) => {
                          this.setState({ projectType1: e.target.value });
                        }}
                      ></FormControl>
                    </Col>
                  </Row>
                  <Row className='mt-30'>
                    <Col >
                      <label className='verticle-align-middle cp-text'>
                        Sub Type Name (optional){' '}
                      </label>
                      <FormControl
                        type='text'
                        className="placeholder-text"
                        placeholder='CS / SE / IS / MIT / MIS / MCS / MBA etc...'
                        value={this.state.projectType2}
                        onChange={(e) => {
                          this.setState({ projectType2: e.target.value });
                        }}
                      ></FormControl>
                    </Col>
                  </Row>
                  <Row className='mt-30'>
                    <Col md={4} sm={12} xs={12} className='form-control-label middle'>
                      <FormControlLabel
                        className='form-control-label middle'
                        control={
                          <CustomCheckbox
                            fontSize='5em'
                            checked={this.state.isAcademicYear}
                            onChange={() => {
                              this.setState({
                                isAcademicYear: !this.state.isAcademicYear,
                              });
                            }}
                            name='checkedB'
                          />
                        }
                        label={
                          <span style={{ fontSize: '12px' }}>
                            Academic Years
                          </span>
                        }
                      />
                    </Col>
                    <Col md={2} sm={6} xs={6} className="col-padding-5  middle">
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <CustomCheckbox
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
                    <Col md={2} sm={6} xs={6} className="col-padding-5  middle">
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <CustomCheckbox
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
                    <Col md={2} sm={6} xs={6} className="col-padding-5  middle">
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <CustomCheckbox
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
                    <Col md={2} sm={6} xs={6} className="col-padding-5  middle">
                      {this.state.isAcademicYear && (
                        <FormControlLabel
                          className='form-control-label'
                          control={
                            <CustomCheckbox
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
                    {this.state.componentType === 'edit' &&
                      <Col>
                        <Button
                          variant='outline-danger'
                          onClick={this.goBack}
                          style={{ width: '100%' }}
                        >
                          Go Back
                        </Button>
                      </Col>}
                    <Col>
                      <Button
                        variant='info'
                        onClick={this.submit}
                        style={{ width: '100%' }}
                      >
                        {this.state.componentType === 'add' &&
                          'Add Type Now'}
                        {this.state.componentType === 'edit' &&
                          'Save Now'}
                      </Button>
                    </Col>
                    <Col md={3}></Col>
                  </Row>
                </div>

                {this.state.projectTypeList.length > 0 && this.state.componentType === "add" && (

                  <div className="card card-div-2">
                    <h3 className='title2'>Project Categories</h3>


                    <div>
                      <Table hover style={{ marginTop: 20 }} >
                        <thead>
                          <tr>
                            <th className="table-heading">Project Type</th>
                            <th className="table-heading">Academic Years</th>
                            <th className="table-heading" style={{ width: '20%', }}>Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.projectTypeList.map((type) => {
                            return (<tr key={type._id}>
                              <td className="table-heading" style={{ verticalAlign: 'middle' }}>{type.projectType}</td>
                              <td className="table-heading" style={{ verticalAlign: 'middle' }} >
                                {!type.isFirstYear && !type.isSecondYear && !type.isThirdYear && !type.isFourthYear && "None"}
                                {type.isFirstYear && "1st Year"}{type.isFirstYear && <br></br>}
                                {type.isSecondYear && "2nd Year"}{type.isSecondYear && <br></br>}
                                {type.isThirdYear && "3rd Year"}{type.isThirdYear && <br></br>}
                                {type.isFourthYear && "4th Year"}{type.isFourthYear && <br></br>}</td>
                              <td className="operation-column" style={{ verticalAlign: 'middle' }}><Row>
                                <Col><Create className="edit-btn" fontSize="large" onClick={() => this.onEditHandler(type)} /></Col>
                                <Col><DeleteForeverIcon className="del-btn" fontSize="large" onClick={() => this.onDeleteHandler(type._id)} /></Col>
                              </Row>
                              </td>
                            </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </Container>
            </Col>
          </Row>
        </div>
        <Footer />
      </React.Fragment >
    );
  }
}

export default ProjectTypes;
