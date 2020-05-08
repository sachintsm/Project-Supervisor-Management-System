import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import './profile.css';
import Profilepic from './Profilepic';

export default class Profile extends Component {
    render() {
        return(
<div>
    <div className="card testimonial-card">
        <div className="card-up indigo lighten-1"></div>
        <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20%2810%29.jpg" className="rounded-circle"
            alt="woman avatar" style={{width: 150}}/>
        <div className="card-body">
            <h4 className="card-title">Edit Profile Picture</h4>
            <p><i className="fas fa-quote-left"></i> <Profilepic></Profilepic></p>
        </div>
    </div>






<div className="card" style={{width: 550}}>
    <h5 className="card-header info-color white-text text-center py-4">About</h5>
    <div className="card-body px-lg-5">
        <div style={{marginTop: 10}}>
            <form onSubmit={this.onSubmit}>
            <div className="form-row mb-4">
            <div className="col">
                <div className="form-group">
                    <label> First Name:</label>
                    <input type="text" className="form-control" />
                </div>
            </div>
            <div className="col">
                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" className="form-control" />
                </div>
            </div>
            </div>


            <div className="form-group">
                <label>Email:</label>
                <input type="text" className="form-control" />
            </div>

            <div className="form-row mb-4"> 
            <div className="col"> 
                <div className="form-group">
                     <label> NIC Number:</label>
                    <input type="text" className="form-control" />
                </div>
            </div> 
            <div className="col">
                <div className="form-group">
                    <label> Mobile Number:</label>
                    <input type="text" className="form-control" />
                </div>
            </div> 
            </div> 
            
            <div className="form-group">
                <label>Birthday:</label>
                <DatePicker
                name="startDate"
                dateFormat="MM/dd/yyyy"
            />
            </div>

                <div className="from-group justify-content-center">
                    <input type="submit" value="Save" className="btn btn-primary" />
                </div>
             </form>
        </div>
    </div>
</div>
</div>
        )
    }
}