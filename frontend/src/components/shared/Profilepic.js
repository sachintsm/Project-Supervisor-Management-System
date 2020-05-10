import React, {Component}  from 'react';
import '../../css/shared/Profile.css';
const axios = require("axios");

export default class Profilepic extends Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('myImage',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/upload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
    }

    render() {
        return (
    <div>
        <div className="card testimonial-card" style={{width: 900,height:250}}>
        <div className="card-up indigo lighten-1"></div>
            <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20%2810%29.jpg" className="rounded-circle"
            alt="woman avatar" style={{width: 150}}/>
            <div className="card-body" style={{height:200}}>
                <h4 className="card-title">Edit Profile Picture</h4>
                <div className="form-group">
                    <form onSubmit={this.onFormSubmit}>
                        <input type="file" name="myImage" onChange= {this.onChange} />
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
        )
    }
}

