import React, {Component} from 'react';
import { Table, Modal, Button, ButtonToolbar } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col } from "reactstrap";
import axios from 'axios';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import Footer from '../shared/Footer';
import Navbar from "../shared/Navbar";
import Snackpop from "../shared/Snackpop";
import '../../css/students/ReqSupervisor.scss';

const backendURI = require('../shared/BackendURI');


function ProjectModal(props) {
    const { hide,re,...rest } = props
    return (
    
        <Modal responsive="true"
            {...rest}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal"
        >
                    
            <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
                 Projects
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive >
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Type</th>
                                    <th>Academic Year</th>
                                    <th>Projects</th>
                                </tr>
                            </thead>
                            <tbody>
                            {re.map((result) => {
                                return (<tr key={result._id}>
                                    <td>{result.projYear}</td>
                                    <td>{result.projectType}</td>
                                    <td>{result.academicYear}</td>
                                    <td>{result.noProjects}</td>
                                    </tr> 
                                    )
                            })}
                            </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hide}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
  }

function CenteredModal(props) {
    const { hide,des,desH,re,...rest } = props
    return (
    
        <Modal responsive="true"
            {...rest}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal"
        >
                    
            <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
                Add Project Description
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h5></h5>
            <form >
                <textarea className="area" value={des} onChange={desH} />
            </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={re} disabled={!des}>Send</Button>
                <Button onClick={hide}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
  }
  

const Staff = React.memo( props =>(

        
            <tr>
                <td>{props.staff.firstName} {props.staff.lastName}</td>
                <td><a href="#" onClick={() => props.view(props.staff._id,props.result)}>{props.staff.email}</a></td>
                <td><ButtonToolbar>
                <Button type="submit" value="Mod" className="btn btn-info" onClick={() => props.view(props.staff._id)} >Projects</Button> 
                <ProjectModal
                show={props.stat2}
                hide={props.hiden2}
                re={props.result}
                />
                </ButtonToolbar>
                </td>
                <td><ButtonToolbar>
                <Button type="submit" value="Mod" className="btn btn-info" onClick={() => props.send(props.staff._id)} >Request</Button> 
                <CenteredModal
                show={props.stat}
                hide={props.hiden}
                des={props.descrip}
                desH={props.desHan}
                re={props.request}
                />
                </ButtonToolbar>
                </td>
            </tr>
            
       )
);
const ReqState = React.memo( props =>(

        
    <tr>
        <td>{props.req.supFirstName}{" "}{props.req.supLastName}</td>
        <td>{props.req.supEmail}</td>
        {(props.req.state === "pending")?
            (<td>{props.req.state}</td>):
                ((props.req.state === "read")?
                    (<td >Pending</td>):
                        ((props.req.state === "accept")?
                            (<td style={{ color: "green"}}>Accepted</td>):
                                (<td style={{ color: "red"}}>Declined</td>)
                        )
                )
        }
    </tr>
    
)
);

export default class Profile extends Component {


    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            isSupervisor: '',
            search: '',
            userS: [],
            pro:[],
            reqSt:[],
            group:'',
            project: props.location.state.projectDetails,
            snackbaropen: false,
            snackbarmsg: ' ',
            snackbarcolor: '',
            show:false,
            show2:false,
            sId:'',
            descript:'',
            dis:false
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.requestSup = this.requestSup.bind(this);
        this.reqSend = this.reqSend.bind(this);
        this.viewPro = this.viewPro.bind(this);
    } 
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    showModal = () => {
        this.setState({show: true});
    };
    showModal2 = () => {
        this.setState({show2: true});
    };
    
    hideModal = () => {
        this.setState({ show: false,descript:'' });
    };
    hideModal2 = () => {
        this.setState({ show2: false});
        this.props.history.push('/studenthome/viewproject/requestsupervisor');
    };

    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        const userData = getFromStorage('auth-id')
       
       
        axios.get(backendURI.url + '/users/getSup/' + this.state.project._id)
            .then(response => {
                console.log(response.data.data);

                this.setState({ userS: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            })
        
            axios.get(backendURI.url + '/users/getReqStatus/' + userData.id)
            .then(response => {
                console.log(response.data.data);
                const group= response.data.data;
                console.log(group);
                this.setState({ group: response.data.data })
                const obj = {
                    groID: this.state.group
                };
                axios.post(backendURI.url + '/users/getStatus/' + this.state.project._id,obj)
                .then(response => {
                    console.log(response.data.data);
                    this.setState({ reqSt: response.data.data })
                })
                 .catch(function (error) {
                        console.log(error);
                 })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    handleSearch = e => {
        this.setState({ search: e.target.value.substr(0, 20) });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    handleChange = e =>{
        this.setState({
            descript: e.target.value
        })
    }
    UserList4() {
        
        let filteredUsers = this.state.userS.filter(
            (currentStaff) => {
                console.log(currentStaff.firstName);
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
           // if (currentStaff.isStaff === true && currentStaff.isSupervisor === true && currentStaff.isDeleted === false) {
                return <Staff request={this.requestSup} send={this.reqSend} view={this.viewPro} result={this.state.pro} 
                hiden={this.hideModal} hiden2={this.hideModal2} desHan={this.handleChange} descrip={this.state.descript} 
                stat={this.state.show} stat2={this.state.show2} dis={this.state.dis}  staff={currentStaff} key={i} />;
           // }
        })

    }
    StatusList4(){
        
      
            console.log(this.state.reqSt);
            let filteredStatus = this.state.reqSt.filter(
                (currentStatus) => {
                    console.log(currentStatus.state);
                    return currentStatus. projectType.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
                }
            );
    
            return filteredStatus.map((currentStatus, i) => {
               // if (currentStaff.isStaff === true && currentStaff.isSupervisor === true && currentStaff.isDeleted === false) {
                    return <ReqState  req={currentStatus} key={i} />;
               // }
            })
    }
    reqSend(sup){
        const userData = getFromStorage('auth-id')
        console.log(sup);
        console.log(userData.id);
        const obj = {
            sup_id: sup,
            stu_id:userData.id,
            project_id:this.state.project._id,
        };
        axios.post(backendURI.url + "/users/check" , obj)
                    .then(res => {
                        
                        console.log(res.data)
                        if(res.data.state==true){
                            this.setState({
                                sId:sup
                            })
                            this.showModal();
                        }
                        else{
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg:res.data.msg,
                                snackbarcolor: 'error',
                            })
                            
                        }
                    })
                    .catch((error) => {
                    console.log(error);
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg:'Something went wrong',
                        snackbarcolor: 'error',
                    })
                    })
        
    }
    viewPro(sup,k){
        const userData = getFromStorage('auth-id')
        console.log(sup);
        
        axios.get(backendURI.url + "/users/getSupPro/"+sup)
                    .then(res => {
                        console.log(res.data.data);
                        if(res.data.state==true){
                            this.setState({
                                pro:res.data.data
                            })
                            this.showModal2();
                            
                        }
                        else{
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg:res.data.msg,
                                snackbarcolor: 'error',
                            })
                            
                        }
                            
                    })
                    .catch((error) => {
                    console.log(error);
                    })
               return <ProjectModal
               show={ this.showModal2}
               hide={this.hideModal2}
               re={k}
               />    
        
    }
    requestSup() {
        const userData = getFromStorage('auth-id')
        this.setState({
            show:false
        })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to request this supervisor?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const obj = {
                        sup_id: this.state.sId,
                        stu_id: userData.id,
                        project_id:this.state.project._id,
                        descript:this.state.descript
                    };
                    console.log(obj);
                    axios.post(backendURI.url + "/users/add" , obj)
                    .then(res => {
                        
                        console.log(res.data)
                        if(res.data.state==true){
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg: res.data.msg,
                                snackbarcolor: 'success',
                                descript:'',
                                
                            })
                        }
                        else{
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg:res.data.msg,
                                snackbarcolor: 'error',
                                descript:''
                            })
                            
                        }
                    })
                    .catch((error) => {
                    console.log(error);
                    this.setState({
                        snackbaropen: true,
                        snackbarmsg:'Something went wrong',
                        snackbarcolor: 'error',
                        descript:''
                    })
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
    render(){
       
        return(
            <React.Fragment >
            <Navbar panel={"student"} />
            <div className="card container">
                <Snackpop
                msg={this.state.snackbarmsg}
                color={this.state.snackbarcolor}
                time={3000}
                status={this.state.snackbaropen}
                closeAlert={this.closeAlert}
               />
               <Col md={12} xs="12" className="main-div">
                    <Tabs className="tab" defaultActiveKey="list" id="uncontrolled-tab-example" style={{ marginTop: "40px" }}>
                        <Tab eventKey="list" title="Request Supervisor">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                                        <div className="container">
                                            <div className="row" style={{ marginTop: "20px" }}>
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
                                                                                <th>Name</th>
                                                                                <th>Email</th>
                                                                                <th>View Projects</th>
                                                                                <th>Request</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {this.UserList4()}
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
                        <Tab eventKey="status" title="Request Status">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                                        <div className="container">
                                            <div className="row" style={{ marginTop: "20px" }}>
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
                                                                                <th>Name</th>
                                                                                <th>Email</th>
                                                                                <th>Status</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {this.StatusList4()}
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

            <Footer />
        </React.Fragment >
        );
        
    }
}
