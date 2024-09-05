import axios from 'axios';

export const predictAlzheimers = async (fileIds, fileNames, age, sex, accessToken) => {
  try {
    const response = await axios.post('http://localhost:5000/predict_ad', 
      {
        input_files_ids: fileIds,
        input_files_names: fileNames,
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
    return response.data;
  } catch (error) {
    throw new Error('Error predicting Alzheimer\'s: ' + error.message);
  }
};
