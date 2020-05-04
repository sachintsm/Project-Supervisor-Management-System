import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./Components/auth/navbar";
import Footer from "./Components/auth/footer";

import Registration from "./Components/admin/registration";
import Login from "./Components/admin/login";
import Home from "./Components/basic/Home";

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
