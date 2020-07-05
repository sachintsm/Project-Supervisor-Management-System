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
import ProgressUpdates from "./ProgressUpdates";
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { confirmAlert } from 'react-confirm-alert';

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
const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.white,
    },
    tooltip: {
        backgroundColor: '#555',
        fontSize: "14px",
        color: 'white'
    },
}));
function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}

class ViewTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task: null,
            taskId: props.location.state.taskId,
            groupDetails: props.location.state.groupDetails,
            projectDetails: props.location.state.projectDetails,
            defaultTaskWeight: null,
            defaultProgress: null,
            loading: true,
            updateLoading: true,
            progressUpdates: []
        }
    }
    componentDidMount() {
        this.getTaskDetails()
        this.getProgressUpdates()
        window.scrollTo(0, 0)

    }

    getProgressUpdates = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const taskId = this.state.taskId;
        axios.get(backendURI.url+'/progress/gettaskprogressupdates/'+taskId,{headers:headers}).then(res=>{
            console.log(res.data)
            this.setState({
                progressUpdates: res.data,
                updateLoading: false
            })
        })
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
                loading: false,
                progressHint: "Increase or Decrease the progress of "+res.data.taskTitle
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
        if(this.state.task.taskTitle){
            confirmAlert({
                title: 'Edit Task',
                message: 'Do you want to edit this Task?',
                buttons: [
                    {
                        label: 'No',
                        onClick: () => {

                        }
                    },
                    {
                        label: 'Yes',
                        onClick: async () => {
                            const object = {
                                id: this.state.task._id,
                                taskTitle: this.state.task.taskTitle,
                                taskWeight: this.state.task.taskWeight,
                            }

                            const headers = {
                                'auth-token':getFromStorage('auth-token').token,
                            }
                            axios.patch(backendURI.url+'/progress/edittask/'+this.state.task._id,object,{headers:headers}).then(res=>{
                                console.log(res)
                            })

                            this.props.history.goBack();

                        }
                    }

                ]
            })
        }
    }

    updateTask = () =>{

        if(this.state.description){
            confirmAlert({
                title: 'Update Task',
                message: 'Do you want to update the task progress?',
                buttons: [
                    {
                        label: 'No',
                        onClick: () => {

                        }
                    },
                    {
                        label: 'Yes',
                        onClick: async () => {
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
                    }
                ]
            })
        }
        else{
            this.setState({description: ""})
        }
    }

    resetPage = () =>{            confirmAlert({
        message: 'Reset to default values?',
        buttons: [
            {
                label: 'No',
                onClick: () => {

                }
            },
            {
                label: 'Yes',
                onClick: async () => {
                    window.location.reload(false);

                }
            }
        ]
    })
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
                            {this.state.projectDetails.projectState &&

                            <Row className="task-options">
                                <Col lg={6} md={6} className="edit-card-div">
                                    <Card className="edit-card">
                                        <h3 className="title">Edit Task</h3>

                                        <div >
                                            <form onSubmit={this.onSubmit}>

                                                <div className="form-group">
                                                    <Label for="avatar">Task Title{this.state.task.taskTitle==="" && <span className="title-error">*Required</span>}</Label>
                                                    <Input type="text" className="form-control" name="task-title" onChange={this.onChangeTitle} value={this.state.task.taskTitle}/>

                                                </div>

                                                <div className="form-group">
                                                    <Label for="avatar">Task Weight ( 1-10 )
                                                        <BootstrapTooltip title="Change your approximate Task Weight. Give higher weight for complex tasks and lower weight for simple tasks. Total Progress will be calculated according to the Task Weights"  placement="right">
                                                            <span className="question-span">&#9432;</span>
                                                        </BootstrapTooltip>
                                                    </Label>
                                                    <div  className="slider-div">
                                                        <ThemeProvider theme={muiTheme}>

                                                            <Slider defaultValue={this.state.defaultTaskWeight} onChange={this.taskWeightHandler} aria-labelledby="discrete-slider"
                                                                    valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks}/>
                                                        </ThemeProvider>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <Row className="btn-row">
                                                        <Col md={4} lg={4} sm={6} xs={6} className="my-btn1-div"><Button className="btn btn-danger my-4 my-btn1" onClick={this.resetPage} block>Reset</Button></Col>
                                                        <Col md={8} lg={8} sm={6} xs={6} className="my-btn2-div"><Button className="btn btn-info my-4 my-btn2" onClick={this.editTask} block>Edit Task</Button></Col>
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
                                        (<div><label>New Task Progress </label><label style={{fontWeight:"bold",marginLeft:"3px"}}> ({this.state.task.totalProgress}%)</label> <label style={{fontWeight:"bold",color:"red"}}> (-{this.state.defaultProgress-this.state.task.totalProgress}%)
                                            <BootstrapTooltip title={this.state.progressHint} placement="right">
                                                <span className="question-span">&#9432;</span>
                                            </BootstrapTooltip></label> </div>)}

                                        {this.state.task.totalProgress > this.state.defaultProgress &&
                                        (<div><label>New Task Progress </label><label style={{fontWeight:"bold",marginLeft:"3px"}}> ({this.state.task.totalProgress}%)</label> <label style={{fontWeight:"bold",color:"#27d600"}}> (+{this.state.task.totalProgress-this.state.defaultProgress}%)
                                            <BootstrapTooltip title={this.state.progressHint}  placement="right">
                                                <span className="question-span">&#9432;</span>
                                            </BootstrapTooltip></label></div>)}

                                        {this.state.task.totalProgress === this.state.totalProgress && <div><label> New Task Progress </label><label style={{fontWeight:"bold",marginLeft:"3px"}}> ({this.state.task.totalProgress}%) </label><label style={{marginLeft: "3px"}}>  (No Change)

                                            <BootstrapTooltip title={this.state.progressHint}  placement="right">
                                                <span className="question-span">&#9432;</span>
                                            </BootstrapTooltip></label> </div>}

                                        <ThemeProvider theme={muiTheme}>
                                            <Slider defaultValue={this.state.defaultProgress} onChange={this.progressHandler} aria-labelledby="continuous-slider"
                                                    valueLabelDisplay="auto" step={1} min={0} max={100} />
                                        </ThemeProvider>
                                        <form>

                                            <label className="label-description">Description
                                                <BootstrapTooltip title="Briefly explain changes in the update"  placement="right">
                                                    <span className="question-span">&#9432;</span>
                                                </BootstrapTooltip>
                                                {this.state.description==="" && <span className="title-error">*Required</span>}
                                            </label>
                                            <Form.Control as="textarea" rows="2" onChange={this.onChangeDescription}/>
                                            <div className="form-group update-button-div">
                                                <Row className="btn-row2">
                                                    <Col md={4} lg={4} sm={6} xs={6} className="my-btn1-div"><Button className="btn btn-danger my-4 my-btn1" onClick={this.resetPage} block>Reset</Button></Col>
                                                    <Col md={8} lg={8} sm={6} xs={6} className="my-btn2-div"><Button className="btn btn-info my-4 my-btn2" onClick={this.updateTask} block>Update Progress</Button></Col>
                                                </Row>
                                            </div>
                                        </form>
                                    </Card>
                                </Col>
                            </Row>
                            }
                        </div>


                    )}
                    {this.state.progressUpdates.length>0 && (
                        <div className="progress-update-div">
                            <Card className="progress-update-card">
                                <h3 className="title">Progress Update History</h3>
                                {!this.state.updateLoading && <ProgressUpdates taskTitleShow={true} usernameShow={true} progressUpdates={this.state.progressUpdates}/>}
                            </Card>
                        </div>
                    )}
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default ViewTask;