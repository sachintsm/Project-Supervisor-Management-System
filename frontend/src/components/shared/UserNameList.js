import React, { Component } from 'react';
import axios from 'axios';
import "../../App.css"
import { getFromStorage } from "../../utils/Storage";
import "../../css/shared/Notice.css";
const backendURI = require('../shared/BackendURI');

class UserNameList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: this.props.id.userId,
            component: this.props.component,
            userNameList: [],
            props: props,

        }



    }
    componentDidMount() {
        this.getUserList()
    }

    getUserList() {

        this.setState({
            userIDList: this.props.id,
            userNameList: []
        })

        //console.log("skdmcxlsdkcnosv",this.state.userID)
        const headers = {
            'auth-token': getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url + '/users/getUser/' + this.state.userID, { headers: headers }).then(res => {
            if (res.data) {
                const name = res.data.data.firstName + " " + res.data.data.lastName
                //console.log(name)
                this.setState({
                    userNameList: [...this.state.userNameList, name],

                })

            }
        })

    }
    render() {
        return (
            <div>

                {this.state.userNameList.map((user, index) => {
                    return <div key={index}>
                        <p className= "cd-date" >
                            (&nbsp;by&nbsp;{user}
                        </p>
                    </div>
                })}
            </div>
        );
    }
}

export default UserNameList;