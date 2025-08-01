import React from 'react';
import './Header.css';

const Header = () => {
  return (
<header className="header">
  <div className="header-content">
    <h1>Castaway</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/docs" className='lastA'>Docs</a></li>
      </ul>
    </nav>
  </div>
</header>
  );
};

export default Header;
