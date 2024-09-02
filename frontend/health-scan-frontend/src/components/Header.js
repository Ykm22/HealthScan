import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#007BFF',
  width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#FFFFFF',
  marginLeft: theme.spacing(2),
}));

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HealthScan
        </Typography>
        <Box>
          <StyledButton component={Link} to="/">Home</StyledButton>
          <StyledButton component={Link} to="/upload">Upload</StyledButton>
          <StyledButton component={Link} to="/about">About</StyledButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
