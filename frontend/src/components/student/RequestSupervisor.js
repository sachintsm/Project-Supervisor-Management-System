import React, {Component} from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Footer from '../shared/Footer';
import Navbar from "../shared/Navbar";
import '../../css/students/ViewProjects.scss'

export default class Profile extends Component {
    render(){
        return(
            <React.Fragment>
                    <Navbar panel={"student"} />
                    <div className="container-fluid view-projects view-project-background-color">
                        <Container>
                            <div className="card card-div current-card">
                                <h1>hiiii</h1>
                            </div>
                        </Container>
                    </div>
                    <Footer/>
            </React.Fragment>
        );
        
    }
}
