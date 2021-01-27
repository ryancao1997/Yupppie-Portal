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
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import { useAuthState } from '../Context'
import Box from '@material-ui/core/box';

const useStyles = makeStyles((theme) => ({
        floorplanButton: {
          textTransform: 'none',
          marginTop: 10
        },
        box: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '140%',
          width: '80%'
        },
        font: {
          fontSize: 30
        },
        small: {
          width: '100%'

        },
        button: {
          marginLeft: -12,
          marginRight: -15
        },
        end: {
          width: '100%',
        },
        gridContainer: {
          width: '100%',
        },
        line: {
          display: 'flex',
          flexDirection: 'row'
        }

      }));

const UnitInfo = (props) => {
    const user = useAuthState();
    const classes = useStyles();
    const [progress, setProgress] = useState(0);
    const { address, data, setFieldValue, handleChange } = props;
    const [floorplanUrl, setFloorplanUrl] = useState(data.floorPlan);
    const wait = time => new Promise((resolve) => setTimeout(resolve, time));
    const uploadFile = async (x) => {
      return new Promise((resolve, reject) => {
        let data = new FormData();
        data.append('file', x, x.name);
        console.log(data)
        axios.post(`http://18.218.78.71:8080/images`,data,{ headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'Authorization': `Bearer ${user.token}`
      }})
          .then(res => {
        console.log(res.data)
        resolve(res.data.result.id)
        setFieldValue(`units.${props.index}.floorPlan`, res.data.result.id)
        setFloorplanUrl(res.data.result.id)
      })
          .catch( e =>{
            console.log(e)
          })

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
      <div>
      <div className={classes.line}>
      <Grid container spacing={1} className={classes.gridContainer}>
      <Grid item xs={2}>
            <Field
              required
              className={classes.end}
              component={TextField}
              type="unit"
              label="Unit"
              name={`units.${props.index}.number`}
              variant="outlined"
            />
      </Grid>
      <Grid item xs={2}>
            <Field
              required
              component={TextField}
              className={classes.small}
              type="number"
              label="Price/Month"
              name={`units.${props.index}.price`}
              variant="outlined"
            />
      </Grid>
      <Grid item xs={2}>
            <Field
              required
              component={TextField}
              className={classes.small}
              type="number"
              label="Square Feet"
              variant="outlined"
              name={`units.${props.index}.squareFeet`}
            />
      </Grid>
      <Grid item xs={2}>
            <FormControl className={classes.small} variant="outlined" required>
              <InputLabel id="bedrooms">Bedrooms</InputLabel>
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
                <MenuItem value={0}>Studio</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>
            </FormControl>
      </Grid>
      <Grid item xs={2}>
            <FormControl className={classes.small} variant="outlined" required>
              <InputLabel id="bathrooms">Bathrooms</InputLabel>
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
      </Grid>
      <Grid item xs={2}>
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
      </Grid>
      </Grid>
            <IconButton 
            aria-label="delete"
            onClick={() => {
              props.arrayHelpers.remove(props.index)
            }}
            className= {classes.button}
            >
              <DeleteIcon />
            </IconButton>
      </div>
            <div>
              {}
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                  {(floorplanUrl=='')?
                  <Button className = {classes.floorplanButton} variant="contained">
                  <AddIcon /> <div>Add Floorplan</div>
                  </Button>
                  :
                  <Button className = {classes.floorplanButton} variant="contained">
                  <AddIcon /> <div>Change Floorplan</div>
                  </Button>
                  }
              </div>
            </div>
            <br/><br/>
      </div>
    )
  
}

export default UnitInfo