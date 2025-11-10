import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (isRegistering) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await api.post('/auth/register', { username, password });
      }
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || (isRegistering ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Connect First</h1>
        <p className="login-subtitle">Non-profit Needs Management System</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
            />
            <small className="hint">Use "admin" for Manager access</small>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
            {isRegistering && <small className="hint">Minimum 6 characters</small>}
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (isRegistering ? 'Creating Account...' : 'Logging in...') : (isRegistering ? 'Create Account' : 'Login')}
          </button>

          <button 
            type="button" 
            onClick={toggleMode} 
            disabled={loading}
            className="btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
