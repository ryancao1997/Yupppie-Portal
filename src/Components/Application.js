import React, { useContext } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Header from "./Header"
import UserProvider from "../Providers/UserProvider";
import { UserContext } from "../Providers/UserProvider";
import PasswordReset from "./PasswordReset";
import Navbar from "./Navbar"
import Dashboard from "./Dashboard"
import AddBuilding from './AddBuilding'
import AddUnit from './AddUnit'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";

function Application() {
  const user = useContext(UserContext);
  return (
        user ?
        <Router>
          <Navbar/>
          <Header/>
          <Route exact path="/">
              <Redirect to="/dashboard" />
          </Route>
          <Route path="/SignUp">
              <Redirect to="/dashboard" />
          </Route>
          <Route exact path="/PasswordReset">
              <Redirect to="/dashboard" />
          </Route>
          <Route path = "/dashboard" exact component = {Dashboard}/>
        </Router>
        :
        <Router>
          <Route path = "/" exact component = {SignIn} />
        </Router>

  )
}
export default Application;

