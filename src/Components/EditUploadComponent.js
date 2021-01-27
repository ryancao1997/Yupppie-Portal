import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import EditPhotoComponent from './EditPhotoComponent'
import { useAuthState } from '../Context'
import axios from 'axios';

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
  }
}));

const EditUploadComponent = props => {
  const user = useAuthState();
  const classes = useStyles();
  const { setFieldValue, onUpload, initialUrls } = props;
  const [currentUrls, setCurrentUrls] = useState(initialUrls);
  function handleDelete (urls) {
    setCurrentUrls(urls)
  }
  const [progress, setProgress] = useState(0);
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
        resolve(res.data.result.id)
      })
          .catch( e =>{
            console.log(e)
          })

        });
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      const Urls = await Promise.all(acceptedFiles.map((fileArray) => uploadFile(fileArray)))
      onUpload([...currentUrls, ...Urls])
      setFieldValue("files", [...currentUrls, ...Urls])
      setCurrentUrls([...currentUrls, ...Urls])
    }
  });
  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
      <EditPhotoComponent Urls = {currentUrls} name = "files" setFieldValue={setFieldValue} onDelete={handleDelete}/>
      </Grid>
      <br/>
      <Grid item xs={12}>
          <div>
          {}
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            {(currentUrls.length > 0) ? (
              <Box border={5} borderRadius={10} height = "100%">
              <br/>
              <center><p className = {classes.font}>Upload Additional Pictures ({currentUrls.length} uploaded)</p></center>
              <br/>
              </Box>
            ) : (
              <Box border={5} borderRadius={10} height = "100%">
              <br/>
              <center><p className = {classes.font}>Upload Additional Pictures</p></center>
              <br/>
              </Box>
            )}
          </div>
        </div>
        </Grid>
    </Grid>
  );
};
export default EditUploadComponent