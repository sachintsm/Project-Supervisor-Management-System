import React, {Component} from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import {Input,Label, Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import "../../../css/students/progress/TaskCard.scss"
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import Slider from '@material-ui/core/Slider';
import { withRouter } from "react-router-dom";
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from "@material-ui/core/styles";

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

class TaskCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.task,
            groupDetails: this.props.groupDetails
        }
    }

    componentDidMount() {
        this.setState({
            totalProgress: this.state.task.totalProgress
        })
    }

    editTask = () => {
        this.props.history.push('/studenthome/viewproject/progresstasks/viewtask', { taskDetails: this.state.task ,groupDetails: this.state.groupDetails})
    }

    taskWeightHandler = (event,value) =>{
        this.setState({taskWeight: value})
    }

    progressHandler = (event,value) => {
        this.setState({totalProgress: value})
    }

    onChangeDescription = (e) => {

        this.setState({ description: e.target.value  })
    }

    render() {


        return (
            <Card className="task-card" onClick={this.editTask}>
                <Card.Header className="card-header">{this.state.task.taskTitle} ({this.state.task.totalProgress}%)</Card.Header>
                <Card.Body className="card-body">
                    <div className="circular-progress-div">
                        {this.state.task.totalProgress<51 && <CircularProgressbar styles={buildStyles({textColor: `rgb(150,${this.state.task.totalProgress*(255/50) -100},0)`,pathColor: `rgb(255,${this.state.task.totalProgress*(255/50)},0)`,})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}
                        {this.state.task.totalProgress>50 && <CircularProgressbar styles={buildStyles({textColor: `rgb(${255 - ((this.state.task.totalProgress-50)*(255/50)) -100},150,0)` ,pathColor: `rgb(${255 - ((this.state.task.totalProgress-50)*(255/50))},255,0)`,})}   value={this.state.task.totalProgress} text={`${this.state.task.totalProgress}%`} />}
                    </div>
                    <span>Task Weight</span>
                    <Card.Text>
                        <Slider disabled defaultValue={this.state.task.taskWeight} aria-labelledby="non-linear-slider"
                                valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks} />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
            // if the task is in edit state
            // return (
            //     <Card className="task-card" onClick={this.editTask}>
            //         <Card.Header className="card-header">Update Task</Card.Header>
            //         <Card.Body className="card-body">
            //             <Card.Text>
            //                 {this.state.task.totalProgress > this.state.totalProgress &&
            //                     (<div><span>Change Task Progress </span><span style={{fontWeight:"bold"}}>({this.state.totalProgress}%)</span> <span style={{color:"red"}}>(-{this.state.task.totalProgress-this.state.totalProgress}%)</span> </div>)}
            //                 {this.state.task.totalProgress < this.state.totalProgress &&
            //                     (<div><span>Change Task Progress </span><span style={{fontWeight:"bold"}}>({this.state.totalProgress}%)</span><span style={{color:"#27d600"}}> (+{this.state.totalProgress-this.state.task.totalProgress}%)</span></div>)}
            //                 {this.state.task.totalProgress === this.state.totalProgress && <div><span>Change Task Progress </span><span style={{fontWeight:"bold"}}>({this.state.totalProgress}%)</span> </div>}
            //
            //                 <ThemeProvider theme={muiTheme}>
            //                     <Slider defaultValue={this.state.task.totalProgress} onChange={this.progressHandler} aria-labelledby="continuous-slider"
            //                             valueLabelDisplay="auto" step={1} min={0} max={100} />
            //                 </ThemeProvider>
            //
            //                 <span>Change Task Weight</span>
            //                 <ThemeProvider theme={muiTheme}>
            //                     <Slider defaultValue={this.state.task.taskWeight} onChange={this.taskWeightHandler} aria-labelledby="discrete-slider"
            //                             valueLabelDisplay="auto" step={1} min={1} max={10} marks={marks}/>
            //                 </ThemeProvider>
            //
            //                 <label>Comment</label>
            //                 <Input type="text" className="form-control" name="Description" onChange={this.onChangeDescription} />
            //
            //                 <Row>
            //
            //                 </Row>
            //             </Card.Text>
            //         </Card.Body>
            //     </Card>
            // );

    }
}

export default withRouter(TaskCard);