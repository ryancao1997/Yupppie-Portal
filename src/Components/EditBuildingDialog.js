import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from 'formik';
import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Alert, AlertTitle } from '@material-ui/lab';
import EditUploadComponent from './EditUploadComponent'
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
import { useAuthState } from '../Context'
import axios from 'axios';

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
  const user = useAuthState();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear()
  var datePlaceholder = yyyy + '-' + mm + '-' + dd;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const { address, buildingName, amenities, onPhotoEdit, description, onDelete, onSubmit, units, building, onClose, open, companyName, initialUrls } = props;
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
  const [files, setFiles] = useState(initialUrls)
  const handleUpload = (files) => {
    setFiles(files)
    console.log(files)
  }
  const handleDelete = () => {
    onDelete(building.id);
    onClose()
  };
  const handleSubmit = (values) => {
    try {
      dbUpload(values);
      setUnitSubmitted(true);
      setSuccessMessage(true);
      onSubmit(values,initialIds)
    } catch (error) {
      setError("Error adding units to platform. Make sure inputs are valid");
    }
  };
  const dbUpload = async (values) => {
    let address_object = {
            streetAddress: values.streetAddress,
            zipCode: values.zipCode,
            city: values.city,
            state: values.state,
          }
    let doc = {
      propertyManager: user.user,
      name: values.name,
      address: address_object,
      description: values.description,
      amenities: values.amenities,
      images: values.files,
      units: values.units,
    };
    console.log('doc',doc)
  axios.put(`http://18.218.78.71:8080/buildings/${building.id}`,doc, 
      { headers: {
        'Authorization': `Bearer ${user.token}`
      }}
      )
  .then(res =>
        console.log(res.data)
        )
  onPhotoEdit(values.files)
  return doc
  }
  return (
    <Dialog onClose={handleClose} open={open} maxWidth = {'md'}>
    <div>
      <Formik
        onSubmit={(values) => handleSubmit(values)}
        initialValues={{
          name: buildingName,
          streetAddress: address.streetAddress,
          zipCode: address.zipCode,
          city: address.city,
          state: address.state,
          description: description,
          files: files,
          amenities: amenities,
          units: units
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
                      type="name"
                      label="Building Name"
                      name="name"
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
                      type="zipCode"
                      label="Zip"
                      name="zipCode"
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
                    <EditUploadComponent name = "files" className = {classes.upload} setFieldValue={setFieldValue} onUpload={handleUpload} initialUrls = {initialUrls}/>
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
                              number: "",
                              price: "",
                              bedrooms: "",
                              bathrooms: "",
                              squareFeet: "",
                              dateAvailable: {datePlaceholder},
                              floorPlan: ""
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
