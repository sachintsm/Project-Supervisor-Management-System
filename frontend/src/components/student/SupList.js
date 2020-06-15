import React, {Component} from 'react';
import { Container, Row, Col, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from "../shared/Snackpop";
import '../../css/students/ReqSupervisor.css';

const backendURI = require('../shared/BackendURI');


export default class Profile extends Component {


    constructor(props) {
        super(props);

        this.state = {
            user:this.props.staff,
            snackbaropen: false,
            snackbarmsg: ' ',
            snackbarcolor: '',
        }

        this.onChange = this.onChange.bind(this);
        this.requestSup=this.requestSup.bind(this);
        
    } 
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };

    
    

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
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
                        stu_id: userData.id
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
                    .catch((error) => {console.log(error)})
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
            <div>
            <Snackpop
                msg={this.state.snackbarmsg}
                color={this.state.snackbarcolor}
                time={3000}
                status={this.state.snackbaropen}
                closeAlert={this.closeAlert}
                />
            </div>
           
            <tr>
                <td>{this.state.user.firstName} {this.state.user.lastName}</td>
                <td>{this.state.user.email}</td>
                <td>{this.state.user.mobile}</td>
                <td><input type="submit" value="Request" className="btn btn-info my-4" onClick={() => this.requestSup(this.state.user.staff._id)}/></td>
            </tr>
            
        </React.Fragment >
        );
        
    }
}
