import React, {useState, useContext} from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios'
import { loginUser, useAuthState, useAuthDispatch } from '../Context/index' 


const useStyles = makeStyles((theme) => ({
  logo: {
    height: 100,
    width: 300,
    marginBottom:-50,
    marginTop: 10
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none'
  },
}));

const SignIn = () => {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const dispatch  = useAuthDispatch()
    let link = `http://18.218.78.71:8080/property-managers/login`
    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        const user = {
          email: email.toLowerCase(),
          password: password
        }
        axios.post(link,user)
        .then(res => {
          loginUser(dispatch , res.data)
        })
        .catch(error => {
            setError("Wrong email or password");
            console.error("Error signing in with password and email", error);
          });
      };
    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'userEmail') {
            setEmail(value);
        }
        else if(name === 'userPassword'){
          setPassword(value);
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
          Sign In
        </Typography>
        {error !== null && <Alert severity="error" onClose={() => {setError(null)}}>{error}</Alert>}
        <form className={classes.form} noValidate>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="userEmail"
            value = {email}
            id="userEmail"
            onChange = {(event) => onChangeHandler(event)}
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="userPassword"
            value={password}
            type="password"
            id="userPassword"
            onChange = {(event) => onChangeHandler(event)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}
          >
            Sign In
          </Button>
        </form>
          <Link
                to="/Enquire"
                className="my-2 text-blue-700 hover:text-blue-800 text-center block"
              >
                Click here to begin listing with us
              </Link>
      </div>
    </Container>
    </div>
  );
};
export default SignIn;