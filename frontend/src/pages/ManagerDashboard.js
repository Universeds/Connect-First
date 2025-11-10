import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NeedCard from '../components/NeedCard';

const ManagerDashboard = () => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    quantity: '',
    category: 'Other',
    priority: 'Medium',
    isTimeSensitive: false,
    deadline: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    try {
      const response = await api.get('/needs/priority');
      setNeeds(response.data);
    } catch (error) {
      console.error('Error fetching needs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNeed) {
        await api.put(`/needs/${editingNeed.id}`, formData);
        setMessage('Need updated successfully!');
      } else {
        await api.post('/needs', formData);
        setMessage('Need created successfully!');
      }
      
      resetForm();
      fetchNeeds();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Operation failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (need) => {
    setEditingNeed(need);
    setFormData({
      name: need.name,
      description: need.description,
      cost: need.cost,
      quantity: need.quantity,
      category: need.category,
      priority: need.priority,
      isTimeSensitive: need.isTimeSensitive,
      deadline: need.deadline ? new Date(need.deadline).toISOString().slice(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (needId) => {
    if (!window.confirm('Are you sure you want to delete this need?')) return;
    
    try {
      await api.delete(`/needs/${needId}`);
      setMessage('Need deleted successfully!');
      fetchNeeds();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete need');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cost: '',
      quantity: '',
      category: 'Other',
      priority: 'Medium',
      isTimeSensitive: false,
      deadline: ''
    });
    setEditingNeed(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading needs...</div>;

  return (
    <div className="dashboard">
      <h1>Manager Dashboard - Cupboard Management</h1>
      
      {message && <div className="message">{message}</div>}

      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : 'Add New Need'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="need-form">
          <h2>{editingNeed ? 'Edit Need' : 'Create New Need'}</h2>
          
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cost ($) *</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Food">Food</option>
                <option value="Clothing">Clothing</option>
                <option value="Toiletries">Toiletries</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isTimeSensitive"
                checked={formData.isTimeSensitive}
                onChange={handleInputChange}
              />
              Time Sensitive
            </label>
          </div>

          {formData.isTimeSensitive && (
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
              />
              <small className="hint">Set a deadline for this time-sensitive need</small>
            </div>
          )}

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingNeed ? 'Update Need' : 'Create Need'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="needs-grid">
        {needs.length === 0 ? (
          <p>No needs in the cupboard yet.</p>
        ) : (
          needs.map(need => (
            <NeedCard
              key={need.id}
              need={need}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isManager={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
