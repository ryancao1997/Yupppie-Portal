import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import {firestore, storage} from "../firebase"
import Carousel from 'nuka-carousel'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditBuildingDialog from './EditBuildingDialog'

const useStyles = makeStyles((theme) => ({
  description: {
    maxHeight: 285
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  button: {
    textTransform: 'none'
  },
  amenities: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: -15
  },
  expand: {
    transform: 'rotate(0deg)',
    marginTop: 30,
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  table: {
    marginLeft: -10,
  }
}));


export default function BuildingCard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { onDelete, building, companyName, onPhotoChange } = props
  const [description, setDescription] = React.useState(building.description);
  const [buildingName, setBuildingName] = React.useState(building.buildingName);
  const [address, setAddress] = React.useState(building.address);
  const [amenities, setAmenities] = React.useState(building.amenities);
  const [photoUrls, setPhotoUrls] = React.useState(building.photoUrls);
  const [expanded, setExpanded] = React.useState(false);
  const [units, setUnits] = useState([])
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
      setDescription(building.description)
      setBuildingName(building.buildingName)
      setAddress(building.address)
      setAmenities(building.amenities)
      const unitRef = firestore.collection("buildings").doc(building.id).collection("units")
      unitRef.get().then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        setUnits(data)
      })
  },[building]);
  function handlePhotoEdits(urls) {
    setPhotoUrls(urls)
    onPhotoChange(urls)
  }
  try {
    var date = building.lastEdited.toDate()
  } catch {
    var date = building.lastEdited
  }
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear()
  var lastEditedString = 'Last Edited: ' + yyyy + '-' + mm + '-' + dd;
  function handleEdits(edits,initialIds) {
    setDescription(edits.description)
    setBuildingName(edits.buildingName)
    let uploadAddress = edits.streetAddress+', '+edits.city+', '+ edits.state+', '+ edits.zip
    setAddress(uploadAddress)
    setAmenities(edits.amenities)
    setUnits(edits.units)
    console.log(edits.units)
    console.log(initialIds)
    var currentIds = []
    var y
    for (y of edits.units){
      currentIds.push(y.id)
    }
    var x
    for (x of initialIds){
      console.log(currentIds)
      if (!currentIds.includes(x)){
        firestore.collection("buildings").doc(building.id).collection("units").doc(x).delete()
      }
    }
  }
  return (
    <Grid item xs={4}>
    <Card>
      <div className = {classes.description}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={handleClickOpen}>
            <MoreVertIcon />
          </IconButton>
        }
        title={buildingName}
        subheader={<Typography variant="body2" color="textSecondary" component="p">
                    {address}
                  </Typography>
                }
      />
      <Carousel defaultControlsConfig={{nextButtonText:'>',prevButtonText:'<', nextButtonStyle: {opacity: 0.5}, prevButtonStyle: {opacity: 0.5}}}>
          {photoUrls.map((url) => (
              <CardMedia
                className={classes.media}
                image={url}
                title={building.buildingName}
              />
            ))}
      </Carousel>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        {lastEditedString}
        </Typography>
      </CardContent>
      <EditBuildingDialog address = {address} buildingName = {buildingName} amenities = {amenities} units = {units} building={building} description ={description} open={open} onClose={handleClose} onSubmit={handleEdits} onDelete={onDelete} companyName={companyName} initialUrls={photoUrls} onPhotoEdit={handlePhotoEdits}/>
      </div>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography paragraph>Amenities:</Typography>
            <List className = {classes.amenities}>
            {amenities.map((amenity) => (
              <Typography variant="body2" color="textSecondary" component="p">
                <ListItem>{amenity}</ListItem>
              </Typography>
              ))}
            </List>
        </CardContent>
        <CardContent>
          <Typography paragraph>Units:</Typography>
          		<Table size="small" aria-label="units" className={classes.table}>
	                <TableHead>         
                      <TableRow>
                        <TableCell align="left">Unit</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Sqft</TableCell>
                        <TableCell align="left">BR</TableCell>
                        <TableCell align="left">BA</TableCell>
                        <TableCell align="left">Date Avail.</TableCell>
                      </TableRow>
	                </TableHead>
	                <TableBody>
                      {units.map((apartment) => (          
                      <TableRow key={apartment.unit}>
                        <TableCell align="left">{apartment.unit}</TableCell>
                        <TableCell align="left">{apartment.price}</TableCell>
                        <TableCell align="left">{apartment.squareFeet}</TableCell>
                        <TableCell align="left">{apartment.bedrooms}</TableCell>
                        <TableCell align="left">{apartment.bathrooms}</TableCell>
                        <TableCell align="left">{apartment.dateAvailable}</TableCell>
                      </TableRow>
                      ))}
                </TableBody>
	            </Table>
        </CardContent>
      </Collapse>
    </Card>
    </Grid>
  );
}