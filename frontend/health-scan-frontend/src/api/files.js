import axios from 'axios';

const API_URL = 'http://localhost:5000'; // You might want to store this in an environment variable

export const getFiles = async (email) => {
  try {
    const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
    const accessToken = userProperties.access_token;

    const response = await axios.get(`${API_URL}/files/get/${email}`,  {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFiles = async (fileIds) => {
  try {
    const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
    const accessToken = userProperties.access_token;

    await axios.post(`${API_URL}/files/delete`, { file_ids: fileIds }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
  } catch (error) {
    throw new Error('Error deleting files: ' + error.message);
  }
};

export const uploadFiles = async (formData) => {
  try {
    const userProperties = JSON.parse(localStorage.getItem('user_properties') || '{}');
    const accessToken = userProperties.access_token;

    await axios.post(`${API_URL}/files/save`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      },
    });
  } catch (error) {
    throw new Error('Error uploading files: ' + error.message);
  }
};
