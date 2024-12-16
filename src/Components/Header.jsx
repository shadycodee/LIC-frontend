import React, { useState, useEffect } from 'react';
import { Sheet, Box, Typography, Dropdown, MenuButton, Menu, MenuItem, Button, CssVarsProvider, extendTheme, IconButton } from '@mui/joy';
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useLocation } from 'react-router-dom';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import axios from 'axios';
import apiUrl from '../../config';
import { getCookie } from "../utils/utils";
import { useSnackbar } from 'notistack';

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Poppins, sans-serif",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#a94442",
        },
      },
    },
    JoySheet: {
      styleOverrides: {
        root: {
          "&.header": {
            backgroundColor: "#ffd404",
          },
        },
      },
    },
  },
});

const Header = ({ username }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);
  
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Manage Staff", path: "/staff", restricted: true },  
    { label: "Settings", path: "/settings"},   
  ];

  const activePage = menuItems.find(item => location.pathname === item.path)?.label || "Dashboard";

  // Handle Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = getCookie("csrftoken");

      if (!token) {
        console.log("No token found, logging out...");
        navigate("/"); // Navigate to the login page
        return;
      }

      const response = await axios.post(
        `${apiUrl}/api/logout/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem('userRole');
        navigate("/"); // Navigate to login page after successful logout
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("Logout failed:", error.response.data);
        if (error.response.status === 403) {
          localStorage.removeItem("token"); // Remove invalid token
          console.log("Token was invalid, but logout proceeded.");
          navigate("/"); // Redirect to login
        }
      } else {
        console.error("Logout error:", error.message);
      }
      navigate("/"); // Redirect to login on other errors
    }
  };

  return (
    <CssVarsProvider theme={theme}>
      <div>
        <Sheet variant="outlined" className="headerSheet">
          <Sheet
            variant="solid"
            className="header"
            sx={{
              backgroundColor: "#ffd000",
              borderRadius: "0",
              marginTop: "0",
              marginRight: "0",
              top: 0,
              left: 0,
              marginBottom: 0,
              zIndex: 1000,
            }}
          >
            <Box sx={{
              display: "flex",
              alignItems: "center",
              width: "70px",
              height: "70px",
              backgroundImage: "url('/images/gui_logo.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
              marginRight: "20px",
            }} />
            <Typography
              component="div"
              sx={{
                marginLeft: "0",
                paddingLeft: "0",
                textAlign: "left",
                fontSize: "18px",
              }}
            >
              <div>LIC Connect</div>
              <div>Library Internet Center</div>
            </Typography>

            <Box className="header-content">
              <Dropdown>
                <MenuButton
                  className="menu-button"
                  sx={{
                    "--Button-radius": "1.5rem",
                    backgroundColor: "#89343b",
                    color: "white",
                    fontSize: "12px",
                    "&:hover": {
                      color: "#89343b",
                      backgroundColor: "white",
                    },
                  }}
                  variant="outlined"
                  endDecorator={<KeyboardArrowDownIcon />}
                >
                  {activePage}
                </MenuButton>
                <Menu
                  variant="outlined"
                  placement="bottom-start"
                  disablePortal
                  size="sm"
                  sx={{
                    "--ListItemDecorator-size": "24px",
                    "--ListItem-minHeight": "40px",
                    "--ListDivider-gap": "4px",
                    minWidth: 200,
                    fontSize: "12px",
                  }}
                >
                  {menuItems.map((item, index) => (
                    <MenuItem 
                      key={index} 
                      onClick={() => {
                        // Check if the page is restricted and if the user is allowed to access it
                        if (item.restricted && userRole !== 'admin') {
          
                          enqueueSnackbar('Access Denied', { variant: 'error' });
                        } else {
                          navigate(item.path === "/dashboard" ? `/dashboard/${username}` : item.path);
                        }
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Dropdown>

              <Box
                className="analytics-container"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {/* Only show the Analytics button if the user is an admin */}
                {userRole === 'admin' && (
                  <Button
                    className="analytics-button"
                    sx={{
                      marginLeft: "8px",
                      backgroundColor: "transparent",
                      border: "2px solid #89343b",
                      color: "#89343b",
                      marginRight: "50px",
                      "&:hover": {
                        color: "white",
                        backgroundColor: "#89343b",
                        borderColor: "#89343b",
                      },
                    }}
                    onClick={() => navigate("/analytics")}
                  >
                    {showTooltip && (
                      <div className="tooltip-text">View Analytics</div>
                    )}
                    <InsightsTwoToneIcon />
                  </Button>
                )}
              </Box>
            </Box>

            <Box className="header-actions">
              <IconButton
                variant="none"
                className="logout"
                sx={{
                  color: "#89343b",
                }}
                onClick={handleLogout}
              >
                <ExitToAppOutlinedIcon />
              </IconButton>
            </Box>
          </Sheet>
        </Sheet>
      </div>
    </CssVarsProvider>
  );
};

export default Header;
