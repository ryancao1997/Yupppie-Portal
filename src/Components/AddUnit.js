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
import Alert from '@material-ui/lab/Alert';
import {firestore, storage} from "../firebase"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import UploadComponent from './UploadComponent'
import UnitInfo from './UnitInfo'

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

const AddUnit = () => {
  const user = useContext(UserContext);
  const companyName = user.companyName
  const classes = useStyles();
  const [buildings, setBuildings] = useState([])
  useEffect(() => {
      const buildingRef = firestore.collection("buildings")
      buildingRef.where('companyName', '==', companyName).get().then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        setBuildings(data)
      })
        
  },[buildings.length]);
  var Addresses = []
  var x
  for (x of buildings){
    Addresses.push(x.address)
  }
  const [progress, setProgress] = useState(0);
  const [unitSubmitted, setUnitSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = (values) => {
    try {
      firestoreUpload(values);
      setUnitSubmitted(true);
      setSuccessMessage(true);
    } catch (error) {
      setError("Error adding units to platform. Make sure inputs are valid");
    }
  };
  const firestoreUpload = (values) => {
    var docs = []
    var x
    for (x of values.units){
      let doc = {
          companyName: user.companyName,
          address: values.address,
          unit: x.unit,
          price: x.price,
          bedrooms: x.bedrooms,
          bathrooms: x.bathrooms,
          squareFeet: x.squareFeet
        };
      docs.push(doc)
    }
  console.log(docs)
  var y
  for (y of docs){
    console.log(y)
    let id = y.address + ' '+ y.unit
    firestore.collection("buildings").doc(y.address).collection("units").doc(id).add(y);
  }
  }

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
          units: [{
            unit: "",
            price: "",
            bedrooms: "",
            bathrooms: "",
            squareFeet: "",
          }]
        }}
        render={({ values, setFieldValue, handleChange }) => (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                  <FormControl className={classes.large} variant="outlined" required>
                    <InputLabel id="address">Address</InputLabel>
                    <Select
                      name="address"
                      labelId="address"
                      label="Address"
                      onChange={handleChange}
                    >
                      <MenuItem value="" disabled>
                        Address
                      </MenuItem>
                      {Addresses.map((address) => (
                        <MenuItem value={address}>{address}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                            key={i}
                            index={i}
                          />
                        ))}
                        <Button
                          disableRipple
                          variant="contained"
                          className={classes.addUnit}
                          onClick={() =>
                            arrayHelpers.push({
                              unit: "",
                              price: "",
                              bedrooms: "",
                              bathrooms: "",
                              squareFeet: "",
                            })
                          }
                        >
                          Add Another Unit
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
                  Submit
                </Button>
              </Grid>
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
              Units succesfully added to Yuppie!
            </Alert>
          )}
          <br />
          {unitSubmitted && (
            <Button
              onClick={handleAddAnother}
              className={classes.messages}
              variant="contained"
            >
              Add Units to Another Building
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};
export default AddUnit;
