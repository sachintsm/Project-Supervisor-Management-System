import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/auth/navbar";
import Footer from "./components/auth/footer";

import Registration from "./components/admin/registration";
import Login from "./components/admin/login";
import Home from "./components/basic/home";
require("dotenv").config();

function App() {
  return (
    <React.Fragment>
      <Navbar />

      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/registration" component={Registration}></Route>
          <Route exact path="/login" component={Login}></Route>
        </Switch>
      </Router>

      <Footer />
    </React.Fragment>
  );
}

export default App;
