import React, {Component} from 'react';
import {Card, Row, Col,} from 'react-bootstrap';
import "../../../css/supervisor/notificaitons/ViewComments.scss"
import SupervisorName from "../PresentationFeedback/SupervisorName";
import {getFromStorage} from "../../../utils/Storage";
import {AiFillDelete} from "react-icons/ai";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";


const backendURI = require('../../shared/BackendURI');

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

class ViewComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: this.props.comment,
            userId: getFromStorage("auth-id").id,
            deleteAlert: false
        }
    }

    deleteComment = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/biweekcomments/deletecomment/'+this.state.comment._id,{headers: headers}).then(res=>{
            this.props.callBack()
        })
    }


    render() {
        return (
            <Card className="view-comments">

                <Row>
                    <Col lg={11} md={11} xs={10} sm={10}>
                        <span className="date-time">{this.state.comment.date} &nbsp;  {this.state.comment.time}</span><br/>
                        <span className="author">Author : <SupervisorName id={this.state.comment.userId}/></span><br/>
                        <span>Comment : {this.state.comment.comment}</span>
                    </Col>
                    <Col lg={1} md={1} xs={2} sm={2} className="delete-btn-col">
                        {this.state.userId===this.state.comment.userId && (

                            <BootstrapTooltip1 title="Delete Comment" placement="bottom">
                                <span className="delete-span" onClick={this.deleteComment}>
                                    <AiFillDelete />
                                </span>
                            </BootstrapTooltip1>
                        )}
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default ViewComments;