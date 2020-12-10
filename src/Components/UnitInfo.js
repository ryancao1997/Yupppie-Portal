import React, {useState}from 'react'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {firestore, storage} from "../firebase";
import { useDropzone } from "react-dropzone";
import Box from '@material-ui/core/box';

const useStyles = makeStyles((theme) => ({
        box: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '140%',
          width: '70%'
        },
        font: {
          fontSize: 30
        },
        small: {
          width: '15.8%',
          marginLeft: theme.spacing(1)

        },
        form: {
          marginTop: theme.spacing(.1),
          marginBottom: -10
        },
        button: {
          marginTop: -5,
          marginBottom: -10,
        },
        end: {
          width: '15.8%',
        }

      }));

const UnitInfo = (props) => {
    const classes = useStyles();
    const [progress, setProgress] = useState(0);
    const { address, data, setFieldValue, handleChange } = props;
    const wait = time => new Promise((resolve) => setTimeout(resolve, time));
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
                  setFieldValue(`units.${props.index}.floorplanUrl`, url)
                  resolve(url);
                  
                });
            }
          );
      });
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: "image/*",
      onDrop: acceptedFiles => {
        uploadFile(acceptedFiles[0])
      }
    });
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear()
    var datePlaceholder = yyyy + '-' + mm + '-' + dd;
    return (
      <Grid item xs={12} className = {classes.form}>
            <Field
              required
              className={classes.end}
              component={TextField}
              type="unit"
              label="Unit"
              name={`units.${props.index}.unit`}
              variant="outlined"
            />
            <Field
              required
              component={TextField}
              className={classes.small}
              type="number"
              label="Price/Month"
              name={`units.${props.index}.price`}
              variant="outlined"
            />
            <Field
              required
              component={TextField}
              className={classes.small}
              type="number"
              label="Square Feet"
              variant="outlined"
              name={`units.${props.index}.squareFeet`}
            />
            <FormControl className={classes.small} variant="outlined" required>
              <InputLabel id="bathrooms">Bedrooms</InputLabel>
              <Select
                value = {data.bedrooms}
                name={`units.${props.index}.bedrooms`}
                labelId="bedrooms"
                label="Bedrooms"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  Bedrooms
                </MenuItem>
                <MenuItem value={"Studio"}>Studio</MenuItem>
                <MenuItem value={"1"}>1</MenuItem>
                <MenuItem value={"2"}>2</MenuItem>
                <MenuItem value={"3"}>3</MenuItem>
                <MenuItem value={"4"}>4</MenuItem>
                <MenuItem value={"5"}>5</MenuItem>
                <MenuItem value={"6"}>6</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.small} variant="outlined" required>
              <InputLabel id="bedrooms">Bathrooms</InputLabel>
              <Select
                value = {data.bathrooms}
                name={`units.${props.index}.bathrooms`}
                labelId="bathrooms"
                label="Bathrooms"
                onChange={handleChange}
              >
                <MenuItem value="" disabled>
                  Bathrooms
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={1.5}>1.5</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={2.5}>2.5</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={3.5}>3.5</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={4.5}>4.5</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={5.5}>5.5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>
            </FormControl>
            <Field
              required
              component={TextField}
              className={classes.small}
              type="date"
              defaultValue={datePlaceholder}
              label="Date Available"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              name={`units.${props.index}.dateAvailable`}
            />
            <div>
              {}
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                  <Box border={5} borderRadius={10} height = "100%">
                  <br/>
                  <center><p className = {classes.font}>Upload Floorplan </p></center>
                  <br/>
                  </Box>
              </div>
            </div>
            <IconButton 
            aria-label="delete"
            onClick={() => {
              props.arrayHelpers.remove(props.index)
            }}
            className= {classes.button}
            >
              <DeleteIcon />
            </IconButton>
            <br/><br/>
      </Grid>

    )
  
}

export default UnitInfo