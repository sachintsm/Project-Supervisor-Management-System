import React, {Component} from 'react';
import { Container, Row, Col, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import Footer from '../shared/Footer';
import Navbar from "../shared/Navbar";
import Snackpop from "../shared/Snackpop";
import '../../css/students/ReqSupervisor.css';

const backendURI = require('../shared/BackendURI');


const Staff = React.memo( props =>(
        
            <tr>
                <td>{props.staff.firstName} {props.staff.lastName}</td>
                <td>{props.staff.email}</td>
                <td>{props.staff.mobile}</td>
                <td><input type="submit" value="Request" className="btn btn-info my-4" onClick={() => props.request(props.staff._id)}/></td>
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
            project: props.location.state.projectDetails,
            snackbaropen: false,
            snackbarmsg: ' ',
            snackbarcolor: '',
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.requestSup = this.requestSup.bind(this);
    } 
    closeAlert = () => {
        this.setState({ snackbaropen: false });
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
    UserList4() {

        let filteredUsers = this.state.userS.filter(
            (currentStaff) => {
                return currentStaff.firstName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredUsers.map((currentStaff, i) => {
            if (currentStaff.isStaff === true && currentStaff.isSupervisor === true && currentStaff.isDeleted === false) {
                return <Staff request={this.requestSup} staff={currentStaff} key={i} />;
            }
        })

    }
    requestSup(data) {
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
