import React, { Component } from 'react';

import Navbar from '../../shared/Navbar';





class Proposals extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    



    render() {
        return (
            <React.Fragment>
            <Navbar panel={"coordinator"} />
            <div className="container">
                <div className="card">
                 <h2>Proposel</h2>
                </div>
            </div>
           </React.Fragment>
        );
    }
}

export default Proposals;