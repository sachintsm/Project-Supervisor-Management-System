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
        // console.log(this.props);
        
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
                    <ModalHeader toggle={this.toggle}>Details</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <img src={this.props.image}></img><br/>
                            Name : {this.state.firstName} {this.state.lastName}<br/>
                            Category : {this.state.cat}<br/>
                            Email : {this.state.email}<br/>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}