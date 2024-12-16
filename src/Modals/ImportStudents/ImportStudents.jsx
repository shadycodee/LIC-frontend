import React, { useState } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';  // Import exceljs
import './ImportStudents.css';
import apiUrl from '../../config';

import { useSnackbar } from 'notistack';

const ImportStudents = ({ isOpen, onClose, username }) => {  // Add username prop
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Logging activity
  const logActivity = async (action, username) => {
    const logData = {
      username: username,
      action: action,
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("Logging activity with data: ", logData);
      await axios.post(`${apiUrl}/api/activity-logs/`, logData);
      console.log("Activity logged successfully");
    } catch (error) {
      console.error("Error logging activity:", error.response?.data || error.message);
    }
  };

  const handleImport = async () => {
    if (!file) {
      enqueueSnackbar('No file attached', { variant: 'error' });
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      let students;

      if (file.name.endsWith('.csv')) {
        // Handle CSV file
        const text = new TextDecoder().decode(data);
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        students = rows.slice(1).map(row => {
          const studentObj = {};
          headers.forEach((header, index) => {
            const value = row[index];
            studentObj[header.trim()] = typeof value === 'string' ? value.trim() : value;
            if (header.trim() === 'time_left' || header.trim() === 'is_logged_in') {
              studentObj[header.trim()] = parseInt(value, 10);
            }
          });
          return studentObj;
        });
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        // Handle Excel file using exceljs
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);

        // Read data from the first sheet
        const worksheet = workbook.worksheets[0];
        const rows = worksheet.getSheetValues();
        const headers = rows[0];
        students = rows.slice(1).map(row => {
          const studentObj = {};
          row.forEach((value, index) => {
            const header = headers[index];
            if (header) {
              studentObj[header.trim()] = typeof value === 'string' ? value.trim() : value;
              if (header.trim() === 'time_left' || header.trim() === 'is_logged_in') {
                studentObj[header.trim()] = parseInt(value, 10);
              }
            }
          });
          return studentObj;
        });
      } else {
        enqueueSnackbar('Unsupported file type. Please upload a CSV or Excel file.', { variant: 'error' });
        return;
      }

      console.log("Parsed students JSON:", JSON.stringify(students, null, 2)); // Debug: Log the JSON

      try {
        const response = await axios.post(`${apiUrl}/api/import-student/`, students, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('File imported successfully:', response.data);
        enqueueSnackbar('Imported file succesffully!', { variant: 'success' });
        

        // Log the import activity
        await logActivity(`Imported ${students.length} students`, username);

      } catch (error) {
        console.error('Error importing file:', error.response ? error.response.data : error);
        enqueueSnackbar('Error importing students. Please check the console for details', { variant: 'error' });
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      enqueueSnackbar('Error reading file. Please try again', { variant: 'error' });
    };

    reader.readAsArrayBuffer(file); // Reading the file as ArrayBuffer
  };

  return (
    <div className='containerImport'>
      <div className='contentImport'>
        <button className='closeImport' onClick={onClose}>
          &times;
        </button>
        <h2>Import Students</h2>
        <div className="file-input">
          <input type="file" id="fileInput" onChange={handleFileChange} />
        </div>
        {fileName && <div className="file-name">Selected File: {fileName}</div>}
        <div className="button-group">
          <button className="import-btn" onClick={handleImport}>Import</button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudents;
