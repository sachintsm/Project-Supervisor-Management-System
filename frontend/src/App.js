import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Registration from "./components/Registration";
import Login from "./components/Login";
import AdminHome from "./components/admin/AdminHome";
import viewusers from "./components/admin/ViewUsers";
import CoordinatorHome from "./components/coordinator/CoordinatorHome";
import SupervisorHome from "./components/supervisor/SupervisorHome";
import StudentHome from "./components/student/StudentHome";
import ViewUsers from "./components/admin/ViewUsers";

require("dotenv").config();

function App() {
  return (
    <React.Fragment>
      {/* <Navbar /> */}

      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/registration" component={Registration}></Route>
          <Route exact path="/adminhome" component={AdminHome}></Route>
          <Route exact path="/adminhome/viewusers" component={ViewUsers}></Route>

          <Route
            exact
            path="/coordinatorhome"
            component={CoordinatorHome}
          ></Route>
          <Route
            exact
            path="/supervisorhome"
            component={SupervisorHome}
          ></Route>
          <Route exact path="/studenthome" component={StudentHome}></Route>
        </Switch>
      </Router>

      {/* <Footer /> */}
    </React.Fragment>
  );
}

export default App;
