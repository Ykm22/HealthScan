import axios from 'axios';

const API_URL = 'http://localhost:5000'; // You might want to store this in an environment variable

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/password/forgot`, { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/password/reset/${token}`, {
      new_password: newPassword
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();

  // Store user properties in localStorage
  localStorage.setItem('user_properties', JSON.stringify({
    access_token: data.access_token,
    age: data.age,
    email: data.email,
    id: data.id,
    is_admin: data.is_admin,
    sex: data.sex
  }));

  return data;
};

export const register = async (email, password, sex, age) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, sex, age }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};
