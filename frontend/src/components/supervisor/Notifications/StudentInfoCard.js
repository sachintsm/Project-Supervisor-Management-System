import React, {Component} from 'react';
import axios from 'axios';
import {getFromStorage} from "../../../utils/Storage";
import { Card, Col, Row} from 'react-bootstrap';
import "../../../css/students/formgroups/StudentInfoCard.scss"
import "../../../css/supervisor/notificaitons/StudentInfoCard.scss"
import Slider from "@material-ui/core/Slider";
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme} from "@material-ui/core/styles";

const muiTheme = createMuiTheme({
    overrides: {
        MuiSlider: {
            thumb: {
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
const muiTheme2 = createMuiTheme({
    overrides: {
        MuiSlider: {
            thumb: {
                color: "green",
            },
            track: {
                color: 'green'
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
    { value: 1, label: '1', },
    { value: 2, label: '2', },
    { value: 3, label: '3', },
    { value: 4, label: '4', },
    { value: 5, label: '5', },
];

const backendURI = require('../../shared/BackendURI');

class StudentInfoCard extends Component {

    constructor(props) {
        super(props);
        this.state= {
            index: this.props.index,
            exists: this.props.exists,
            existingMarks: this.props.existingMarks,
            loading: true
        }
    }

    componentDidMount() {
        this.getGivenMark()
        this.getStudentName()
    }

    getGivenMark() {
        let arrayIndex=0
        if(this.state.existingMarks){

            this.state.existingMarks.studentList.map((index,key)=>{
                if(index===this.state.index){
                    arrayIndex = key
                }
            })
            this.setState({
                givenMark: this.state.existingMarks.individualMarks[arrayIndex]
            })
        }
    }

    getStudentName = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        axios.get(backendURI.url+'/users/studentDetails/'+this.state.index,{headers: headers}).then(res=>{
            let data = res.data.data
            let name = data.firstName+" "+data.lastName
            this.setState({
                name: name,
                reg: data.regNumber.toUpperCase(),
                image: data.imageName,
                loading: false
            })
        })
    }

    marksHandler = (event, value) => {
        this.props.callBack(this.state.index, value)
    }

    render() {
        console.log(this.state.givenMark)
        return (
            <React.Fragment>

                {!this.state.loading && (
                    <Card className="student-info-card">
                        <Row>
                            <Col>
                                <img src={(backendURI.url+"/users/profileImage/" + this.state.image)} className="image"></img><br />
                            </Col>
                            <Col>
                                <div className="span-item">{this.state.name}  </div>
                                <div>{this.state.index} </div>
                                <div className="span-item">{this.state.reg} </div></Col>
                            <Col>
                                {this.state.exists &&
                                    <ThemeProvider theme={muiTheme2}>
                                        <label>Individual Marks</label>
                                        <Slider defaultValue={this.state.givenMark} disabled aria-labelledby="discrete-slider"
                                                valueLabelDisplay="auto" step={1} min={1} max={5} marks={marks} />


                                    </ThemeProvider>
                                }
                                {!this.state.exists &&
                                    <ThemeProvider theme={muiTheme}>
                                        <label>Individual Marks</label>
                                        {!this.state.exists && <Slider defaultValue={3} onChange={this.marksHandler} aria-labelledby="discrete-slider"
                                                                       valueLabelDisplay="auto" step={1} min={1} max={5} marks={marks} />}

                                    </ThemeProvider>
                                }
                            </Col>
                        </Row>

                    </Card>
                )}
            </React.Fragment>
        );
    }
}

export default StudentInfoCard;