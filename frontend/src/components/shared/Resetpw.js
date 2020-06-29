import React, {Component} from 'react';
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import { Row, Col } from "reactstrap";
import { confirmAlert } from 'react-confirm-alert';
import '../../css/shared/Profile.css';
import Snackpop from './Snackpop';

const backendURI = require("./BackendURI");

export default class Resetpw extends Component {

    constructor(props){
        super(props);
        this.onChangeCurrentpw= this.onChangeCurrentpw.bind(this);
        this.onChangeNewpw= this.onChangeNewpw.bind(this);
        this.onChangeConfirmNewpw= this.onChangeConfirmNewpw.bind(this);
        this.onReset = this.onReset.bind(this);


        this.state ={
            currentPw:'',
            newtPw:'',
            conNewPw:'',
            conError:'',
            isCuShown:false,
            isNewShown:false,
            isConShown:false,
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',

        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    togglePasswordVisibilityCu = () => {
        const {isCuShown} = this.state;
        this.setState({ isCuShown: !isCuShown});
    }
    togglePasswordVisibilityNew = () => {
        const {isNewShown} = this.state;
        this.setState({ isNewShown: !isNewShown});
    }
    togglePasswordVisibilityCon = () =>{
        const {isConShown} = this.state;
        this.setState({ isConShown: !isConShown});
    }
    onChangeCurrentpw(e){
        this.setState({
            currentPw :e.target.value
        });
       
    }
    onChangeNewpw(e){
        this.setState({
            newPw :e.target.value
        });
       
    }
    onChangeConfirmNewpw(e){
        this.setState({
            conNewPw :e.target.value
        });
    }
    validate = () => {
        let conError= "";
        if ( this.state.newPw !== this.state.conNewPw){
            conError = 'Do not match password';
        }

        if (conError){
            this.setState({conError});
            return false;
        }
        return true;
    }
    onReset(e){
        e.preventDefault();
        const userData = getFromStorage('auth-id');
        console.log(userData.id);
        const isValid = this.validate();
        if(isValid){
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => {
                       
                        const obj = {
                            currentPw: this.state.currentPw,
                            newPw: this.state.newPw
                         };
                        console.log(obj);
                        this.setState({
                            conError:'',
                            newPw:'',
                            currentPw:'',
                            conNewPw:''
                        });
                        axios.post(backendURI.url + '/users/reset/'+userData.id, obj)
                        .then(res => {
                            console.log(res.data);
                            if(! res.data.state){
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: 'Your current password is invalid',
                                    snackbarcolor: 'error',
                                })
                            }
                            else{
                                this.setState({
                                    snackbaropen: true,
                                    snackbarmsg: 'Password change successfully',
                                    snackbarcolor: 'success',
                                })
                            }
                        }
                        )
                        .catch(error => {
                            console.log(error)
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg: 'Your current password is invalid',
                                snackbarcolor: 'error',
                            })
                        })
                      
                    }
                  },
                  {
                    label: 'No',
                    onClick: () => {
                        this.setState({
                            newPw:'',
                            currentPw:'',
                            conNewPw:''
                        });
                    }
                  }
                ]
              })
        
        }
       
    }


render() {
        const {isCuShown}= this.state;
        const {isNewShown}= this.state;
        const {isConShown}= this.state;
    return(
        <div>
            <Snackpop
                msg={this.state.snackbarmsg}
                color={this.state.snackbarcolor}
                time={3000}
                status={this.state.snackbaropen}
                closeAlert={this.closeAlert}
             />
            <div className="card2">
                <div className="card-body2 px-lg-5">
                    <div style={{marginTop: 10}}>
                        <form  onSubmit={this.onReset}>
                        <Row>
                        <Col md={6} xs="12">
                            <div className="input-container">
                               <input type={isCuShown ? "text":"password"} className="form-control" 
                                 placeholder="Enter Current Password"
                                 value={this.state.currentPw || ""}
                                 onChange={this.onChangeCurrentpw}
                                 required/>
                                 <i className={`fa ${isCuShown? "fa-eye-slash": "fa-eye"}  password-icon`}
                                 onClick={this.togglePasswordVisibilityCu}/>
                            </div></Col></Row><br></br>
                            <Row>
                        <Col md={6} xs="12">
                            <div className="input-container" style={{marginTop: 7}}>
                                 <input type={isNewShown ? "text":"password"} className="form-control"
                                 placeholder="Enter New password" 
                                 value={this.state.newPw || ""}
                                 onChange={this.onChangeNewpw}
                                 required/>
                                 <i className={`fa ${isNewShown? "fa-eye-slash": "fa-eye"}  password-icon`}
                                 onClick={this.togglePasswordVisibilityNew}/>
                            </div></Col></Row><br></br>
                            <Row>
                            <Col md={6} xs="12">
                            <div className="input-container" style={{marginTop: 7}}>
                                 <input type={isConShown? "text":"password"} className="form-control"
                                 placeholder="Confirm New password" 
                                 value={this.state.conNewPw || ""}
                                 onChange={this.onChangeConfirmNewpw}
                                 required/>
                                 <i className={`fa ${isConShown? "fa-eye-slash": "fa-eye"}  password-icon`}
                                 onClick={this.togglePasswordVisibilityCon}/>
                                 <div style={{fontSize:12,color:"red"}}>{this.state.conError}</div> 
                            </div></Col></Row>
                            
                             <div className="from-group justify-content-center">
                                <input type="submit" value="Change" className="btn btn-info my-4" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )}
}