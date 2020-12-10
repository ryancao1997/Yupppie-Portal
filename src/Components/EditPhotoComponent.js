import React, { useState } from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/box';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'black',
  },
  button: {
    textTransform: 'none',
    fontSize : 20,
    marginTop: -20
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.2) 0%, ' +
      'rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)',
  },
  image: {
    height: 150
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '140%'
  },
  font: {
    fontSize: 30
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  }
}));
const SortableItem = SortableElement(({value, handleDelete}) => {
  const classes = useStyles();
  return (
      <div>
      <img src={value} className = {classes.image} />
      </div>
  );
});
const SortableList = SortableContainer(({items, handleDelete}) => {
  const classes = useStyles();
  return (
    <List className = {classes.list}>
      {items.map((value, index) => (
        <ListItem>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <SortableItem key={`item-${value}`} index={index} value={value} handleDelete={handleDelete}/>
        </Grid>
        <Grid item xs={12}>
        <Button className={classes.button} onClick={() => handleDelete(value)}>
            <div className={classes.icon}><DeleteIcon/></div>
        </Button>
        </Grid>
        </Grid>
        </ListItem>
        
      ))}
    </List>
  );
});

const EditPhotoComponent = props => {
  const classes = useStyles();
  const { setFieldValue, Urls } = props;
  const [urls, setUrls] = useState(Urls);
  const onSortEnd = ({oldIndex, newIndex}) => {
    setUrls(arrayMove(urls, oldIndex, newIndex))
    setFieldValue("Urls", arrayMove(urls, oldIndex, newIndex))
  };
  function handleDelete(url) {
    let newUrls = []
    var x
    for (x of urls) {
      if (x != url) {
        newUrls.push(x)
      }
    }
    setUrls(newUrls)
    setFieldValue("Urls", newUrls)
  }
  return (
  <SortableList items={urls} onSortEnd={onSortEnd} handleDelete={handleDelete} axis={"x"}/>
  );
};
export default EditPhotoComponent