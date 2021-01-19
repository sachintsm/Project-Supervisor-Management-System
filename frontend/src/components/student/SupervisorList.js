import React, { Component } from 'react';
import axios from 'axios';
import "../../App.css"
import { getFromStorage } from "../../utils/Storage";
import { Spinner,Col, Row } from 'react-bootstrap';
const backendURI = require('../shared/BackendURI');

class CoordinatorList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idList: this.props.idList,
            supervisorNameList: [],
            props: props,
            loading: true
        }

    }

    componentDidMount() {

        this.getSupervisorList()
    }

    getSupervisorList() {
        
        this.setState({
            idList: this.props.idList,
            supervisorNameList: []
        })

        if(this.props.idList.length==0){
            this.setState({
                loading:false
            })
        }
        
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }
        this.state.idList.map(id => {
            axios.get(backendURI.url + '/users/stafflist/' + id, { headers: headers }).then(res => {
                if (res.data) {
                    const name = res.data.firstName + " " + res.data.lastName
                    this.setState({
                        supervisorNameList: [...this.state.supervisorNameList, name],
                        loading: false
                    })
                }
            })
        })
    }


    render() {
        return (
            <div style={{padding:" 0px 0px"}}>
                {this.state.loading && <Spinner animation="border" className="spinner" style={{alignContent:'center'}}/>}

                {this.state.supervisorNameList.map((user, index) => {
                    return <span  key={index}>{user} , </span>
                })}
            </div>
        );
    }
}

export default CoordinatorList;