import React, { Component } from 'react';
import '../../css/admin/CreateProject.scss';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import MultiSelect from 'react-multi-select-component';
import Footer from '../shared/Footer';
import { Button, Col, Row, Dropdown, DropdownButton, ButtonGroup, Table, Container, FormControl, Card } from 'react-bootstrap';
import Snackpop from "../shared/Snackpop";
import {getFromStorage} from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import CoordinatorList from "./CoordinatorList";
import CSVReader from "react-csv-reader";
import { AiFillDelete } from 'react-icons/ai';

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
      componentType: 'add',
      title: 'Assign Coordinators & Students',
      projects: [],
      selectedTypeIndex: 0 ,
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
      typeWarnAlert: false,
      newIndex: ""
    };
  }
  //   const [selected, setSelected] = useState([]);

  componentDidMount() {

    this.getProjectList()
    this.getCategoryList()

    const headers = {
      'auth-token':getFromStorage('auth-token').token,
    }

    axios
        .get(backendURI.url + '/users/stafflist',{headers: headers})
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

  // componentDidUpdate() {
  //
  //   const headers = {
  //     'auth-token':getFromStorage('auth-token').token,
  //   }
  //   axios
  //       .get(backendURI.url + '/users/stafflist',{headers: headers})
  //       .then((result) => {
  //         if (result.data.length > 0) {
  //           this.setState({
  //             staffList: result.data.map((user) => user),
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // }

  onCreateProject(){

    confirmAlert({
      title: 'Projects',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {

            const headers = {
              'auth-token':getFromStorage('auth-token').token,
            }


            if(this.state.selectedStaffList.length>0 && this.state.type!==''){
              const coordinators = this.state.selectedStaffList.map(item=>{
                return item.value
              })


              const project = {
                projectYear: this.state.year,
                projectType: this.state.type,
                academicYear: this.state.academicYear,
                coordinatorList: coordinators,
                studentList: this.state.studentList
              }
              if(this.state.componentType==='add'){

                axios.post(backendURI.url + '/projects',project,{headers: headers}).then(result=>{
                  this.setState({
                    successAlert: true
                  })
                  this.getProjectList()
                }).catch(err=>{
                  console.log(err)
                })
              }

              if(this.state.componentType==='edit'){
                
                axios.patch(backendURI.url + '/projects/' + this.state.id, this.state,{headers: headers}).then(res => {
                }).catch(err => {
                  console.log(err)
                })

                window.location.reload(false);

                this.setState({
                  editAlert: true,
                })
              }

            }
            else if(this.state.type===''){
              this.setState({
                typeWarnAlert: true
              })
            }
            else if(this.state.selectedStaffList.length===0){
              this.setState(({
                warnAlert: true,
              }))
            }

          }
        },
        {
          label: 'No',
          onClick: () => {

          }
        },
      ]
    })
  }

  getProjectList=()=>{

    const headers = {
      'auth-token':getFromStorage('auth-token').token,
    }

    axios.get(backendURI.url+'/projects',{headers: headers}).then((result)=>{
      if(result.data.length>0){
        this.setState({
          projects: result.data.map(project=>project)
        })
      }
      else{
        this.setState({
          projects: []
        })
      }
    })


  }

  getCategoryList() {

    const headers = {
      'auth-token':getFromStorage('auth-token').token,
    }
    axios.get(backendURI.url + '/projects/projecttype',{headers: headers}).then((result => {
      if (result.data.length > 0) {
        this.setState({
          projectTypeList: result.data.map((type) => type)
        },()=>{
          this.setState({
            type :  this.state.projectTypeList[0].projectType
          })
          if(this.state.projectTypeList[0].isFirstYear){
            this.setState(({
              academicYear: "1st Year"
            }))
          }
          else if(this.state.projectTypeList[0].isSecondYear){
            this.setState(({
              academicYear: "2nd Year"
            }))
          }
          else if(this.state.projectTypeList[0].isThirdYear){
            this.setState(({
              academicYear: "3rd Year"
            }))
          }
          else if(this.state.projectTypeList[0].isFourthYear){
            this.setState(({
              academicYear: "4th Year"
            }))
          }
          else{
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
    // console.log(obj)
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
    // console.log(typeIndex)
    this.setState({
      type: this.state.projectTypeList[typeIndex].projectType,
      selectedTypeIndex: typeIndex
    });
    if(this.state.projectTypeList[typeIndex].isFirstYear){
      this.setState(({
        academicYear: "1st Year"
      }))
    }
    else if(this.state.projectTypeList[typeIndex].isSecondYear){
      this.setState(({
        academicYear: "2nd Year"
      }))
    }
    else if(this.state.projectTypeList[typeIndex].isThirdYear){
      this.setState(({
        academicYear: "3rd Year"
      }))
    }
    else if(this.state.projectTypeList[typeIndex].isFourthYear){
      this.setState(({
        academicYear: "4th Year"
      }))
    }
    else{
      this.setState(({
        academicYear: ''
      }))
    }
  }

  onDeleteHandler = (id) => {
    confirmAlert({
      title: 'Delete Project',
      message: 'This will delete the entire project. Are you sure?',
      buttons: [

        {
          label: 'No',
          onClick: () => {

          }
        },
        {
          label: 'Yes',
          onClick: async () => {

            const headers = {
              'auth-token':getFromStorage('auth-token').token,
            }
            axios.patch(backendURI.url + '/projects/delete/' + id,{headers: headers}).then(res => {
              this.getProjectList()
            }).catch(err => console.log(err))
          }
        },
      ]
    })
  }

  onEditHandler = (project) => {
    console.log(project)
    this.state.projectTypeList.map((type,index)=>{
      if(type.projectType===project.projectType){
        this.setState({
          selectedTypeIndex: index
        })
      }
    })

    this.setState({
      selectedStaffList: []
    })

    project.coordinatorList.map(id=>{
      // selectedStaffList

      const headers = {
        'auth-token':getFromStorage('auth-token').token,
      }
      axios.get(backendURI.url+'/users/stafflist/'+id, {headers: headers}).then(res=>{
        // console.log(res)
        if(res.data){
          const name = res.data.firstName+" "+res.data.lastName
          const array = {
            "value": id,
            "label": name
          }
          this.setState({
            selectedStaffList: [...this.state.selectedStaffList, array]
          })
        }
      })
    })


    this.setState({
      componentType: 'edit',
      title: 'Edit Project',
      type: project.projectType,
      year: project.projectYear,
      academicYear: project.academicYear,
      studentList: project.studentList,
      id: project._id,
    }, () => { window.scrollTo(0, 0) })
  }

  goBack = () =>{

    this.setState({
      componentType: "add",
      title: 'Assign Coordinators & Students',
      selectedTypeIndex : 0,
      selectedStaffList: []
    })
  }

  closeAlert = () => {
    this.setState({
      successAlert: false,
      editAlert: false,
      warnAlert: false,
      typeWarnAlert: false
    });
  };

  handleForce = data => {
    let studenList = []
    data.map(row =>{
      if(row[0]!=""){
        studenList.push(row[0])
      }
    })
    this.setState({
      studentList: studenList
    })
  };

  addIndex = () => {
    if(this.state.studentList.includes(this.state.newIndex)){ //index already exists
    }
    else{
      this.setState({
        studentList: [...this.state.studentList, this.state.newIndex]
      })
    }
  }

  deleteIndex = (index) => {
    confirmAlert({
      title: 'Delete Index',
      message: 'Are you sure you want to delete this Index?',
      buttons: [


        {
          label: 'Yes',
          onClick: async () => {

            this.setState( {studentList: this.state.studentList.filter((item)=>{return item!==index })  })
          }
        },
        {
          label: 'No',
          onClick: () => {

          }
        },
      ]
    })
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
          <Snackpop
              msg={'Project Created Successfully'}
              color={'success'}
              time={3000}
              status={this.state.successAlert}
              closeAlert={this.closeAlert}
          />

          <Snackpop
              msg={'Edited Successfully'}
              color={'success'}
              time={3000}
              status={this.state.editAlert}
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
          <div className="create-project-main">

            <div className="container-fluid container-fluid-di ">
              <Row >
                <Col>
                  {this.state.componentType==='edit' && (
                      <Container fluid className=" zero-padding" style={{paddingLeft: '3%', paddingRight: '3%'}}>

                        <div className="card card-1" >

                          <h3 style={{ marginTop: "30px" }}>{this.state.title}</h3>
                          <Row style={{ marginLeft: '0px', marginTop: '20px' }}>
                            <Col lg="4" md="4" sm="6" xs="6">
                              <Row>
                                <p className="cp-text">
                                  Year of the Project
                                </p>
                              </Row>
                              <Row>
                                <DropdownButton
                                    as={ButtonGroup}
                                    // className="full-width"
                                    variant={'secondary'}
                                    title={this.state.year}
                                    onSelect={this.onChangeYear}
                                    style={{ width: "90%" }}>
                                  {this.state.yearsArray.map((item,index) => {
                                    return(
                                        <Dropdown.Item key={index} eventKey={item}>
                                          {item}
                                        </Dropdown.Item>)
                                  })}
                                </DropdownButton>{' '}
                              </Row>

                            </Col>
                            <Col lg="4" md="4" sm="6" xs="6">
                              <Row>
                                <p className="cp-text">
                                  Project Type
                                </p>
                              </Row>

                              <Row >

                                {
                                  this.state.projectTypeList.length == 0 ? (
                                      <DropdownButton
                                          // className="full-width"
                                          as={ButtonGroup}
                                          variant={'secondary'}
                                          title={"No Items"}
                                          onSelect={this.onChangeType}
                                          style={{ width: "90%" }}
                                      >
                                      </DropdownButton>) : (
                                      <DropdownButton
                                          // className="full-width"
                                          as={ButtonGroup}
                                          variant={'secondary'}
                                          title={this.state.type}
                                          onSelect={this.onChangeType}
                                          style={{ width: "90%" }}
                                      >
                                        {this.state.projectTypeList.map((item,index) => {
                                          return(
                                              <Dropdown.Item key={item._id} eventKey={index}>
                                                {item.projectType}
                                              </Dropdown.Item>)
                                        })}
                                      </DropdownButton>)
                                }

                              </Row>
                            </Col>
                            {(this.state.projectTypeList.length>0 && this.state.projectTypeList[this.state.selectedTypeIndex].isAcademicYear)?
                                <Col  lg="4" md="4" sm="12" xs="12" >
                                  <Row>
                                    <p className="cp-text cp-text">
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
                                        className="full-width"
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
                                </Col> :  null
                            }


                          </Row>

                          <Row style={{ paddingLeft: '30px', marginTop: '20px' }}>
                            <Row>
                              <p className="cp-text">
                                Assign Coordinators into the Project
                              </p>
                            </Row>
                            <Col md={12} sm={12} lg={12} xs={12} className="multiselect-col">
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


                          <div style={{   marginTop: '20px', textAlign:"center" }}>

                            <Row style={{paddingLeft: '15px',}}>
                              <p className="cp-text">
                                Assign Students into the Project
                              </p>
                            </Row>
                            {this.state.componentType=="add" &&
                            <div>
                              <Row style={{paddingLeft: '15px',}}>
                                <p className="cp-text2">
                                  CSV File Format :
                                </p>
                              </Row>
                              <Row className="img-col">

                                <Col md={2} lg={3} xs={0} sm={0}></Col>
                                <Col md={8} lg={6} xs={12} sm={12}>
                                  <img
                                      alt='background'
                                      src={require('../../assets/images/Student Assign-CSV-Format.PNG')}
                                      className='csv-image'
                                  />
                                </Col>
                                <Col md={2} lg={3} xs={0} sm={0}></Col>
                              </Row>
                              <Row style={{paddingLeft: '15px',}}>
                                <p className="cp-text2">
                                  Choose CSV File :
                                </p>
                              </Row>

                              <Row className="img-col">

                                <Col md={2} lg={3} xs={0} sm={0}></Col>
                                <Col md={8} lg={6} xs={12} sm={12}>
                                  <div className="csv-reader-div">
                                    <CSVReader
                                        cssClass="react-csv-input"
                                        onFileLoaded={this.handleForce}
                                        inputStyle={{ color: 'grey' }}
                                    />
                                  </div>
                                </Col>
                                <Col md={2} lg={3} xs={0} sm={0}></Col>
                              </Row>
                            </div>
                            }

                            {this.state.componentType=="edit" &&
                            <div>
                              <Row style={{paddingLeft: '15px',}}>
                                <Col lg={2} md={2} xs={0}></Col>
                                <Col lg={5} md={6} xs={12} sm={12}>
                                  <FormControl
                                      type='text'
                                      className="placeholder-text"
                                      placeholder='Eg :- 17000001'
                                      value={this.state.newIndex}
                                      onChange={(e) => {
                                        this.setState({ newIndex: e.target.value });
                                      }}
                                  ></FormControl>
                                </Col>
                                <Col lg={3} md={4} xs={12} sm={12}>
                                  <Button
                                      variant='info'
                                      onClick={this.addIndex}
                                      style={{ width: '100%' }}
                                  >
                                    Add Index
                                  </Button>
                                </Col>
                                <Col lg={2} md={2} xs={0}></Col>
                              </Row>

                              <Row className="index-list-row">
                                {this.state.studentList.map((index,key)=>{
                                  return (
                                      <Col key={key} lg={3} md={4} xs={12} sm={12} className="index-card-col">
                                        {/*<Row>*/}
                                        <Card className="index-card">
                                          <Card.Body className="index-card-body">
                                            {index} <span className="index-delete-icon" onClick={()=>this.deleteIndex(index)}><AiFillDelete/></span>
                                          </Card.Body>
                                        </Card>
                                        {/*</Row>*/}
                                      </Col>
                                  )
                                })}
                              </Row>
                            </div>
                            }

                          </div>

                          <Row style={{ marginTop: '40px', marginBottom: '30px' }}>
                            <Col md={1}></Col>
                            {this.state.componentType === 'edit' &&
                            <Col>
                              <Button
                                  variant='danger'
                                  onClick={this.goBack}
                                  style={{ width: '100%' }}
                              >
                                Cancel
                              </Button>
                            </Col>}
                            <Col>
                              <Button
                                  variant='info'
                                  onClick={this.onCreateProject}
                                  style={{ width: '100%' }}
                              >
                                {this.state.componentType === 'add' &&
                                'Assign Now'}
                                {this.state.componentType === 'edit' &&
                                'Save Now'}
                              </Button>
                            </Col>
                            <Col md={1}></Col>
                          </Row>

                        </div>
                      </Container>

                  )}
                  <Container fluid className=" zero-padding" style={{paddingLeft: '3%', paddingRight: '3%'}}>

                    {this.state.projects.length > 0 && this.state.componentType === "add" && (

                        <div className="card card-2 create-project">
                          <h3>Current Projects</h3>


                          <div>
                            <Table hover style={{ marginTop: 20 }} >
                              <thead>
                              <tr>
                                <th >Project Year</th>
                                <th >Project Type</th>
                                <th >Academic Year</th>
                                <th >Coordinators</th>
                                <th >State</th>
                                <th style={{ width: '20%', textAlign: "center" }}>Operations</th>
                              </tr>
                              </thead>
                              <tbody>
                              {this.state.projects.map((project) => {
                                return (<tr key={project._id}>
                                      <td style={{ verticalAlign: 'middle' }}>{project.projectYear}</td>
                                      <td style={{ verticalAlign: 'middle' }}>{project.projectType}</td>
                                      <td style={{ verticalAlign: 'middle' }}>{project.academicYear?project.academicYear: '-'}</td>
                                      <td style={{ verticalAlign: 'middle' }}><CoordinatorList idList={project}/></td>
                                      {project.projectState && <td style={{ verticalAlign: 'middle' , color: 'green'}}>Active</td>}
                                      {!project.projectState && <td style={{ verticalAlign: 'middle' , color: 'red' }}>Ended</td>}

                                      <td style={{ verticalAlign: 'middle' }}><Row>
                                        <Col style={{  textAlign:"end"}}>
                                          <Create className="edit-btn" fontSize="large" onClick={()=>this.onEditHandler(project)} />
                                        </Col>
                                        <Col>
                                          <DeleteForeverIcon className="del-btn" fontSize="large" onClick={() =>this.onDeleteHandler(project._id)} />
                                        </Col>
                                      </Row></td>
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
          </div>


          <Footer />
        </React.Fragment >
    );
  }
}

export default CreateProject;
