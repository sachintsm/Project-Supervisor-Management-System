import React, { Component } from 'react'
import { Table } from 'react-bootstrap'


import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';

import '../../../css/coordinator/SubmissionView.scss';


class ViewSubmission extends Component {

     constructor(props) {
          super(props)

          this.state = {

          }
     }

     render() {
          return (
               <React.Fragment>
                    <Navbar panel={"coordinator"} />

                    <div className="SubView_style">

                         <div className="container-fluid page_style">

                              <div className="container">

                                   <Table>

                                        <thead>
                                             <tr>
                                                  <th className="table-head">Group</th>
                                                  <th className="table-head">Members' Ids</th>
                                                  <th className="table-head">Supervisors</th>
                                             </tr>
                                        </thead>

                                   </Table>
                              </div>
                         </div>
                    </div>



                    <Footer />
               </React.Fragment>
          )
     }
}

export default ViewSubmission
