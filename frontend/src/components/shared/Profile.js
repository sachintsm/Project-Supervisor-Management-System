import React, {Component} from 'react';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
//import DatePicker from 'react-datepicker';
//import "react-datepicker/dist/react-datepicker.css";
import '../../css/shared/Profile.css';
import Navbar from './Navbar';
import Profilepic from './Profilepic';
import Resetpw from './Resetpw';


const backendURI = require("./BackendURI");

export default class Profile extends Component {
    
      async componentDidMount(){
        const authState = await verifyAuth();
        const userData = getFromStorage('auth-id')
     //  console.log(userData.id)
        this.setState({ authState: authState });
      
        if (!authState){
          this.props.history.push("/");
        }
        
        else{
            axios.get(backendURI.url + '/users/get/' + userData.id)
            .then(response => {
                console.log(response);
                console.log(response.data);
                console.log(response.data.data[0].email);
               

                this.setState({
                    users: response.data.data,
                    firstName:response.data.data[0].lastName,
                    lastName: response.data.data[0].lastName,
                    email: response.data.data[0].email,
                    nic: response.data.data[0].nic,
                    mobile: response.data.data[0].mobile,
                    birthday: response.data.data[0].birthday
                })
            })
            .catch(error => {
                console.log(error)
            })
         }

      }
      constructor(props){
        super(props);
        this.onChangeFirstName= this.onChangeFirstName.bind(this);
        this.onChangeLastName= this.onChangeLastName.bind(this);
        this.onChangeEmail= this.onChangeEmail.bind(this);
        this.onChangeNic= this.onChangeNic.bind(this);
        this.onChangeMobile= this.onChangeMobile.bind(this);
        this.onChangeBirthday= this.onChangeBirthday.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state ={
            firstName:'',
            lastName:'',
            email: '',
            nic: '',
            mobile:'',
            birthday:'',
            emailError:'',
           // mobileError:''

        }
    }

    onChangeFirstName(e){
        this.setState({
            firstName:e.target.value
        });
       
    }

    onChangeLastName(e){
        this.setState({
            lastName:e.target.value
        });
       
    }
    onChangeEmail(e){
        this.setState({
            email:e.target.value
        });
    }
    onChangeNic(e){
        this.setState({
            nic:e.target.value
        });
    }
    onChangeMobile(e){
        this.setState({
            mobile:e.target.value
        });
    }
    onChangeBirthday(e){
        this.setState({
            birthday:e.target.value
        });
        
    }
    
    

    

    validate = () => {
        let emailError= "";
        if (! this.state.email.includes('@')){
            emailError = 'invalid email';
        }

        if (emailError){
            this.setState({emailError});
            return false;
        }
        return true;
    }
    onSubmit(e){
        e.preventDefault();
        const userData = getFromStorage('auth-id');
        console.log(userData.id);
       const isValid = this.validate();
        if(isValid){
        const obj = {
            email: this.state.email,
            mobile: this.state.mobile
         };
        console.log(obj);
        this.setState({
            emailError:''
        });
       axios.post(backendURI.url + '/users/update/'+userData.id, obj).then(res => console.log(res.data));
       // this.props.history.push('/profile');
    }
    }
    

    
    
    
    
    
    
    
    
    
      render() {
        return(
<div style={{ backgroundColor: "#f5f5f5"}}>
<Navbar/>
<br></br>
<Profilepic/> 


<div className="card" style={{width: 550}}>
    <h5 className="card-header info-color white-text text-center py-4">About</h5>
    <div className="card-body px-lg-5">
        <div style={{marginTop: 10}}>
            <form  onSubmit={this.onSubmit}>
            <div className="form-row mb-4">
            <div className="col">
                <div className="form-group">
                    <label>First Name:</label>
                     <input type="text" className="form-control" 
                    value={this.state.firstName || ""}
                    onChange={this.onChangeFirstName}
                    readOnly/>
        </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" className="form-control" 
                    value={this.state.lastName || ""}
                    onChange={this.onChangeLastName}
                    readOnly/>
                </div>
            </div>
            </div>


            <div className="form-group">
                <label>Email:</label>
                <input type="text" className="form-control" 
                value={this.state.email || ""}
                onChange={this.onChangeEmail}
                required/>
                <div style={{fontSize:12,color:"red"}}>{this.state.emailError}</div> 
            </div>
               

            <div className="form-row mb-4"> 
            <div className="col"> 
                <div className="form-group">
                     <label> NIC Number:</label>
                    <input type="text" className="form-control" 
                    value={this.state.nic || ""}
                    onChange={this.onChangeNic}
                   readOnly />
                </div>
            </div> 
            <div className="col">
                <div className="form-group">
                    <label> Mobile Number:</label>
                    <input type="text" className="form-control" 
                    value={this.state.mobile || ""}
                    onChange={this.onChangeMobile}
                    required/>
                    <div style={{fontSize:12,color:"red"}}></div> 
                </div>
            </div> 
            </div> 
            
            <div className="form-group">
                <label>Birthday:</label>
                <input type="text" className="form-control" 
                value={this.state.birthday || ""}
                onChange={this.onChangeBirthday}
                readOnly/>
            </div>

                <div className="from-group justify-content-center">
                    <input type="submit" value="Save" className="btn btn-primary" />
                </div>
             </form>
        </div>
    </div>
</div>
<Resetpw/>
</div>
        )
    }
}