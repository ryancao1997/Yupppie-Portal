import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button } from '@material-ui/core';
import { Link } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import { useAuthDispatch, logout, useAuthState } from '../Context';

const useStyles = makeStyles((theme) => ({
  link: {
    marginLeft : 30,
    textTransform: 'none'
  },
}))

function Navbar() {
  const handleLogout = (event) => {
        event.preventDefault()
        logout(dispatch)
        window.location.href = '/'
      };
  const user = useAuthState();
  const dispatch = useAuthDispatch();
  const classes = useStyles();
  return (
        <AppBar position="static">
          <Toolbar>  
            <Typography>
              <Link href = "/" onClick={handleLogout} color="inherit" className = {classes.link}>
                Logout
              </Link>
              <Link href="/dashboard" color="inherit" className = {classes.link}>
                Dashboard
              </Link>
              <Link href="/leads" color="inherit" className = {classes.link}>
                Leads
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
  );
}
export default Navbar;