import React, { Component } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import MultiSelect from 'react-multi-select-component';
import Footer from '../shared/Footer';
import '../../css/admin/CreateProject.css';
import {
  Button,
  Col,
  Row,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from 'react-bootstrap';

const backendURI = require('../shared/BackendURI');
const date_ob = new Date();
const year = date_ob.getFullYear()

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.onYearHandle = this.onYearHandle.bind(this);
    this.onChangeAcademicYear = this.onChangeAcademicYear.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.setSelected = this.setSelected.bind(this);

    this.state = {
      academicYear: '1st Year',
      type: 'Undergraduate Project',
      year: year,
      staffList: [],
      selectedStaffList: [],
      staffOptionList: [],
      yearsArray: [],
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

    const { yearsArray } = this.state;

    let yearList = yearsArray.length > 0
      && yearsArray.map((item, i) => {
        return (
          <Dropdown.Item key={i} eventKey={item}>{item}</Dropdown.Item>
        )
      }, this);

    return (
      <React.Fragment>
        <Navbar panel={'admin'} />

        <div className="container-fluid" style={{ backgroundColor: "rgb(252, 252, 252)" }}>
          <Row >

            <div className="card" style={{ width: '80%', margin: "auto", marginTop: "40px", marginBottom: "40px" }}>
              <div className="container">

                <h3 className='cp-head'>Creating New Project</h3>
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
                        onSelect={this.onChangeAcademicYear}
                        style={{ width: "90%" }}>
                        {yearList}
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
                      <DropdownButton
                        as={ButtonGroup}
                        variant={'secondary'}
                        title={this.state.type}
                        onSelect={this.onChangeType}
                        style={{ width: "90%" }}
                      >
                        <Dropdown.Item eventKey='Undergraduate Project'>
                          Undergraduate Project
                                </Dropdown.Item>
                        <Dropdown.Item eventKey='BIT Project'>
                          BIT Project
                                </Dropdown.Item>
                      </DropdownButton>{' '}

                    </Row>
                  </Col>
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
                    </Row>
                  </Col>

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
                    onClick={this.onSignIn}
                  >
                    Create Project
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
