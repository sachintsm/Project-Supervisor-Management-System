import React, {Component} from 'react';
import Navbar from "../../shared/Navbar";
import {Button, Card, Col, Container, FormControl, Row} from "react-bootstrap";
import Footer from "../../shared/Footer";
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import "../../../css/supervisor/notificaitons/IndividualMarks.scss"
import StudentInfoCard from "./StudentInfoCard";
import BackendURI from "../../shared/BackendURI";
import Snackpop from "../../shared/Snackpop";
import {confirmAlert} from "react-confirm-alert";

const backendURI = require('../../shared/BackendURI');

//default Individual Mark
const defaultMark = 3

class IndividualMarks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            biWeekId: this.props.match.params.id,
            userId: getFromStorage('auth-id').id,
            biWeekDetails: this.props.history.location.state.biWeekDetails,
            loading1: true,
            loading2: true,
            loading3: true,
            successAlert: false,
        }
    }

    componentDidMount() {

        this.getProjectDetails()
        this.getGroupDetails()
        this.getIndividualMarks()
        window.scrollTo(0, 0)
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
                loading1:false,
                studentList: res.data.data.groupMembers,
            })

            let individualMarks = []
            res.data.data.groupMembers.map(item=> {
                individualMarks.push(defaultMark)
            })
            this.setState({
                individualMarks: individualMarks
            })

        })
    }

    getIndividualMarks = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/biweeksubmissions/individualmarks/'+this.state.biWeekId,{headers: headers}).then(res=>{
            console.log(res.data)
            if(res.data){
                this.setState({
                    exists: true,
                    existingMarks: res.data,
                    loading3: false
                })
            }
            else{
                this.setState({
                    exists: false,
                    loading3: false
                })
            }
        })
    }

    getMarks = (callBackIndex,callBackMarks) => {

        let arrayIndex = 0

        this.state.studentList.map((index,key)=>{
            if(index===callBackIndex){
                arrayIndex = key
            }
        })

        let individualMarks = this.state.individualMarks
        individualMarks[arrayIndex] = callBackMarks

        this.setState({
            individualMarks: individualMarks
        })

    }

    submitReport = () => {
        const data = {
            biweekId: this.state.biWeekId,
            biweekLinkId: this.state.biWeekDetails._id,
            studentList: this.state.studentList,
            individualMarks: this.state.individualMarks
        }

        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        confirmAlert({
            title: 'Biweek Marks',
            message: 'Are you sure to submit this marks?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {

                        if(!this.state.exists){
                            // submit marks into database
                            axios.post(BackendURI.url + "/biweeksubmissions/individualmarks", data, { headers: headers }).then(res => {
                                this.setState({
                                    successAlert: true
                                })

                            })
                        }


                        let item = this.state.biWeekDetails

                        item.supervisors.map((supervisor, index) => {
                            if (supervisor === this.state.userId) {
                                item.status[index] = "Accepted"
                            }
                        })


                        axios.patch(backendURI.url + "/biweeksubmissions/updateRequest/" + item._id, item, { headers: headers }).then(res => {

                        })

                        this.props.history.goBack();
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


    closeAlert = () => {
        this.setState({
            successAlert: false,
        });
    };

    render() {
        let students =  !this.state.loading1 && !this.state.loading3 && this.state.groupDetails.groupMembers.map(index=>{
            return <StudentInfoCard callBack={this.getMarks} key={index} index={index} exists={this.state.exists} existingMarks={this.state.existingMarks}/>
        })

        return (
            <React.Fragment>

                <Snackpop
                    msg={'Success'}
                    color={'success'}
                    time={3000}
                    status={this.state.successAlert}
                    closeAlert={this.closeAlert}
                />

                <Navbar panel={"supervisor"}/>
                <div className="individual-marks">
                    <Container className="div-container">
                        <div className="title-div">
                            {!this.state.loading2 && <h4>{this.state.projectDetails.projectYear} {this.state.projectDetails.projectType} {this.state.projectDetails.academicYear}</h4>}
                            {!this.state.loading1 && <h4>{this.state.groupDetails.groupName} ( Group {this.state.groupDetails.groupId} )</h4>}
                            <h5>BiWeekly Report #{this.state.biWeekDetails.biweeklyNumber} Individual Marks</h5>
                        </div>

                        {!this.state.loading3 && this.state.exists && <h6 className="marks-given-text">Note: Marks are Already Given</h6>}
                        {students}
                        <div className="btn-div">
                            {!this.state.loading && this.state.exists && <Button className="btn btn-info submit-btn mt-1" onClick={() => this.submitReport()}>Accept Report</Button>}
                            {!this.state.loading && !this.state.exists && <Button className="btn btn-info submit-btn mt-1" onClick={() => this.submitReport()}>Submit Report</Button>}

                        </div>

                    </Container>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default IndividualMarks;