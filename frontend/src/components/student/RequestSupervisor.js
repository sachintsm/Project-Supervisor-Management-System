import React, {Component} from 'react';
import { Table, Modal, Button, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import Footer from '../shared/Footer';
import Navbar from "../shared/Navbar";
import Snackpop from "../shared/Snackpop";
import '../../css/students/ReqSupervisor.css';

const backendURI = require('../shared/BackendURI');


function ProjectModal(props) {
    const { hide,re,...rest } = props
    return (
    
        <Modal responsive="true"
            {...rest}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
                    
            <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
                 Projects
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h5></h5>
            <form >
                <textarea className="area" value={re.projectType} readOnly/>
            </form>
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
                <td>{props.staff.email}</td>
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

export default class Profile extends Component {


    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            isSupervisor: '',
            search: '',
            userS: [],
            pro:[],
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
    };

    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });

        axios.get(backendURI.url + '/users/getSup/' + this.state.project._id)
            .then(response => {
                console.log(response.data.data);

                this.setState({ userS: response.data.data });
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
                return <Staff request={this.requestSup} send={this.reqSend} view={this.viewPro} result={this.state.pro} hiden={this.hideModal} hiden2={this.hideModal2} 
                desHan={this.handleChange} descrip={this.state.descript} stat={this.state.show} stat2={this.state.show2} dis={this.state.dis}  staff={currentStaff} key={i} />;
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
    viewPro(sup){
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
            <div className="container-fluid">
                <Snackpop
                msg={this.state.snackbarmsg}
                color={this.state.snackbarcolor}
                time={3000}
                status={this.state.snackbaropen}
                closeAlert={this.closeAlert}
               />
                <div className="row">
                    <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                        <div className="container">
                            <div className="row" style={{ marginTop: "20px" }}>
                                <div className="card">
                                    <div>
                                        <h3 className="sp_head">List of Supervisors</h3>
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

            <Footer />
        </React.Fragment >
        );
        
    }
}
