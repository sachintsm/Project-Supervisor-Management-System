import React, {Component} from 'react';
import Navbar from "../shared/Navbar";
import {getFromStorage} from "../../utils/Storage";
import axios from "axios";
import BiweekData from "./BiweekData";
import { Row, Col, Card,Container } from 'react-bootstrap';
import Footer from "../shared/Footer"
import "../../css/supervisor/BiWeekly.scss"


const backendURI = require('../shared/BackendURI');

class BiWeekly extends Component {

    constructor(props) {
        super(props);

        this.state = {
            groupDetails: props.location.state.groupDetails,
            loading: true
        }
    }

    componentDidMount() {
        this.getBiweekRequests()
    }

    getBiweekRequests = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id

        axios.get(backendURI.url+"/biweeksubmissions/getgroupsubmissions/"+this.state.groupDetails._id, {headers: headers}).then(res=>{
            console.log(res.data)
            this.setState({
                biWeekRequests: res.data,
                loading: false
            },()=> {
                // this.getProjectDetails()
            })
        })
    }

    getProjectDetails = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/projects/getproject/'+this.state.request.projectId,{headers: headers}).then(res=>{
            this.setState({
                projectDetails: res.data.data,
                loading2:false
            })
        })
    }

    render() {

        // console.log(this.state)

        return (
            <div className="biweekly-supervisor">
                <Navbar panel={"supervisor"} />
                <Container>
                    <div className="title-div margin-top-30">
                        <h3 className="title">Biweekly Reports </h3>
                    </div>
                    {!this.state.loading && this.state.biWeekRequests.map((item,key)=> {
                        return <Card className="margin-bottom-20" key={key}>


                            <Card.Header className="card-header">Biweekly Report {item.biweeklyNumber} </Card.Header>

                            <Card.Body className="card-body">
                                <Row className="details-row">
                                    <Col>
                                        <BiweekData details={item}/>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                    })}
                </Container>
                <Footer/>
            </div>
        );
    }
}

export default BiWeekly;