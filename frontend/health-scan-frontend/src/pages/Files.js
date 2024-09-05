import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Button, Checkbox } from '@mui/material';
import { getFiles, deleteFiles, uploadFiles } from '../api/files.js';
import { predictAlzheimers } from '../api/ad_prediction.js';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
      const email = userProperties.email;

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
      await deleteFiles(filesToDelete);
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
    const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
    const email = userProperties.email;

    formData.append('email', email);

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      await uploadFiles(formData);
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
      const { access_token: accessToken, age, sex } = userProperties;
      const response = await predictAlzheimers(selectedFileIds, selectedFileNames, age, sex, accessToken);
      
      const newPredictions = {};
      response.forEach(item => {
        newPredictions[item.file_id] = item.prediction;
      });
      setPredictions(newPredictions);
    } catch (err) {
      setError(err.message);
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
            <ListItemText 
              primary={file.filename.slice(0, 20)} 
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {file.size}
                  </Typography>
                  {predictions[file.id] && (
                    <Typography component="p" variant="body2" color="text.secondary">
                      Prediction: {predictions[file.id]}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>    </Box>
  );
};

export default Files;
