import React, {Component} from 'react';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import '../../css/shared/Profile.css';

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
            isPasswordShown:false

        }
    }
    togglePasswordVisibility = () => {
        const {isPasswordShown} = this.state;
        this.setState({ isPasswordShown: !isPasswordShown});
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
                            alert("Your current password is invalid");
                            }
                            else{
                                alert("Password change successfully");
                            }
                        }
                        )
                        .catch(error => {
                            console.log(error)
                            alert("Your Current Password is invalid");
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
        const {isPasswordShown}= this.state;
    return(
        <div>
            <div className="card" style={{width: 550}}>
                <div className="card-body px-lg-5">
                    <div style={{marginTop: 10}}>
                        <form  onSubmit={this.onReset}>
                            <div className="form-group">
                               <input type={isPasswordShown ? "text":"password"} className="form-control" 
                                 placeholder="Enter Current Password"
                                 value={this.state.currentPw || ""}
                                 onChange={this.onChangeCurrentpw}
                                 required/>
                                 <i className={`fa ${isPasswordShown? "fa-eye-slash": "fa-eye"}  password-icon`}
                                 onClick={this.togglePasswordVisibility}/>
                            </div>
                            <div className="form-group">
                                 <input type={isPasswordShown ? "text":"password"} className="form-control"
                                 placeholder="Enter New password" 
                                 value={this.state.newPw || ""}
                                 onChange={this.onChangeNewpw}
                                 required/>
                                 <i className={`fa ${isPasswordShown? "fa-eye-slash": "fa-eye"}  password-icon`}
                                 onClick={this.togglePasswordVisibility}/>
                            </div>
                            <div className="form-group">
                                 <input type={isPasswordShown ? "text":"password"} className="form-control"
                                 placeholder="Confirm New password" 
                                 value={this.state.conNewPw || ""}
                                 onChange={this.onChangeConfirmNewpw}
                                 required/>
                                 <i className={`fa ${isPasswordShown? "fa-eye-slash": "fa-eye"}  password-icon`}
                                 onClick={this.togglePasswordVisibility}/>
                                 <div style={{fontSize:12,color:"red"}}>{this.state.conError}</div> 
                            </div>
                             <div className="from-group justify-content-center">
                                <input type="submit" value="Reset Password" className="btn btn-primary" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )}
}