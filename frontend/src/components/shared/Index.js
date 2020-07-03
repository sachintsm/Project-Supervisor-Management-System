import React, {Component} from 'react';
import axios from 'axios';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';
const backendURI = require("./BackendURI");

export default class Index extends Component{
    constructor(props){
        super(props);
        this.state = {MessageList: {}};
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            firstName: '',
            lastName: '',
            regNumber: '',
            email: '',
            image: '',
            
        });
        axios.get(backendURI.url + '/indexInfo/'+this.props.index)
          .then(res => {
            this.setState({ 
                firstName: res.data.firstName, 
                lastName: res.data.lastName,
                regNumber: res.data.regNumber,
                email: res.data.email,
                image: res.data.imageName,
                cat: res.data.regNumber.substring(5,7).toUpperCase()
            })
            console.log(res.data);
          }) 
    };

    render(){
        return(
            <div>
                <a onClick={this.toggle} href="#">
                    {this.props.index}
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Students' Information</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <img src={this.props.image}></img><br/><br/>
                            Name : {this.state.firstName} {this.state.lastName}<br/><br/>
                            Course Infomation : {this.state.cat}<br/><br/>
                            Registration Number : {this.state.regNumber}<br/><br/>
                            Email : {this.state.email}<br/><br/>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}