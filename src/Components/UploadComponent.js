import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '140%'
  },
  font: {
    fontSize: 30
  }
}));

const UploadComponent = props => {
  const classes = useStyles();
  const { setFieldValue, onUpload } = props;
  const [files, setFiles] = useState([]);
  const wait = time => new Promise((resolve) => setTimeout(resolve, time));
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      wait(1000)
        .then(setFiles([...files, ...acceptedFiles]))
        .then(() => setFieldValue("files", [...files, ...acceptedFiles]))
        .then(onUpload([...files, ...acceptedFiles]))
    }
  });
  return (
    <div>
      {}
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {(files.length > 0) ? (
          <Box border={5} borderRadius={10} height = "100%">
          <br/>
          <center><p className = {classes.font}>Upload Pictures ({files.length} uploaded)</p></center>
          <br/>
          </Box>
        ) : (
          <Box border={5} borderRadius={10} height = "100%">
          <br/>
          <center><p className = {classes.font}>Upload Pictures (Required)</p></center>
          <br/>
          </Box>
        )}
      </div>
    </div>
  );
};
export default UploadComponent