import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link } from "@material-ui/core";
import Collapse from '@material-ui/core/Collapse';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import CardContent from '@material-ui/core/CardContent';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import { useAuthState } from '../Context'
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 90
      },
    circle: {
      borderRadius: 50,
      width: 50,
      height: 50,
      float: "left",
      objectFit: "cover",
      marginLeft: -40,
      marginRight: -40
    },
    root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}))

function Leads() {
  const user = useAuthState();
  console.log(user)
  const [leads, setLeads] = useState([]);
  const classes = useStyles();
  useEffect(() => {
      let link = `http://18.218.78.71:8080/leads`
      axios.get(link,{ headers: {
        'Authorization': `Bearer ${user.token}`
      }})
      .then(res => {
        setLeads(res.data.data)
      })
      .catch(err => {
        console.log(err)
        setLeads([])
      })
  },[]);
  console.log(leads)
  return (
    <Container component="main" className = {classes.container}>
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
            </TableCell>
            <TableCell>
              <Typography variant="h6" gutterBottom component="div">
                Lead Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" gutterBottom component="div">
                Phone Number
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" gutterBottom component="div">
                Email
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" gutterBottom component="div">
                Building
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" gutterBottom component="div">
                Unit Enquired
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" gutterBottom component="div">
                Created Date
              </Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.reverse().map((lead) => (
            <LeadRow lead={lead}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
  );
}

function LeadRow(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  const {lead} = props
  const [message, setMessage] = React.useState(lead.message);
  const [buildingName, setBuildingName] = React.useState(lead.propertyName);
  const [unit, setUnit] = React.useState(lead.unitEnquired);
  const [moveInDate, setMoveInDate] = React.useState(lead.moveInDate);
  console.log(lead.user)
  const [createdDate, setCreatedDate] = React.useState(lead.createdDate);
  const [leadName, setLeadName] = React.useState(`${lead.user.firstName} ${lead.user.lastName}`);
  const [expanded, setExpanded] = React.useState(false);
  return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell><img src={lead.user.profilePicture} className = {classes.circle}/></TableCell>
          <TableCell>{leadName}</TableCell>
          <TableCell>{lead.user.phone}</TableCell>
          <TableCell>{lead.user.email}</TableCell>
          <TableCell>{lead.propertyName}</TableCell>
          <TableCell>{lead.unitEnquired}</TableCell>
          <TableCell>{lead.createdDate}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <CardContent>
                <Typography paragraph>Message:</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {message}
                </Typography>
                </CardContent>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
      )
  }

export default Leads;