import React, { Component } from 'react'
import {getFromStorage} from "../../../utils/Storage";
import axios from "axios";
import Navbar from "../../shared/Navbar";
import BiweekData from "./BiweekData";
import { Container,Table } from 'react-bootstrap';
import Footer from "../../shared/Footer";

const backendURI = require('../../shared/BackendURI');

export class ViewBiweekly extends Component {

     constructor(props) {
          super(props)

          this.state = {
              biweeklyData: this.props.history.location.state.biweeklyData,
              loading: true
          }
     }

    componentDidMount() {
        this.getBiweekSubmissions()
    }

    getBiweekSubmissions = () => {

        const headers = {
            'auth-token':getFromStorage('auth-token').token,
        }
        const userId = getFromStorage("auth-id").id

        axios.get(backendURI.url+"/biweeksubmissions/getbiweeklinksubmissions/"+this.state.biweeklyData._id, {headers: headers}).then(res=>{
            this.setState({
                biWeekSubmissions: res.data,
                loading: false
            })
        })
    }
     
    render() {
        return (
            <div className="biweekly-supervisor">
                <Navbar panel={"coordinator"} />
                    <div style={{"min-height": "680px","padding": "0px 80px"}}>

                        <div className="title-div margin-top-30">
                            <h3 className="title">Biweekly Report {this.state.biweeklyData.biweeklyNumber} (Submissions)</h3>
                        </div>


                        <Table hover style={{ marginTop: 50 }} >
                            <thead>
                            <tr>
                                <th >Group No</th>
                                <th >Group Name</th>
                                <th >Submitted Date</th>
                                <th >Submitted Time</th>
                                <th >Supervisor Approvals</th>
                                <th >Attachment</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!this.state.loading && this.state.biWeekSubmissions.map((item,key)=> {

                                return <BiweekData details={item} key={key}/>


                            })}
                            </tbody>
                        </Table>
                    </div>
                <Footer/>
            </div>
        );
    }
}

export default ViewBiweekly
