import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from './Component/Auth/navbar';
import Footer from './Component/Auth/footer'

import Registration from './Component/Admin/registration';
import Login from './Component/Admin/login';
import Home from './Component/Basic/Home';

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

      <Footer/>
    </React.Fragment>
  );
}


export default App;
