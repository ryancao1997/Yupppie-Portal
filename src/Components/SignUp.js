import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


const useStyles = makeStyles((theme) => ({
  logo: {
    height: 200,
    width: 200,
    marginBottom:-100,
    marginTop: -30
  },
  small: {
          width: '100%'

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
  const [backendService, setBackendService] = useState("");
  const [numUnits, setNumUnits] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const sendEmail = async (email,companyName, phoneNumber) => {
      event.preventDefault();
      try{
        let payload = {
          companyName: companyName,
          phone: phoneNumber,
          email: email,
          companyWebsite: companyWebsite,
          unitsManaged: numUnits,
          managementSoftware: backendService
        }
        console.log(payload)
        axios.post(`http://18.218.78.71:8080/contact`,payload)
        .then(res => {
          console.log("success")
        })
        .catch(error => {
            console.log(error)
          });
        setEmailHasBeenSent(true)
      }
      catch(error){
        setError('Error. Make sure inputs are valid');
      }

    };
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "companyWebsite") {
      setCompanyWebsite(value);
    } else if (name === "companyName") {
      setCompanyName(value);
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
    } else if (name === "numUnits") {
      setNumUnits(value);
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
          List with Yuppie.
        </Typography>
        {error !== null && <Alert severity="error" onClose={() => {setError(null)}}>{error}</Alert>}
        {emailHasBeenSent && <Alert severity="success" onClose={() => {setEmailHasBeenSent(false)}}>We will reach out to you shortly.</Alert>}
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="companyWebsite"
                name="companyWebsite"
                variant="outlined"
                required
                fullWidth
                id="companyWebsite"
                label="Company Website"
                value = {companyWebsite}
                onChange = {(event) => onChangeHandler(event)}
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
                autoComplete="phoneNumber"
                name="phoneNumber"
                variant="outlined"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                value = {phoneNumber}
                onChange = {(event) => onChangeHandler(event)}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                autoComplete="numUnits"
                name="numUnits"
                variant="outlined"
                required
                type = "number"
                fullWidth
                id="numUnits"
                label="Units Managed"
                value = {numUnits}
                onChange = {(event) => onChangeHandler(event)}
              />
            </Grid>
            <Grid item xs={7}>
            <FormControl className = {classes.small} variant="outlined" required>
              <InputLabel id="managementSoftware">Management Software</InputLabel>
              <Select
                value = {backendService}
                name= "backendService"
                labelId="managementSoftware"
                label="Management Software"
                onChange={(value) => setBackendService(value.target.value)}
              >
                <MenuItem value="" disabled>
                  Management Software
                </MenuItem>
                <MenuItem value={"Yardi"}>Yardi</MenuItem>
                <MenuItem value={"RealPage"}>RealPage</MenuItem>
                <MenuItem value={"AppFolio"}>AppFolio</MenuItem>
                <MenuItem value={""}>None</MenuItem>
              </Select>
            </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={event => {
              sendEmail(email, companyName, phoneNumber);
            }}
          >
            Enquire
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