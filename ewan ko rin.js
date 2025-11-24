import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <h1>SHOPCO</h1>
        </Link>

        <div className="nav-links">
          <Link to="/">Shop</Link>
          <Link to="/">New Arrivals</Link>
          <Link to="/">Brands</Link>
        </div>

        <div className="nav-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="nav-icons">
          <Link to="/cart" className="icon-link">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/account" className="icon-link">
            👤
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;