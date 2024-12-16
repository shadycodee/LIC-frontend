import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddStudent.css';
import apiUrl from '../../config';
import { useSnackbar } from 'notistack';

const AddStudent = ({ isOpen, onClose, onStudentAdded }) => {
  const [studentID, setStudentID] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('Student'); 
  const [password, setPassword] = useState('hashed_default_password'); 
  const [timeLeft, setTimeLeft] = useState(600); 
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    

    console.log('Student ID:', studentID);
    console.log('Name:', name);
    console.log('Course:', course);
    console.log('Status:', status);
    console.log('Password:', password);
    console.log('Time Left:', timeLeft);

    if (!studentID || !name || !course) {
      setError('Please fill in all fields');
      return;
    }

    const newStudent = {
      studentID,
      name,
      course,
      time_left: timeLeft,  
      status,  
      password
    };

    try {
      const response = await axios.post(`${apiUrl}/api/students/`, newStudent);
      console.log('Student added successfully:', response.data);

      onStudentAdded(); 

      setStudentID('');
      setName('');
      setCourse('');
      setStatus('Student'); 
      setPassword('hashed_default_password'); 
      setTimeLeft(600); 

      onClose(); 
      enqueueSnackbar('Student added successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error adding student:', error.response ? error.response.data : error.message);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.studentID) {
          setError(errorData.studentID.join(', ')); 
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors.join(', '));
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('Failed to add student. Please try again.');
      }
    }
  };

    return (
    <div className="addstudent_modal-overlay">
      <div className="addstudent_modal-content">
        <button className="addstudent_modal-close" onClick={onClose}>
          &times;
        </button> 
        <h2>Add Student</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="studentID">Student ID</label>
            <input
              type="text"
              id="studentID"
              name="studentID"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              placeholder="XX-XXXX-XXX"
              required
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="course">Course</label>
            <input
              type="text"
              id="course"
              name="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </div>
          {/* Non-editable fields */}
          <div>
            <label htmlFor="status">Status</label>
            <input
              type="text"
              id="status"
              name="status"
              value={status}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="password">Password (Hashed)</label>
            <input
              type="text"
              id="password"
              name="password"
              value={password}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="timeLeft">Time</label>
            <input
              type="text"
              id="timeLeft"
              name="timeLeft"
              value={timeLeft}
              readOnly
            />
          </div>
          <button type="submit">Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;