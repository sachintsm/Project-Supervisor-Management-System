import React, {Component} from 'react';
import axios from 'axios';
import {getFromStorage} from "../../utils/Storage";
const backendURI = require('../shared/BackendURI');

class CoordinatorList extends Component {

    constructor(props){
        super(props);
        this.state = {
            supervisorIdList: this.props.idList.coordinatorList,
            supervisorNameList: [],
            props: props
        }

    }


    componentDidMount() {

        this.getSupervisorList()
    }

    getSupervisorList() {

        this.setState({
            supervisorIdList: this.props.idList,
            supervisorNameList: []
        })
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        this.state.supervisorIdList.map(id=>{
            axios.get(backendURI.url+'/users/stafflist/'+id, {headers: headers}).then(res=>{
                if(res.data){
                    const name = res.data.firstName+" "+res.data.lastName
                    this.setState({
                        supervisorNameList: [...this.state.supervisorNameList, name]
                    })
                }
            })
        })
    }


    render() {
        return (
            <div>
                {this.state.supervisorNameList.map((user,index)=>{
                    return <p key={index}>{user}</p>
                })}
            </div>
        );
    }
}

export default CoordinatorList;