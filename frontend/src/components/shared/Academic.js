import React, {Component} from 'react';
import { verifyAuth } from "../../utils/Authentication";
import { getFromStorage } from "../../utils/Storage";
import axios from 'axios';
import { Table, Modal, Button, ButtonToolbar } from 'react-bootstrap';
import '../../css/shared/Profile.scss';
import { Row, Col } from "reactstrap";
import { confirmAlert } from 'react-confirm-alert';
import Snackpop from './Snackpop';

const backendURI = require("./BackendURI");



function CenteredModal(props) {
    const { hide,des,desH,re,...rest } = props
    return (
    
        <Modal responsive="true"
            {...rest}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal"
        >
                    
            <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
                Set Projects
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h5></h5>
            <form >
                <input className="form-control" value={des} onChange={desH} />
            </form>
            </Modal.Body>
            <Modal.Footer>
                <Button>Set</Button>
                <Button onClick={hide}>Close</Button>
            </Modal.Footer>
        </Modal>

    );
  }
  





const ProList = React.memo( props =>(

        
    <tr>
        <td>{props.pr.projectYear}</td>
        <td>{props.pr.projectType}</td>
        <td>{props.pr.academicYear}</td>
        <td></td>
        <td> <Button type="submit" value="Mod" className="btn btn-info" onClick={() => props.send()}>Set</Button> 
            <CenteredModal
                show={props.stat}
                hide={props.hiden}
                des={props.descrip}
                desH={props.desHan}
            />
        </td>
    </tr>
    
)
);
export default class Academic extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            authState: '',
            isSupervisor: '',
            search: '',
            proS: [],
            descript:'',
            show:false,
            dis:false
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.requestSup = this.requestSup.bind(this);
    } 
    handleSearch = e => {
        this.setState({ search: e.target.value.substr(0, 20) });
    };
    handleChange = e =>{
        this.setState({
            descript: e.target.value
        })
    }
    showModal = () => {
        this.setState({show: true});
    };
    hideModal = () => {
        this.setState({ show: false,descript:'' });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }
    ProList1() {
        
        let filteredProjects = this.state.proS.filter(
            (currentProj) => {
                console.log(currentProj);
                return currentProj.projectType.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
            }
        );

        return filteredProjects.map((currentProj, i) => {
            console.log(i);
            if (currentProj.isDeleted === false) {
                return <ProList  pr={currentProj} key={i}  hiden={this.hideModal}  send={this.requestSup}
                    dis={this.state.dis}  stat={this.state.show} desHan={this.handleChange}/>;
           }
        })
    }
    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        const userData = getFromStorage('auth-id')

        axios.get(backendURI.url + '/users/getSupPro/' + userData.id)
            .then(response => {
                console.log(response.data.data);

                this.setState({ proS: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }
   
    requestSup() {
        const userData = getFromStorage('auth-id')
        this.showModal();
    }
    render() {
        return(
            <div className="container-fluid">
            <div className="row">
                    <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                        <div className="container">
                            <div className="row" style={{ marginTop: "20px" }}>
                                <div className="card">
                                    <div>
                                        <h3 className="sp_head">List of Projects</h3>
                                            <form>
                                                <div className="form-group" style={{ marginTop: "50px", marginLeft: "40px", marginRight: "40px" }} >
                                                    <input className="form-control" type="Id" name="Id" id="Id" placeholder="Search  here" onChange={this.handleSearch}/>
                                                </div>
                                            </form>
                                                <div className="container" style={{marginLeft:"24px", width:"95.5%"}}>
                                                    <Table responsive >
                                                        <thead>
                                                            <tr>
                                                                <th>Year</th>
                                                                <th>Type</th>
                                                                <th> Year</th>
                                                                <th>Maximum Projects</th>
                                                                <th>Set Projects</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {this.ProList1()}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        )
    }
}