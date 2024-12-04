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
  }, []);

  // Funkcia na prihlásenie užívateľa
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUsername(localStorage.getItem('username'));
  };

  // Funkcia na odhlásenie užívateľa
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
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
            {/* <Route
              path="/ManageUsers"
              element={
                username === "admin" ? (
                  <ManageUsersPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
