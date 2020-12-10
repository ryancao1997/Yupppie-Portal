import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/box';
import { makeStyles } from '@material-ui/core/styles';
import {firestore, storage} from "../firebase"

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
  const classes = useStyles();
  const { setFieldValue, onUpload, initialUrls } = props;
  const [currentUrls, setCurrentUrls] = useState(initialUrls);
  const [progress, setProgress] = useState(0);
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
                  resolve(url);
                  
                });
            }
          );
      });
    }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      const Urls = await Promise.all(acceptedFiles.map((fileArray) => uploadFile(fileArray)))
      onUpload([...currentUrls, ...Urls])
      setFieldValue("Urls", [...currentUrls, ...Urls])
      setCurrentUrls([...currentUrls, ...Urls])
    }
  });
  return (
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
  );
};
export default EditUploadComponent