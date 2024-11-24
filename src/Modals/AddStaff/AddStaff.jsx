import React, { useState } from 'react';
import './AddStaff.css';

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
  const [username, setUsername] = useState('');
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const defaultPassword = 'default password';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = { username, first_name, last_name }; 
    onAddStaff(newStaff);
    setUsername('');
    setFirstname('');
    setLastname('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-staff-modal-overlay">
      <div className="add-staff-modal">
        <button className="add-staff-modal-close" onClick={onClose}>&times;</button>
        <h2>Add Staff</h2>
        <form onSubmit={handleSubmit}>
          <div>
          <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
          </div>
          <div>
          <label>First Name:</label>
            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div>
          <label>Last Name:</label>
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div></div>
          <div>
            <label>Password:</label>
            <input
              type="text" 
              value={defaultPassword} 
              readOnly 
              required
            />
          </div>
          <button type="submit" >Add Staff</button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;