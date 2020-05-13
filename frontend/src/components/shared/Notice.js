import React, { Component } from 'react'
//import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { verifyAuth } from "../../utils/Authentication";
import Card from "@material-ui/core/Card";
import "../../css/shared/Notice.css";

import axios from 'axios';
const backendURI = require("./BackendURI");

 class Notice extends Component {

    // componentDidMount = async () => {
    //     const authState = await verifyAuth();
    //     this.setState({ authState: authState });
    //     if (!authState || !localStorage.getItem("isAdmin"))
    //       this.props.history.push("/");
    //   };

    constructor(props) {
      super(props)

    
      this.state = {
          
          //userType:"",
          noticeTittle:"",
          notice:"",
          noticeAttachment: ""
         
      }

      this.onChangeTittle = this.onChangeTittle.bind(this)
      this.onChangeNotice = this.onChangeNotice.bind(this)
      this.onChangeFile = this.onChangeFile.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
    }

    onChangeTittle(e) {
      this.setState({
        noticeTittle: e.target.value,
      });
    }

    onChangeNotice(e) {
      this.setState({
        notice: e.target.value,
      });
    }

    onChangeFile(e) {
      this.setState({
        noticeAttachment: e.target.files[0],
      });
    }

    onSubmit(e){
      e.preventDefault()

      const formData = new FormData()
      formData.append('noticeTittle', this.state.noticeTittle);
      formData.append('notice', this.state.notice);
      formData.append('noticeAttachment', this.state.noticeAttachment);

        
      

      axios.post(backendURI.url + "/notice/addNotice",formData)
      .then(res=>{
        console.log(res)
      }).catch(error=>{
        console.log(error)
      })

      this.setState({
        noticeTittle:'',
        notice:'',
        noticeAttachment:''
      })




    }

  render() {
    return (
       
      <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "700px" }}>
        <div className="row">
          <div className="container notice-card-div">
            <Card className="notice-card">
          
            <h2 class="topic">Add Notice</h2>
            <br></br>

            <form onSubmit={this.onSubmit}>

            <div className="form-group">
            <p style={{textalign: "left"}}>Notice Tittle :</p>
            <input type="text" className="form-control"   placeholder="Enter Notice Tittle" value={this.state.noticeTittle} onChange={this.onChangeTittle}>
            </input>
            </div>

            <div className="form-group">
            <p style={{textalign: "left"}}>Notice :</p>
            <textarea type="text" className="form-control"   placeholder="Enter Notice" value={this.state.notice} onChange={this.onChangeNotice}>
            </textarea>
            </div>

            
            <div className="form-group">
            <p style={{textalign: "left"}}>File Attach :</p>
            <input type="file" name="noticeAttachment" className="form-control"   onChange={this.onChangeFile}/>
            </div>
            

            <button type="submit" className="btn btn-primary btn-sm btn-style ">Uploard</button>
            
            </form>
             
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default Notice
