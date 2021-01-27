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
import Carousel from 'nuka-carousel'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditBuildingDialog from './EditBuildingDialog'
import FloorplanDialog from './FloorplanDialog'
import axios from 'axios';

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
    marginLeft: -0
  },
  tableCell: {
    fontSize: 9.5
  }
}));


export default function BuildingCard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [floorplanOpen, setFloorplanOpen] = React.useState(false);
  const [floorplanApartment, setFloorplanApartment] = React.useState([]);
  const handleFloorplanOpen = (apartment) => {
    setFloorplanOpen(true);
    console.log(apartment)
    setFloorplanApartment(apartment)
  };
  const handleFloorplanClose = () => {
    setFloorplanOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { onDelete, building, companyName, onPhotoChange } = props
  const [description, setDescription] = React.useState(building.description);
  const [buildingName, setBuildingName] = React.useState(building.name);
  const [address, setAddress] = React.useState(`${building.address.streetAddress}, ${building.address.city}, ${building.address.state}, ${building.address.zipCode}`);
  const [amenities, setAmenities] = React.useState(building.amenities);
  const [photoUrls, setPhotoUrls] = React.useState(building.images);
  const [expanded, setExpanded] = React.useState(false);
  const [units, setUnits] = React.useState(building.units)
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
      setDescription(building.description)
      setBuildingName(building.name)
      setAddress(`${building.address.streetAddress}, ${building.address.city}, ${building.address.state}, ${building.address.zipCode}`)
      setAmenities(building.amenities)
      setUnits(building.units)
      setPhotoUrls(building.images)
      console.log(building)
  },[building.name]);
  function handlePhotoEdits(urls) {
    setPhotoUrls(urls)
    onPhotoChange(urls)
  }
  try {
    var date = new Date()
  } catch {
    var date = building.lastEdited
  }
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear()
  var lastEditedString = 'Last Edited: ' + yyyy + '-' + mm + '-' + dd;
  function handleEdits(edits,initialIds) {
    setDescription(edits.description)
    setBuildingName(edits.name)
    let uploadAddress = edits.streetAddress+', '+edits.city+', '+ edits.state+', '+ edits.zipCode
    setAddress(uploadAddress)
    setAmenities(edits.amenities)
    setUnits(edits.units)
    var currentIds = []
    var y
    for (y of edits.units){
      currentIds.push(y.id)
    }
    var x
    for (x of initialIds){
      if (!currentIds.includes(x)){
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
          {photoUrls.map((image) => (
              <CardMedia
                className={classes.media}
                image={image}
                title={building.buildingName}
              />
            ))}
      </Carousel>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        </Typography>
      </CardContent>
      <EditBuildingDialog address = {building.address} buildingName = {buildingName} amenities = {amenities} units = {units} building={building} description ={description} open={open} onClose={handleClose} onSubmit={handleEdits} onDelete={onDelete} companyName={companyName} initialUrls={photoUrls} onPhotoEdit={handlePhotoEdits}/>
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
                        <TableCell align="left"><div className={classes.tableCell}>Unit</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>Price</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>Sqft</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>BR</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>BA</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>Date Avail.</div></TableCell>
                      </TableRow>
	                </TableHead>
	                <TableBody>
                      {units.map((apartment) => (          
                      <TableRow key={apartment.unit} onClick = {e => handleFloorplanOpen(apartment)}>
                        <TableCell align="left"><div className={classes.tableCell}>{apartment.number}</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>{apartment.price}</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>{apartment.squareFeet}</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>{apartment.bedrooms}</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>{apartment.bathrooms}</div></TableCell>
                        <TableCell align="left"><div className={classes.tableCell}>{apartment.dateAvailable}</div></TableCell>
                      </TableRow>
                      ))}
                </TableBody>
	            </Table>
              <FloorplanDialog open = {floorplanOpen} onClose={handleFloorplanClose} apartment = {floorplanApartment}/>
        </CardContent>
      </Collapse>
    </Card>
    </Grid>
  );
}