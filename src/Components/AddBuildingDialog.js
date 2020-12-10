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
import { Alert, AlertTitle } from '@material-ui/lab';
import {firestore, storage} from "../firebase"
import InputLabel from '@material-ui/core/InputLabel';
import UploadComponent from './UploadComponent';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import UnitInfo from './UnitInfo'
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  paper: {
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    width: '100%',
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontSize : 20
  },
  subtitle: {
    fontSize : 20,
  },
  addUnit: {
    marginLeft: theme.spacing(0),
    marginTop: -2,
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontSize : 20
  },
  container: {
    width: '100%',
  },
  messages: {
  	width: '100%',
  	textTransform: 'none'
  },
  font: {
    fontSize: 30
  },
  close: {
    textTransform: 'none'
  }
}));

const AddBuildingDialog = (props) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear()
  var datePlaceholder = yyyy + '-' + mm + '-' + dd;
  const user = useContext(UserContext);
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const [unitSubmitted, setUnitSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([])
  const { onSubmit, onClose, open, companyName } = props;
  const handleUpload = (uploadFiles) => {
    setFiles(uploadFiles)
  }
  const handleClose = () => {
    setSuccessMessage(false)
    onClose();
  };
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
      
    onSubmit(doc)
    }
  }

    const uploadFile = async (x) => {
      return new Promise((resolve, reject) => {
        console.log(x.name)
        const photoUpload = storage.ref(`images/${x.name}`).put(x)
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
              .child(x.name)
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
    var today = new Date();
    let doc = {
      id: uuidv4(),
      companyName: companyName,
      buildingName: values.buildingName,
      address: address,
      description: values.description,
      photoUrls: urls,
      amenities: values.amenities,
      createdDate: today,
      lastEdited: today
    };
    firestore.collection("buildings").doc(doc.id).set(doc);
      var unitDocs = []
      var x
      for (x of values.units){
        let unitDoc = {
            id: uuidv4(),
            companyName: companyName,
            address: doc.address,
            unit: x.unit,
            price: x.price,
            bedrooms: x.bedrooms,
            bathrooms: x.bathrooms,
            squareFeet: x.squareFeet,
            dateAvailable: x.dateAvailable,
            createdDate: today,
            floorplanUrl: x.floorplanUrl
          };
        unitDocs.push(unitDoc)
      }
    console.log(unitDocs)
    var y
    for (y of unitDocs){
      firestore.collection("buildings").doc(doc.id).collection("units").doc(y.id).set(y);
    }
    console.log(doc)
    return doc;
  };

  return (
    
    <Dialog onClose={handleClose} open={open} maxWidth = {'md'}>
    
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
          amenities: [],
          units: [
            {unit: "",
            price: "",
            bedrooms: "",
            bathrooms: "",
            squareFeet: "",
            dateAvailable: {datePlaceholder},
            floorplanUrl: ""
          }
          ]
        }}
        render={({ values, setFieldValue, handleChange }) => (
          <Container component="main" className = {classes.container} maxWidth={'xl'}>
            <center><p className = {classes.font}>Add Building</p></center>
            <CssBaseline />
            <div className={classes.paper}>
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      required
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
                      component={TextField}
                      type="address"
                      label="Street Address"
                      name="streetAddress"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <Field
                      required
                      component={TextField}
                      type="city"
                      label="City"
                      name="city"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Field
                      required
                      component={TextField}
                      type="state"
                      label="State"
                      name="state"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Field
                      required
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
                  <div className = {classes.subtitle}>Amenities:</div>
                  </Grid>
                  <Grid item xs={12}>
                    <div role = "group">
                      <Field type="checkbox" name="amenities" value="Gym"/>
                      Gym
                      <Field type="checkbox"name="amenities" value="Pool"/>
                      Pool
                      <Field type="checkbox" name="amenities" value="Doorman"/>
                      Doorman
                      <Field type="checkbox" name="amenities" value="Dry Cleaning"/>
                      Dry Cleaning
                      <Field type="checkbox" name="amenities" value="Rooftop"/>
                      Rooftop
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                  <UploadComponent name = "files" className = {classes.upload} setFieldValue={setFieldValue} onUpload={handleUpload}/>
                  </Grid>
                  <div className = {classes.subtitle}>Units:</div>
                  <Grid item xs={12} className={classes.addUnit}>
                    <FieldArray
                    name="units"
                    render={(arrayHelpers) => (
                      <div>
                        {values.units.map((data, i) => (
                          <UnitInfo
                            setFieldValue={setFieldValue}
                            handleChange={handleChange}
                            arrayHelpers={arrayHelpers}
                            values={values}
                            data={data}
                            key={i}
                            index={i}
                          />
                        ))}
                        <Button
                          disableRipple
                          className={classes.addUnit}
                          onClick={() =>
                            arrayHelpers.push({
                              unit: "",
                              price: "",
                              bedrooms: "",
                              bathrooms: "",
                              squareFeet: "",
                              dateAvailable: {datePlaceholder},
                              floorplanUrl :""
                            })
                          }
                        >
                          <AddIcon/> Add Unit
                        </Button>
                      </div>
                    )}
                    />
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
              <Container component="main" maxWidth="xs">
              <div className={classes.messagePaper}>
                {error != null && successMessage == null &&(
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
                    <AlertTitle>
                    Building succesfully added to Yuppie!
                    </AlertTitle>
                  </Alert>
                )}
                <br />
              </div>
              </Container>
            </div>
          </Container>
        )}
      />
    </div>
    <DialogActions>
          <Button onClick={handleClose} color="primary" className = {classes.close}>
            Close
          </Button>
    </DialogActions>
    </Dialog>
  );
};
export default AddBuildingDialog;
