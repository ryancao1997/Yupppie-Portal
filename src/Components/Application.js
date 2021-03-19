import React, { useContext } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Header from "./Header"
import PasswordReset from "./PasswordReset";
import Navbar from "./Navbar"
import Dashboard from "./Dashboard"
import AddUnit from './AddUnit'
import { useAuthState } from '../Context'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import Leads from './Leads'

function Application() {
  const user = useAuthState();
  return (
        (user.user) ?
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
          <Route path = "/leads" exact component = {Leads}/>
        </Router>
        :
        <Router>
          <Route path = "/" exact component = {SignIn} />
          <Route path = "/Enquire" exact component = {SignUp}/>
          <Route exact path="/dashboard">
              <Redirect to="/" />
          </Route>
        </Router>


  )
}
export default Application;

