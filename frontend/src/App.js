import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Registration from './components/admin/Registration'
import Login from './components/Login';

/*********************************************************************************** */
import AdminHome from './components/admin/AdminHome';
import ViewUsers from './components/admin/ViewUsers';
import CreateProject from './components/admin/CreateProject';
import ProjectTypes from './components/admin/ProjectTypes';

import Footer from "./components/shared/Footer"
import Profile from "./components/shared/Profile";

import CoordinatorHome from './components/coordinator/CoordinatorHome';
import CreateGroup from './components/coordinator/CreateGroups'
import ProjectGroups from './components/coordinator/ProjectGroups'

import SupervisorHome from './components/supervisor/SupervisorHome';
import NoticeView from './components/shared/NoticeView';

import StudentHome from './components/student/StudentHome';

import Notice from './components/shared/Notice'

require('dotenv').config();


function App() {
  return (
    <React.Fragment>
      {/* <Navbar /> */}

      <Router>
        <Switch>
          <Route exact path='/' component={Login}></Route>
          {/* ======================= Admin Routes =============================== */}
          <Route exact path='/adminhome' component={AdminHome}></Route>
          <Route exact path='/adminhome/registration' component={Registration}></Route>
          <Route exact path="/profile" component={Profile}></Route>

          <Route exact path='/adminhome/viewusers' component={ViewUsers}></Route>
          <Route exact path='/adminhome/createproject' component={CreateProject}></Route>
          <Route exact path='/adminhome/projecttypes' component={ProjectTypes}></Route>
          <Route exact path='/shared/notice' component={Notice}></Route>

          {/* ==================================================================== */}
          <Route exact path='/coordinatorhome' component={CoordinatorHome}></Route>
          <Route exact path='/coordinatorhome/createGroups' component={CreateGroup}></Route>
          <Route exact path='/coordinatorhome/projectGroups' component={ProjectGroups}></Route>          
          <Route exact path='/shared/notice' component={Notice}></Route>
          <Route exact path='/shared/noticeView' component={NoticeView}></Route>

          {/* ==================================================================== */}
          <Route exact path='/supervisorhome' component={SupervisorHome}></Route>
          <Route exact path='/shared/noticeView' component={NoticeView}></Route>


          {/* ==================================================================== */}
          <Route exact path='/studenthome' component={StudentHome}></Route>
          <Route exact path='/shared/notice' component={NoticeView}></Route>



        </Switch>
      </Router>
    </React.Fragment >
  );
}

export default App;
