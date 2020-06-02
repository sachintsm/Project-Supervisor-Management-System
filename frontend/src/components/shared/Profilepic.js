import React, {Component}  from 'react';
import { verifyAuth } from "../../utils/Authentication";
import '../../css/shared/Profile.css';
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from './Snackpop';


const backendURI = require("./BackendURI");
export default class Profilepic extends Component {

    async componentDidMount(){
        const authState = await verifyAuth();
        const userData = getFromStorage('auth-id')
        this.setState({ authState: authState });
      
        if (!authState){
          this.props.history.push("/");
        }
        
        else{
            axios.get(backendURI.url + '/users/get/' + userData.id)
            .then(response => {
                console.log(response);
                console.log(response.data.data[0].imageName);
                this.setState({
                    mulImage:response.data.data[0].imageName,
                    username:response.data.data[0].firstName
                })
            })
            .catch(error => {
                console.log(error)
            })
        }

      }
    constructor(props) {
        super(props);
        this.onChangeP = this.onChangeP.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.state ={
            form:{
            multerImage:'',
            },
            username:'',
            mulImage:'',
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',
        }
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };


    onFormSubmit(e){
        e.preventDefault();
        if(!this.state.form.file){
            this.setState({
                snackbaropen: true,
                snackbarmsg: "Please select a picture.",
                snackbarcolor: 'error',
            })
        }
        else{
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            const userData = getFromStorage('auth-id')
                            let formData= new FormData();
                            formData.append('profileImage', this.state.form.file);
                            console.log( formData);
                            axios.post(backendURI.url +'/users/uploadmulter/'+ userData.id , formData)
                                .then((response) => {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: response.data.msg,
                                        snackbarcolor: 'success',
                                    })
                                    console.log(response);
                                }).catch((error) => {
                                    this.setState({
                                        snackbaropen: true,
                                        snackbarmsg: error.data.msg,
                                        snackbarcolor: 'error',
                                    })
                                    });
                            window.location.reload(false);
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
    }
    onChangeP(e) {
        console.log(e.target.files[0].name);
        this.setState({
            multerImage:e.target.files[0].name
        });
        this.setState( ({
            form: {
              
              file:e.target.files[0]
            }
          }))
    }
    render() {
        return (
                <div>
                <Snackpop
                        msg={this.state.snackbarmsg}
                        color={this.state.snackbarcolor}
                        time={3000}
                        status={this.state.snackbaropen}
                        closeAlert={this.closeAlert}
                />
                    <div className="card testimonial-card"  style={{backgroundColor: '#263238'}}>
                    <div className="card-body1">
                        <img src={("http://localhost:4000/users/profileImage/"+this.state.mulImage)} className="avatar" alt="" />
                        <br></br>
                        <h3 className="card-title" style={{ color: 'white' }}>{this.state.username}</h3>
                        </div>
                    </div>
                        <div className="card testimonial-card1">
                        <div className="card-body1">
                            <div className="form-group1">
                                <form onSubmit={this.onFormSubmit}>
                                    <input type="file" className="myImage" name="Image" onChange= {this.onChangeP} />
                                    <button type="submit"  className="btn btn-info my-4">Upload</button>
                                </form>
                            </div>
                        </div>
                        </div>
                    
                </div>
        )
    }
}

