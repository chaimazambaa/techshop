import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout, cartItemCount, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm); // Appelle la fonction de recherche fournie en tant que prop
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">KOLYUM</Link>

      {/* Search Bar in Navbar */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">🔍</button>
      </form>

      {user ? (
        <div className="navbar-right">
          <Link to="/cart" className="navbar-cart">
            🛒
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
          <div className="navbar-dropdown">
            <button className="navbar-dropdown-toggle">
              {user.email} ▼
            </button>
            <div className="navbar-dropdown-menu">
              <Link to="/profile" className="navbar-dropdown-item">Modify Profile</Link>
              <Link to="/categories" className="navbar-dropdown-item">Categories</Link>
              <Link to="/add-product" className="navbar-dropdown-item">Ajouter un produit</Link>
              <button onClick={onLogout} className="navbar-dropdown-item">Logout</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login" className="navbar-link">Login</Link>
          <Link to="/signup" className="navbar-link">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

