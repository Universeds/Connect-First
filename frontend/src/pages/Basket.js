import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Basket = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBasket();
  }, []);

  const fetchBasket = async () => {
    try {
      const response = await api.get('/basket');
      setBasketItems(response.data);
    } catch (error) {
      console.error('Error fetching basket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await api.put(`/basket/${itemId}`, { quantity: newQuantity });
      fetchBasket();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update quantity');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/basket/${itemId}`);
      fetchBasket();
      setMessage('Item removed from basket');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to remove item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await api.post('/basket/checkout');
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Checkout failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const calculateTotal = () => {
    return basketItems.reduce((total, item) => total + (item.cost * item.quantity), 0).toFixed(2);
  };

  if (loading) return <div className="loading">Loading basket...</div>;

  return (
    <div className="basket-container">
      <h1>My Funding Basket</h1>

      {message && <div className="message">{message}</div>}

      {basketItems.length === 0 ? (
        <div className="empty-basket">
          <p>Your basket is empty</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Needs
          </button>
        </div>
      ) : (
        <>
          <div className="basket-items">
            {basketItems.map(item => (
              <div key={item.id} className="basket-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="item-category">{item.category}</span>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  
                  <div className="item-cost">
                    ${(item.cost * item.quantity).toFixed(2)}
                  </div>
                  
                  <button onClick={() => handleRemoveItem(item.id)} className="btn-remove">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="basket-summary">
            <div className="total">
              <span>Total:</span>
              <span className="total-amount">${calculateTotal()}</span>
            </div>
            
            <button onClick={handleCheckout} className="btn-checkout">
              Checkout & Fund
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Basket;
