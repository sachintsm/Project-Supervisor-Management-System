import React, {Component} from 'react';
import Navbar from "../../shared/Navbar";
import { Row, Col, Card, Form, Spinner   } from 'react-bootstrap';
import {Input,Label, Button,} from 'reactstrap';
import Footer from "../../shared/Footer";
import TaskProgressCard from "./TaskProgressCard";
import "../../../css/students/progress/ViewTask.scss"
import {ThemeProvider} from "@material-ui/styles";
import Slider from "@material-ui/core/Slider";
import {createMuiTheme} from "@material-ui/core/styles";
import axios from 'axios'
import {getFromStorage} from "../../../utils/Storage";

const backendURI = require('../../shared/BackendURI');

const muiTheme = createMuiTheme({
    overrides:{
        MuiSlider: {
            thumb:{
                color: "#000",
            },
            track: {
                color: '#444'
            },
            rail: {
                color: '#888'
            },
            mark: {
                backgroundColor: '#888',
            },
        }
    }
});
const marks = [
    { value: 1, label: '1',  },
    { value: 2, label: '2',  },
    { value: 3, label: '3',  },
    { value: 4, label: '4',  },
    { value: 5, label: '5',  },
    { value: 6, label: '6',  },
    { value: 7, label: '7',  },
    { value: 8, label: '8',  },
    { value: 9, label: '9',  },
    { value: 10, label: '10',  },
];

class ViewTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task: null,
            taskId: props.location.state.taskId,
            groupDetails: props.location.state.groupDetails,
            defaultTaskWeight: null,
            defaultProgress: null,
            loading: true
        }

    }
    componentDidMount() {
        this.getTaskDetails()
        window.scrollTo(0, 0)
    }

    getTaskDetails = () =>{

        window.scrollTo(0, 0)
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/progress/gettaskdetails/'+this.state.taskId,{headers:headers}).then(res=>{
            this.setState({
                task:res.data,
                defaultTaskWeight: res.data.taskWeight,
                defaultProgress : res.data.totalProgress,
                totalProgress: res.data.totalProgress,
                loading: false
            })
        })
    }

    onChangeTitle = (e) => {
        let title = e.target.value
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                taskTitle: title
            }
        }))
    }

    taskWeightHandler = (event,value) =>{
        let weight = value
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                taskWeight: weight
            }
        }))
    }

    progressHandler = (event,value) => {
        let progress = value
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                totalProgress: progress
            }
        }))
        this.setState({
            progressChange: progress-this.state.defaultProgress
        })
    }

    onChangeDescription = (e) => {

        this.setState({ description: e.target.value  })
    }

    editTask = () => {
        const object = {
            id: this.state.task._id,
            taskTitle: this.state.task.taskTitle,
            taskWeight: this.state.task.taskWeight
        }

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.patch(backendURI.url+'/progress/edittask/'+this.state.task._id,object,{headers:headers}).then(res=>{
            console.log(res)
        })

        this.props.history.goBack();
    }

    updateTask = () =>{

        let userId = getFromStorage("auth-id").id

        const date = new Date()
        const dateString = date.toLocaleDateString()
        const timeString = date.toLocaleTimeString()

        const object = {
            taskId: this.state.task._id,
            groupId: this.state.groupDetails._id,
            userId: userId,
            description: this.state.description,
            progressChange: this.state.task.totalProgress - this.state.defaultProgress,
            timestamp: new Date(),
            date: dateString,
            time: timeString
        }
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.post(backendURI.url+'/progress/addprogressupdate/',object,{headers:headers}).then(res=>{
            // console.log(res)
        })
        window.location.reload(false);
    }

    resetPage = () =>{
        window.location.reload(false);
    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid view-task tasks-background-color">
                    {this.state.loading && <div className="spinner-div"><Spinner animation="border" className="spinner"/></div>}
                    {!this.state.loading && (
                        <div className="main-card">

                            <Row><TaskProgressCard groupDetails={this.state.groupDetails} taskDetails={this.state.task}/></Row>

                            <Row className="task-options">
                                <Col lg={6} md={6} className="edit-card-div">
                                    <Card className="edit-card">
                                        <h3 className="title">Edit Task</h3>

                                        <div >
                                            <form onSubmit={this.onSubmit}>

                                                <div className="form-group">
                                                    <Label for="avatar">Task Title</Label>
                                                    <Input type="text" className="form-control" name="task-title" onChange={this.onChangeTitle} value={this.state.task.taskTitle}/>

                                                </div>

                                                <div className="form-group">
                                                    <Label for="avatar">Task Weight ( 1-10 )</Label>
                                                    <div  className="slider-div">
                                                        <ThemeProvider theme={muiTheme}>

                                                            <Slider defaultValue={this.state.defaultTaskWeight} onChange={this.taskWeightHandler} aria-labelledby="discrete-slider"
                                                                    valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks}/>
                                                        </ThemeProvider>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <Row className="btn-row">
                                                        <Col md={4} lg={4} sm={6} xs={6} className="my-btn1"><Button className="btn btn-danger my-4 my-btn1" onClick={this.resetPage} block>Reset</Button></Col>
                                                        <Col md={8} lg={8} sm={6} xs={6} className="my-btn2"><Button className="btn btn-info my-4 my-btn2" onClick={this.editTask} block>Edit Task</Button></Col>
                                                    </Row>
                                                </div>
                                            </form>
                                        </div>
                                    </Card>
                                </Col>
                                <Col lg={6} md={6} className="update-card-div">
                                    <Card className="update-card">
                                        <h3  className="title">Update Task Progress</h3>

                                        {this.state.task.totalProgress < this.state.defaultProgress &&
                                        (<div><label>New Task Progress </label><label style={{fontWeight:"bold",marginLeft:"3px"}}> ({this.state.task.totalProgress}%)</label> <label style={{fontWeight:"bold",color:"red"}}> (-{this.state.defaultProgress-this.state.task.totalProgress}%)</label> </div>)}
                                        {this.state.task.totalProgress > this.state.defaultProgress &&
                                        (<div><label>New Task Progress </label><label style={{fontWeight:"bold",marginLeft:"3px"}}> ({this.state.task.totalProgress}%)</label> <label style={{fontWeight:"bold",color:"#27d600"}}> (+{this.state.task.totalProgress-this.state.defaultProgress}%)</label></div>)}
                                        {this.state.task.totalProgress === this.state.totalProgress && <div><label> New Task Progress </label><label style={{fontWeight:"bold",marginLeft:"3px"}}> ({this.state.task.totalProgress}%) </label><label style={{marginLeft: "3px"}}>  (No Change)</label> </div>}

                                        <ThemeProvider theme={muiTheme}>
                                            <Slider defaultValue={this.state.defaultProgress} onChange={this.progressHandler} aria-labelledby="continuous-slider"
                                                    valueLabelDisplay="auto" step={1} min={0} max={100} />
                                        </ThemeProvider>
                                        <form>

                                            <label className="label-description">Description</label>
                                            <Form.Control as="textarea" rows="2" onChange={this.onChangeDescription}/>
                                            <div className="form-group update-button-div">
                                                <Row className="btn-row2">
                                                    <Col md={4} lg={4} sm={6} xs={6} className="my-btn1"><Button className="btn btn-danger my-4 my-btn1" onClick={this.resetPage} block>Reset</Button></Col>
                                                    <Col md={8} lg={8} sm={6} xs={6} className="my-btn2"><Button className="btn btn-info my-4 my-btn2" onClick={this.updateTask} block>Update Task Progress</Button></Col>
                                                </Row>
                                            </div>
                                        </form>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default ViewTask;