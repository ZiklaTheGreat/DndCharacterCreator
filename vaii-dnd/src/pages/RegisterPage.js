import React, { useState } from 'react';
import axios from 'axios';
import "../styles/LoginPageStyle.css";

function RegisterPage() {
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
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      alert(res.data.msg);
    } catch (err) {
      console.error('Chyba pri registrácii:', err);
  
      const errorMsg = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Chyba pri registrácii';
  
      alert(errorMsg);
    }
  };
  

  return (
    <div>
      <main className="content">
        <div className="login-box">
          <h2>Register</h2>
          <form onSubmit={onSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter your username"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
            />
            <button type="submit" className="btn-submit">Register</button>
          </form>
          <p className="register-link">
            Already have an account? <a href="/Login">Login here</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
