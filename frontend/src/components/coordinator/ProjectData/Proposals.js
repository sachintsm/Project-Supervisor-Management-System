import React, { Component } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios'
import { verifyAuth } from "../../../utils/Authentication";
import { getFromStorage } from "../../../utils/Storage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Snackpop from "../../shared/Snackpop";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';


import '../../../css/coordinator/proposel.scss';

import {
    Button,
    Container,
    Col,
    Row,
    FormGroup,
    FormControl,


  } from "react-bootstrap";
  const backendURI = require("../../shared/BackendURI");





class Proposals extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeproposelDiscription = this.onChangeproposelDiscription.bind(this);
        this.onChangeProposelTittle = this.onChangeProposelTittle.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.getProposel = this.getProposel.bind(this);
        this.onDeleteHandler= this.onDeleteHandler.bind(this);

   //console.log("Ashan",this.props.match.params.id);

        this.state = {

          componentType: 'add',
          tittle : "Create New Submision",
          projectId:this.props.match.params.id,
          proposelTittle: "",
          proposelDiscription:"",
          deadDate :"",
          deadTime :"",
          proposelAttachment : "",
          imgname: '',
          toLateSubmision:false,


          // succesAlert: false,
          // deleteSuccesAlert: false,
          // warnAlert: false,
          // snackbaropen: false,
          // snackbarmsg: "",

          propselList :[],
          proId : "",

             
        }
    }

    handleDropdownChange = (e) => {
      const val = e.target.value
      this.setState({
        state : val
      });
    }

    onChangeProposelTittle(e) {
      this.setState({
        proposelTittle: e.target.value,
      });
    }
    onChangeproposelDiscription(e){
      this.setState({
        proposelDiscription:e.target.value,
      })
    }

    onChangeDate = (e)=>{
      this.setState({
        deadDate : e.target.value,
      })
    }

    onChangeTime = (e) =>{
      this.setState({
        deadTime : e.target.value,
      })
    }

    onChangeFile =  (e)=>{
      this.setState ({
        imgname: e.target.files[0].name,
        proposelAttachment: e.target.files[0],
      })
    }

    componentDidMount(){

      this.getProposel();

    }

    getProposel(){
      axios.get(backendURI.url +'/proposel/getSubmisionLink')
      .then((res=>{
       // console.log("ssssssssssssss", res.data.data)
        this.setState({
          propselList : res.data.data
        })
        console.log("sss",this.state.propselList);
      })).catch(err=>{
        console.log(err)
      })

    }

    onDeleteHandler = (id) => {
      confirmAlert({
        title: "Delete Notice",
        message: "Are you sure?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
  
              const headers = {
                'auth-token': getFromStorage('auth-token').token,
              }
              axios
                .delete(backendURI.url + "/proposel/deleteSubmision/" + id, { headers: headers })
                .then((res) => {
                  this.setState({
                    deleteSuccesAlert: true,
                  });
                 // window.location.reload();
                  this.getProposel();
                  
                })
                .catch((err) => {
                  console.log(err);
                });
  
            },
          },
          {
            label: "No",
            onClick: () => { },
          },
        ],
      });
    }

    onSubmit(e) {
      e.preventDefault();
      
          confirmAlert({
            title: 'Confirm to submit',
            message: "Are you sure?",
            buttons: [
              {
                label: "Yes",
                onClick: async () => {
  
                  const headers = {
                    'auth-token': getFromStorage('auth-token').token,
                  }
  
                  var date = new Date();
                  const dateString = date.toLocaleDateString()
                  const timeString = date.toLocaleTimeString()
                  
  
                  const userType = localStorage.getItem("user-level");
                 
                  const userId = getFromStorage('auth-id').id;
  
                  const formData = new FormData();
  
  
                  formData.append("userId",userId);
                  formData.append("userType",userType);
                  formData.append("date", dateString);
                  formData.append("time", timeString);
                  formData.append("projectId",this.state.projectId);
                  formData.append("proposelTittle",this.state.proposelTittle);
                  formData.append("proposelDiscription",this.state.proposelDiscription);
                  formData.append("deadDate",this.state.deadDate);
                  formData.append("deadTime",this.state.deadTime);
                  formData.append("proposelAttachment",this.state.proposelAttachment);
                  formData.append("toLateSubmision",this.state.toLateSubmision);
    
                  if(this.state.componentType === 'add'){
                  axios
                    .post(backendURI.url + "/proposel/addProposel", formData, { headers: headers })
                    .then((res) => {
                      this.setState({
                        succesAlert: true,
                      });
                     // window.location.reload();
                     this.getProposel();
                    })
                    .catch((error) => {
                      this.setState({
                        snackbaropen: true,
                        snackbarmsg: error,
                      });
                      console.log(error);
                    });
  
                  this.setState({
                    proposelTittle:"",
                    proposelDiscription:"",
                    deadDate:"",
                    deadTime:"",
                    proposelAttachment:""
  
                  });
                  
                } if(this.state.componentType === 'edit'){
                  
                  axios.patch(backendURI.url + "/proposel/" + this.state.id, this.state,{headers:headers})
                  .then(res=>{

                  }).catch(err =>{
                    console.log(err)
                  })
                  window.location.reload(false);

                  this.setState({
                    editAlert : true,
                  })

                }

              }
              },
              {
                label: "No",
                onClick: () => { },
              },
            ],
          });
        }


        onEditHandler = (type) =>{

          this.setState({
            componentType: 'edit',
            tittle: 'Edit Submision',
            proposelTittle:type.proposelTittle,
            proposelDiscription:type.proposelDiscription,
            deadDate:type.deadDate,
            deadTime:type.deadTime,
            proposelAttachment:type.filePath,
            toLateSubmision:type.toLateSubmision,
            proId : type._id

          }, () => { window.scrollTo(0, 0) })

        }
        


    render() {


        return (
            <React.Fragment>

            <Snackpop
            msg={"Successfully Added"}
            color={"success"}
            time={2000}
            status={this.state.succesAlert}
            closeAlert={this.closeAlert}
          />
          <Snackpop
            msg={"Deleted Successfully.."}
            color={"success"}
            time={2000}
            status={this.state.deleteSuccesAlert}
            closeAlert={this.closeAlert}
          />

          <Snackpop
          msg={'Edited Successfully'}
          color={'success'}
          time={3000}
          status={this.state.editAlert}
          closeAlert={this.closeAlert}
      />

            <Navbar panel={"coordinator"} />

            <div className="proposel-style">
            <div className="container-fluid pro-back">
            <div className="container">

            <Tabs defaultActiveKey="Submited Proposel" id="uncontrolled-tab-example"  className="pro-tabs" style={{marginBottom:"30px"}}>

            <Tab eventKey="Submited Proposel" title="Submited Proposel" className="pro-tab">
            
            <div className="card conatiner" style={{ margin: "0px 0px 20px 0px" }}>

            <div className="pro-head">
            <p className="pro-grp-name">G-08</p>
            </div>

            <div className="pro-body">
                <h6>Proposel Details</h6>
                <a>Attachment </a>
            </div>

            </div>
            
            </Tab>




            <Tab eventKey="Create Link" title="Create Proposel" className="pro-tab">
            
            <div>
            <div className="card container pro-link-crd">

            <form onSubmit={this.onSubmit}>

            <Row>
            <p className="pro-link-name">{this.state.tittle}</p>
            </Row>

            <div className="form-group pro-form">
            <label >Proposel Tittle :</label>
            <input type="text" className="form-control" id="exampleInputProposel" placeholder="Proposel Tittle"
            name="proposelTittle" value={this.state.proposelTittle} onChange={this.onChangeProposelTittle}/>
            </div>

            <div className="form-group pro-form">
            <label >Proposel Discription :</label>
            <textarea type="text" className="form-control" id="exampleInputProposel" placeholder="Discription"
            name="proposelTittle" value={this.state.proposelDiscription} onChange={this.onChangeproposelDiscription}/>
            </div>


           
        <Row > 
            <Col  md={6} xs="12">
            <div className="form-group pro-form">
            <label >Dead Line Date :</label>
            <input type="date" className="form-control" id="exampleInputDate" name="deadDate"
            value={this.state.deadDate} onChange={this.onChangeDate}/>
            </div>
            </Col>

            <Col md={6} xs="12">
            <div className="form-group pro-form">
            <label >Dead Line Time :</label>
            <input type="time" className="form-control" id="exampleInputTime" name="deadTime"
            value={this.state.deadTime} onChange={this.onChangeTime}/>
            </div>
            </Col>

        </Row>

        <Row>
            <Col md={6} xs="12">
            <label className="verticle-align-middle  pro-form">File Attach :{" "}</label>
            <FormGroup  className="pro-form">

            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text"> Upload </span>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="exampleFile"
                  onChange={this.onChangeFile}
                  name="proposelAttachment"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.imgname}</label>
              </div>
            </div>

          </FormGroup>
            </Col>

            <Col className="col-padding-5 check-box"  md={6} xs={12}>
            
            <FormControlLabel
              className="form-control-label"
              control={
                <Checkbox
                  fontSize="5px"
                  checked={this.state.toLateSubmision}
                  onChange={() => {
                    this.setState({
                      toLateSubmision: !this.state.toLateSubmision,
                    });
                  }}
                  name="checkedB"
                  color="default"
                />
              }
              label={
                <span style={{ fontSize: "14px" }}>
                Permision For Late Submision
                </span>
              }
            />
          
        
            </Col>

        </Row>
        <Row style={{ marginTop: '40px', marginBottom: '30px' }}>
        <Col md={1}></Col>
        {this.state.componentType === 'edit' &&
        <Col>
          <Button
              variant='danger'
              onClick={this.goBack}
              style={{ width: '100%' }}
          >
            Cancel
          </Button>
        </Col>}
        <Col>
          <Button
              variant='info'
              onClick={this.onSubmit}
              style={{ width: '100%' }}
          >
            {this.state.componentType === 'add' &&
            'Add Submision Now'}
            {this.state.componentType === 'edit' &&
            'Edit Now'}
          </Button>
        </Col>
        <Col md={1}></Col>
      </Row>

            </form>
            
            </div>

            

            <div>  </div>

            {this.state.propselList.length > 0 && this.state.componentType === 'add' && (
              <div>
              <div>
              {this.state.propselList.map((type) => {

                return(
                  <div className="card container  pcrd-style" style={{ margin: "0px 0px 20px 0px" }} key={type._id}>
                 
                  <Row className="pcrd_proposel-tittle-div">
                    <Col md={10} xs={10}>
                      <p className="pcrd_proposel-name">{type.proposelTittle}</p>
                    </Col>
                    <Col className="pcrd_btn-row" md={2} xs={2}>
                    <EditIcon style={{marginTop: "5px" }} className="edit-btn" fontSize="large" onClick={() => this.onEditHandler(type)} />
                    <DeleteForeverIcon style={{marginTop: "5px" }} className="delete-btn" fontSize="large" onClick={() => this.onDeleteHandler(type._id)} />
                    </Col>
                    
                  </Row>

                  <Row className="pcrd_user-name-div">
                    <Col md={11} xs={10}>
                        <p className="pcrd_date">&nbsp;{type.date}&nbsp;&nbsp;{type.time}</p>
                    </Col>
                  </Row>
                  <div >
                      <p className="pcrd_discription">{type.proposelDiscription}</p>
                      <p className="dead_date">Dead Line Date :{type.deadDate}</p>
                      <p className="dead_time">Dead Line Time :{type.deadTime}</p>
                  </div>

                  <div className="fille_attach">
                  <a className="crd_atchmnt" href={"http://localhost:4000/proposel/proposelAttachment/" + type.filePath}>
                    Attachment
              </a>
                </div>
                  
                  </div>

                )
                


              })}

              
              </div>
              
              </div>

            )}

            
          

           </div>
            </Tab>
            </Tabs>
          
            </div>
            </div>
            </div>
            <Footer />
           </React.Fragment>
        );
    }
}

export default Proposals;