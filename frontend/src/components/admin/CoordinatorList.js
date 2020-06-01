import React, {Component} from 'react';
import axios from 'axios';
import {getFromStorage} from "../../utils/Storage";
const backendURI = require('../shared/BackendURI');

class CoordinatorList extends Component {

    constructor(props){
        super(props);
        this.state = {
            coordinatorIDList: this.props.idList.coordinatorList,
            coordinatorNameList: [],
            props: props
        }

    }


    componentDidMount() {

        this.getCoordinatorList()
    }

    getCoordinatorList() {

        this.setState({
            coordinatorIDList: this.props.idList,
            coordinatorNameList: []
        })
        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        this.state.coordinatorIDList.map(id=>{
            axios.get(backendURI.url+'/users/stafflist/'+id, {headers: headers}).then(res=>{
                if(res.data){
                    const name = res.data.firstName+" "+res.data.lastName
                    this.setState({
                        coordinatorNameList: [...this.state.coordinatorNameList, name]
                    })
                }
            })
        })
    }


    render() {
        return (
            <div>
                {this.state.coordinatorNameList.map((user,index)=>{
                    return <p key={index}>{user}</p>
                })}
            </div>
        );
    }
}

export default CoordinatorList;