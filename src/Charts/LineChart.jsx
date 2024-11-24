import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Checkbox, FormControlLabel } from '@mui/material'; // Importing Material UI components
import axios from 'axios';

// Updated color palette with 20 colors
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0", "#d0ed57", 
  "#f56f42", "#ff9e00", "#7f7f7f", "#c2185b", "#8e24aa", "#0288d1", 
  "#2e7d32", "#d32f2f", "#1976d2", "#0288d1", "#7b1fa2", "#e91e63", 
  "#2196f3", "#4caf50"
];

const LoadPayments = () => {
  const [data, setData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [courseColors, setCourseColors] = useState({});
  const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:8000/api/courses-count/') // Replace with your actual endpoint
      .then(response => {
        const fetchedData = response.data.data;

        // Transform backend data to match chart structure
        const chartData = [];
        const coursesSet = new Set();
        const courseColorMapping = {};

        // Loop through each course in fetched data to organize by month
        Object.keys(fetchedData).forEach((course, index) => {
          fetchedData[course].forEach(({ month, count }, monthIndex) => {
            if (!chartData[monthIndex]) chartData[monthIndex] = { month };
            chartData[monthIndex][course] = count;
            coursesSet.add(course);
          });

          // Assign a color to the course based on its index
          courseColorMapping[course] = COLORS[index % COLORS.length]; // Loop through color palette if courses exceed the number of colors
        });

        setData(chartData);
        setCourseColors(courseColorMapping);

        // Initialize selected courses based on available courses in data
        const initialSelectedCourses = {};
        coursesSet.forEach(course => {
          initialSelectedCourses[course] = true;
        });
        setSelectedCourses(initialSelectedCourses);
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }, []);

  // Handle course selection toggle
  const handleCourseToggle = (course, isChecked) => {
    setSelectedCourses((prev) => ({ ...prev, [course]: isChecked }));
  };

  // Handle "Select All" / "Deselect All" toggle
  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    // Update all courses to be selected or deselected
    const updatedSelectedCourses = {};
    Object.keys(selectedCourses).forEach(course => {
      updatedSelectedCourses[course] = newSelectAll;
    });
    setSelectedCourses(updatedSelectedCourses);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent:'space-between'}}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Course Session Frequency by Month</h2> {/* Title */}
      {/* Select All / Deselect All checkbox */}
      <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllToggle}
            />
          }
          label="Select / Deselect All"
        />
      </div>
      

      <div>
        
        {/* Map courses to checkboxes */}
        {Object.keys(selectedCourses).map(course => (
          <FormControlLabel
            key={course}
            control={
              <Checkbox
                checked={selectedCourses[course]}
                onChange={(e) => handleCourseToggle(course, e.target.checked)}
              />
            }
            label={course}
          />
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(selectedCourses).map(course => 
            selectedCourses[course] && (
              <Line 
                key={course} 
                type="monotone" 
                dataKey={course} 
                stroke={courseColors[course]} 
              >
                <LabelList 
                  dataKey={course} 
                  position="top" 
                  fill={courseColors[course]} 
                  fontSize={12}
                />
                </Line>
            )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadPayments;
