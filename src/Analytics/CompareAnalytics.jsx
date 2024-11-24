import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for routing
import { Button, Box } from '@mui/material'; // Material UI components for styling
import PreviousLineChart from '../Charts/PreviousCharts.jsx';

const CompareAnalytics = () => {
   
  return (
    <div>
      {/* Back Button with Link from react-router-dom */}
      <Link to="/analytics" style={{ textDecoration: 'none' }}>
        <Button 
          variant="contained" 
          
          style={{ marginBottom: '20px', backgroundColor:'#8C383E' }}
        >
           Back to Analytics
        </Button>
      </Link>
      
      {/* Comparison Section using Box */}
      <Box display="flex" flexDirection="row" justifyContent="space-between" gap={2}>
        {/* First Analytics */}
        <Box
          flex={1}
          p={2}
          border="1px solid #ddd"
          borderRadius="8px"
          style={{ minWidth: '300px', backgroundColor: 'white' }}
        >
          {/* Add your first analytics chart or data here */}
          {/* Example content */}
          <PreviousLineChart/>
        </Box>

        {/* Second Analytics */}
        <Box
          flex={1}
          p={2}
          border="1px solid #ddd"
          borderRadius="8px"
          style={{ minWidth: '300px', backgroundColor:'white' }}
        >
            <Box sx={{diplay:'flex', justifyContent:'space-between'}}>
            </Box>
          <PreviousLineChart/>
        </Box>
      </Box>
    </div>
  );
};

export default CompareAnalytics;
