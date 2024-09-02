import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { resetPassword } from '../api/auth'; // Import the API function

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
  backgroundColor: '#007BFF',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newPassword) {
      setPasswordError('Password is required');
      return;
    }
    setPasswordError('');
    setIsLoading(true);

    try {
      const data = await resetPassword(token, newPassword);
      setSnackbarMessage(data.message);
      setOpenSnackbar(true);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
    } catch (error) {
      console.error('Error resetting password:', error);
      setSnackbarMessage(error.error || 'Failed to reset password');
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
        <Typography component="h1" variant="h5" color="#495057">
          Reset Your Password
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E9F7FE',
                },
                '&:hover fieldset': {
                  borderColor: '#007BFF',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#007BFF',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6C757D',
              },
            }}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </SubmitButton>
        </StyledForm>
      </StyledPaper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        ContentProps={{
          sx: {
            backgroundColor: snackbarMessage.includes('successfully') ? '#28A745' : '#FFC107',
            color: '#FFFFFF',
          }
        }}
      />
    </Container>
  );
};

export default ResetPasswordPage;
