import React, {useState, useEffect} from 'react';
import Header from '../Components/Header.jsx';
import { Button, Box, Typography } from '@mui/material';
import BarChart from '../Charts/BarChart.jsx';
import LineChart from '../Charts/LineChart.jsx';
import './Analytics.css';
import apiUrl from '../config.js';
import { Link } from 'react-router-dom';
import ExportButton from '../Components/ExportButton.jsx';

const Analytics = () => {
  const [semester, setSemester] = useState({ year: '', semester_name: '' });
  const [loggedInCount, setLoggedInCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(null);

  useEffect(() => {
    // Fetch the active users count from the backend
    fetch(`${apiUrl}/api/active_users/`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setActiveUsersCount(data.active_users_count);
        }
      })
      .catch((error) => console.error('Error fetching active users count:', error));
  }, []); // Empty array ensures this runs only once on mount

  useEffect(() => {
    // Fetch the logged-in count from the backend
    fetch(`${apiUrl}/api/count_loggedin/`)
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched count
        setLoggedInCount(data.logged_in_count);
      })
      .catch((error) => console.error('Error fetching logged-in count:', error));
  }, []); // Empty array ensures this runs only once on mount

  useEffect(() => {
    // Fetch the semester data from the API
    fetch(`${apiUrl}/api/semesters/`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setSemester(data);
        }
      })
      .catch((error) => console.error('Error fetching semester data:', error));
  }, []);
  return (
    <div>
      <Header />

     
    <div className='headerMenu'>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, margin: 4, }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#8C383E', fontWeight: 'bold' }}>SY: {semester.year} {semester.semester_name} </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '220px'}}>
          <Link to="/compare_analytics"><Button variant="contained" sx={{backgroundColor:'#8C383E'}} >Compare</Button></Link>
          <ExportButton/>
        </Box>
        
      </Box>
    </div>
      


      <div className="body">
        <div className='container1'>
          <Box sx={{ flex: '0 0 55%', padding: 1, margin: 4, backgroundColor: 'white', borderRadius: '8px' }}>
              <BarChart />
            </Box>
          {/* Stats Section */}
          <Box sx={{ padding: 5, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {/* Current Logged-in Users */}
          
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 3,
              borderRadius: '8px',
              flex: '1 1 100%', // Full width on small screens
              textAlign: 'center',
            }}
          >
            <Typography variant="h2" sx={{ color: '#8C383E', fontWeight: 'bold' }}>{loggedInCount}</Typography>
            <Typography variant="h6">Current Logged-in Users</Typography>
          </Box>

          {/* Active Users for this Semester */}
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 3,
              borderRadius: '8px',
              flex: '1 1 100%', // Full width on small screens
              textAlign: 'center',
            }}
          >
            <Typography variant="h2" sx={{ color: '#8C383E', fontWeight: 'bold' }}>{activeUsersCount}</Typography>
            <Typography variant="h6">Active Users</Typography>
          </Box>
        </Box>

        </div>
      
        {/* Charts Section */}
        <Box sx={{ padding: 2, display: 'flex', flexWrap: 'wrap', gap: 1, margin: 4 }}>
          {/* BarChart */}
          

          {/* LineChart */}
          <Box sx={{ flex: '1 1 100%', padding: 2, backgroundColor: 'white', borderRadius: '8px' }}>
            <LineChart />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Analytics;
