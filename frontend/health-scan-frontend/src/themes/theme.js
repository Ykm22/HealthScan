import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // Soft Blue
    },
    secondary: {
      main: '#28A745', // Light Green
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#F1F3F5', // Very Light Gray
    },
    text: {
      primary: '#495057', // Dark Gray
      secondary: '#6C757D', // Medium Gray
    },
  },
  // You can add more theme customizations here
});

export default theme;
