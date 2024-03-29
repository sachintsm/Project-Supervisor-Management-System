import React, { Component } from 'react';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Table, Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Row, Col } from "reactstrap";
import '../../css/shared/Profile.scss';
import { supervisorRequestEmail } from "../shared/emailTemplates"
import Footer from '../shared/Footer';
import Navbar from "../shared/Navbar";
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from '../shared/Snackpop';



const backendURI = require("../shared/BackendURI");


const Pending = React.memo( props =>(

    <tr>
        <td>{props.req.projectYear} {props.req.projectType} {props.req.academicYear}</td>
        <td>{props.req.groupId}</td>
        <td>{props.req.description}</td>
        <td><ButtonToolbar>
        <Button type="submit" value="Mod" className="btn btn-info" onClick={() => props.sendAccept(props.req._id,props.req.groupId,props.req.supFirstName,props.req.supLastName,props.req.projectId)} >Accept</Button> 
        </ButtonToolbar>
        </td>
        <td><ButtonToolbar>
        <Button type="submit" variant="danger"  value="Mod" className="btn btn-info" onClick={() => props.sendReject(props.req._id,props.req.projectId)} >Reject</Button> 
        </ButtonToolbar>
        </td>
    </tr>
    
)
);
const Accept = React.memo( props =>(

    <tr>
        <td>{props.req.projectYear} {props.req.projectType} {props.req.academicYear}</td>
        <td>{props.req.groupId}</td>
        <td>{props.req.description}</td>
    </tr>
)
);
const Reject = React.memo( props =>(

    <tr>
        <td>{props.req.projectYear} {props.req.projectType} {props.req.academicYear}</td>
        <td>{props.req.groupId}</td>
        <td>{props.req.description}</td>
    </tr>
)
);

const NoData = React.memo( props =>(

    <tr>
        <td></td>
        <td>No Requests</td>
        <td></td>
    </tr>
)
);

