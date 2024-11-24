import React, { useState, useEffect } from 'react';
import './Confirmation.css';

const Confirmation = ({ isOpen, onClose, onConfirm, newStatus }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setAlertMessage('Status changed successfully!');
      setAlertType('success');
    } catch (error) {
      console.error('Error changing status:', error);
      setAlertMessage('Error changing status.');
      setAlertType('error');
    } finally {
      setShowSnackbar(true); 
    }
  };

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
        setAlertMessage('');
        setAlertType('');
        onClose();
      }, 1000); 

      return () => clearTimeout(timer); 
    }
  }, [showSnackbar, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Status Change</h2>
        <p>
          Are you sure you want to change the student's status to 
          <span className="status-pill">{newStatus}</span>?
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm}>Confirm</button>
          
        </div>

        {/* Snackbar Alert */}
        {showSnackbar && (
          <div className={`alert-message ${alertType} show`}>
            {alertMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;
