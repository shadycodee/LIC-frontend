import React, { useEffect } from 'react';
import { LineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import axios from 'axios';
import apiUrl from '../config';
import { Typography, Box } from '@mui/material';

const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0", "#d0ed57", 
    "#f56f42", "#ff9e00", "#7f7f7f", "#c2185b", "#8e24aa", "#0288d1", 
    "#2e7d32", "#d32f2f", "#1976d2", "#0288d1", "#7b1fa2", "#e91e63", 
    "#2196f3", "#4caf50"
];

const PreviousLineChart = () => {
    const [semester_name, setSemester] = React.useState('');
    const [year, setYear] = React.useState('');
    const [chartType, setChartType] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [selectedCourses, setSelectedCourses] = React.useState({});
    const [courseColors, setCourseColors] = React.useState({});
    const [selectAll, setSelectAll] = React.useState(false);

    //Bar Chart
    const [chartTitle, setChartTitle] = React.useState('Number of Hours Use');
    const [sessionData, setSessionData] = React.useState([]);
    const [incomeData, setIncomeData] = React.useState([]);

    const handleCourseToggle = (course, isChecked) => {
        setSelectedCourses((prev) => ({ ...prev, [course]: isChecked }));
    };

    const handleSelectAllToggle = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const updatedSelectedCourses = {};
        Object.keys(selectedCourses).forEach(course => {
            updatedSelectedCourses[course] = newSelectAll;
        });
        setSelectedCourses(updatedSelectedCourses);
    };

    const handleChange = (event) => setSemester(event.target.value);
    const handleYearChange = (event) => setYear(event.target.value);
    const handleChartTypeChange = (event) => setChartType(event.target.value);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchTransactionIncome = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/previous-income/`, {
                params: { year, semester_name }
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

    const fetchSessionHours = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/previous-session/`, {
                params: { year, semester_name }
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

    const handleSubmit = async () => {
        if (chartType === 'line') {
            try {
                const response = await axios.get(`${apiUrl}/api/previous-count/`, {
                    params: { year, semester_name },
                });
                const fetchedData = response.data.data;

                const chartData = [];
                const coursesSet = new Set();
                const courseColorMapping = {};

                Object.keys(fetchedData).forEach((course, index) => {
                    fetchedData[course].forEach(({ month, count }, monthIndex) => {
                        if (!chartData[monthIndex]) chartData[monthIndex] = { month };
                        chartData[monthIndex][course] = count;
                        coursesSet.add(course);
                    });
                    
                    courseColorMapping[course] = COLORS[index % COLORS.length];
                });

                setData(chartData);
                setCourseColors(courseColorMapping);

                const initialSelectedCourses = {};
                coursesSet.forEach(course => {
                    initialSelectedCourses[course] = true;
                });

                setSelectedCourses(initialSelectedCourses);
                setOpen(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        } else if (chartType === 'bar') {
            fetchSessionHours();
            fetchTransactionIncome();
            setOpen(false);
        }
    };

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
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{ backgroundColor: '#8C383E' }}>Select</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Past Records</DialogTitle>
                <DialogContent>
                    <DialogContentText>Year</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="year"
                        name="year"
                        label="YYYY-YYYY"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={year}
                        onChange={handleYearChange}
                    />
                    <InputLabel id="semester-label">Semester</InputLabel>
                    <Select
                        labelId="semester-label"
                        id="semester"
                        value={semester_name}
                        onChange={handleChange}
                        label="Semester"
                        sx={{ width: '200px' }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="firstsem">First semester</MenuItem>
                        <MenuItem value="secondsem">Second semester</MenuItem>
                        <MenuItem value="midyear">Midyear</MenuItem>
                    </Select>
                    <InputLabel id="chart-type-label">Chart Type</InputLabel>
                    <Select
                        labelId="chart-type-label"
                        id="chart-type"
                        value={chartType}
                        onChange={handleChartTypeChange}
                        label="Chart Type"
                        sx={{ width: '200px', marginTop: '20px' }}
                    >
                        <MenuItem value="line">Line Chart</MenuItem>
                        <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Set</Button>
                </DialogActions>
            </Dialog>

            <div>
                {data.length === 0 ? (
                    <p>No data yet</p>
                ) : chartType === 'line' ? (
                    <div className="linechart">
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
                ) : (
                    <div className="barchart">
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
                    </div>
                )}
            </div>
        </div>
    );
};
  
export default PreviousLineChart;