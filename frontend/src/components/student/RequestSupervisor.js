import React, {Component} from 'react';
import { Container, Row, Col, Spinner, Table, Modal, Button, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import Footer from '../shared/Footer';
import Navbar from "../shared/Navbar";
import Snackpop from "../shared/Snackpop";
import Modalreq from "./Modalreq";
import '../../css/students/ReqSupervisor.css';

const backendURI = require('../shared/BackendURI');


/*const Modal = ({ handleClose, show, sId }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    console.log(showHideClassName );
    console.log(sId);
  
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
            <p>hello {sId}</p>
          <button onClick={handleClose}>close</button>
        </section>
      </div>
    );
  };*/

  function CenteredModal(props) {
    const { hide,des,desH,re,...rest } = props
    return (
    
      <Modal
        {...rest}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
                
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Project Description
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <form>
            <textarea rows="10" cols="60"value={des} onChange={desH} />
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
                <td>{props.staff.mobile}</td>
                <td><input type="submit" value="Request" className="btn btn-info my-4" /></td>
                <td><ButtonToolbar>
                <Button type="submit" value="Mod" className="btn btn-info my-4" onClick={() => props.send(props.staff._id)} disabled={props.dis} >Req</Button> 
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
            
    ////onClick={() => props.request(props.staff._id)}
            
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
            project: props.location.state.projectDetails,
            snackbaropen: false,
            snackbarmsg: ' ',
            snackbarcolor: '',
            show:false,
            sId:'',
            descript:'',
            dis:false
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.requestSup = this.requestSup.bind(this);
        this.reqSend = this.reqSend.bind(this);
    } 
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    showModal = () => {
        this.setState({show: true});
      };
    
    hideModal = () => {
        this.setState({ show: false,descript:'' });
    };

    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });

        axios.get(backendURI.url + "/users/get")
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
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
            if (currentStaff.isStaff === true && currentStaff.isSupervisor === true && currentStaff.isDeleted === false) {
                return <Staff request={this.requestSup} send={this.reqSend} hiden={this.hideModal} 
                desHan={this.handleChange} descrip={this.state.descript} stat={this.state.show} dis={this.state.dis} staff={currentStaff} key={i} />;
            }
        })

    }
    reqSend(sup){
        console.log(sup);
        const obj = {
            sup_id: sup,
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
    requestSup() {
        const userData = getFromStorage('auth-id')
        this.setState({
            show:false
        })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
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
  /* requestSup(data) {
        const userData = getFromStorage('auth-id')
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const obj = {
                        sup_id: data,
                        stu_id: userData.id,
                        project_id:this.state.project._id
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
                            })
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
              },
              {
                label: 'No',
                onClick: () => {
                    window.location.reload(false);
                }
              }
            ]
          })

    }*/
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
                    {/* <div className="col-md-2" style={{ backgroundColor: "#1c2431" }}>
                        <Sidebar />
                    </div> */}
                    <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                        <div className="container">
                                    <div className="row" style={{ marginTop: "20px" }}>

                                        <div className="card">
                                            <div>
                                                <h3 className="sp_head">List of Supervisors</h3>
                                                <form>
                                                    <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                        <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search ID here" onChange={this.handleSearch}/>
                                                    </div>
                                                </form>
                                                <div>
                                                    <Table hover style={{ marginTop: 20 }} >
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Mobile</th>

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