export default class ViewRequest extends Component {


    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            isSupervisor: '',
            search: '',
            reqS: [],
            emailA:[],
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.reqSendAccept = this.reqSendAccept.bind(this);
        this.reqSendReject = this.reqSendReject.bind(this);
    } 
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    handleSearch = e => {
        this.setState({ search: e.target.value.substr(0, 20) });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        const userData = getFromStorage('auth-id');

        axios.get(backendURI.url + '/users/getSupReq/' + userData.id)
       
            .then(response => {
                console.log(response.data.data);

                this.setState({ 
                    reqS: response.data.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    reqSendAccept(req,group,fName,lName,proId){
        console.log(proId);
        const id = req;
        const userData = getFromStorage('auth-id');
        console.log(userData.id)
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to accept this group?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const obj = {
                            req_id: req,
                            state:'accept',
                            projId:proId,
                            supId:userData.id
                        };
                        console.log(req);
                        axios.post(backendURI.url + "/users/updateReqState/" +id, obj)
                                    .then(res=> {
                                        
                                        console.log(res.data)
                                        if (res.data.state === true) {
                                            this.setState({
                                                snackbaropen: true,
                                                snackbarmsg: res.data.msg,
                                                snackbarcolor: 'success',
                                            })

                                            axios.post(backendURI.url + '/users/getIndexNumbers/' + id,obj)
                                                .then(async(response) => {
                                                    console.log(response.data.data[0]);
                                                    this.setState({
                                                        emailA: response.data.data
                                                    })
                                                    if(this.state.emailA.length === 0){
                                                        console.log('no data');
                                                    }
                                                    else{
                                                        for(var i=0; i<this.state.emailA.length; i++){
                                                            const email = await supervisorRequestEmail(this.state.emailA[i],group, fName, lName)
                                                                axios.post(backendURI.url + '/mail/sendmail', email)
                                                                .then(res => {
                                                                    console.log(res);
                                                                })
                                                        }
                                                    }
                                                    window.location.reload();

                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                })

                                          
                                          
                                        }
                                        else {
                                            this.setState({
                                                snackbaropen: true,
                                                snackbarmsg: res.data.msg,
                                                snackbarcolor: 'error',
                                            })
                                            window.location.reload(false);
                                        }
                                    })
                                    .catch((error) => {
                                    console.log(error);
                                    })
                                    
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        window.location.reload(false);
                    }
                }
            ]
        })
    }
    reqSendReject(req,proId){
        console.log(proId);
        const userData = getFromStorage('auth-id');
        const id = req;
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to reject this group?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const obj = {
                            req_id: req,
                            state:'reject',
                            projId:proId,
                            supId:userData.id
                        };
                        axios.post(backendURI.url + "/users/updateReqState/" +id, obj)
                                    .then(res => {
                                        
                                        console.log(res.data)
                                        if (res.data.state === true) {
                                            this.setState({
                                                snackbaropen: true,
                                                snackbarmsg: res.data.msg,
                                                snackbarcolor: 'success',
                                            })
                                            window.location.reload(false);
                                        }
                                        else {
                                            this.setState({
                                                snackbaropen: true,
                                                snackbarmsg: 'Unable to accept',
                                                snackbarcolor: 'error',
                                            })
                                            window.location.reload(false);
                                        }
                                    })
                                    .catch((error) => {
                                    console.log(error);
                                    })
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        window.location.reload(false);
                    }
                }
            ]
        })
    }
    PendingList() {
        let k = false;
        let filteredReq = this.state.reqS.filter(
            (currentReq) => {
                console.log(currentReq);
                return currentReq.projectType.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

            for(let i =0 ; i<filteredReq.length; i++){
                if(filteredReq[i].state==='read'){
                    k=true;
                }
            }
            if(k === true){
        return filteredReq.map((currentReq, i) => {
            console.log(i);
            if (currentReq.state === 'read' || currentReq.state === 'pending') {
                return <Pending sendAccept={this.reqSendAccept} sendReject={this.reqSendReject} req={currentReq} key={i} />;
            }
        })
    }
    else{
        return <NoData/>
    }

    }
    AcceptList() {
        let k = false;
        let filteredReq = this.state.reqS.filter(
            (currentReq) => {
                console.log(currentReq);
                return currentReq.projectType.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        for(let i =0 ; i<filteredReq.length; i++){
            if(filteredReq[i].state==='accept'){
                k=true;
            }
        }
        if(k === true){
        return filteredReq.map((currentReq, i) => {
            console.log(i);
            if (currentReq.state === 'accept') {
                return <Accept  req={currentReq} key={i} />;
            }
        })
    }else{
        return <NoData/>
    }

    }
    RejectList() {
        let k = false;
        let filteredReq = this.state.reqS.filter(
            (currentReq) => {
                console.log(currentReq);
                return currentReq.projectType.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        for(let i =0 ; i<filteredReq.length; i++){
            if(filteredReq[i].state==='reject'){
                k=true;
            }
        }
        if(k === true){
        return filteredReq.map((currentReq, i) => {
            console.log(i);
            if (currentReq.state === 'reject') {
                return <Reject  req={currentReq} key={i} />;
            }
        })
    }else{
        return <NoData/>
    }

    }

    render() {
        return (
            <React.Fragment >
                <Navbar panel={"supervisor"} />
                    <div className="card container">
                    <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                    />
                        <Col md={12} xs="12" className="main-div">
                            <Tabs className="tab" defaultActiveKey="pending" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                                <Tab eventKey="pending" title="Pending Requests">
                                     <div className="container-fluid" style={{ backgroundColor: "white"}}>
                                        <div className="row">
                                            <div className="col-md-12" style={{ backgroundColor: "white", minHeight: "1000px" }}>
                                                <div className="container">
                                                    <div className="row" style={{ marginTop: "2px" }}>
                                                        <div className="card">
                                                            <div>
                                                                <form>
                                                                    <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                                        <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search  here" onChange={this.handleSearch} />
                                                                    </div>
                                                                </form>
                                                                <div className="container" style={{marginLeft:"24px", width:"95.5%"}}>
                                                                    <Table responsive >
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Project Type</th>
                                                                                <th>Group Number</th>
                                                                                <th>Description</th>
                                                                                <th>Accept</th>
                                                                                <th>Reject</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {this.PendingList()}
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="accept" title="Accepted Requests">
                                    <div className="container-fluid" style={{ backgroundColor: "white"}}>
                                        <div className="row">
                                                <div className="col-md-12" style={{ backgroundColor: "white", minHeight: "1000px" }}>
                                                    <div className="container">
                                                        <div className="row" style={{ marginTop: "2px" }}>
                                                            <div className="card">
                                                                <div>
                                                                    <form>
                                                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                                            <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search  here" onChange={this.handleSearch}/>
                                                                        </div>
                                                                    </form>
                                                                    <div className="container" style={{marginLeft:"24px", width:"95.5%"}}>
                                                                        <Table responsive >
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Project Type</th>
                                                                                    <th>Group Number</th>
                                                                                    <th>Description</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {this.AcceptList()}
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="reject" title="Rejected Requests">
                                    <div className="container-fluid" style={{ backgroundColor: "white"}}>
                                        <div className="row">
                                                <div className="col-md-12" style={{ backgroundColor: "white", minHeight: "1000px" }}>
                                                    <div className="container">
                                                        <div className="row" style={{ marginTop: "2px" }}>
                                                            <div className="card">
                                                                <div>
                                                                    <form>
                                                                        <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                                            <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search  here" onChange={this.handleSearch}/>
                                                                        </div>
                                                                    </form>
                                                                    <div className="container" style={{marginLeft:"24px", width:"95.5%"}}>
                                                                        <Table responsive >
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Project Type</th>
                                                                                    <th>Group Number</th>
                                                                                    <th>Description</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {this.RejectList()}
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Col>
                    </div>
                <Footer/>
            </React.Fragment>
        )
    }
}