import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import MultiSelect from 'react-multi-select-component';
import Footer from '../shared/Footer';
import '../../css/admin/CreateProject.css';
import { Button, Col, Row, Dropdown, DropdownButton, ButtonGroup, } from 'react-bootstrap';
import Snackpop from "../shared/Snackpop";
import { getFromStorage } from "../../utils/Storage";

const backendURI = require('../shared/BackendURI');
const date_ob = new Date();
const year = date_ob.getFullYear()

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeAcademicYear = this.onChangeAcademicYear.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.getCategoryList = this.getCategoryList.bind(this);
    this.onCreateProject = this.onCreateProject.bind(this)

    this.state = {
      selectedTypeIndex: 0,
      academicYear: '',
      type: '',
      year: year,
      staffList: [],
      selectedStaffList: [],
      staffOptionList: [],
      yearsArray: [],
      projectTypeList: [],
      successAlert: false,
      warnAlert: false,
      typeWarnAlert: false
    };
  }
  //   const [selected, setSelected] = useState([]);

  componentDidMount() {

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }

    this.getCategoryList()
    axios
      .get(backendURI.url + '/users/stafflist', { headers: headers })
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
          return null;
        });
      })
      .catch((err) => {
        console.log(err);
      });
    /***************************************************************************** */
    let date_ob = new Date();
    const year = date_ob.getFullYear();
    var startYear = year - 2;
    for (var i = 0; i < 6; i++) {
      this.state.yearsArray.push(startYear);
      startYear += 1;
    }

  }

  componentDidUpdate() {

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }
    axios
      .get(backendURI.url + '/users/stafflist', { headers: headers })
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

  onCreateProject() {

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }
    if (this.state.selectedStaffList.length > 0 && this.state.type !== '') {
      const supervisors = this.state.selectedStaffList.map(item => {
        return item.value
      })


      const project = {
        projectYear: this.state.year,
        projectType: this.state.type,
        academicYear: this.state.academicYear,
        coordinatorList: supervisors
      }

      axios.post(backendURI.url + '/projects', project, { headers: headers }).then(result => {
        this.setState({
          successAlert: true
        })
      }).catch(err => {
        console.log(err)
      })
    }
    else if (this.state.type === '') {
      this.setState({
        typeWarnAlert: true
      })
    }
    else if (this.state.selectedStaffList.length === 0) {
      this.setState(({
        warnAlert: true,
      }))
    }

  }

  getCategoryList() {

    const headers = {
      'auth-token': getFromStorage('auth-token').token,
    }
    axios.get(backendURI.url + '/projects/projecttype', { headers: headers }).then((result => {
      if (result.data.length > 0) {
        this.setState({
          projectTypeList: result.data.map((type) => type)
        }, () => {
          this.setState({
            type: this.state.projectTypeList[0].projectType
          })
          if (this.state.projectTypeList[0].isFirstYear) {
            this.setState(({
              academicYear: "1st Year"
            }))
          }
          else if (this.state.projectTypeList[0].isSecondYear) {
            this.setState(({
              academicYear: "2nd Year"
            }))
          }
          else if (this.state.projectTypeList[0].isThirdYear) {
            this.setState(({
              academicYear: "3rd Year"
            }))
          }
          else if (this.state.projectTypeList[0].isFourthYear) {
            this.setState(({
              academicYear: "4th Year"
            }))
          }
          else {
            this.setState(({
              academicYear: ''
            }))
          }
        })
      }
      else {
        this.setState({
          projectTypeList: []
        })
      }
    }))

  }

  setSelected(obj) {
    this.setState({
      selectedStaffList: obj,
    });
  }
  onChangeYear(year) {
    this.setState({
      year: year,
    });
  }
  onChangeAcademicYear(year) {
    this.setState({
      academicYear: year,
    });
  }
  onChangeType(typeIndex) {
    this.setState({
      type: this.state.projectTypeList[typeIndex].projectType,
      selectedTypeIndex: typeIndex
    });
    if (this.state.projectTypeList[typeIndex].isFirstYear) {
      this.setState(({
        academicYear: "1st Year"
      }))
    }
    else if (this.state.projectTypeList[typeIndex].isSecondYear) {
      this.setState(({
        academicYear: "2nd Year"
      }))
    }
    else if (this.state.projectTypeList[typeIndex].isThirdYear) {
      this.setState(({
        academicYear: "3rd Year"
      }))
    }
    else if (this.state.projectTypeList[typeIndex].isFourthYear) {
      this.setState(({
        academicYear: "4th Year"
      }))
    }
    else {
      this.setState(({
        academicYear: ''
      }))
    }
  }

  closeAlert = () => {
    this.setState({
      successAlert: false,
      warnAlert: false,
      typeWarnAlert: false
    });
  };
  render() {

    const { yearsArray } = this.state;

    let yearList = yearsArray.length > 0
      && yearsArray.map((item, i) => {
        return (
          <Dropdown.Item key={i} eventKey={item}>{item}</Dropdown.Item>
        )
      }, this);

    return (
      <React.Fragment>
        <Snackpop
          msg={'Project Created Successfully'}
          color={'success'}
          time={3000}
          status={this.state.successAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={'Please Assign Coordinators'}
          color={'error'}
          time={3000}
          status={this.state.warnAlert}
          closeAlert={this.closeAlert}
        />

        <Snackpop
          msg={'Please define a Project Type'}
          color={'error'}
          time={3000}
          status={this.state.typeWarnAlert}
          closeAlert={this.closeAlert}
        />
        <Navbar panel={'admin'} />

        <div className="container-fluid" style={{ backgroundColor: "rgb(252, 252, 252)" }}>
          <Row >

            <div className="card" style={{ width: '60%', margin: "auto", marginTop: "40px", marginBottom: "40px", paddingLeft: "2%", paddingRight: "2%" }}>
              <div className="container">

                <h3 style={{ marginTop: "30px" }}>Creating New Project</h3>
                <Row style={{ marginLeft: '0px', marginTop: '20px' }}>
                  <Col xs="4">
                    <Row>
                      <p className="cp-text">
                        Year of the Project
                          </p>
                    </Row>
                    <Row>
                      <DropdownButton
                        as={ButtonGroup}
                        variant={'secondary'}
                        title={this.state.year}
                        onSelect={this.onChangeYear}
                        style={{ width: "90%" }}>
                        {this.state.yearsArray.map((item, index) => {
                          return (
                            <Dropdown.Item key={index} eventKey={item}>
                              {item}
                            </Dropdown.Item>)
                        })}
                      </DropdownButton>{' '}
                    </Row>

                  </Col>
                  <Col xs="4">
                    <Row>
                      <p className="cp-text">
                        Project Type
                          </p>
                    </Row>

                    <Row >

                      {
                        this.state.projectTypeList.length == 0 ? (
                          <DropdownButton
                            as={ButtonGroup}
                            variant={'secondary'}
                            title={"No Items"}
                            onSelect={this.onChangeType}
                            style={{ width: "90%" }}
                          >
                          </DropdownButton>) : (
                            <DropdownButton
                              as={ButtonGroup}
                              variant={'secondary'}
                              title={this.state.type}
                              onSelect={this.onChangeType}
                              style={{ width: "90%" }}
                            >
                              {this.state.projectTypeList.map((item, index) => {
                                return (
                                  <Dropdown.Item key={item._id} eventKey={index}>
                                    {item.projectType}
                                  </Dropdown.Item>)
                              })}
                            </DropdownButton>)
                      }

                    </Row>
                  </Col>
                  {(this.state.projectTypeList.length > 0 && this.state.projectTypeList[this.state.selectedTypeIndex].isAcademicYear) ?
                    <Col xs="4">
                      <Row>
                        <p className="cp-text">
                          Academic Year
                          </p>
                      </Row>
                      <Row>

                        <DropdownButton
                          as={ButtonGroup}
                          variant={'secondary'}
                          title={this.state.academicYear}
                          onSelect={this.onChangeAcademicYear}
                          style={{ width: "90%" }}
                        >
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isFirstYear &&
                            <Dropdown.Item eventKey='1st Year'>
                              1st Year
                            </Dropdown.Item>}
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isSecondYear &&
                            <Dropdown.Item eventKey='2nd Year'>
                              2nd Year
                            </Dropdown.Item>}
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isThirdYear &&
                            <Dropdown.Item eventKey='3rd Year'>
                              3rd Year
                            </Dropdown.Item>}
                          {this.state.projectTypeList[this.state.selectedTypeIndex].isFourthYear &&
                            <Dropdown.Item eventKey='4th Year'>
                              4th Year
                            </Dropdown.Item>}
                        </DropdownButton>{' '}
                      </Row>
                    </Col> : null
                  }


                </Row>

                <Row style={{ marginLeft: '15px', marginTop: '20px' }}>
                  <Row>
                    <p className="cp-text">
                      Assign Supervisors into the Project
                      </p>
                  </Row>
                  <Col md={12}>
                    <MultiSelect
                      options={this.state.staffOptionList}
                      value={this.state.selectedStaffList}
                      onChange={this.setSelected}
                      labelledBy={'Select'}
                      hasSelectAll={false}
                      className="cp-coordinator"
                    />
                  </Col>
                </Row>

                <Row style={{ marginTop: '40px', marginBottom: '30px' }}>
                  <Button
                    className='cp-btn'
                    variant='info'
                    onClick={this.onCreateProject}
                  >
                    Create Project Now
                      </Button>
                </Row>
              </div>
            </div>

          </Row>
        </div>

        <Footer />
      </React.Fragment >
    );
  }
}

export default CreateProject;
