import React, {Component} from 'react';
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";

const backendURI = require('../../shared/BackendURI');

class ProjectName extends Component {
    constructor(props) {
        super(props);
        this.state={
            id: this.props.id,
            loading: true,
        }
    }

    componentDidMount() {
        this.getName()
    }

    getName = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }

        axios.get(backendURI.url+'/projects/getProjectName/'+this.state.id,{headers: headers}).then(res=>{
            this.setState({
                projectName: res.data.data,
                loading: false
            })
        })
    }

    render() {
        return (
            <span>
                {!this.state.loading &&(
                    <div>
                        {this.state.projectName.projectYear}<br/>{this.state.projectName.projectType}<br/>{this.state.projectName.academicYear}
                    </div>
                )}
            </span>
        );
    }
}

export default ProjectName;