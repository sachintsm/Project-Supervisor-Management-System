import React, { Component } from 'react'
//import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { verifyAuth } from "../../utils/Authentication";
import Card from "@material-ui/core/Card";
import "../../css/shared/Notice.css";
import Navbar from '../shared/Navbar';
import Snackpop from '../shared/Snackpop';
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
          noticeAttachment: "",
          succesAlert: false,
          warnAlert: false,
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
        this.setState({
          succesAlert: true,
        
        });
        console.log(res.data)

      }).catch(error=>{
        console.log(error)
      })

      this.setState({
        noticeTittle:'',
        notice:'',
        noticeAttachment:''
      })

    }

    closeAlert = () => {
      this.setState({
        succesAlert: false,
        warnAlert: false,
      });
    };

  render() {
    return (
      <React.Fragment>
      <Snackpop
      msg={'Successfully Added'}
      color={'success'}
      time={3000}
      status={this.state.succesAlert}
      closeAlert={this.closeAlert}
    />
 

      <Navbar panel={'admin'} />

      <div className="container-fluid" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="row">
          <div className="container notice-card-div">
            <Card className="notice-card">
          
            <h3 >Add New Notice</h3>
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
            
            
            <div className="form-group">
            <button type="submit" className="btn btn-info my-4 btn-style ">Uploard</button>
            </div>

            </form>
             
            </Card>
          </div>
        </div>
      </div>

      </React.Fragment>
    )
  }
}

export default Notice
