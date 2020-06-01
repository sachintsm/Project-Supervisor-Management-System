import React, { Component } from 'react';
//import axios from 'axios';

import {
    Input,
    Label,
    Button,
    Modal,
    ModalHeader,
    ModalBody
  } from 'reactstrap';
  import { Row, Col } from "reactstrap";

export default class Contactus extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            //profileImg: '',
            //upload: ''
         }
    }

    toggle = () => {
        
        this.setState({
          modal: !this.state.modal,
        
        //   upload: ''
        });
    };

    
    onChange = e => {
        this.setState({ [e.target.name]: e.target.value});
    };

    onSubmit(e) {
        e.preventDefault()
        // const formData = new FormData()
        // formData.append('profileImg', this.state.profileImg)
        // axios.post("http://localhost:4000/mazzevents/addprofileimg/"+this.props.id, formData, {
        // }).then(res => {
        //     console.log(res)
        // })
        //this.setState({ upload: 1 })
    }


    render() {
        return (
            <div>
                <Button className="btn btn-info" style={{width: '40%', paddingLeft: '0px',paddingRight: '0px'}} onClick={this.toggle} href="#">
                    Send a Message
                </Button>
                 <Modal isOpen={this.state.modal} toggle={this.toggle}> 
                <ModalHeader toggle={this.toggle}>Send your Message</ModalHeader>
                <ModalBody>
                <div className="container">
                    <div className="row">
                    </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                        <form onSubmit={this.onSubmit}>

                        <Row>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">First Name: </label>
                                <input type="text" className="form-control" name="firstName" onChange={this.onChange} />
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="text-label">Last Name : </label>
                                <input type="text" className="form-control" name="lastName" onChange={this.onChange} />
                             </div>
                            </Col>
                          </Row>
                            
                            <div className="form-group">
                                <Label for="avatar">Contact Number</Label>
                                <Input type="number" id="number" onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <Label for="avatar">Email</Label>
                                <Input type="text" id="email" onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <Label for="avatar">Message</Label>
                                <Input type="textarea" id="message" onChange={this.onChange}/>
                            </div>
                            <div className="form-group">
                                <Button className="btn btn-info my-4"  type="submit">Send</Button>
                            </div>
                        </form>
                    </div>
                </div>
                </ModalBody>
            </Modal>
            </div>          
        )
    }
}

