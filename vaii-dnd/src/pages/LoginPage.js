import React, { useState } from 'react';
import axios from 'axios';
import "../styles/LoginPageStyle.css";

function LoginPage({ handleLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);

      if (res.data.success) {
        alert(res.data.msg);
        // Uložíme informáciu o prihlásení do localStorage
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('username', username);
        // Zavoláme handleLogin na aktualizáciu stavu v App.js
        handleLogin();
        // Presmerujeme užívateľa na hlavnú stránku alebo inú stránku
        // window.location.href = '/';
      } else {
        alert(res.data.msg);
      }
    } catch (err) {
      console.error('Chyba pri prihlásení:', err);
      if (err.response && err.response.data && err.response.data.msg) {
        alert(`Chyba pri prihlásení: ${err.response.data.msg}`);
      } else {
        alert('Chyba pri prihlásení: Niečo sa pokazilo.');
      }
    }
  };

  return (
    <div>
      <main className="content">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={onSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                placeholder="Enter your username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn-submit">Login</button>
          </form>
          <p className="register-link">
            Don't have an account? <a href="/Register">Register here</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
