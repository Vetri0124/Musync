// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/globalStyles';
import theme from './styles/theme'; // Ensure this path is correct: './styles/theme.js'

import BackgroundAnimations from './components/BackgroundAnimations'; // <-- Ensure this import is correct

import Header from './components/Header/Header'; // Assuming you have this component
import Footer from './components/Footer/Footer'; // Assuming you have this component

// Your page components (adjust paths if different)
import HomePage from './pages/Home/HomePage';
import SearchPage from './pages/Search/SearchPage';
import RecognizePage from './pages/Recognize/RecognizePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SongDetailPage from './pages/Songs/SongDetailPage';

// Your custom components and context providers
import PrivateRoute from './components/PrivateRoute'; // Assuming you have this
import { AuthProvider } from './context/AuthContext'; // Assuming you have this context
import { AudioProvider } from './context/AudioContext'; // Assuming you have this context

function App() {
  return (
    // ThemeProvider makes your 'theme' object accessible throughout your styled-components
    <ThemeProvider theme={theme}>
      {/*
        BackgroundAnimations is rendered here, outside the main content flow.
        It uses fixed positioning and a low z-index to sit behind all your
        main application content, creating a truly fixed background.
      */}
      <BackgroundAnimations /> {/* <-- Ensure this line is present and correct */}

      {/* AuthProvider and AudioProvider wrap the entire application for global context */}
      <AuthProvider>
        <AudioProvider>
          {/* Router manages navigation within your single-page application */}
          <Router>
            {/* GlobalStyle applies base CSS rules and main body background */}
            <GlobalStyle />

            {/* Header, Main content (Routes), and Footer are your primary UI structure */}
            <Header />
            <main>
              {/* Routes define which component renders for a given URL path */}
              <Routes>
                {/* Public routes */}
                <Route index element={<HomePage />} /> {/* Default route */}
                <Route path="search" element={<SearchPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="songs/:id" element={<SongDetailPage />} />

                {/* Protected routes using PrivateRoute (requires authentication) */}
                <Route
                  path="recognize"
                  element={
                    <PrivateRoute>
                      <RecognizePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </Router>
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;