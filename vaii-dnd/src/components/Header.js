import React from 'react';
import Logo from "../images/Logo2.png";
import '../styles/HeaderStyle.css';

const Header = ({ isAuthenticated, handleLogout, username }) => {
  return (
    <header className="site-header">
      <div className="header-content">
        <a href="/">
          <img src={Logo} alt="Logo" className="logo" />
        </a>
        <h1 className="site-title">Character Builder</h1>
        <nav className="nav-links">
          <ul>
            <li><a href="/ClassList">Classes</a></li>
            <li><a href="/SpellList">Spells</a></li>
            {username === 'admin' && (
              <li><a href="/ManageUsers">Manage Users</a></li>
            )}
            {isAuthenticated && username !== 'admin' && (
              <li><a href="/create-character">Create Character</a></li>
            )}
            {isAuthenticated && username !== 'admin' && (
              <li><a href="/my-characters">My Characters</a></li>
            )}
          </ul>
        </nav>

        <div className="user-control">
        {isAuthenticated ? (
          <div className="user-info">
            <span className="welcome-message">User: {username}!</span>
            <a href="/" onClick={handleLogout} className="logout-link">Logout</a>
          </div>
        ) : (
          <a href="/Login" className="login-link">Login</a>
        )}
        </div>

        
      </div>
    </header>
  );
};

export default Header;
