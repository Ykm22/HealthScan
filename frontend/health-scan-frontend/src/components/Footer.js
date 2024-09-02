import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#F8F9FA',
  color: '#495057',
  padding: theme.spacing(3),
  marginTop: 'auto',
  bottom: 0,
  width: '100%',
}));

const Footer = () => {
  return (
    <StyledFooter component="footer">
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} HealthScan. All rights reserved.
      </Typography>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        <MuiLink color="inherit" href="/privacy">
          Privacy Policy
        </MuiLink>
        {' | '}
        <MuiLink color="inherit" href="/terms">
          Terms of Service
        </MuiLink>
      </Typography>
    </StyledFooter>
  );
};

export default Footer;
