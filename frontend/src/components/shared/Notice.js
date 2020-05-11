import React, { Component } from 'react';
//import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
//import { verifyAuth } from "../../utils/Authentication";
import Card from "@material-ui/core/Card";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';

import "../../css/shared/Notice.css";
import Footer from '../shared/Footer';
import Navbar from '../shared/Navbar';
import Snackpop from '../shared/Snackpop';
import axios from 'axios';

import {
  Button,
  Container,
  Col,
  Row,
  FormControl,
  Table,
  FormGroup,
 
} from 'react-bootstrap';


const backendURI = require("./BackendURI");


 class Notice extends Component {

    // componentDidMount = async () => {
    //     const authState = await verifyAuth();
    //     this.setState({ authState: authState });
    //     if (!authState || !localStorage.getItem("isAdmin"))
    //       this.props.history.push("/");
    //   };

    constructor(props) {
      super(props);

    
      this.state = {
          
          //userType:"",
          noticeTittle:"",
          notice:"",
          noticeAttachment: "",
          date:"",
          succesAlert: false,
          warnAlert: false,
          noticeType:'',
          noticeList: []
      };

      this.onChangeTittle = this.onChangeTittle.bind(this);
      this.onChangeNotice = this.onChangeNotice.bind(this);
      this.onChangeFile = this.onChangeFile.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.getNoticeList = this.getNoticeList.bind(this);


    }

    componentDidMount() {
      this.getNoticeList();
    }

    getNoticeList() {
      axios.get(backendURI.url + '/notice/viewNotice').then((result => {
        if (result.data.length > 0) {
          this.setState({
            noticeList: result.data.map((type) => type)
          });
        }
        else {
          this.setState({
            noticeList: []
          });
        }
      }));
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

      // if(this.state.noticeType === ''){
      //   this.setState({
      //     warnAlert:true
      //   })
      // }
      e.preventDefault();

      this.state.date = Date();

      const formData = new FormData();
      formData.append('noticeTittle', this.state.noticeTittle);
      formData.append('notice', this.state.notice);
      formData.append('date',this.state.date);
      formData.append('noticeAttachment', this.state.noticeAttachment);

      axios.post(backendURI.url + "/notice/addNotice",formData)
      .then(res=>{

        window.location.reload();
        this.setState({
          succesAlert: true,
        
        });
        console.log(res.data);
      

      }).catch(error=>{
        console.log(error);
      });

      this.setState({
        noticeTittle:'',
        notice:'',
        noticeAttachment:null
      });

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

      <div className="container-fluid" style={{ backgroundColor: "rgb(252, 252, 252)" }}>
      
      <Row >
      <Col>
      <Container>

            <div className="card" style={{ width: '80%', margin: "auto", marginTop: "40px", marginBottom: "40px", paddingLeft: "2%", paddingRight: "2%" }}>
              <div className="container">

                <h3 style={{ marginTop: "30px" }}>Creating New Notice</h3>

                <Row className='margin-top-30'>
                <Col >
                  <label className='verticle-align-middle cp-text'>
                    Notice Tittle :{' '}
                  </label>
                  <FormControl
                    type='text'
                    style={{ width: '100%' }}
                    placeholder='Notice Tittle'
                    value={this.state.noticeTittle}
                    onChange={this.onChangeTittle}
                  ></FormControl>
                </Col>
              </Row>


              <Row className='margin-top-30'>
              <Col >
              <div className="form-group">
              <p style={{textalign: "left" , color:" #6d6d6d"}}>Notice :</p>
              <textarea type="text" className="form-control"   placeholder="Enter Notice" value={this.state.notice} onChange={this.onChangeNotice}>
              </textarea>
              </div>
  
              </Col>
            </Row>

            <Row className='margin-top-30'>
              <Col >

              <label className='verticle-align-middle cp-text'>
              File Attach : {' '}
            </label>
              <FormGroup>
              <input type="file" name="noticeAttachment" id="exampleFile" onChange={this.onChangeFile} />
              </FormGroup>
              </Col>
            </Row>

            <Row style={{ marginTop: '40px', marginBottom: '30px' }}>
            <Button
              type='submit'
              className='cp-btn'
              variant='info'
              onClick={this.onSubmit}
            >
              Add Notice
                </Button>
          </Row>

      </div>
      </div>

      {this.state.noticeList.length > 0 && (

    
        <div >
        <h3>Notice View </h3>
        <div>
        
            {this.state.noticeList.map((type)=>{
          return (
            <Card key={type._id}  style={{marginTop:'15px', marginBottom:'20px'}}>

            <CardHeader  title= {type.noticeTittle } subheader={type.date} />

            <CardContent>
           
            <Typography variant="body1" component="p">{type.notice}</Typography>
            
            </CardContent>

            <a href="http://localhost:4000/notice/noticeAtachment/{type.noticeAtachment}">&nbsp;&nbsp;Attachment</a>

            <CardActions>
            <Button size="small" variant="outline-danger"style={{width:'20%'}}>Delete</Button>
            </CardActions>


            </Card>
          );

        })}
        

        
        </div>

        </div>
      
  
    
      )
      }
      </Container>
      </Col>
      </Row>
</div>
<Footer />
      </React.Fragment>
    );
  }
}

export default Notice
