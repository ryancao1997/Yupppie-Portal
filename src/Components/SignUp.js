import React, { useState } from "react";
import { Link } from "react-router-dom";
import {auth} from "../firebase"
import {generateUserDocument} from "../firebase"
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';


const useStyles = makeStyles((theme) => ({
  logo: {
    height: 200,
    width: 200,
    marginBottom:-100,
    marginTop: -30
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none'
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [firstName, setfirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);
  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
      event.preventDefault();
      try{
        const {user} = await auth.createUserWithEmailAndPassword(email, password);
        generateUserDocument(user, {companyName, fullName, phoneNumber});
      }
      catch(error){
        setError('Error signing up. Make sure inputs are valid');
      }

    };
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    } else if (name === "companyName") {
      setCompanyName(value);
    } else if (name === "firstName") {
      setFullName(value);
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
  };
  return (
    <div>
    <center>
        <img src={require('../Images/logo.png')} alt="Logo" className = {classes.logo}/>
    </center>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {error !== null && <Alert severity="error" onClose={() => {setError(null)}}>{error}</Alert>}
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoComplete="firstName"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value = {firstName}
                onChange = {(event) => onChangeHandler(event)}
                autoFocus
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="lastName"
                name="lastName"
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                value = {lastName}
                onChange = {(event) => onChangeHandler(event)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="companyName"
                name="companyName"
                variant="outlined"
                required
                fullWidth
                id="companyName"
                label="Company Name"
                value = {companyName}
                onChange = {(event) => onChangeHandler(event)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="phoneNumber"
                name="phoneNumber"
                variant="outlined"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                value = {phoneNumber}
                onChange = {(event) => onChangeHandler(event)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="userEmail"
                label="Email Address"
                name="userEmail"
                autoComplete="email"
                value = {email}
                onChange = {(event) => onChangeHandler(event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="userPassword"
                label="Password"
                type="password"
                id="userPassword"
                autoComplete="current-password"
                value = {password}
                onChange = {(event) => onChangeHandler(event)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={event => {
              createUserWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 hover:text-blue-600">
                Sign in here
              </Link>{" "}
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </div>
  );
};
export default SignUp;