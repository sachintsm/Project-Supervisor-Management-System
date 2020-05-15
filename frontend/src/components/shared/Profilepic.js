import React, {Component}  from 'react';
import '../../css/shared/Profile.css';
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';


const backendURI = require("./BackendURI");
export default class Profilepic extends Component {

   /* async componentDidMount(){
            axios.get(backendURI.url + '/profileImage/'+this.state.multerImage)
            .then(response => {
                console.log(response);
               

                this.setState({
                    multerImage: response.data
                })
            })
            .catch(error => {
                console.log(error)
            })
         
    }*/

    constructor(props) {
        super(props);
        this.onChangeP = this.onChangeP.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.state ={
            multerImage: null
        }
    }

  /*  setDefaultImage(uploadType){
        if(uploadType == "multer"){
            this.setState({
                multerImage: "2048-avatar-ninja-samurai-warrior-icon-ninja-avatar-png-512_512"
            });
        }
    }

    uploadImage(e,method){
        if(method == "multer"){
            let imageFormObj= new FormData();
            imageFormObj.append("imageName","multer-image-"+Date.now());
            imageFormObj.append("imageData",e.target.files[0]);

            this.setState({
                multerImage: URL.createObjectURL(e.target.files[0])
            });

            axios.post((backendURI.url +'/image/uploadmulter',imageFormObj))
            .then((data)=> {
                if(data.data.success){
                    alert("Image has been successfully uploaded");
                    this.setDefaultImage("multer");
                }
            })
            .catch((err)=> {
                alert("Error");
                this.setDefaultImage("multer");
            });

        }

    }*/




    onFormSubmit(e){
        e.preventDefault();
        const userData = getFromStorage('auth-id')
        let imageFormObj= new FormData();
       // imageFormObj.append("imageName","multer-image-"+Date.now());
       //imageFormObj.append("imageData",e.target.file);
        imageFormObj.append("image",this.state.multerImage);
        const ob = this.state.multerImage
       console.log(ob);
        axios.post(backendURI.url +'/users/uploadmulter/'+ userData.id ,ob)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
    }
    onChangeP(e) {
        console.log(e.target.files[0].name);
        this.setState({
            multerImage:e.target.files[0].name
        });
    }

    render() {
        return (
    <div>
        <div className="card testimonial-card" style={{width: 900,height:250}}>
        <div className="card-up indigo lighten-1"></div>
            <img src={'../../../../backend/local_storage/profile_Images/' +this.state.multerImage} className="rounded-circle"
            alt="woman avatar" style={{width: 150}}/>
            <div className="card-body" style={{height:200}}>
                <h4 className="card-title">Edit Profile Picture</h4>
                <div className="form-group">
                    <form onSubmit={this.onFormSubmit}>
                        <input type="file" className="myImage"  onChange= {this.onChangeP} />
                        <button type="submit">Upload</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
        )
    }
}

