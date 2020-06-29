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
            taskTitleShow: this.props.taskTitleShow,
            usernameShow: this.props.usernameShow,
            component: this.props.component,
            loading1: true,
            loading2: true
        }


    }

    componentDidMount() {
        this.getUserName()
        this.getTaskTitle()
    }

    getUserName = () => {
        this.state.progressUpdates.map (item => {

            const headers = {
                'auth-token':getFromStorage('auth-token').token,
            }
            axios.get(backendURI.url+'/users/getUser/'+item.userId,{headers:headers}).then(res=>{
                item.name = res.data.data.firstName + " " + res.data.data.lastName
                this.setState({
                    loading1:false
                })
            })
        })
    }

    getTaskTitle = () => {
        this.state.progressUpdates.map (item => {
            const headers = {
                'auth-token':getFromStorage('auth-token').token,
            }
            axios.get(backendURI.url+'/progress/gettaskdetails/'+item.taskId,{headers:headers}).then(res=>{
                item.taskTitle = res.data.taskTitle
                this.setState({
                    loading2:false
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
            <div className="update-card-history-div">
                {!this.state.loading1 && !this.state.loading2 && this.state.progressUpdates.map(item => {
                    return (
                        <Card className="update-history-card" key={item._id} style={{borderColor: item.progressChange<0? "red":"#27d600", borderWidth: "1.1px"}}>
                            <Row>
                                <Col lg={9} md={9} sm={12}>
                                    { this.renderDate(item) }
                                    <div className="description">{ item.description}</div>
                                    {this.state.taskTitleShow && <div className="task-title">Task : {item.taskTitle} </div>}
                                    {this.state.usernameShow && <div className="name">Author : {item.name}</div>}

                                </Col>
                                <Col lg={3} md={3} xs={12} className="progress-change-col">
                                    <div  className="name">Task Progress Change</div>
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