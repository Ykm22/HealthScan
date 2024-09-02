import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const data = await login(email, password);
      console.log('Login successful:', data);

      // Here you might want to store the token or user data
      // For example: localStorage.setItem('token', data.token);

      // Navigate to the home page
      navigate('/Home');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" color="primary">
          Login
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Sign In
          </SubmitButton>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Link 
              href="#" 
              variant="body2" 
              color="textSecondary"
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
              }}
            >
              Forgot password?
            </Link>
            <Link 
              href="#" 
              variant="body2" 
              color="textSecondary"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default LoginPage;
