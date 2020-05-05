import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import Registration from "./Components/Registration";
import Login from "./Components/Login";
import AdminHome from "./Components/admin/AdminHome";
import CoordinatorHome from "./Components/coordinator/CoordinatorHome";
import SupervisorHome from "./Components/supervisor/SupervisorHome";
import StudentHome from "./Components/student/StudentHome";

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
