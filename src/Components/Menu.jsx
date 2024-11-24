import React from 'react';
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

const Menu = ({ onSubmit }) => {
    const [semester, setSemester] = React.useState('');
    const [year, setYear] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (year && semester) {
            // Passing the selected values to the parent component
            onSubmit(year, semester);
            console.log("Year:", year);  // Log year separately
            console.log("Semester:", semester);
            handleClose();
        } else {
            alert("Please fill in both fields.");
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>Menu</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Past Records</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Year
                    </DialogContentText>
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
                        value={semester}
                        onChange={handleChange}
                        label="Semester"
                        sx={{ width: '200px' }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="firstsem">First semester</MenuItem>
                        <MenuItem value="secondsem">Second semester</MenuItem>
                        <MenuItem value="midyear">Midyear</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Set</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Menu;
