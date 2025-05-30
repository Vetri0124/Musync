import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle, { theme } from './styles/globalStyles';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/HomePage';
import SearchPage from './pages/Search/SearchPage';
import RecognizePage from './pages/Recognize/RecognizePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SongDetailPage from './pages/Songs/SongDetailPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AudioProvider>
          <Router>
            <GlobalStyle />
            <Header />
            <main>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="songs/:id" element={<SongDetailPage />} />
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