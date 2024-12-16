import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiUrl from '../config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box, Button } from '@mui/material';

const AnalyticsChart = ({ year, semester }) => {
  const [chartTitle, setChartTitle] = useState('Number of Hours Use');
  const [data, setData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [incomeData, setIncomeData] = useState([]); 

  useEffect(() => {
    fetchSessionHours();
    fetchTransactionIncome();
  }, [year, semester]); // Re-fetch data when year or semester changes

  // Fetch Transaction Income
  const fetchTransactionIncome = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/transaction-income/`, {
        params: { year, semester }
      });
      const formattedData = response.data.map(item => ({
        month: item.month,
        value: item.total_income,
      }));
      setIncomeData(formattedData);
    } catch (error) {
      console.error("Error fetching transaction income:", error);
    }
  };

  // Fetch Session Hours
  const fetchSessionHours = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/session-hours/`, {
        params: { year, semester }
      });
      const formattedData = response.data.map(item => ({
        month: item.month,
        value: item.total_hours,
      }));
      setSessionData(formattedData);
      setData(formattedData); 
    } catch (error) {
      console.error("Error fetching session hours:", error);
    }
  };

  // Function to handle button click to toggle chart data
  const handleButtonClick = () => {
    if (chartTitle === 'Number of Hours Use') {
      setChartTitle('Load Payment Income');
      setData(incomeData);
    } else {
      setChartTitle('Number of Hours Use');
      setData(sessionData);
    }
  };

  const barLabel = chartTitle === 'Number of Hours Use' ? 'Hours' : 'PHP';
  const numberFormatter = (value) => new Intl.NumberFormat('en-US').format(value);

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: '10px', padding: '5px', maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#8C383E', fontWeight: 'bold' }}>
          {chartTitle}
        </Typography>
        <Button variant="contained" onClick={handleButtonClick} sx={{backgroundColor:'#8C383E'}}>
          {chartTitle === 'Number of Hours Use' ? 'Load Payment Income' : 'Load Number of Hours Use'}
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => numberFormatter(value)} />
          <Legend />
          <Bar dataKey="value" name={barLabel} fill="#8884d8" label={{ position: 'top', formatter: numberFormatter }} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Define prop types for the component
AnalyticsChart.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
};

export default AnalyticsChart;
