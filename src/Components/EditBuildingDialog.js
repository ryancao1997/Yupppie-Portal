import React, { useContext, useState, useEffect } from "react";
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
import EditUploadComponent from './EditUploadComponent'
import EditPhotoComponent from './EditPhotoComponent'
import UnitInfo from './UnitInfo'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardActions from '@material-ui/core/CardActions';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
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
  delete: {
    marginTop:20,
    textTransform: 'none',
    fontSize : 20
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  addUnit: {
    marginLeft: theme.spacing(0),
    marginTop: -2,
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    fontSize : 20
  },
  editUnit: {
    fontSize : 20
  },
  large: {
  	width: '100%',
  },
  upload: {
  	width: '100%',
  },
  messages: {
  	width: '100%',
  	textTransform: 'none',
  },
  container: {
    width: '100%',
  },
  font: {
    fontSize: 30
  },
  close: {
    textTransform: 'none'
  },
  subtitle: {
    fontSize : 20,
  },
}));

const EditBuildingDialog = (props) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear()
  var datePlaceholder = yyyy + '-' + mm + '-' + dd;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const user = useContext(UserContext);
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const { address, buildingName, amenities, onPhotoEdit, description, onDelete, onSubmit, units, building, onClose, open, companyName, initialUrls } = props;
  const address_array = address.split(", ")
  const handleClose = () => {
    setSuccessMessage(false)
    onClose();
  };
  var initialIds = []
  var x
  for (x of units){
    initialIds.push(x.id)
  }
  const [unitSubmitted, setUnitSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([])
  const [Urls, setUrls] = useState(initialUrls)

  const handleUpload = (urls) => {
    setUrls(urls)
  }
  const handleDelete = () => {
    onDelete(building.id);
    onClose()
  };
  const handleSubmit = (values) => {
    try {
      firestoreUpload(values);
      setUnitSubmitted(true);
      setSuccessMessage(true);
      onSubmit(values,initialIds)
    } catch (error) {
      setError("Error adding units to platform. Make sure inputs are valid");
    }
  };
  const firestoreUpload = async (values) => {
    var docs = []
    let uploadAddress = values.streetAddress+', '+values.city+', '+ values.state+', '+ values.zip
    var x
    for (x of values.units){
      console.log(x)
      let doc = {
          id: x.id,
          companyName: companyName,
          unit: x.unit,
          price: x.price,
          bedrooms: x.bedrooms,
          bathrooms: x.bathrooms,
          squareFeet: x.squareFeet,
          dateAvailable: x.dateAvailable,
          createdDate: x.createdDate,
          floorplanUrl: x.floorplanUrl
        };
      docs.push(doc)
    }
  var y
  for (y of docs){
    firestore.collection("buildings").doc(building.id).collection("units").doc(y.id).set(y);
  }
  firestore.collection("buildings").doc(building.id).update({description: values.description, photoUrls: Urls, amenities: values.amenities, lastEdited:today, address: uploadAddress, buildingName: values.buildingName})
  onPhotoEdit(Urls)
  }
  return (
    <Dialog onClose={handleClose} open={open} maxWidth = {'md'}>
    <div>
      <Formik
        onSubmit={(values) => handleSubmit(values)}
        initialValues={{
          description: description,
          buildingName: buildingName,
          streetAddress: address_array[0],
          city: address_array[1],
          state: address_array[2],
          zip: address_array[3],
          units: units,
          files: [],
          Urls: Urls,
          amenities: amenities,
        }}
        render={({ values, setFieldValue, handleChange }) => (
          <Container component="main" className = {classes.container} maxWidth={'md'}>
            <center><p className = {classes.font}>{buildingName}</p></center>
            <CssBaseline />
            <div>
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
                    <CardActions disableSpacing>
                    <Button
                      onClick={handleExpandClick}
                      className={classes.addUnit}
                    >
                      Edit Photos <ExpandMoreIcon className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                      })}/>
                    </Button>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Grid item xs={12}>
                    <EditPhotoComponent Urls = {Urls} name = "Urls" setFieldValue={setFieldValue}/>
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                    <EditUploadComponent name = "files" className = {classes.upload} setFieldValue={setFieldValue} onUpload={handleUpload} initialUrls = {Urls}/>
                    </Grid>
                  </Collapse>
                  </Grid>
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
                            address={building.address}
                            key={i}
                            index={i}
                          />
                        ))}
                        <Button
                          disableRipple
                          
                          className={classes.addUnit}
                          onClick={() =>
                            arrayHelpers.push({
                              id: uuidv4(),
                              unit: "",
                              price: "",
                              bedrooms: "",
                              bathrooms: "",
                              squareFeet: "",
                              dateAvailable: {datePlaceholder},
                              createdDate: {today},
                              floorplanUrl: ""
                            })
                          }
                        >
                          <AddIcon/> Add Unit
                        </Button>
                      </div>
                    )}
                  />
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Make Changes
                </Button>
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
                      Changes Made!
                      </AlertTitle>
                    </Alert>
                  )}
                </div>
                </Container>
                <Grid container justify="center">
                <Button
                  color="secondary"
                  className={classes.delete}
                  onClick={handleDelete}
                >
                  <DeleteIcon/> Delete Building
                </Button>
                </Grid>
              </Grid>
              </Form>
            </div>
          </Container>
        )}
      />
    </div>
    <DialogActions>
          <Button color="primary" onClick={handleClose} className = {classes.close}>
            Close
          </Button>
    </DialogActions>
    </Dialog>
  );
};
export default EditBuildingDialog;
