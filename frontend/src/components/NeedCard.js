import React from 'react';
import Map from './Map';

const NeedCard = ({ need, onAddToBasket, onEdit, onDelete, isManager }) => {
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="need-card">
      <div className="need-header">
        <h3>{need.name}</h3>
        <span className={`priority-badge ${getPriorityClass(need.priority)}`}>
          {need.priority}
        </span>
      </div>
      
      <p className="need-description">{need.description}</p>
      
      <div className="need-details">
        <div className="detail-item">
          <span className="label">Cost:</span>
          <span className="value">${need.cost}</span>
        </div>
        <div className="detail-item">
          <span className="label">Available:</span>
          <span className="value">{need.quantity}</span>
        </div>
        <div className="detail-item">
          <span className="label">Category:</span>
          <span className="value">{need.category}</span>
        </div>
      </div>

      {need.isTimeSensitive && (
        <div className="time-sensitive">
          ⏰ Time Sensitive
          {need.deadline && (
            <div style={{ marginTop: '0.25rem', fontWeight: 'bold' }}>
              Deadline: {new Date(need.deadline).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      )}

      {need.frequencyCount > 0 && (
        <div className="frequency">
          Requested {need.frequencyCount} times
        </div>
      )}

      <div className="need-actions">
        {isManager ? (
          <>
            <button onClick={() => onEdit(need)} className="btn-edit">Edit</button>
            <button onClick={() => onDelete(need.id)} className="btn-delete">Delete</button>
          </>
        ) : (
          <button onClick={() => onAddToBasket(need)} className="btn-add">
            Add to Basket
          </button>
        )}
      </div>
      <Map latitude={need.latitude} longitude={need.longitude} />
    </div>
  );
};

export default NeedCard;
