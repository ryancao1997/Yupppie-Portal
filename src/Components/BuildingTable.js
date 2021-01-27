import Box from '@material-ui/core/Box';
import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import EditBuildingDialog from './EditBuildingDialog'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  amenities: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: -15
  },
});

function BuildingTable(props) {
  const { onDelete, buildings, companyName, onPhotoChange } = props
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
            	<Typography variant="h6" gutterBottom component="div">
            		Building Name
            	</Typography>
            </TableCell>
            <TableCell>
            	<Typography variant="h6" gutterBottom component="div">
            		Address
            	</Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {buildings.map((building) => (
            <Row key={building.buildingName} building={building} companyName = {companyName} onDelete = {onDelete} onPhotoChange = {onPhotoChange}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  );
}

function Row(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const classes = useRowStyles();
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
  const [units, setUnits] = useState(building.units)
  useEffect(() => {
      setDescription(building.description)
      setBuildingName(building.name)
      setAddress(`${building.address.streetAddress}, ${building.address.city}, ${building.address.state}, ${building.address.zipCode}`)
      setAmenities(building.amenities)
      setUnits(building.units)
      setPhotoUrls(building.images)
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
  console.log(units)
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
    var today = new Date();
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
	    <React.Fragment>
	      <TableRow className={classes.root}>
	        <TableCell>
	          <IconButton aria-label="expand row" size="small" onClick={() => setExpanded(!expanded)}>
	            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
	          </IconButton>
	        </TableCell>
	        <TableCell>{buildingName}</TableCell>
	        <TableCell>{address}</TableCell>
	        <TableCell>
	        	<IconButton aria-label="settings" onClick={handleClickOpen}>
		          <MoreVertIcon />
		        </IconButton>
	        </TableCell>
	      </TableRow>
	      <TableRow>
	        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
	          <Collapse in={expanded} timeout="auto" unmountOnExit>
	            <Box margin={1}>
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
	              <Table size="small" aria-label="units">
	                <TableHead>
	                  <TableRow>
	                    <TableCell align="right">Unit #</TableCell>
	                    <TableCell align="right">Price</TableCell>
	                    <TableCell align="right">Square Feet</TableCell>
	                    <TableCell align="right">Bedrooms</TableCell>
	                    <TableCell align="right">Bathrooms</TableCell>
	                    <TableCell align="right">Date Available</TableCell>
	                  </TableRow>
	                </TableHead>
	                <TableBody>
	                    {units.map((apartment) => (          
	                    <TableRow key={apartment.unit}>
	                      <TableCell align="right">{apartment.number}</TableCell>
	                      <TableCell align="right">{apartment.price}</TableCell>
	                      <TableCell align="right">{apartment.squareFeet}</TableCell>
	                      <TableCell align="right">{apartment.bedrooms}</TableCell>
	                      <TableCell align="right">{apartment.bathrooms}</TableCell>
	                      <TableCell align="right">{apartment.dateAvailable}</TableCell>
	                    </TableRow>
	                    ))}
	                </TableBody>
	              </Table>
	              </CardContent>
	            </Box>
	          </Collapse>
	        </TableCell>
	      </TableRow>
	      <EditBuildingDialog address = {building.address} buildingName = {buildingName} amenities = {amenities} units = {units} building={building} description ={description} open={open} onClose={handleClose} onSubmit={handleEdits} onDelete={onDelete} companyName={companyName} initialUrls={photoUrls} onPhotoEdit={handlePhotoEdits}/>
	    </React.Fragment>
	    )
	}

export default BuildingTable;