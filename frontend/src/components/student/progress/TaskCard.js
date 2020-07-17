import React, {Component} from 'react';
import { Card, } from 'react-bootstrap';
import "../../../css/students/progress/TaskCard.scss"
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import Slider from '@material-ui/core/Slider';
import { withRouter } from "react-router-dom";
import {createMuiTheme, makeStyles} from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip';
import { AiFillDelete } from 'react-icons/ai';
import { confirmAlert } from 'react-confirm-alert';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";

const backendURI = require('../../shared/BackendURI');
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
const useStylesBootstrap1 = makeStyles((theme) => ({
    arrow: {
        color: "white",
    },
    tooltip: {
        backgroundColor: "white",
        fontSize: "14px",
        color: 'red'
    },
}));
function BootstrapTooltip1(props) {
    const classes = useStylesBootstrap1();
    return <Tooltip arrow classes={classes} {...props} />;
}

const useStylesBootstrap2 = makeStyles((theme) => ({
    arrow: {
        color: "#555",
    },
    tooltip: {
        backgroundColor: "#555",
        fontSize: "14px",
        color: 'white'
    },
}));
function BootstrapTooltip2(props) {
    const classes = useStylesBootstrap2();

    return <Tooltip arrow classes={classes} {...props} />;
}


class TaskCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.task,
            groupDetails: this.props.groupDetails,
            projectDetails: this.props.projectDetails,
            userLevel: localStorage.getItem("user-level")
        }
    }

    componentDidMount() {
        this.setState({
            totalProgress: this.state.task.totalProgress,
            viewTitle: "View "+this.state.task.taskTitle,
            deleteTitle: "Delete "+this.state.task.taskTitle
        })
    }

    editTask = () => {
        this.props.history.push('/studenthome/viewproject/progresstasks/viewtask', { taskId: this.state.task._id ,groupDetails: this.state.groupDetails, projectDetails:this.state.projectDetails})
    }

    deleteTask = (e) =>{
        e.stopPropagation();

        confirmAlert({
            title: "Delete Task",
            message: 'Do you want to '+this.state.deleteTitle+" ?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const headers = {
                            'auth-token':getFromStorage('auth-token').token,
                        }
                        axios.delete(backendURI.url+'/progress/deletetask/'+this.state.task._id,{headers:headers}).then(res=>{
                            console.log(res)
                        })

                        window.location.reload(false);

                    }
                },
                {
                    label: 'No',
                    onClick: () => {

                    }
                },
            ]
        })
    }

    render() {
        return (
            <div>

                <BootstrapTooltip2 title={this.state.viewTitle}  placement="bottom">
                    <Card className="task-card" onClick={this.editTask}>
                        {this.state.projectDetails.projectState &&
                            <div>
                                <Card.Header className="card-header">{this.state.task.taskTitle} ({this.state.task.totalProgress}%)
                                    {this.state.userLevel === "student" && (
                                        <BootstrapTooltip1 title={this.state.deleteTitle}  placement="bottom">
                                            <span className="delete-span" onMouseEnter={()=>{this.setState({viewTitle: "",})}} onMouseLeave={()=>this.setState({viewTitle: "View "+this.state.task.taskTitle,})} onClick={this.deleteTask}><AiFillDelete/></span>
                                        </BootstrapTooltip1>
                                    )}
                                </Card.Header>
                            </div>
                        }
                        {!this.state.projectDetails.projectState &&
                        <Card.Header className="card-header">{this.state.task.taskTitle} ({this.state.task.totalProgress}%) </Card.Header>
                        }
                        <Card.Body className="card-body">
                            <div className="circular-progress-div">


                                {this.state.task.totalProgress<=33 && <CircularProgressbar styles={buildStyles({textColor: '#DC3545',pathColor: '#DC3545',})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}
                                {this.state.task.totalProgress<=66 && this.state.task.totalProgress>33  && <CircularProgressbar styles={buildStyles({textColor: '#FFC107',pathColor: '#FFC107',})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}
                                {this.state.task.totalProgress<=100 && this.state.task.totalProgress>66  && <CircularProgressbar styles={buildStyles({textColor: '#28A745',pathColor: '#28A745',})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}

                           </div>
                            <span>Task Weight</span>
                            <Card.Text>
                                <Slider disabled defaultValue={this.state.task.taskWeight} aria-labelledby="non-linear-slider"
                                        valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks} />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </BootstrapTooltip2>
            </div>

        );

    }
}

export default withRouter(TaskCard);