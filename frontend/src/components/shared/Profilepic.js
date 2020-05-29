import React, {Component}  from 'react';
import { verifyAuth } from "../../utils/Authentication";
import '../../css/shared/Profile.css';
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';


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
                    multerImage:response.data.data[0].imageName,
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
            username:''  
        }
    }



    onFormSubmit(e){
        e.preventDefault();
        const userData = getFromStorage('auth-id')
        let formData= new FormData();
        formData.append('profileImage', this.state.form.file);
       console.log( formData);
        axios.post(backendURI.url +'/users/uploadmulter/'+ userData.id , formData)
            .then((response) => {
               console.log(response);
            }).catch((error) => {
        });
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
        <div className="card testimonial-card" style={{width: 900,height:250}}>
        <div className="card-up indigo lighten-1"></div>
            <img src={("http://localhost:4000/users/profileImage/"+this.state.multerImage)} className="rounded-circle"
            alt="" style={{width: 150}}/>
            <div className="card-body" style={{height:200}}>
                <h4 className="card-title">{this.state.username}</h4>
                <div className="form-group">
                    <form onSubmit={this.onFormSubmit}>
                        <input type="file" className="myImage" name="Image" onChange= {this.onChangeP} />
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
        )
    }
}
