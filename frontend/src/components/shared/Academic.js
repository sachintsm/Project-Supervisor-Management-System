import React, {Component} from 'react';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import '../../css/shared/Profile.css';
import { confirmAlert } from 'react-confirm-alert';


const backendURI = require("./BackendURI");

export default class Academic extends Component {
    
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
                console.log(response.data);
                this.setState({
                    pro:response.data.data[0].noProject,
                })
            })
            .catch(error => {
                console.log(error)
            })
         }

      }
      constructor(props){
        super(props);
        this.onChangePro= this.onChangePro.bind(this)
        this.onSubmit = this.onSubmit.bind(this);

        this.state ={
            pro:'',

        }
    }

    onChangePro(e){
        this.setState({
            pro:e.target.value
        });
       
    }
    
    onSubmit(e){
        e.preventDefault();
        const userData = getFromStorage('auth-id');
        console.log(userData.id);
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to do this.',
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => {
                        const obj = {
                            pro: this.state.pro
                        };
                        console.log(obj);
                       axios.post(backendURI.url + '/users/academic/'+userData.id, obj).then(res =>{ 
                        console.log(res.data);
                        if(res.data.state==true){
                            alert("Update Successfull");
                        }
                        else{
                            alert("Try Again");
                        }
                        }
                        );
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
    render() {
        return(
            <div>
            <div className="card3">
                <div className="card-body px-lg-5">
                    <div style={{marginTop: 10}}>
                        <form  onSubmit={this.onSubmit}>
                             <div className="from-group justify-content-center">
                                <p className="tab">Your projects:  
                                    <input type="number" name="project"
                                    value={this.state.pro || ""}
                                    onChange={this.onChangePro}/>
                                    <input type="submit" value="change" className="btn btn-info my-4" />
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}