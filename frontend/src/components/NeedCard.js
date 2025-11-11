import React from 'react';
import Map from './Map';

const NeedCard = ({ need, onAddToBasket, onEdit, onDelete, isManager }) => {
  // Debug: Log need data to see what we're receiving
  console.log('NeedCard - need data:', {
    id: need.id,
    name: need.name,
    cost: need.cost,
    quantity: need.quantity,
    amountRaised: need.amountRaised,
    amountLeft: need.amountLeft,
    totalGoal: need.totalGoal,
    progressPercentage: need.progressPercentage
  });
  
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

      {/* Funding Progress Bar */}
      {(() => {
        // Calculate progress data - use backend data if available, otherwise calculate from need data
        const amountRaised = need.amountRaised !== undefined ? need.amountRaised : 0;
        const amountLeft = need.amountLeft !== undefined ? need.amountLeft : (need.quantity * need.cost);
        const totalGoal = need.totalGoal !== undefined ? need.totalGoal : (amountRaised + amountLeft);
        const progressPercentage = need.progressPercentage !== undefined 
          ? need.progressPercentage 
          : (totalGoal > 0 ? (amountRaised / totalGoal) * 100 : 0);
        
        // Always show progress bar if we have valid cost and quantity data
        if (need.cost && need.quantity !== undefined) {
          return (
            <div className="funding-progress">
              <div className="progress-header">
                <span className="progress-label">Funding Progress</span>
                <span className="progress-percentage">{Math.round(progressPercentage * 10) / 10}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
                ></div>
              </div>
              <div className="progress-details">
                <span className="progress-amount">
                  <strong>${amountRaised.toFixed(2)}</strong> raised
                </span>
                <span className="progress-amount">
                  <strong>${amountLeft.toFixed(2)}</strong> to go
                </span>
              </div>
              <div className="progress-total">
                Goal: <strong>${totalGoal.toFixed(2)}</strong>
              </div>
            </div>
          );
        }
        return null;
      })()}

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
