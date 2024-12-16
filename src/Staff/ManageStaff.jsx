import React, { useState, useEffect } from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import AddIcon from '@mui/icons-material/Add';
import Header from '../Components/Header.jsx';
import SnackbarComponent from '../Components/SnackbarComponent.jsx';
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import AddStaffModal from '../Modals/AddStaff/AddStaff.jsx';
import './ManageStaff.css';
import Dropdown from "@mui/joy/Dropdown";
import MenuButton from "@mui/joy/MenuButton";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/joy/Input";
import { useSnackbar } from 'notistack';
import apiUrl from "../config";

const ManageStaff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [activityLogs, setActivityLogs] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/staffview/`); 
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const data = await response.json();
      setStaffList(data); 
    } catch (error) {
      console.error('Failed to fetch staff list:', error);
      setError('Failed to fetch staff list'); 
    }
  };

  // Filter staff based on search query
  const filteredStaff = staffList.filter((staff) =>
    staff.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = async (newStaff) => {
    try {
      const response = await fetch(`${apiUrl}/api/create-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.alert?.message || 'Failed to add staff.');
      }

      enqueueSnackbar('Staff added successfully!', {variant: 'success'}); 
      await fetchStaffList(); 
    } catch (error) {
      enqueueSnackbar('Failed', {variant: 'error'}); 
    }
  };

  const fetchActivityLogs = (username) => {
    fetch(`${apiUrl}/api/logs/${username}/`)
      .then((response) => {
        if (!response.ok) {
          console.log('Failed Fetching')
        }
        return response.json();
      })
      .then((data) => {
        setActivityLogs(data);
      })
      .catch((error) => {
        console.error('Error fetching logs:', error.message);
        setActivityLogs([]);  // Empty out logs on error
        enqueueSnackbar('Failed', {variant: 'error'}); 
      });
  };
  
  


  const handleRowClick = (username) => {
    console.log("Selected username:", username);  

    if (selectedUsername === username) {
        setSelectedUsername(null);
        setActivityLogs([]);
        return;
    }

    setLoading(true);
    setSelectedUsername(username);
    fetchActivityLogs(username);

    setTimeout(() => {
        setLoading(false);
    }, 2000);
};


  const logActivity = async (username, action) => {
    try {
      await fetch(`${apiUrl}/api/activity-logs/`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, action }),
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const handleStatusChange = async (username, newStatus) => {
    // Find the current staff member in the list
    const currentStaff = staffList.find(staff => staff.username === username);
    
    // Check if the status is already the same
    if (currentStaff && currentStaff.is_active === newStatus) {
      return; // Exit the function without making an API call
    }
    
    try {
      const response = await fetch(`${apiUrl}/api/update-status/${username}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchStaffList();
      enqueueSnackbar('Status updated successfully!', {variant: 'success'}); 
      
      // Log the activity
      await logActivity(username, newStatus ? 'Activated' : 'Deactivated');
    } catch (error) {
      enqueueSnackbar('Failed', {variant: 'error'}); 
    }
  };

  const paginatedStaff = filteredStaff.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < Math.ceil(filteredStaff.length / itemsPerPage)) {
      setPage(page + 1);
    }
  };

  const currentStaff = staffList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStaff={handleAddStaff}
      />
      {error && (
        <Typography sx={{ color: 'red', textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      <Header />
      <div className="staff-container">
        <div className="staff-container-body">
          <div className="staff-container-content">
            <div className="staff-table">
              <div className='staff-container-header'>
                <Typography
                  component="h1"
                  sx={{ fontSize: '36px', fontWeight: 'normal', color: '#a94442' }}
                >
                  STAFF
                </Typography>
                <div className="pagination-controls">
                  {/* Previous Button */}
                  <IconButton
                    onClick={handlePrevious}
                    disabled={page === 1}
                  >
                    <ArrowBackIos />
                  </IconButton>

                  {/* Current Page Number */}
                  <Typography 
                    variant="button" 
                    sx={{ 
                      color: 'white',
                      backgroundColor: '#a94442',
                      borderRadius: '50%', 
                      width: '30px',     
                      height: '30px',    
                      display: 'flex',     
                      justifyContent: 'center',
                      alignItems: 'center',  
                    }}>
                   {page}
                  </Typography>

                  <IconButton
                    onClick={handleNext}
                    disabled={page === Math.ceil(filteredStaff.length / itemsPerPage)} 
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </div>
                <Input
                  placeholder="Search staff..."
                  variant="soft"
                  size="sm"
                  endDecorator={<SearchIcon />}
                  className="search-input"
                  sx={{
                    width: "250px",
                    height: "20px",
                    fontSize: "13px",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Button
                  startDecorator={<AddIcon />}
                  sx={{
                    backgroundColor: '#89343b',
                    color: 'white',
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#FFD404', color: '#89343b' },
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Staff
                </Button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {paginatedStaff.length > 0 ? (
                    paginatedStaff.map((staff) => (
                        <tr
                            key={staff.username}
                            onClick={() => handleRowClick(staff.username)} 
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{staff.first_name}</td>
                            <td>{staff.username}</td>
                            <td>
                                <Dropdown>
                                    <MenuButton
                                        variant="outlined"
                                        endDecorator={<KeyboardArrowDownIcon />}
                                    >
                                        {staff.is_active ? 'Active' : 'Inactive'}
                                    </MenuButton>
                                    <Menu>
                                        <MenuItem onClick={() => handleStatusChange(staff.username, true)}>Active</MenuItem>
                                        <MenuItem onClick={() => handleStatusChange(staff.username, false)}>Inactive</MenuItem>
                                    </Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No staff members found.</td>
                    </tr>
                )}
            </tbody>

              </table>
            </div>
            <div className="logs-table">
              <Typography
                  component="h1"
                  sx={{
                      fontSize: '36px',
                      fontWeight: 'normal',
                      color: '#a94442',
                  }}
              >
                  LOGS
              </Typography>
              <table style={{ display: 'block', maxHeight: '400px', overflowY: 'auto', width: '100%', borderRadius: '5px' }}>
                  <thead style={{ width: '100%'}}>
                      <tr>
                        <strong><th colSpan="3" style={{width: '1000px', maxWidth:'100%', color: '#a94442'}}>{`Staff: ${selectedUsername || ""}`}</th></strong> 
                        </tr>
                      <tr>
                          <th style={{width: '75%'}}>Action</th>
                          <th style={{width: '25%'}}>Timestamp</th> 
                      </tr>
                  </thead>
                  <tbody>
                  {loading ? (
                    <tr>
                        <td colSpan="2">Loading...</td>
                    </tr>
                  ) : selectedUsername ? (
                    <>
                        
                        {activityLogs.length > 0 ? (
                          activityLogs.map((log, index) => (
                              <tr key={index}>
                                <td>{log.action}</td> 
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                              </tr>
                          ))
                        ) : (
                          <tr>
                              <td colSpan="2">No logs found for this user.</td>
                          </tr>
                        )}
                    </>
                  ) : (
                    <tr>
                        <td colSpan="2">No logs yet...</td>
                    </tr>
                  )}

                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;
