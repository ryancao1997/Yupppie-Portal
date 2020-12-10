import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  logo: {
    height: 200,
    width: 200,
    marginBottom:-100,
    marginTop: -30
  },

}));
function Header() {
  const classes = useStyles();
  return (
        <center>
        <img src={require('../Images/logo.png')} alt="Logo" className = {classes.logo}/>
        </center>
  );
}
export default Header;