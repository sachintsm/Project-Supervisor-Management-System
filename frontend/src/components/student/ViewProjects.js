import React, {Component} from 'react';
import '../../css/students/ViewProjects.scss'
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Footer from '../shared/Footer';
import axios from 'axios';
import {getFromStorage} from "../../utils/Storage";
import CoordinatorList from "../admin/CoordinatorList";

const backendURI = require('../shared/BackendURI');

class ViewProjects extends Component {

    constructor(props) {
        super(props);
        this.getProjectList = this.getProjectList.bind(this)
        this.state = {
            activeList: [],
            endedList: [],
            loading: true
        };
    }

    componentDidMount() {
        this.getProjectList();
    }

    getProjectList(){
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const studentId = getFromStorage("auth-id")
        axios.get(backendURI.url+'/projects/studentprojects/'+studentId.id,{headers: headers}).then(result=>{
            if(result.data.length>0){
                result.data.map(item=>{
                  if(item.projectState){
                    this.setState({
                        activeList: [...this.state.activeList,item]
                    })
                  }
                  else{
                      this.setState({
                          endedList: [...this.state.endedList,item]
                      })
                  }
                })
            }
            this.setState({
                loading: false
            })
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-fluid view-projects view-project-background-color">
                    <Container>
                        <div className="card card-div current-card">
                            <h3 className="title">Ongoing Projects <span className="dot"></span></h3>
                            <div className="project-list-div">

                                {this.state.loading && <Spinner animation="border" />}
                                {this.state.activeList.length==0 && !this.state.loading  && <p className="no-project">No Projects</p>}
                                <Row className="project-row">
                                    {
                                        this.state.activeList.map(item=>{
                                            return <Col lg={6} md={12} sm={12} xs={12} key={item._id} className="item-div">
                                                <div  className="card zero-margin projects-card">

                                                    <Row>
                                                        <Col lg={5} md={4} sm={12} xs={12}><span className="bold-text">Project Year </span></Col>
                                                        {/*<Col lg={1} md={1} sm={0} xs={0}><span className="bold-text">: </span></Col>*/}
                                                        <Col lg={7} md={7} sm={12} xs={12}><span className="normal-text">{item.projectYear}</span></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={5} md={4} sm={12} xs={12}><span className="bold-text">Project Type</span></Col>
                                                        {/*<Col lg={1} md={1} sm={0} XS={0}><span className="bold-text">: </span></Col>*/}
                                                        <Col lg={7} md={7} sm={12} xs={12}><span className="normal-text">{item.projectType}</span></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={5} md={4} sm={12} xs={12}><span className="bold-text">Academic Year</span></Col>
                                                        {/*<Col lg={1} md={1} sm={0} xs={0}><span className="bold-text">: </span></Col>*/}
                                                        <Col lg={5} md={7} sm={12} xs={12}><span className="normal-text">{item.academicYear}</span></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={5} md={4} sm={12} xs={12}><span className="bold-text">Coordinators</span></Col>
                                                        {/*<Col lg={1} md={1} sm={0} XS={0}><span className="bold-text">: </span></Col>*/}
                                                        <Col lg={7} md={7} sm={12} xs={12}><span className="normal-text"><CoordinatorList component={"viewProject"} idList={item}/></span></Col>
                                                    </Row>
                                                </div>



                                            </Col>
                                        })
                                    }

                                </Row>
                            </div>
                        </div>
                        <div className="card card-div ended-card">
                            <h3 className="title">Ended Projecs</h3>
                            <div className="project-list-div">
                                {this.state.loading && <Spinner animation="border" />}
                                {this.state.endedList.length==0 && !this.state.loading && <p className="no-project">No Projects</p>}
                            </div>
                        </div>
                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default ViewProjects;