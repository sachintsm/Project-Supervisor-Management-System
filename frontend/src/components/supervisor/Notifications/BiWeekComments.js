import React, {Component} from 'react';
import {Container, Button, Card, Row, Col, FormControl} from 'react-bootstrap';
import Navbar from "../../shared/Navbar"
import Footer from "../../shared/Footer"
import "../../../css/supervisor/notificaitons/BiWeekComments.scss"
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import BackendURI from "../../shared/BackendURI";
import Snackpop from "../../shared/Snackpop";
import ViewComments from "./ViewComments";

const backendURI = require('../../shared/BackendURI');

class BiWeekComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            biWeekId: this.props.match.params.id,
            biWeekDetails: this.props.history.location.state.biWeekDetails,
            loading1: true,
            loading2: true,
            loading3: true,
            newComment: "",
            successAlert: false,
            warnAlert: false,
            deleteAlert: false
        }
    }

    componentDidMount() {
        this.getProjectDetails()
        this.getGroupDetails()
        this.getComments()
    }

    getProjectDetails = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/projects/getproject/'+this.state.biWeekDetails.projectId,{headers: headers}).then(res=>{
            this.setState({
                projectDetails: res.data.data,
                loading2:false
            })
        })
    }
    getGroupDetails = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/createGroups/getGroupData/'+this.state.biWeekDetails.groupId,{headers: headers}).then(res=>{
            this.setState({
                groupDetails: res.data.data,
                loading1:false
            })
        })
    }

    commentHandler = (e) => {
        this.setState({
            newComment: e.target.value
        })
    }

    addComment = () => {

        if(this.state.newComment===""){
            this.setState({
                warnAlert: true
            })
        }
        else{

            const userId = getFromStorage("auth-id").id


            const date = new Date()
            const dateString = date.toLocaleDateString()
            const timeString = date.toLocaleTimeString()

            const data = {
                biweekId: this.state.biWeekDetails._id,
                comment: this.state.newComment,
                userId: userId,
                date: dateString,
                time: timeString,
                timestamp: new Date(),

            }

            const headers = {
                'auth-token': getFromStorage('auth-token').token,
            }


            axios.post(BackendURI.url + "/biweekcomments/addcomment", data, { headers: headers }).then(res => {
                this.setState({
                    successAlert: true
                }, () => {
                    this.setState({
                        loading3: true,
                        newComment: ""
                    },()=>{
                        this.getComments()
                    })
                })

            })
        }
    }

    getComments = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/biweekcomments/getcomments/'+this.state.biWeekDetails._id,{headers: headers}).then(res=>{
            console.log(res.data)
            this.setState({
                comments: res.data,
                loading3: false
            })
        })
    }

    callBackFunction = () => {
        this.setState({
            loading3: true,
            deleteAlert: true
        },()=> {
            this.getComments()
        })
    }

    closeAlert = () => {
        this.setState({
            successAlert: false,
            warnAlert: false,
            deleteAlert: false
        });
    };

    render() {

        return (
            <React.Fragment>

                <Snackpop
                    msg={'Comment Success'}
                    color={'success'}
                    time={3000}
                    status={this.state.successAlert}
                    closeAlert={this.closeAlert}
                />

                <Snackpop
                    msg={'Delete Success'}
                    color={'success'}
                    time={3000}
                    status={this.state.deleteAlert}
                    closeAlert={this.closeAlert}
                />

                <Snackpop
                    msg={'Please Enter a Comment'}
                    color={'warning'}
                    time={3000}
                    status={this.state.warnAlert}
                    closeAlert={this.closeAlert}
                />

                <Navbar panel={"supervisor"}/>
                <div className="biWeekComments">
                    <Container className="div-container">
                        <div className="title-div">
                            {!this.state.loading2 && <h4>{this.state.projectDetails.projectYear} {this.state.projectDetails.projectType} {this.state.projectDetails.academicYear}</h4>}
                            {!this.state.loading1 && <h4>{this.state.groupDetails.groupName} ( Group {this.state.groupDetails.groupId} )</h4>}
                            <h5>BiWeekly Report #{this.state.biWeekDetails.biweeklyNumber} Comments</h5>
                        </div>

                        <div className="card-div">
                            <Card className="comments-card">
                                <div className="add-comment-div">
                                    <h6 className="sub-title1">Add New Comment</h6>
                                    <Row>
                                        <Col lg={10} md={9} xs={6} xs={6}>
                                            <FormControl
                                                type='text'
                                                className="placeholder-text"
                                                placeholder='Enter Your New Comment'
                                                value={this.state.newComment}
                                                onChange={this.commentHandler}
                                            ></FormControl>
                                        </Col>
                                        <Col lg={2} md={3} xs={6} xs={6}>
                                            <Button variant="info" style={{"width": "100%"}} onClick={()=>this.addComment()}>Add Comment</Button>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="comments-div">
                                    <h6 className="sub-title2">Previous Comments</h6>
                                    <div className="previous-comments">

                                        {!this.state.loading3 && this.state.comments.length===0 && <label className="no-comments">No Comments</label>}

                                        {!this.state.loading3 && this.state.comments.length>0 && this.state.comments.map((comment,key)=> {
                                            return <ViewComments comment={comment} key={key} callBack={this.callBackFunction}/>
                                        })}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default BiWeekComments;