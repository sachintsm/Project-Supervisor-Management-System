import React, {Component} from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import {Input,Label, Button, Modal, ModalHeader, ModalBody, } from 'reactstrap';
import "../../../css/students/progress/Tasks.scss"
import Footer from "../../shared/Footer";
import {IconContext} from "react-icons";
import axios from 'axios'
import {AiOutlineFileAdd} from "react-icons/ai";
import Slider from '@material-ui/core/Slider';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Navbar from "../../shared/Navbar";
import {getFromStorage} from "../../../utils/Storage";
import TaskCard from "./TaskCard";
import { withRouter } from "react-router-dom";
import TotalProgressCard from "./TotalProgressCard";
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

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: props.location.state.projectDetails,
            groupDetails: props.location.state.groupDetails,
            taskWeight: 0,
            currentTasks: [],
            loading: true,
            progressUpdates: [],
            updateLoading: true,
            taskTitleError: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.getTasks()
        this.getProgressUpdates()
    }

    getTasks = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const groupId = this.state.groupDetails._id;
        axios.get(backendURI.url+'/progress/gettasks/'+groupId,{headers:headers}).then(res=>{
            this.setState({
                currentTasks: res.data,
                loading: false
            })
        })
    }

    getProgressUpdates = () => {
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        const groupId = this.state.groupDetails._id;
        console.log(groupId)
        axios.get(backendURI.url+'/progress/getprojectprogressupdates/'+groupId,{headers:headers}).then(res=>{
            this.setState({
                progressUpdates: res.data,
                updateLoading: false
            })
        })
    }

    openModal = () => {
        this.setState({ modal: true });
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };
    taskWeightHandler=(event,value) => {
        this.setState({
            taskWeight: value
        })
    }

    onChangeTitle = (e) =>{
        this.setState({
            taskTitle: e.target.value
        })
    }

    onSubmit=(e)=>{
        e.preventDefault();
        if(this.state.taskTitle){


            this.setState({ modal: false });
            confirmAlert({
                title: 'Add New Task',
                message: 'Do you want to Add this Task?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: async () => {

                            this.setState({
                                taskTitleError: false
                            })

                            const object={
                                taskTitle: this.state.taskTitle,
                                taskWeight: this.state.taskWeight,
                                groupId: this.state.groupDetails._id,
                                groupMembers: this.state.groupDetails.groupMembers,
                                totalProgress: 0,
                            }
                            const headers = {
                                'auth-token':getFromStorage('auth-token').token,
                            }
                            axios.post(backendURI.url+'/progress/addtask',object,{headers:headers}).then(res=>{

                            })

                            window.location.reload(false);

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
        else{
            this.setState({
                taskTitleError: true
            })
        }


    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid tasks tasks-background-color">
                    <div className="main-card">
                        <div className="title-div">
                            <h2 className="project-task-title">Progress ( {this.state.groupDetails.groupName}  )</h2>
                        </div>
                        {this.state.currentTasks.length>0 && <Row><TotalProgressCard groupDetails={this.state.groupDetails}/></Row>}

                        {this.state.loading && <div className="spinner-div"><Spinner animation="border" className="sp   inner"/></div>}

                        {this.state.currentTasks.length==0 && !this.state.loading && <h6 className="no-task-text">* No Tasks to Show</h6>}
                        <Row>
                            {this.state.currentTasks.map(item=>{
                                return(
                                    <Col className="task-card-col" key={item._id} lg={3} md={4} xs={12} sm={12}>
                                        <TaskCard task={item} groupDetails={this.state.groupDetails} projectDetails={this.state.projectDetails}/>
                                    </Col>
                                )
                            })}
                            {!this.state.loading && this.state.project.projectState &&
                            <Col lg={3} md={3} xs={12} sm={12}>

                                <BootstrapTooltip title="Add New Task"  placement="bottom">
                                    <Card className="btn-card" onClick={()=>{this.openModal()}}>
                                        <IconContext.Provider value={{ className: 'btn-icon', size:"2em"}}>
                                            <div>
                                                {/*<AiOutlineAppstoreAdd />*/}
                                                <AiOutlineFileAdd />

                                            </div>
                                        </IconContext.Provider><span className="btn-title">Add New Task</span></Card>
                                </BootstrapTooltip>
                            </Col>}
                        </Row>
                    </div>
                    {this.state.progressUpdates.length>0 && (
                        <div className="progress-update-div">
                            <Card className="progress-update-card">
                                <h3 className="title">Progress Update History</h3>
                                {!this.state.updateLoading && <ProgressUpdates taskTitleShow={true} usernameShow={true} progressUpdates={this.state.progressUpdates}/>}

                            </Card>
                        </div>
                    )}
                </div>


                {/*Modal for addd new Task*/}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add New Task</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                                <form onSubmit={this.onSubmit}>

                                    <div className="form-group title-form-group">
                                        <Label for="avatar">Task Title</Label>
                                        <Input type="text" className="form-control" name="task-title" onChange={this.onChangeTitle} placeholder="Eg :- Login Page / User Registrations"/>
                                        {this.state.taskTitleError && !this.state.taskTitle ? <span className="title-error">Please Enter a Task Title</span> : <span>&nbsp;</span>}
                                    </div>

                                    <div className="form-group">
                                        <Label for="avatar">Task Weight ( 1-10 )
                                            <BootstrapTooltip title="Define an approximate weight for the Task. Give higher weight for complex tasks and lower weight for simple tasks. Total Progress will be calculated according to the Task Weights"  placement="right">
                                                <span className="question-span">&#9432;</span>
                                            </BootstrapTooltip>
                                        </Label>

                                        <ThemeProvider theme={muiTheme}>

                                            <Slider defaultValue={1} onChange={this.taskWeightHandler} aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks}/>
                                        </ThemeProvider>
                                    </div>
                                    <div className="form-group">
                                        <Button className="btn btn-info my-4" type="submit" block>Add Task</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Footer/>
            </React.Fragment>
        );
    }
}

export default withRouter(Tasks);