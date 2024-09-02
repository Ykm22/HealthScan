import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await register(email, password, sex, parseInt(age));
      console.log('Registration successful:', data);
      // Here you might want to store the token or user data
      // For example: localStorage.setItem('token', data.token);
      // Navigate to the login page or directly to home page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" color="primary">
          Register
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="sex-label">Sex</InputLabel>
            <Select
              labelId="sex-label"
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              label="Sex"
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              <MenuItem value="O">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="age"
            label="Age"
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Register
          </SubmitButton>
          <Box mt={2} display="flex" justifyContent="center">
            <Link 
              href="#" 
              variant="body2" 
              color="textSecondary"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default RegisterPage;
