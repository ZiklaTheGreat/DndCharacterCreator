import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ClassListPage from './pages/ClassListPage';
import LoginPage from './pages/LoginPage';
import SpellListPage from './pages/SpellListPage';
import RegisterPage from './pages/RegisterPage';
import ManageUsersPage from './pages/ManageUsersPage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import CharactersListPage from './pages/CharactersListPage';
import CharacterDetailPage from './pages/CharacterDetailPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const user = localStorage.getItem('username');
    if (auth) {
      setIsAuthenticated(true);
      setUsername(user);
    }

    const updateLastActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const logoutAfterInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const currentTime = Date.now();

      if (lastActivity && currentTime - parseInt(lastActivity, 10) > 3600000) {
        // 1 hodina = 3600000 ms
        handleLogout();
        window.location.reload();
      }
    };

    // Aktualizuj čas poslednej aktivity pri interakcii používateľa
    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);

    // Kontrola neaktivity každých 5 minút
    const interval = setInterval(logoutAfterInactivity, 300000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
    };
  }, []);

  // Funkcia na prihlásenie užívateľa
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUsername(localStorage.getItem('username'));
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  // Funkcia na odhlásenie užívateľa
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('lastActivity');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <div id="root">
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} username={username} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ClassList" element={<ClassListPage />} />
            <Route
              path="/Login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage handleLogin={handleLogin} />
                )
              }
            />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/SpellList" element={<SpellListPage />} />
            <Route path="/ManageUsers" element={<ManageUsersPage username={username} />} />
            <Route path="/create-character" element={<CreateCharacterPage />} />
            <Route path="/my-characters" element={<CharactersListPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
