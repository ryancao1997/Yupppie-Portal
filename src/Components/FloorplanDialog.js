import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  image: {
    height: 350
  }
}));

function FloorplanDialog(props) {
  const { onClose, open, apartment } = props;
  const classes = useStyles();
  return (
    <Dialog onClose={onClose} open={open}>
      {(apartment.floorPlan=='')?
      <DialogTitle>{apartment.unit} No Floorplan</DialogTitle>
      :
      <div>
      <DialogTitle>{apartment.unit} Floorplan</DialogTitle>
      <img className={classes.image} src={apartment.floorPlan} alt="No Floorplan Found"/>
      </div>
      }
    </Dialog>
  );
}
export default FloorplanDialog;