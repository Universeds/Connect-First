import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isHelper, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Connect First</Link>
        
        {user && (
          <div className="nav-menu">
            <span className="nav-user">
              {user.username} ({user.role})
            </span>
            
            {isHelper && (
              <Link to="/basket" className="nav-link">
                🛒 Basket
              </Link>
            )}
            
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
