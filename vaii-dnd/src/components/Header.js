import React from 'react';
import Logo from "../images/Logo2.png";
import '../styles/HeaderStyle.css';


const Header = () => {
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
          </ul>
        </nav>
        <a href="/login" className="login-link">Login</a>
      </div>
    </header>
  );
};

export default Header;
