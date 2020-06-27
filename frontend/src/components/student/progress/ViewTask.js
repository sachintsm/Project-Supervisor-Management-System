import React, {Component} from 'react';
import Navbar from "../../shared/Navbar";
import TotalProgressCard from "./TotalProgressCard";
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Footer from "../../shared/Footer";
import TaskCard from "./TaskCard";
import {IconContext} from "react-icons";
import {AiOutlineFileAdd} from "react-icons/ai";
import TaskProgressCard from "./TaskProgressCard";

class ViewTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task: props.location.state.taskDetails,
            groupDetails: props.location.state.groupDetails
        }
    }

    render() {
        return (
            <React.Fragment>
                <Navbar panel={"student"} />
                <div className="container-fluid tasks tasks-background-color">
                    <div className="main-card">
                        {/*<div className="title-div">*/}
                        {/*    <h2 className="project-task-title">Progress ( {this.state.groupDetails.groupName}  )</h2>*/}
                        {/*</div>*/}
                        <Row><TaskProgressCard groupDetails={this.state.groupDetails} taskDetails={this.state.task}/></Row>


                    </div>
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default ViewTask;