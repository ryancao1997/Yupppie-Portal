import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';


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
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const sendEmail = async (values) => {
      event.preventDefault();
      console.log(values)
      try{
        axios.post(`http://18.218.78.71:8080/contact`,values)
        .then(res => {
          console.log("success")
          setEmailHasBeenSent(true)
        })
        .catch(error => {
            console.log(error)
            setError('Error. Make sure inputs are valid');
          });
      }
      catch(error){
        setError('Error. Make sure inputs are valid');
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
        <Formik
        onSubmit={(values) => sendEmail(values)}
        initialValues={{
          companyName: "",
          companyWebsite: "",
          email: "",
          phone: "",
          unitsManaged: "",
          managementSoftware: ""
        }}
        render={({ values, setFieldValue, handleChange }) => (
          <div>
          <Form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                autoComplete="companyName"
                name="companyName"
                variant="outlined"
                component={TextField}
                required
                fullWidth
                id="companyName"
                label="Company Name"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                autoComplete="companyWebsite"
                name="companyWebsite"
                component={TextField}
                variant="outlined"
                fullWidth
                id="companyWebsite"
                label="Company Website"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                variant="outlined"
                required
                fullWidth
                id="userEmail"
                component={TextField}
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                autoComplete="phoneNumber"
                name="phone"
                variant="outlined"
                type="number"
                required
                component={TextField}
                fullWidth
                id="phoneNumber"
                label="Phone Number"
              />
            </Grid>
            <Grid item xs={5}>
              <Field
                autoComplete="numUnits"
                name="unitsManaged"
                variant="outlined"
                required
                type = "number"
                component={TextField}
                fullWidth
                id="numUnits"
                label="Units Managed"
              />
            </Grid>
            <Grid item xs={7}>
            <FormControl className = {classes.small} variant="outlined" required>
              <InputLabel id="managementSoftware">Management Software</InputLabel>
              <Select
                name= "managementSoftware"
                labelId="managementSoftware"
                label="Management Software"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  Management Software
                </MenuItem>
                <MenuItem value={"Yardi"}>Yardi</MenuItem>
                <MenuItem value={"RealPage"}>RealPage</MenuItem>
                <MenuItem value={"AppFolio"}>AppFolio</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
                <MenuItem value={"None"}>None</MenuItem>
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
          >
            Enquire
          </Button>
          </Form>
          <Grid container justify="flex-end">
            <Grid item>
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 hover:text-blue-600">
                Sign in here
              </Link>
            </Grid>
          </Grid>
          </div>
        )}
      />
      </div>
    </Container>
    </div>
  );
};
export default SignUp;