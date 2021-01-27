import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none'
  },
}));

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    }
  };

  const sendResetEmail = event => {
    event.preventDefault();
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
          Reset Your Password
        </Typography>
        {error !== null && <Alert severity="error" onClose={() => {setError(null)}}>{error}</Alert>}
        {emailHasBeenSent && <Alert severity="success" onClose={() => {setEmailHasBeenSent(false)}}>Password Reset Email Sent</Alert>}
        <form className={classes.form} noValidate>
          <Grid container spacing={0}>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={event => {
              sendResetEmail(event);
            }}
          >
            Reset Password
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                to="/"
                className="my-2 text-blue-700 hover:text-blue-800 text-center block"
              >
                back to sign in page
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </div>
  );
};

export default PasswordReset;