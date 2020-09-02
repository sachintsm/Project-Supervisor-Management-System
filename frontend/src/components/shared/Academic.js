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
    const { hide,des,desH,re,increase,decrease,up,...rest } = props
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
                
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5></h5>
                <form >
                    <Row>
                        <Col md={3} xs="12">
                            <Button onClick={increase}>+</Button>
                        </Col>
                        <Col md={6} xs="12">
                            <input className="form-control" value={des} onChange={desH} readOnly/>
                        </Col>
                        <Col md={3} xs="12">
                            <Button onClick={decrease} >-</Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={up}>Set</Button>
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
        <td> <Button type="submit" value="Mod" className="btn btn-info" onClick={() => props.send(props.pr._id,props.pr.academicYear,props.limit,props.pr.projectType,props.pr.projectYear)}>Set</Button> 
            <CenteredModal
                show={props.stat}
                hide={props.hiden}
                des={props.descrip}
                desH={props.desHan}
                increase={props.in}
                decrease={props.de}
                up={props.update}
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
            proL:[],
            descript:0,
            show:false,
            dis:false,
            proId:'',
            acaYear:'',
            type:'',
            year:'',
            snackbaropen: false,
            snackbarmsg: '',
            snackbarcolor: '',
        }

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setPro= this.setPro.bind(this);
        this.changePro= this.changePro.bind(this);
        this.IncrementItem = this.IncrementItem.bind(this);
        this.DecreaseItem = this.DecreaseItem.bind(this);
    } 
    closeAlert = () => {
        this.setState({ snackbaropen: false });
    };
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
        this.setState({ show: false,descript:0 });
    };

    onChange = (e) => {
        e.persist = () => { };
        let store = this.state;
        store[e.target.name] = e.target.value
        this.setState(store);
    }

    IncrementItem = () => {
        if(this.state.descript < 10){
            this.setState({
                descript: (this.state.descript + 1)
            });
        }else{
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'You cannot set more than 10 !',
                snackbarcolor: 'error',
                descript:this.state.descript,
            })
        }
    }
    DecreaseItem = () => {
        if(this.state.descript > 0){
            this.setState({
                descript: (this.state.descript - 1)
            });
        }else{
            this.setState({
                snackbaropen: true,
                snackbarmsg: 'Always set the value greater than 0 !',
                snackbarcolor: 'error',
                descript:0,
            })
        }
    }

    changePro(){
        console.log(this.state.proId);
        const userData = getFromStorage('auth-id')
        this.setState({
            show:false
        })
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to set limit?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const obj = {
                        sup_id: userData.id,
                        project_id:this.state.proId,
                        academic_year:this.state.acaYear,
                        descript:this.state.descript,
                        proType:this.state.type,
                        proYear:this.state.year,
                    };
                    console.log(obj);
                    axios.post(backendURI.url + "/users/setLimit" , obj)
                    .then(res => {
                        
                        console.log(res.data)
                        if(res.data.state==true){
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg: res.data.msg,
                                snackbarcolor: 'success',
                                descript:0,
                                
                            })
                        }
                        else{
                            this.setState({
                                snackbaropen: true,
                                snackbarmsg:res.data.msg,
                                snackbarcolor: 'error',
                                descript:0
                            })
                            
                        }
                        window.location.reload(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.setState({
                            snackbaropen: true,
                            snackbarmsg:'Something went wrong',
                            snackbarcolor: 'error',
                            descript:0
                        })
                        window.location.reload(false);
                    })
                }
              },
              {
                label: 'No',
                onClick: () => {
                    window.location.reload(false);
                }
              }
            ]
          })
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
            if (currentProj.isDeleted === false && currentProj.projectState === true) {
                return <ProList  pr={currentProj} key={i} limit={this.state.proL} hiden={this.hideModal}  send={this.setPro}
                    dis={this.state.dis}  stat={this.state.show} desHan={this.handleChange} update={this.changePro}
                    in={this.IncrementItem} de={this.DecreaseItem} descrip={this.state.descript}/>;
           }
        })
    }
    async componentDidMount() {
        const authState = await verifyAuth();
        this.setState({ authState: authState });
        const userData = getFromStorage('auth-id')

        axios.get(backendURI.url + '/users/getSupProAca/' + userData.id)
            .then(response => {
                console.log(response.data.data[0]._id);
                var l =(response.data.data).length;
                console.log(l);
                this.setState({ proS: response.data.data });
                var arr1 = [];
                for(var i=0; i<l; i++){
                   const ob = {
                         pro : response.data.data[i]._id
                    }
                   
                   axios.post(backendURI.url + "/users/getLimit/" +userData.id , ob)
                    .then(res => {  
                        console.log(res.data.data[0].noProjects);
                        arr1.push(res.data.data[0]);
                        
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                }
                console.log(arr1);
                this.setState({ proL: arr1 });
                console.log(this.state.proL);
                
            })
            .catch(function (error) {
                console.log(error);
            })
    }
   
    setPro(id,year,k,proType,proYear) {
        const userData = getFromStorage('auth-id')
        console.log(k);
        console.log(year)
        if(k.length ===0){
            this.setState({
                proId:id,
                acaYear:year,
                descript:0,
                type:proType,
                year:proYear
            })
            this.showModal();
        }else{
        for(var i=0;i<k.length;i++){
            if((year === k[i].academicYear) && (proType === k[i].projectType)){
                console.log('yes');
                this.setState({
                    proId:id,
                    acaYear:year,
                    descript:k[i].noProjects,
                    type:proType,
                    year:proYear
                })
                this.showModal();
                return;
            }
            else{
                console.log(proType);
                this.setState({
                    proId:id,
                    acaYear:year,
                    descript:0,
                    type:proType,
                    year:proYear
                })
                this.showModal();
            }
        }
    }
       
        
    }
    render() {
        return(
            <div className="container-fluid">
            <Snackpop
            msg={this.state.snackbarmsg}
            color={this.state.snackbarcolor}
            time={3000}
            status={this.state.snackbaropen}
            closeAlert={this.closeAlert}
            />
            <div className="row">
                    <div className="col-md-12" style={{ backgroundColor: "#f8f9fd", minHeight: "1000px" }}>
                        <div className="container">
                            <div className="row" style={{ marginTop: "20px" }}>
                                <div className="card">
                                    <div>
                                        <h3 className="sp_head"></h3>
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
                                                                <th> Academic Year</th>
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