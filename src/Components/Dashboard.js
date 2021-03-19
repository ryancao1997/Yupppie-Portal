import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import BuildingTable from "./BuildingTable"
import BuildingCard from "./BuildingCard"
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import AddBuildingDialog from './AddBuildingDialog'
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import { useAuthState } from '../Context'


const useStyles = makeStyles((theme) => ({
  link: {
    marginLeft : 30,
    textTransform: 'none'
  },
  dashboard: {
    marginTop : 90
  },
  container: {
    width: '100%'
  },
  button: {
    textTransform: 'none',
    marginBottom : 40,
    marginTop: -40
  },
  font: {
    fontSize: 20
  },
  search: {
    marginBottom:30,
    width: '30%'
  }
}))

function Dashboard() {
  const user = useAuthState();
  console.log(user)
  const classes = useStyles();
  const [companyName, setCompanyName] = useState("test")
  const [buildings, setBuildings] = useState([])
  const [photoChange, setPhotoChange] = useState([])
  const [open, setOpen] = React.useState(false);
  const [listView, setListView] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const dynamicSearch = () => {
    return buildings.filter(building => building.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleSwitch = () => {
    setListView(!listView);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
      let link = `http://18.218.78.71:8080/buildings`
      axios.get(link, { headers: {
        'Authorization': `Bearer ${user.token}`
      }})
      .then(res => {
        console.log(res.data.data)
        setBuildings(res.data.data)})
      .catch(err => {
        console.log(err)
        setBuildings([])
      })
  },[listView, photoChange]);
  console.log(buildings)
  function handleNewBuilding(newBuilding) {
    let newBuildings = [... buildings, newBuilding]
    setBuildings(newBuildings)
    console.log(buildings)
  }
  function handlePhotoChange(urls) {
    setPhotoChange(urls)
  }
  function handleDeleteBuilding(id) {
    let link = `http://18.218.78.71:8080/buildings/${id}`
    axios.delete(link,{ headers: {
        'Authorization': `Bearer ${user.token}`
      }})
    .then(res =>
        console.log(res.data)
        )
    let newBuildings = []
    var building
    for (building of buildings) {
      if (building.id != id) {
        newBuildings.push(building)
      }
    }
    setBuildings(newBuildings)
  }
  const onChangeHandler = (event) => {
      const {name, value} = event.currentTarget;
      if(name === 'search') {
          setSearchTerm(value);
      }
    };
  return (
    <div className = {classes.dashboard}>
    
    <Container component="main" className = {classes.container}>
      <Grid container item xs={12} spacing={1} alignItems="stretch">
          <Button className = {classes.button} variant="contained" color="primary" onClick={handleClickOpen}>
            <AddIcon /> <div className={classes.font}>Add Building</div>
          </Button>
          <AddBuildingDialog propertyManager = {user} open={open} onClose={handleClose} onSubmit={handleNewBuilding}/>
      </Grid>
      <Grid container item xs={12} spacing={1} alignItems="stretch">
      <TextField
        label="Search For Buildings"
        className = {classes.search}
        value = {searchTerm}
        name = "search"
        onChange = {(event) => onChangeHandler(event)}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      </Grid>
      <Grid container item xs={12} spacing={1} alignItems="stretch">
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <Switch checked={listView} onChange={handleSwitch} name="listView" color="primary" />
          </Grid>
          <Grid item>List View</Grid>
        </Grid>
      </Typography>
      </Grid>
      { !listView ?
      <Grid container item xs={12} spacing={1} alignItems="stretch">
        {dynamicSearch().map((building) => (
              <BuildingCard companyName = {companyName} building={building} onDelete = {handleDeleteBuilding} onPhotoChange = {handlePhotoChange}/>
            ))}
      </Grid>
      :
      <Grid container item xs={12} spacing={1} alignItems="stretch">
        <BuildingTable companyName = {companyName} buildings={dynamicSearch()} onDelete = {handleDeleteBuilding} onPhotoChange = {handlePhotoChange}/>
      </Grid>
      }
    </Container>
    </div>
  );
}
export default Dashboard;