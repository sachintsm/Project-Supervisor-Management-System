import React, {Component} from 'react';
import axios from 'axios'
import {getFromStorage} from "../../../utils/Storage";
const backendURI = require('../../shared/BackendURI');

class TotalProgressCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupId: this.props.groupId,
            totalProgress: 0
        }
    }

    componentDidMount() {
        this.getTotalProgress()
    }

    getTotalProgress = () =>{
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/progress/gettotalprogress/'+this.state.groupId,{headers:headers}).then(res=>{
            console.log("res===========")
            this.setState({
                totalProgress: res.data.totalProgress
            })
        })
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <h1>{this.state.totalProgress}</h1>
            </div>
        );
    }
}

export default TotalProgressCard;