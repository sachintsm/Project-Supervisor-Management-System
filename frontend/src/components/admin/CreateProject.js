import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import MultiSelect from 'react-multi-select-component';
// import Snackbar from '@material-ui/core/Snackbar';
// import YearPicker from 'react-year-picker';
import {
  Button,
  Container,
  Col,
  Row,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  FormControl,
} from 'react-bootstrap';

const backendURI = require('../shared/BackendURI');

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.onYearHandle = this.onYearHandle.bind(this);
    this.onChangeAcademicYear = this.onChangeAcademicYear.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.setSelected = this.setSelected.bind(this);

    this.state = {
      year: '',
      academicYear: '1st Year',
      type: 'Undergraduate Project',
      staffList: [],
      selectedStaffList: [],
      staffOptionList: [],
    };
  }
  //   const [selected, setSelected] = useState([]);

  componentDidMount() {
    axios
      .get(backendURI.url + '/users/stafflist')
      .then((result) => {
        if (result.data.length > 0) {
          this.setState({
            staffList: result.data.map((user) => user),
          });
        }
      })
      .then((a) => {
        this.state.staffList.map((user) => {
          const option = {
            label: user.firstName + ' ' + user.lastName,
            value: user._id,
          };
          this.setState({
            staffOptionList: [...this.state.staffOptionList, option],
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate() {
    axios
      .get(backendURI.url + '/users/stafflist')
      .then((result) => {
        if (result.data.length > 0) {
          this.setState({
            staffList: result.data.map((user) => user),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setSelected(obj) {
    this.setState({
      selectedStaffList: obj,
    });
  }
  onYearHandle(e) {
    console.log(this.state.staffOptionList);
    this.setState({
      year: e.target.value,
    });
  }
  onChangeAcademicYear(year) {
    this.setState({
      academicYear: year,
    });
  }
  onChangeType(type) {
    this.setState({
      type: type,
    });
  }
  render() {
    return (
      <React.Fragment>
        <Navbar panel={'admin'} />

        <div className='container-fluid' style={{ backgroundColor: '#F5F5F5' }}>
          <Row>
            <Col>
              <Container>
                <div
                  className='card'
                  style={{
                    margin: 'auto',
                    marginTop: '50px',
                    marginBottom: '50px',
                    width: '100%',
                    paddingTop: '30px',
                    paddingLeft: '60px',
                    paddingRight: '60px',
                    paddingBottom: '30px',
                  }}
                >
                  <h3>Creating New Project</h3>
                  <Row style={{ marginTop: '30px' }}>
                    <Col>
                      <Row style={{ marginBottom: '40px' }}>
                        <Col md={2}>
                          <span style={{ verticalAlign: 'middle' }}>
                            Year of the Project
                          </span>
                        </Col>
                        <Col md={10}>
                          {/* <YearPicker onChange={this.onYearHandle} /> */}
                          <FormControl
                            type='text'
                            style={{ width: '100%' }}
                            placeholder='Ex:- 2020'
                            onChange={this.onYearHandle}
                          ></FormControl>
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: '40px' }}>
                        <Col>
                          <Row>
                            <Col md={4}>
                              <span style={{ verticalAlign: 'middle' }}>
                                Project Type{' '}
                              </span>
                            </Col>
                            <Col md={8}>
                              <DropdownButton
                                as={ButtonGroup}
                                variant={'secondary'}
                                title={this.state.type}
                                onSelect={this.onChangeType}
                              >
                                <Dropdown.Item eventKey='Undergraduate Project'>
                                  Undergraduate Project
                                </Dropdown.Item>
                                <Dropdown.Item eventKey='BIT Project'>
                                  BIT Project
                                </Dropdown.Item>
                              </DropdownButton>{' '}
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <Row>
                            <Col md={4}>
                              <span style={{ verticalAlign: 'middle' }}>
                                Academic Year{' '}
                              </span>
                            </Col>
                            <Col md={8}>
                              <DropdownButton
                                as={ButtonGroup}
                                variant={'secondary'}
                                title={this.state.academicYear}
                                onSelect={this.onChangeAcademicYear}
                              >
                                <Dropdown.Item eventKey='1st Year'>
                                  1st Year
                                </Dropdown.Item>
                                <Dropdown.Item eventKey='2nd Year'>
                                  2nd Year
                                </Dropdown.Item>
                                <Dropdown.Item eventKey='3rd Year'>
                                  3rd Year
                                </Dropdown.Item>
                                <Dropdown.Item eventKey='4th Year'>
                                  4th Year
                                </Dropdown.Item>
                              </DropdownButton>{' '}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {/* ***** */}
                  <Row>
                    <Col md={4}>
                      <span
                        style={{
                          marginBottom: '20px',
                          verticalAlign: 'middle',
                        }}
                      >
                        Assign Supervisors into the Project
                      </span>
                    </Col>
                    <Col md={8}>
                      <div>
                        <MultiSelect
                          options={this.state.staffOptionList}
                          value={this.state.selectedStaffList}
                          onChange={this.setSelected}
                          labelledBy={'Select'}
                          hasSelectAll={false}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '50px' }}>
                    <Col md={3}></Col>
                    <Col md={6}>
                      <Button
                        variant='secondary'
                        style={{ width: '90%' }}
                        onClick={this.onSignIn}
                      >
                        Create Project
                      </Button>
                    </Col>
                    <Col md={3}></Col>
                  </Row>
                </div>
              </Container>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateProject;
