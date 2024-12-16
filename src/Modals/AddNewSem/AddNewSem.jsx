import React, { useState } from 'react'
import './AddNewSem.css';
import apiUrl from '../../config';
import { useSnackbar } from 'notistack';



const AddNewSem = ({ isOpen, onClose}) => {
    const [year, setYear] = useState('');
    const [sem, setSem] = useState('');
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    if (!isOpen) return null;
  

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Input validation (optional)
        if (!year || !sem) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/semesters/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ year, semester_name: sem }),
            });

            if (response.ok) {
                enqueueSnackbar('Semester updated!', {variant: 'success'});
                setYear('');
                setSem('');
                onClose();
            } else {
                enqueueSnackbar('Failed to update semester!', {variant: 'error'});
            }
        } catch (error) {
            enqueueSnackbar('Failed to update semester!', {variant: 'error'});
        }
        
    };
    
  return (
    <div className='containerNewSem'>
        <div className='contentNewSem'>
            <button className='modal-close' onClick={onClose}>
                &times;
            </button>
            <h2>New Semester</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='input'>
                    <label htmlFor="year">
                        <input type="text" placeholder='e.g. 2024-2025' value={year} onChange={(e) => setYear(e.target.value)}/>
                    </label>
                </div>
                <div>
                    <label htmlFor="Semester">
                    <select name="semester" id="sem" value={sem} onChange={(e) => setSem(e.target.value)}>
                       <option value="" disabled>Select semester</option>
                        <option value="firstsem">First Semester</option>
                        <option value="secondsem">Second Semester</option>
                        <option value="midyear">Midyear</option>
                    </select>
                    </label>
                </div>
                <button type='submit'>Add new semester</button>
            </form>
        </div>
        
    </div>
  )
}

export default AddNewSem;