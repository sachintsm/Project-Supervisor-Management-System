import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";

import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./components/basic/Home";
import AdminHome from "./components/admin/AdminHome";
import CoordinatorHome from "./components/coordinator/CoordinatorHome";
import SupervisorHome from "./components/supervisor/SupervisorHome";
import StudentHome from "./components/student/StudentHome";
require("dotenv").config();

function App() {
  return (
    <React.Fragment>
      {/* <Navbar /> */}

      <Router>
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/registration" component={Registration}></Route>
          <Route exact path="/adminHome" component={AdminHome}></Route>
          <Route
            exact
            path="/coordinatorHome"
            component={CoordinatorHome}
          ></Route>
          <Route
            exact
            path="/supervisorHome"
            component={SupervisorHome}
          ></Route>
          <Route exact path="/studentHome" component={StudentHome}></Route>
        </Switch>
      </Router>

      {/* <Footer /> */}
    </React.Fragment>
  );
}

export default App;
