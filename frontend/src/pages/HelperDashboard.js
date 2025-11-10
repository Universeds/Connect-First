import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NeedCard from '../components/NeedCard';

const HelperDashboard = () => {
  const [needs, setNeeds] = useState([]);
  const [filteredNeeds, setFilteredNeeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNeeds();
  }, []);

  useEffect(() => {
    filterNeeds();
  }, [needs, searchQuery, categoryFilter, priorityFilter]);

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

  const filterNeeds = () => {
    let filtered = needs;

    if (searchQuery) {
      filtered = filtered.filter(need => 
        need.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(need => need.category === categoryFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(need => need.priority === priorityFilter);
    }

    setFilteredNeeds(filtered);
  };

  const handleAddToBasket = async (need) => {
    try {
      await api.post('/basket', { need_id: need.id, quantity: 1 });
      setMessage(`Added ${need.name} to basket!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add to basket');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="loading">Loading needs...</div>;

  return (
    <div className="dashboard">
      <h1>Available Needs</h1>
      
      {message && <div className="message">{message}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Search needs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Clothing">Clothing</option>
          <option value="Toiletries">Toiletries</option>
          <option value="Medical">Medical</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      <div className="needs-grid">
        {filteredNeeds.length === 0 ? (
          <p>No needs found matching your criteria.</p>
        ) : (
          filteredNeeds.map(need => (
            <NeedCard
              key={need.id}
              need={need}
              onAddToBasket={handleAddToBasket}
              isManager={false}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HelperDashboard;
