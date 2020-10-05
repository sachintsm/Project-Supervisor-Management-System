import React, {Component} from 'react';
import Navbar from "../shared/Navbar"
import Footer from "../shared/Footer"
import {getFromStorage} from "../../utils/Storage";
import axios from "axios";

const backendURI = require("../shared/BackendURI");

class CoordinatorNotifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.getCoordinatorNotifications()
    }

    getCoordinatorNotifications = () => {
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id

        axios.get(backendURI.url+"/createGroups/coordinatorgrouprequests/"+userId, {headers: headers}).then(res=>{
            console.log(res.data)
            this.setState({
                notificationList: res.data
            })
        })
    }

    render() {
        return (
            <React.Fragment>
                <Navbar/>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default CoordinatorNotifications;