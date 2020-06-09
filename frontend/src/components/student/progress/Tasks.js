import React, {Component} from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import {Input,Label, Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import "../../../css/students/progress/Tasks.scss"
import Footer from "../../shared/Footer";
import {IconContext} from "react-icons";
import {AiOutlineFileAdd} from "react-icons/ai";
import {AiOutlineAppstoreAdd} from "react-icons/ai";
import Slider from '@material-ui/core/Slider';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const muiTheme = createMuiTheme({
    overrides:{
        MuiSlider: {
            thumb:{
                color: "#000",
            },
            track: {
                color: '#444'
            },
            rail: {
                color: '#888'
            }
        }
    }
});

class Tasks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: props.location.state.projectDetails,
            groupDetails: props.location.state.groupDetails,
        }
        console.log(this.state)
    }
    openModal = () => {
        this.setState({ modal: true });
    }
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
    toggle = () => {
        this.setState({
            modal: !this.state.modal,
        });
    };
    taskWeightHandler=(value) => {

    }
    render() {
        console.log(this.state.project)
        return (
            <React.Fragment>
                <div className="container-fluid tasks tasks-background-color">
                    <Container>
                        <Row>
                            <Col lg={4} md={4} xs={2} sm={1}></Col>
                            <Col lg={4} md={4} xs={8} sm={10}>
                                <Card className="btn-card" onClick={()=>{this.openModal()}}>
                                    <IconContext.Provider value={{ className: 'btn-icon', size:"2em"}}>
                                        <div>
                                            {/*<AiOutlineAppstoreAdd />*/}
                                            <AiOutlineFileAdd />

                                        </div>
                                    </IconContext.Provider><span className="btn-title">Add New Task</span></Card>
                            </Col>
                            <Col lg={4} md={4} xs={2} sm={1}></Col>
                        </Row>
                    </Container>
                </div>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add New Task</ModalHeader>
                    <ModalBody>
                        <div className="container">
                            <div className="row">
                            </div><div style={{ width: "100%", margin: "auto", marginTop: "20px" }}>
                            <form onSubmit={this.onSubmit}>

                                <div className="form-group">
                                    <Label for="avatar">Task Title</Label>
                                    <Input type="text" className="form-control" name="task-title" onChange={this.onChange} />
                                    <p className="reg-error">{this.state.contactNumberError}</p>
                                </div>

                                <div className="form-group">
                                    <Label for="avatar">Task Weight ( 1-10 )</Label>

                                    <ThemeProvider theme={muiTheme}>

                                        <Slider defaultValue={30} getAriaValueText={this.taskWeightHandler} aria-labelledby="discrete-slider"
                                            valueLabelDisplay="auto" step={1} min={1} max={10} />
                                    </ThemeProvider>
                                </div>
                                <div className="form-group">
                                    <Button className="btn btn-info my-4" type="submit" block>Add Task</Button>
                                </div>
                            </form>
                        </div>
                        </div>
                    </ModalBody>
                </Modal>

                    <Footer/>
            </React.Fragment>
        );
    }
}

export default Tasks;