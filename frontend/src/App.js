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

import Profile from "./components/shared/Profile";
import EditProfile from "./components/admin/EditUser";


import CoordinatorHome from './components/coordinator/CoordinatorHome';
import CreateGroup from './components/coordinator/CreateGroups'
import ProjectGroups from './components/coordinator/ProjectGroups'
import GroupData from './components/coordinator/GroupData/GroupData';
import AssignSupervisor from './components/coordinator/AssignSupervisors';
import SupervisorData from './components/coordinator/SupervisorData/SupervisorData';
import BiWeekly from './components/coordinator/ProjectData/BiWeekly';
import Groups from './components/coordinator/ProjectData/Groups';
import Proposals from './components/coordinator/ProjectData/Proposals';
import SRS from './components/coordinator/ProjectData/SRS';
import Supervisors from './components/coordinator/ProjectData/Supervisors';


import SupervisorHome from './components/supervisor/SupervisorHome';
import NoticeView from './components/shared/NoticeView';

import StudentHome from './components/student/StudentHome';
import ViewProjects from "./components/student/ViewProjects";
import ViewProject from "./components/student/ViewProject";
import Tasks from "./components/student/progress/Tasks";

import Notice from './components/shared/Notice'
import GroupChat from "./components/shared/GroupChat/GroupChat";

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
          <Route exact path="/editprofile/:id" component={EditProfile}></Route>


          <Route exact path='/adminhome/viewusers' component={ViewUsers}></Route>
          <Route exact path='/adminhome/createproject' component={CreateProject}></Route>
          <Route exact path='/adminhome/projecttypes' component={ProjectTypes}></Route>
          <Route exact path='/shared/notice' component={Notice}></Route>

          {/* =================== Coordinator Routes ============================== */}
          <Route exact path='/coordinatorhome' component={CoordinatorHome}></Route>
          <Route exact path='/coordinatorhome/createGroups' component={CreateGroup}></Route>
          <Route exact path='/coordinatorhome/projectGroups' component={ProjectGroups}></Route>
          <Route path='/coordinatorhome/groupData/:id' component={GroupData}  ></Route>
          <Route exact path='/shared/notice' component={Notice}></Route>
          <Route exact path='/shared/noticeView' component={NoticeView}></Route>
          <Route exact path='/coordinatorhome/projectGroups' component={ProjectGroups}></Route>
          <Route path='/coordinatorhome/assignSupervisors' exact component={AssignSupervisor}></Route>
          <Route path='/coordinatorhome/supervisorData/:id' component={SupervisorData}></Route>

          <Route path='/coordinatorhome/projectdata/BiWeekly/:id' component={BiWeekly}></Route>
          <Route path='/coordinatorhome/projectdata/Groups/:id' component={Groups}></Route>
          <Route path='/coordinatorhome/projectdata/Proposals/:id' component={Proposals}></Route>
          <Route path='/coordinatorhome/projectdata/SRS/:id' component={SRS}></Route>
          <Route path='/coordinatorhome/projectdata/Supervisors/:id' component={Supervisors}></Route>


          {/* ================== Supervisor Routes========================= */}
          <Route exact path='/supervisorhome' component={SupervisorHome}></Route>
          <Route exact path='/shared/noticeView' component={NoticeView}></Route>

          {/* =================== Student Routes ============================== */}
          <Route exact path='/studenthome' component={StudentHome}></Route>
          <Route exact path='/studenthome/viewprojects' component={ViewProjects}></Route>
          <Route exact path='/studenthome/viewproject' component={ViewProject}></Route>
          <Route exact path='/studenthome/viewproject/progress-tasks' component={Tasks}></Route>
          <Route exact path='/shared/notice' component={NoticeView}></Route>

          <Route path='/studenthome/chat/:id' component={GroupChat}></Route>

        </Switch>
      </Router>
    </React.Fragment >
  );
}

export default App;
