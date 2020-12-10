import React, { useContext, useState } from "react";
import { UserContext } from "../Providers/UserProvider";
import {auth} from "../firebase";
import { Formik, Form, Field, FieldArray } from 'formik';
import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import {firestore, storage} from "../firebase"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import UploadComponent from './UploadComponent';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  messagePaper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '180%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    width: '100%',
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontSize : 20
  },
  addUnit: {
    marginLeft: theme.spacing(0),
    marginTop: -5,
    width: '100%',
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none'
  },
  end: {
    width: '19.1%',
  },
  small: {
  	width: '19.1%',
  	marginRight: theme.spacing(1),
  },
  city: {
    width: '67.6%',
    marginRight: theme.spacing(1),
  },
  state: {
    width: '10%',
    marginRight: theme.spacing(1),
  },
  zip: {
    width: '20%',
  },
  large: {
  	width: '100%',
  },
  upload: {
  	width: '100%',
  },
  messages: {
  	width: '180%',
  	textTransform: 'none'
  }
}));

const AddBuilding = () => {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const [unitSubmitted, setUnitSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = (values) => {
    console.log(values)
    try {
      firestoreUpload(values); 
      setUnitSubmitted(true);
      setSuccessMessage(true);
    } catch (error) {
      setError("Error adding building to platform. Make sure inputs are valid");
    }
  };
  async function firestoreUpload(values) {
    let doc = await submitHandler(values);
    if (!doc) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      firestore.collection("buildings").doc(doc.address).set(doc);
    }
  }

    const uploadFile = async (x) => {
      return new Promise((resolve, reject) => {
        console.log(x[0].name)
        const photoUpload = storage.ref(`images/${x[0].name}`).put(x[0])
        photoUpload.on(
          "state_changed",
          snapshot => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          error => {
                        console.log(error);
            reject(error)
          },
          () => {
            storage
              .ref("images")
              .child(x[0].name)
              .getDownloadURL()
              .then(url => {
                console.log('url', url);
                resolve(url);
              });
          }
        );
    });
  }

  const submitHandler = async (values) => {
    console.log(values)
    const urls = await Promise.all(values.files.map((fileArray) => uploadFile(fileArray)));
    console.log('urls', urls)
    let address = values.streetAddress+', '+values.city+', '+ values.state+', '+ values.zip
    let doc = {
      companyName: user.companyName,
      buildingName: values.buildingName,
      address: address,
      description: values.description,
      photoUrls: urls
    };
    return doc;
  };

  const handleAddAnother = () => {
    setUnitSubmitted(false);
    window.location.reload();
  };
  return (
    <div>
      <Formik
        onSubmit={(values) => handleSubmit(values)}
        initialValues={{
          buildingName: "",
          streetAddress: "",
          zip: "",
          city: "",
          state: "",
          description: "",
          files: null,
        }}
        render={({ values, setFieldValue, handleChange }) => (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      required
                      className={classes.large}
                      component={TextField}
                      type="buildingName"
                      label="Building Name"
                      name="buildingName"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      required
                      className={classes.large}
                      component={TextField}
                      type="address"
                      label="Street Address"
                      name="streetAddress"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      required
                      className={classes.city}
                      component={TextField}
                      type="city"
                      label="City"
                      name="city"
                      fullWidth
                      variant="outlined"
                    />
                    <Field
                      required
                      className={classes.state}
                      component={TextField}
                      type="state"
                      label="State"
                      name="state"
                      fullWidth
                      variant="outlined"
                    />
                    <Field
                      required
                      className={classes.zip}
                      component={TextField}
                      type="zip"
                      label="Zip"
                      name="zip"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      required
                      className={classes.large}
                      component={TextField}
                      multiline
                      rows={4}
                      type="description"
                      label="Description"
                      name="description"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <UploadComponent name = "files" className = {classes.upload} setFieldValue={setFieldValue} />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </Container>
        )}
      />
      <Container component="main" maxWidth="xs">
        <div className={classes.messagePaper}>
          {error != null && (
            <Alert
              className={classes.messages}
              severity="error"
              onClose={() => {
                setError(null);
              }}
            >
              {error}
            </Alert>
          )}
          {unitSubmitted && successMessage && (
            <Alert
              className={classes.messages}
              severity="success"
              onClose={() => {
                setSuccessMessage(false);
              }}
            >
              Building succesfully added to Yuppie!
            </Alert>
          )}
          <br />
          {unitSubmitted && (
            <Button
              onClick={handleAddAnother}
              className={classes.messages}
              variant="contained"
            >
              Add Another Building
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};
export default AddBuilding;
