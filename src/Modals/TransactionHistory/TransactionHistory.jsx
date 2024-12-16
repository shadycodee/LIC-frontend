import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionHistory.css';
import apiUrl from '../../config';
import { Typography } from '@mui/joy';

const TransactionHistory = ({ isOpen, onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  const fetchTransactions = async () => {
    setError('');
    try {
      const response = await axios.get(`${apiUrl}/api/transactions/`);
      console.log('Fetched transactions:', response.data); 

      const sortedTransactions = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.response ? error.response.data : error.message); 
      setError('Failed to fetch transactions.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="transactionHistory_modal-overlay">
      <div className="transactionHistory_modal-content">
        <button className="transactionHistory_modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Transaction History</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="transaction-list">
          {transactions.length > 0 ? (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <Typography variant="body1" component="div">
                    <strong>Student ID:</strong> {transaction.student_id} <br />
                    <strong>Reference Number:</strong> {transaction.reference_number} <br />
                    <strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1" component="div">
              No transactions found.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
