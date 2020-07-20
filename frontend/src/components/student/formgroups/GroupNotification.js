import React, {Component} from 'react';
import axios from 'axios';
import { getFromStorage } from "../../../utils/Storage";
import { Row, Col, Card,Spinner, Container, Button } from 'react-bootstrap';
import "../../../css/students/formgroups/GroupNotification.scss"
import Navbar from "../../shared/Navbar";
import ProjectDetailsCard from "../ProjectDetailsCard";
import Footer from "../../shared/Footer";
const backendURI = require('../../shared/BackendURI');

class GroupNotification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            loading: true
        }

    }

    componentDidMount() {
        this.getNotifications();
    }

    getNotifications = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id
        axios.get(backendURI.url+'/createGroups/groupformnotification/'+userId,{headers: headers}).then(res=>{
            this.setState({
                projects: res.data,
                loading:false
            })
        })

    }

    formGroups = (id) =>{
        this.props.history.push('/studenthome/formgroups/'+id)
    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid group-notifications">
                    <div className="title-div">
                        <h3 className="title">Notifications </h3>
                    </div>
                    <Container>
                        {this.state.loading &&
                        <div style={{textAlign:'center', paddingTop: "30px"}}>
                            <Spinner animation="border" className="spinner" style={{alignContent:'center'}}/>
                        </div>}
                        {!this.state.loading && (

                            <div className="card card-div">

                                {this.state.projects.map(item=>{
                                    return <Card className="notification-card" key={item._id}>
                                        <Card.Body className="card-body">
                                            <Row className="details-row">
                                                <Col>
                                                    <h5>You Can Form Groups by Yourselves Now...</h5>
                                                    <div>Project Year: {item.projectYear}</div>
                                                    <div>Project Type: {item.projectType}</div>
                                                    <div>Academic Year: {item.academicYear}</div>
                                                </Col>
                                                <Col lg={3} md={3} className="btn-col">
                                                    <Button className="btn btn-info my-btn1" onClick={()=>this.formGroups(item._id)}>Form Groups</Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                })}
                            </div>
                        )}
                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default GroupNotification;