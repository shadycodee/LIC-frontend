import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/joy';
import axios from 'axios';
import './StudentHistory.css';

const StudentHistory = ({ isOpen, onClose, studentID }) => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
          fetchHistory();
        }
      }, [isOpen]);

    const fetchHistory = async () => {
        setError('');
        try {
            const response = await axios.get(`http://localhost:8000/api/sessions/${studentID}/`);
            console.log('Fetched sessions:', response.data); 

            // Sort sessions by date (newest first)
            const sortedHistory = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setHistory(sortedHistory);
        } catch (error) {
            console.error('Error fetching session history:', error);
            setError('Failed to fetch session history.');
        }
    };

    if (!isOpen) return null;
    
  return (
    <div className="session-overlay">
        <div className="session-content">
            <button className="session_modal-close" onClick={onClose}>
            &times;
            </button>
            <h2>Session History</h2>
            <Typography variant="h6" component="div" gutterBottom>
            Student ID: {studentID}
            </Typography>
            <div className="modal-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Login Time</th>
                            <th>Logout Time</th>
                            <th>Consumed Time</th>
                        </tr>
                    </thead>
                    <tbody className="session-history-body">
                    {history.length > 0 ? (
                        history.map((session) => (
                        <tr key={session.parent_id}>
                            <td>{new Date(session.date).toLocaleDateString()}</td>
                            <td>{session.loginTime}</td>
                            <td>{session.logoutTime || 'N/A'}</td>
                            <td>{session.consumedTime ? `${session.consumedTime} mins` : '0'}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="4">No session history available.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
};

export default StudentHistory;