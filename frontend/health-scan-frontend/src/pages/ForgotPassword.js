import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase()) ? '' : 'Incorrect email format';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    setEmailError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSnackbarMessage('Password reset link sent to your email');
      setOpenSnackbar(true);
      console.log('Password reset requested for:', email);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setSnackbarMessage('Error requesting password reset. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" color="primary">
          Forgot Password
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1, mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            error={!!emailError}
            helperText={emailError}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Reset Password
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
              Back to Login
            </Link>
          </Box>
        </StyledForm>
      </StyledPaper>
      <Box mt={2}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
