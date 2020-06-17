import React, {Component} from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import "../../../css/students/progress/TaskCard.scss"
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import Slider from '@material-ui/core/Slider';
import {ThemeProvider} from "@material-ui/styles";

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

class TaskCard extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.task)
        this.state = {
            task: this.props.task
        }
        // console.log(this.task)
    }


    render() {
        return (
            <Card className="task-card">
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
    }
}

export default TaskCard;