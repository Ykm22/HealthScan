import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import AboutUs from './pages/About us/AboutUs';

// Create a theme
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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#E9F7FE', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;