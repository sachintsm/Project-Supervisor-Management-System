import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class IndividualProgressTask extends Component {


    componentDidMount() {
        console.log("sex")
    }
    render() {
        return (
            <div>
                sachin  progressive
            </div>
        );
    }
}

export default withRouter(IndividualProgressTask);