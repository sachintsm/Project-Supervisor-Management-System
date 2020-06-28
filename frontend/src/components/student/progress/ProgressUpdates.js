import React, {Component} from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import "../../../css/students/progress/ProgressUpdates.scss"
import {getFromStorage} from "../../../utils/Storage";
import axios from 'axios'

const backendURI = require('../../shared/BackendURI');

class ProgressUpdates extends Component {

    constructor(props) {
        super(props);
        this.state = {
            progressUpdates: this.props.progressUpdates,
            loading: true
        }


    }

    componentDidMount() {
        let updates = []
        this.state.progressUpdates.map (item => {

            const headers = {
                'auth-token':getFromStorage('auth-token').token,
            }
            axios.get(backendURI.url+'/users/getUser/'+item.userId,{headers:headers}).then(res=>{
                item.name = res.data.data.firstName + " " + res.data.data.lastName
                this.setState({
                    loading:false
                })
            })
        })

    }

    renderDate = (item) =>{
        console.log("hello")
        return (<div style={{fontSize: "13px",color:"#777"}}>{item.date}&nbsp; {item.time}</div>)
    }


    render() {
        return (
            <div className="update-card-div">
                {!this.state.loading && this.state.progressUpdates.map(item => {
                    return (
                        <Card className="update-card" key={item._id} style={{borderColor: item.progressChange<0? "red":"#27d600", borderWidth: "1.1px"}}>
                            <Row>
                                <Col lg={10} md={10}>
                                    { this.renderDate(item) }
                                    <div className="description">{ item.description}</div>
                                    <div className="name">{item.name}</div>
                                </Col>
                                <Col lg={2} md={2} >
                                    {item.progressChange==0 && <span className="neutral-progress">{item.progressChange} %</span>}
                                    {item.progressChange>0 && <span className="positive-progress">+{item.progressChange} %</span>}
                                    {item.progressChange<0 && <span className="negative-progress">- {-1*item.progressChange} %</span>}

                                </Col>
                            </Row>
                        </Card>
                    )
                })}
            </div>
        );
    }
}

export default ProgressUpdates;