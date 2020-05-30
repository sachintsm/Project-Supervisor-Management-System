import React, { Component } from 'react';
import '../../css/admin/CreateProject.css';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import MultiSelect from 'react-multi-select-component';
import Footer from '../shared/Footer';
import { Button, Col, Row, Dropdown, DropdownButton, ButtonGroup, Table, Container } from 'react-bootstrap';
import Snackpop from "../shared/Snackpop";
import {getFromStorage} from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Create from '@material-ui/icons/Create';
import CoordinatorList from "./CoordinatorList";

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
      title: 'Creating New Project',
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
      typeWarnAlert: false
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
              const supervisors = this.state.selectedStaffList.map(item=>{
                return item.value
              })


              const project = {
                projectYear: this.state.year,
                projectType: this.state.type,
                academicYear: this.state.academicYear,
                coordinatorList: supervisors
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
        }
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
        {
          label: 'No',
          onClick: () => {

          }
        }
      ]
    })
  }

  onEditHandler = (project) => {
    // console.log(project)
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
      id: project._id,
    }, () => { window.scrollTo(0, 0) })
  }

  goBack = () =>{

    this.setState({
      componentType: "add",
      title: 'Create Project Now',
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

          <div className="container-fluid container-fluid-di">
            <Row >
              <Col>
                <Container className="zero-margin zero-padding">

                  <div className="card card-1" >

                    <h3 style={{ marginTop: "30px" }}>{this.state.title}</h3>
                    <Row style={{ marginLeft: '0px', marginTop: '20px' }}>
                      <Col lg="4" md="4" sm="12" xs="12">
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
                            {this.state.yearsArray.map((item,index) => {
                              return(
                                  <Dropdown.Item key={index} eventKey={item}>
                                    {item}
                                  </Dropdown.Item>)
                            })}
                          </DropdownButton>{' '}
                        </Row>

                      </Col>
                      <Col lg="4" md="4" sm="12" xs="12">
                        <Row>
                          <p className="cp-text cp-text2">
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
                              <p className="cp-text cp-text2">
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
                          </Col> :  null
                      }


                    </Row>

                    <Row style={{ marginLeft: '15px', marginTop: '20px' }}>
                      <Row>
                        <p className="cp-text">
                          Assign Coordinators into the Project
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
                            onClick={this.onCreateProject}
                            style={{ width: '100%' }}
                        >
                          {this.state.componentType === 'add' &&
                          'Create Project Now'}
                          {this.state.componentType === 'edit' &&
                          'Edit Now'}
                        </Button>
                      </Col>
                      <Col md={3}></Col>
                    </Row>

                  </div>
                  </Container>
                  <Container fluid style={{paddingLeft: '3%', paddingRight: '3%'}}>

                  {this.state.projects.length > 0 && this.state.componentType === "add" && (

                      <div className="card card-2">
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


          <Footer />
        </React.Fragment >
    );
  }
}

export default CreateProject;
