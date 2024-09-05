import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Button, Checkbox } from '@mui/material';
import axios from 'axios';
import { getFiles } from '../api/files.js';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const email = 'stefanichim2201@gmail.com';
      const data = await getFiles(email);
      setFiles(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleDeleteFiles = async () => {
    setDeleting(true);
    const filesToDelete = files.filter((file, index) => selectedFiles[index]).map(file => file.id);
    try {
      const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
      const accessToken = userProperties.access_token;
      await axios.post('http://localhost:5000/files/delete', { file_ids: filesToDelete }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      fetchFiles(); // Refresh the file list after deletion
      setSelectedFiles({}); // Clear selection
    } catch (err) {
      setError('Error deleting files: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const isAnyFileSelected = Object.values(selectedFiles).some(Boolean);

  const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('email', 'stefanichim2201@gmail.com');

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
    const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
    const accessToken = userProperties.access_token;


      await axios.post('http://localhost:5000/files/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      fetchFiles(); // Refresh the file list after upload
      setUploading(false);
    } catch (err) {
      setError('Error uploading files: ' + err.message);
      setUploading(false);
    }
  };

  const handleAlzheimerPrediction = async () => {
    setPredicting(true);
    const selectedFileIds = files.filter((file, index) => selectedFiles[index]).map(file => file.id);
    const selectedFileNames = files.filter((file, index) => selectedFiles[index]).map(file => file.filename);
    try {
      const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
      const accessToken = userProperties.access_token;
      const { age, sex } = userProperties;
      console.log(age);
      console.log(sex);
      const response = await axios.post('http://localhost:5000/predict_ad', 
        {
          input_files_ids: selectedFileIds,
          input_files_names: selectedFileNames,
          age: parseInt(age),
          sex: sex
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      );
      
      // Log the response
      console.log('Alzheimer Prediction Response:', response.data);
      
    } catch (err) {
      setError('Error predicting Alzheimer\'s: ' + err.message);
    } finally {
      setPredicting(false);
    }
  };

  const handleCheckboxChange = (fileId) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Files
      </Typography>
      <input
        accept="*/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </label>
      <Button
          variant="contained"
          color="error"
          onClick={handleDeleteFiles}
          disabled={!isAnyFileSelected || deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Files'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAlzheimerPrediction}
          disabled={!isAnyFileSelected || predicting}
        >
          {predicting ? 'Predicting...' : 'Alzheimer Prediction'}
        </Button>
      {uploading && <CircularProgress size={24} sx={{ marginLeft: 2 }} />}
      <List sx={{ marginTop: 2 }}>
        {files.map((file, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={() => handleCheckboxChange(index)}
                checked={!!selectedFiles[index]}
              />
            }
          >
            <ListItemText primary={file.filename.slice(0, 20)} secondary={file.size} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Files;
